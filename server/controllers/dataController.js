/**
 * 数据控制器
 * 为Dify工作流HTTP节点提供数据
 */

const cache = require('../utils/cache');
const { ErrorTypes, handleError } = require('../utils/errorHandler');

/**
 * 提供工作流参数数据
 * 这个端点专为Dify工作流的HTTP节点设计，用于获取用户提交的参数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function getWorkflowData(req, res) {
  try {
    const { workflowRunId } = req.params;
    
    // 从缓存中获取工作流数据
    const workflowData = cache.get(workflowRunId);
    
    // 如果缓存中没有该工作流数据
    if (!workflowData) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WORKFLOW_NOT_FOUND',
          message: '找不到指定的工作流数据'
        }
      });
    }
    
    // 返回工作流的参数数据
    res.status(200).json({
      success: true,
      params: workflowData.params
    });
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * 获取最新的请求参数
 * 这个端点用于工作流HTTP节点直接获取最新提交的参数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function getLatestParams(req, res) {
  try {
    console.log('收到获取最新参数请求:', req.path, req.method, req.ip);
    
    // 查找最新的工作流数据
    const allKeys = cache.getAllKeys();
    console.log('缓存中的键数量:', allKeys.length);
    
    if (allKeys.length === 0) {
      console.log('缓存中没有数据');
      // 返回404错误而不是示例数据
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_DATA_FOUND',
          message: '当前没有可用的参数数据'
        }
      });
    }
    
    // 按时间戳排序，找出最新的工作流
    let latestWorkflow = null;
    let latestTime = 0;
    
    allKeys.forEach(key => {
      const workflow = cache.get(key);
      if (workflow && workflow.startTime && workflow.startTime > latestTime) {
        latestTime = workflow.startTime;
        latestWorkflow = workflow;
      }
    });
    
    if (!latestWorkflow || !latestWorkflow.params) {
      console.log('找到键但没有有效的参数数据');
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_PARAMS_FOUND',
          message: '未找到有效的参数数据'
        }
      });
    }
    
    console.log('找到最新参数数据，workflowRunId:', latestWorkflow.workflowRunId);
    console.log('参数内容:', latestWorkflow.params);
    
    // 返回最新的参数数据
    res.status(200).json({
      success: true,
      workflowRunId: latestWorkflow.workflowRunId,
      timestamp: latestWorkflow.startTime,
      params: latestWorkflow.params
    });
  } catch (error) {
    console.error('获取最新参数时出错:', error);
    handleError(error, res);
  }
}

/**
 * 记录工作流输出数据（可选）
 * 可以用来记录Dify工作流处理的中间结果
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function saveWorkflowOutput(req, res) {
  try {
    const { workflowRunId } = req.params;
    const outputData = req.body;
    
    // 从缓存中获取工作流数据
    const workflowData = cache.get(workflowRunId);
    
    // 如果缓存中没有该工作流数据
    if (!workflowData) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WORKFLOW_NOT_FOUND',
          message: '找不到指定的工作流数据'
        }
      });
    }
    
    // 更新工作流数据，添加中间输出
    if (!workflowData.intermediateOutputs) {
      workflowData.intermediateOutputs = [];
    }
    
    // 添加带时间戳的输出记录
    workflowData.intermediateOutputs.push({
      timestamp: Date.now(),
      data: outputData
    });
    
    // 更新缓存
    cache.update(workflowRunId, workflowData);
    
    // 返回成功响应
    res.status(200).json({
      success: true,
      message: '工作流输出数据已保存'
    });
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * 直接保存参数数据
 * 这个端点用于前端直接提交参数，不经过报告生成流程
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function saveParams(req, res) {
  try {
    console.log('收到保存参数请求:', req.path, req.method, req.ip);
    const params = req.body;
    
    // 记录参数内容
    console.log('接收到的参数:', JSON.stringify(params, null, 2));
    
    // 验证基本参数结构
    if (!params || typeof params !== 'object' || Array.isArray(params)) {
      console.error('无效的参数格式');
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PARAMS',
          message: '无效的参数格式'
        }
      });
    }
    
    // 验证关键参数
    const requiredFields = ['departure_country', 'destination', 'stopover_date', 'stopover_duration'];
    const missingFields = requiredFields.filter(field => !params[field]);
    
    if (missingFields.length > 0) {
      console.error('缺少必要参数:', missingFields.join(', '));
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: `缺少必要参数: ${missingFields.join(', ')}`,
          fields: missingFields
        }
      });
    }
    
    // 生成工作流运行ID (使用时间戳和随机字符串)
    const workflowRunId = `direct-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    console.log('生成的工作流ID:', workflowRunId);
    
    // 将参数数据存入缓存
    cache.set(workflowRunId, {
      workflowRunId,
      status: 'direct',
      params,
      startTime: Date.now(),
      report: null
    });
    
    // 检查缓存中是否成功设置
    const savedData = cache.get(workflowRunId);
    if (savedData) {
      console.log('参数已成功保存到缓存，工作流ID:', workflowRunId);
      console.log('缓存中的键数量:', cache.getAllKeys().length);
    } else {
      console.error('参数未能保存到缓存');
    }
    
    // 返回成功响应和工作流ID
    res.status(200).json({
      success: true,
      message: '参数已保存',
      workflowRunId
    });
  } catch (error) {
    console.error('保存参数时出错:', error);
    handleError(error, res);
  }
}

/**
 * 专门为Dify工作流提供的参数获取端点
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function getDifyParams(req, res) {
  try {
    console.log('收到Dify工作流参数请求:', req.path, req.method, req.ip);
    
    // 查找最新的工作流数据
    const allKeys = cache.getAllKeys();
    console.log('缓存中的键数量:', allKeys.length);
    
    if (allKeys.length === 0) {
      console.log('缓存中没有数据');
      // 返回404错误
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_DATA_FOUND',
          message: '当前没有可用的参数数据'
        }
      });
    }
    
    // 按时间戳排序，找出最新的工作流
    let latestWorkflow = null;
    let latestTime = 0;
    
    allKeys.forEach(key => {
      const workflow = cache.get(key);
      if (workflow && workflow.startTime && workflow.startTime > latestTime) {
        latestTime = workflow.startTime;
        latestWorkflow = workflow;
      }
    });
    
    if (!latestWorkflow || !latestWorkflow.params) {
      console.log('找到键但没有有效的参数数据');
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_PARAMS_FOUND',
          message: '未找到有效的参数数据'
        }
      });
    }
    
    console.log('找到最新参数数据，workflowRunId:', latestWorkflow.workflowRunId);
    console.log('参数内容:', latestWorkflow.params);
    
    // 返回最新的参数数据
    res.status(200).json({
      success: true,
      workflowRunId: latestWorkflow.workflowRunId,
      timestamp: latestWorkflow.startTime,
      params: latestWorkflow.params
    });
  } catch (error) {
    console.error('获取Dify参数时出错:', error);
    handleError(error, res);
  }
}

module.exports = {
  getWorkflowData,
  saveWorkflowOutput,
  getLatestParams,
  saveParams,
  getDifyParams
}; 