/**
 * 报告控制器
 * 处理报告生成和获取相关请求
 */

const difyService = require('../services/difyService');
const cache = require('../utils/cache');
const { ErrorTypes, handleError } = require('../utils/errorHandler');

/**
 * 生成旅行报告
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function generateReport(req, res) {
  try {
    const params = req.body;
    
    // 记录关键参数
    console.log(`生成报告请求: 出发地=${params.departure_country}, 目的地=${params.destination}, 日期=${params.stopover_date}, 时长=${params.stopover_duration}`);
    
    // 调用Dify服务启动工作流
    const result = await difyService.runWorkflow(params);
    
    // 将工作流信息存入缓存
    cache.set(result.workflowRunId, {
      workflowRunId: result.workflowRunId,
      taskId: result.taskId,
      status: 'running',
      params,
      startTime: Date.now(),
      report: null
    });
    
    console.log(`工作流已启动: ID=${result.workflowRunId}, 任务ID=${result.taskId}`);
    
    // 返回工作流ID和任务ID
    res.status(202).json({
      success: true,
      message: '报告生成已开始',
      workflowRunId: result.workflowRunId,
      taskId: result.taskId
    });
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * 获取报告生成状态
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function getReportStatus(req, res) {
  try {
    const { workflowRunId } = req.params;
    
    // 先检查缓存
    let workflowData = cache.get(workflowRunId);
    
    // 如果缓存中没有，可能已过期或不存在
    if (!workflowData) {
      // 尝试从Dify获取状态
      try {
        const statusResult = await difyService.getWorkflowStatus(workflowRunId);
        
        // 如果能获取到，重建缓存
        workflowData = {
          workflowRunId,
          status: statusResult.status,
          startTime: new Date(statusResult.createdAt).getTime(),
          report: statusResult.outputs || null,
          finishTime: statusResult.finishedAt ? new Date(statusResult.finishedAt).getTime() : null
        };
        
        // 如果工作流已完成，存储报告内容
        if (statusResult.status === 'succeeded' && statusResult.outputs) {
          workflowData.report = statusResult.outputs;
          cache.set(workflowRunId, workflowData);
        }
      } catch (difyError) {
        // 如果Dify也找不到，则返回不存在
        return res.status(404).json(ErrorTypes.WORKFLOW_NOT_FOUND);
      }
    } else {
      // 如果缓存中有数据但状态是running，尝试更新状态
      if (workflowData.status === 'running') {
        try {
          const statusResult = await difyService.getWorkflowStatus(workflowRunId);
          
          // 更新缓存中的状态
          workflowData.status = statusResult.status;
          
          // 如果工作流已完成，存储报告内容
          if (statusResult.status === 'succeeded' && statusResult.outputs) {
            workflowData.report = statusResult.outputs;
            workflowData.finishTime = new Date(statusResult.finishedAt).getTime();
          } else if (statusResult.status === 'failed') {
            workflowData.error = statusResult.error;
            workflowData.finishTime = new Date(statusResult.finishedAt).getTime();
          }
          
          // 更新缓存
          cache.update(workflowRunId, workflowData);
        } catch (updateError) {
          console.error('更新工作流状态失败:', updateError);
          // 继续使用缓存中的状态
        }
      }
    }
    
    // 返回工作流状态
    res.status(200).json({
      success: true,
      workflowRunId,
      status: workflowData.status,
      startTime: workflowData.startTime,
      finishTime: workflowData.finishTime,
      elapsedTime: Math.floor((workflowData.finishTime || Date.now()) - workflowData.startTime) / 1000,
      hasReport: workflowData.status === 'succeeded' && !!workflowData.report
    });
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * 获取生成的报告
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function getReport(req, res) {
  try {
    const { workflowRunId } = req.params;
    
    // 先检查缓存
    let workflowData = cache.get(workflowRunId);
    
    // 如果缓存中没有，尝试从Dify获取
    if (!workflowData) {
      try {
        const statusResult = await difyService.getWorkflowStatus(workflowRunId);
        
        // 检查工作流是否成功完成
        if (statusResult.status === 'succeeded' && statusResult.outputs) {
          // 创建工作流数据并缓存
          workflowData = {
            workflowRunId,
            status: 'succeeded',
            report: statusResult.outputs,
            startTime: new Date(statusResult.createdAt).getTime(),
            finishTime: new Date(statusResult.finishedAt).getTime()
          };
          
          cache.set(workflowRunId, workflowData);
        } else if (statusResult.status === 'running') {
          // 报告还在生成中
          return res.status(202).json(ErrorTypes.REPORT_PROCESSING);
        } else {
          // 工作流失败
          return res.status(500).json({
            success: false,
            error: {
              code: 'WORKFLOW_FAILED',
              message: statusResult.error || '报告生成失败'
            }
          });
        }
      } catch (difyError) {
        // 如果Dify也找不到，则返回不存在
        return res.status(404).json(ErrorTypes.REPORT_NOT_FOUND);
      }
    } else {
      // 如果缓存中有但状态不是成功，返回相应错误
      if (workflowData.status === 'running') {
        // 尝试更新状态
        try {
          const statusResult = await difyService.getWorkflowStatus(workflowRunId);
          
          // 如果状态已更新为成功，获取报告
          if (statusResult.status === 'succeeded' && statusResult.outputs) {
            workflowData.status = 'succeeded';
            workflowData.report = statusResult.outputs;
            workflowData.finishTime = new Date(statusResult.finishedAt).getTime();
            
            // 更新缓存
            cache.update(workflowRunId, workflowData);
          } else if (statusResult.status === 'running') {
            return res.status(202).json(ErrorTypes.REPORT_PROCESSING);
          } else {
            // 工作流失败
            return res.status(500).json({
              success: false,
              error: {
                code: 'WORKFLOW_FAILED',
                message: statusResult.error || '报告生成失败'
              }
            });
          }
        } catch (updateError) {
          // 更新失败，继续使用缓存状态
          return res.status(202).json(ErrorTypes.REPORT_PROCESSING);
        }
      } else if (workflowData.status === 'failed') {
        // 工作流失败
        return res.status(500).json({
          success: false,
          error: {
            code: 'WORKFLOW_FAILED',
            message: workflowData.error || '报告生成失败'
          }
        });
      }
      
      // 状态为成功但没有报告内容
      if (workflowData.status === 'succeeded' && !workflowData.report) {
        return res.status(404).json(ErrorTypes.REPORT_NOT_FOUND);
      }
    }
    
    // 从工作流的输出中提取报告文本
    let reportText = '';
    
    // 假设Dify输出的是text字段包含文本报告
    if (workflowData.report && workflowData.report.text) {
      reportText = workflowData.report.text;
    } else {
      // 尝试从outputs对象中找到第一个字符串类型的值作为报告
      for (const key in workflowData.report) {
        if (typeof workflowData.report[key] === 'string') {
          reportText = workflowData.report[key];
          break;
        }
      }
    }
    
    // 如果没有找到报告文本
    if (!reportText) {
      return res.status(404).json(ErrorTypes.REPORT_NOT_FOUND);
    }
    
    // 设置响应为纯文本
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(reportText);
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * 取消报告生成
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function cancelReport(req, res) {
  try {
    const { workflowRunId } = req.params;
    
    // 检查缓存中是否有该工作流
    const workflowData = cache.get(workflowRunId);
    
    if (!workflowData) {
      return res.status(404).json(ErrorTypes.WORKFLOW_NOT_FOUND);
    }
    
    // 只有正在运行的工作流才能取消
    if (workflowData.status !== 'running') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: '只能取消正在运行的报告生成任务'
        }
      });
    }
    
    // 调用Dify服务停止工作流
    await difyService.stopWorkflow(workflowData.taskId);
    
    // 更新缓存
    workflowData.status = 'stopped';
    workflowData.finishTime = Date.now();
    cache.update(workflowRunId, workflowData);
    
    // 返回成功响应
    res.status(200).json({
      success: true,
      message: '报告生成已取消'
    });
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = {
  generateReport,
  getReportStatus,
  getReport,
  cancelReport
}; 