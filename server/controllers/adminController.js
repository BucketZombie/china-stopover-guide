/**
 * 管理控制器
 * 提供监控数据和系统状态
 */

const cache = require('../utils/cache');
const difyService = require('../services/difyService');
const os = require('os');

// 存储请求记录
const requestLogs = [];
const MAX_LOGS = 100;

/**
 * 添加请求日志
 * @param {Object} log - 日志对象
 */
function addRequestLog(log) {
  // 添加到日志列表开头，保持最新记录在前
  requestLogs.unshift(log);
  
  // 如果超出最大记录数，删除最旧的记录
  if (requestLogs.length > MAX_LOGS) {
    requestLogs.pop();
  }
}

/**
 * 获取系统状态
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
async function getSystemStatus(req, res) {
  try {
    // 获取服务器基本信息
    const serverInfo = {
      uptime: Math.floor(process.uptime()),
      startTime: new Date(Date.now() - process.uptime() * 1000),
      memoryUsage: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      },
      systemInfo: {
        platform: process.platform,
        nodeVersion: process.version
      }
    };
    
    // 检查Dify API连接状态
    let difyStatus;
    try {
      difyStatus = await difyService.checkConnection();
    } catch (error) {
      difyStatus = {
        status: 'disconnected',
        lastChecked: new Date(),
        error: error.message || '无法连接到Dify API'
      };
    }
    
    // 获取工作流统计
    const stats = await getWorkflowStats();
    
    // 返回状态信息
    return res.status(200).json({
      success: true,
      server: serverInfo,
      dify: {
        status: difyStatus.status || 'disconnected',
        lastChecked: new Date(),
        error: difyStatus.error
      },
      workflows: stats
    });
  } catch (error) {
    console.error('获取系统状态失败:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SYSTEM_STATUS_ERROR',
        message: '获取系统状态失败'
      }
    });
  }
}

/**
 * 获取请求日志
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
function getRequestLogs(req, res) {
  try {
    // 可以增加筛选和分页功能
    const { limit = 50, path, statusCode } = req.query;
    
    let filteredLogs = [...requestLogs];
    
    // 根据路径筛选
    if (path) {
      filteredLogs = filteredLogs.filter(log => log.path.includes(path));
    }
    
    // 根据状态码筛选
    if (statusCode) {
      filteredLogs = filteredLogs.filter(log => log.statusCode === parseInt(statusCode));
    }
    
    // 限制返回数量
    filteredLogs = filteredLogs.slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: filteredLogs.length,
      totalCount: requestLogs.length,
      logs: filteredLogs
    });
  } catch (error) {
    console.error('获取请求日志失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取请求日志失败'
      }
    });
  }
}

/**
 * 获取工作流列表
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
function getWorkflows(req, res) {
  try {
    const { status } = req.query;
    const workflows = [];
    
    // 遍历缓存中的工作流数据
    cache.getAllKeys().forEach(key => {
      const workflow = cache.get(key);
      
      // 如果指定了状态过滤，则按状态筛选
      if (workflow && (!status || workflow.status === status)) {
        workflows.push({
          id: workflow.workflowRunId,
          status: workflow.status,
          startTime: workflow.startTime,
          finishTime: workflow.finishTime,
          elapsedTime: workflow.finishTime 
            ? Math.floor((workflow.finishTime - workflow.startTime) / 1000) 
            : Math.floor((Date.now() - workflow.startTime) / 1000),
          hasReport: !!workflow.report
        });
      }
    });
    
    // 按开始时间倒序排序
    workflows.sort((a, b) => b.startTime - a.startTime);
    
    res.status(200).json({
      success: true,
      count: workflows.length,
      workflows
    });
  } catch (error) {
    console.error('获取工作流列表失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取工作流列表失败'
      }
    });
  }
}

/**
 * 获取单个工作流详情
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
function getWorkflowDetail(req, res) {
  try {
    const { workflowRunId } = req.params;
    
    // 从缓存中获取工作流数据
    const workflow = cache.get(workflowRunId);
    
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'WORKFLOW_NOT_FOUND',
          message: '找不到指定的工作流'
        }
      });
    }
    
    // 构建工作流详情响应
    const workflowDetail = {
      id: workflow.workflowRunId,
      taskId: workflow.taskId,
      status: workflow.status,
      startTime: workflow.startTime,
      finishTime: workflow.finishTime,
      elapsedTime: workflow.finishTime 
        ? Math.floor((workflow.finishTime - workflow.startTime) / 1000) 
        : Math.floor((Date.now() - workflow.startTime) / 1000),
      params: workflow.params,
      // 如果有报告，提供报告概要信息
      reportSummary: workflow.report ? {
        available: true,
        length: typeof workflow.report === 'string' 
          ? workflow.report.length 
          : JSON.stringify(workflow.report).length
      } : { available: false },
      // 可能的中间输出记录
      intermediateOutputs: workflow.intermediateOutputs || []
    };
    
    res.status(200).json({
      success: true,
      workflow: workflowDetail
    });
  } catch (error) {
    console.error('获取工作流详情失败:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取工作流详情失败'
      }
    });
  }
}

/**
 * 获取工作流统计信息
 * @returns {Promise<Object>} 工作流统计
 */
async function getWorkflowStats() {
  try {
    const stats = {
      activeWorkflows: 0,
      completedWorkflows: 0,
      failedWorkflows: 0
    };
    
    // 遍历缓存中的工作流数据
    cache.getAllKeys().forEach(key => {
      const workflow = cache.get(key);
      if (workflow && workflow.status) {
        switch (workflow.status) {
          case 'running':
            stats.activeWorkflows++;
            break;
          case 'succeeded':
            stats.completedWorkflows++;
            break;
          case 'failed':
          case 'stopped':
            stats.failedWorkflows++;
            break;
        }
      }
    });
    
    return stats;
  } catch (error) {
    console.error('获取工作流统计失败:', error);
    return {
      activeWorkflows: 0,
      completedWorkflows: 0,
      failedWorkflows: 0
    };
  }
}

// 导出请求记录中间件
function requestLogger(req, res, next) {
  // 记录请求开始时间
  const startTime = Date.now();
  
  // 获取原始响应方法
  const originalSend = res.send;
  let responseBody;
  
  // 重写res.send方法来捕获响应内容
  res.send = function(body) {
    responseBody = body;
    originalSend.apply(res, arguments);
  };
  
  // 当响应完成时记录请求信息
  res.on('finish', () => {
    // 计算请求处理时间
    const duration = Date.now() - startTime;
    
    // 创建请求日志
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: duration, // 毫秒
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      // 记录请求参数（注意可能需要脱敏）
      requestParams: req.method === 'GET' ? req.query : req.body,
      // 为简化起见，不记录完整响应内容，只记录状态
      responseStatus: res.statusCode < 400 ? 'success' : 'error'
    };
    
    // 添加到日志记录
    addRequestLog(logEntry);
  });
  
  next();
}

module.exports = {
  getSystemStatus,
  getRequestLogs,
  getWorkflows,
  getWorkflowDetail,
  requestLogger
}; 