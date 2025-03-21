/**
 * Dify API服务
 * 封装与Dify工作流API的所有交互
 */

const axios = require('axios');
const config = require('../config');
require('dotenv').config();

// 确保使用最新的环境变量
const DIFY_API_URL = process.env.DIFY_API_URL || config.dify.baseUrl;
const DIFY_API_KEY = process.env.DIFY_API_KEY || config.dify.apiKey;

console.log(`Dify服务使用的API地址: ${DIFY_API_URL}`);
console.log(`Dify API密钥设置状态: ${DIFY_API_KEY ? '已设置' : '未设置'}`);

// 创建axios实例
const difyClient = axios.create({
  baseURL: DIFY_API_URL,
  headers: {
    'Authorization': `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120秒超时，考虑到工作流可能需要较长时间
});

/**
 * 启动Dify工作流
 * @param {Object} params - 用户提供的参数
 * @param {String} userId - 用户标识
 * @returns {Promise<Object>} 包含workflowRunId和taskId的响应
 */
async function runWorkflow(params, userId = config.dify.defaultUser) {
  try {
    // 格式化参数为Dify所需格式
    const difyParams = {
      inputs: params, // 用户输入参数
      response_mode: config.dify.responseMode, // 阻塞模式
      user: userId, // 用户标识
    };

    // 调用Dify API启动工作流
    const response = await difyClient.post('/workflows/run', difyParams);
    
    // 返回工作流ID和任务ID用于后续跟踪
    return {
      success: true,
      workflowRunId: response.data.workflow_run_id,
      taskId: response.data.task_id,
      status: 'running'
    };
  } catch (error) {
    console.error('启动工作流失败:', error.response?.data || error.message);
    throw {
      success: false,
      error: {
        code: error.response?.status || 500,
        message: error.response?.data?.error || '启动工作流失败'
      }
    };
  }
}

/**
 * 获取工作流执行状态
 * @param {String} workflowId - 工作流执行ID
 * @returns {Promise<Object>} 工作流状态信息
 */
async function getWorkflowStatus(workflowId) {
  try {
    const response = await difyClient.get(`/workflows/run/${workflowId}`);
    
    // 整理响应，提取关键信息
    return {
      success: true,
      id: response.data.id,
      status: response.data.status,
      error: response.data.error,
      outputs: response.data.outputs,
      createdAt: response.data.created_at,
      finishedAt: response.data.finished_at,
      elapsedTime: response.data.elapsed_time
    };
  } catch (error) {
    console.error('获取工作流状态失败:', error.response?.data || error.message);
    throw {
      success: false,
      error: {
        code: error.response?.status || 500,
        message: error.response?.data?.error || '获取工作流状态失败'
      }
    };
  }
}

/**
 * 停止工作流执行
 * @param {String} taskId - 任务ID
 * @param {String} userId - 用户标识
 * @returns {Promise<Object>} 操作结果
 */
async function stopWorkflow(taskId, userId = config.dify.defaultUser) {
  try {
    const response = await difyClient.post(`/workflows/tasks/${taskId}/stop`, {
      user: userId
    });
    
    return {
      success: true,
      result: response.data.result
    };
  } catch (error) {
    console.error('停止工作流失败:', error.response?.data || error.message);
    throw {
      success: false,
      error: {
        code: error.response?.status || 500,
        message: error.response?.data?.error || '停止工作流失败'
      }
    };
  }
}

/**
 * 检查Dify API连接状态
 * @returns {Promise<Object>} 连接状态
 */
async function checkConnection() {
  try {
    // Dify API连接检查
    // 尝试简单的GET请求测试连接
    await axios({
      method: 'GET',
      url: `${DIFY_API_URL}/applications/oauth/token`,
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000 // 5秒超时
    });
    
    console.log('Dify API连接成功!');
    return {
      success: true,
      status: 'connected'
    };
  } catch (error) {
    // 判断错误类型
    if (error.code === 'ECONNREFUSED') {
      console.error('无法连接到Dify服务器:', error.message);
      return {
        success: false,
        status: 'disconnected',
        error: '无法连接到Dify服务器'
      };
    }
    
    // 如果是401错误，说明API密钥不正确
    if (error.response && error.response.status === 401) {
      console.error('Dify API密钥无效:', error.message);
      return {
        success: false,
        status: 'disconnected',
        error: 'API密钥无效'
      };
    }
    
    // 如果是404错误，说明API端点不存在
    if (error.response && error.response.status === 404) {
      console.error('Dify API端点不存在:', error.message);
      // 尝试不同的端点
      try {
        await axios({
          method: 'GET',
          url: `${DIFY_API_URL}/workflow-runs`,
          headers: {
            'Authorization': `Bearer ${DIFY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000
        });
        
        console.log('Dify API连接成功(备用端点)!');
        return {
          success: true,
          status: 'connected'
        };
      } catch (backupError) {
        return {
          success: false,
          status: 'disconnected',
          error: 'API端点不存在'
        };
      }
    }
    
    console.error('Dify连接检查失败:', error.message);
    return {
      success: false,
      status: 'disconnected',
      error: error.message
    };
  }
}

module.exports = {
  runWorkflow,
  getWorkflowStatus,
  stopWorkflow,
  checkConnection
}; 