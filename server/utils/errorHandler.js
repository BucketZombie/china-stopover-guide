/**
 * 错误处理工具
 * 统一处理API错误响应
 */

/**
 * 创建错误响应
 * @param {String} code - 错误代码
 * @param {String} message - 错误信息
 * @param {Number} statusCode - HTTP状态码，默认500
 * @returns {Object} 格式化的错误对象
 */
function createError(code, message, statusCode = 500) {
  return {
    success: false,
    error: {
      code,
      message
    },
    statusCode
  };
}

/**
 * 预定义的错误类型
 */
const ErrorTypes = {
  // 参数验证错误
  INVALID_PARAMS: createError('INVALID_PARAMS', '无效的参数', 400),
  MISSING_WORKFLOW_ID: createError('MISSING_WORKFLOW_ID', '缺少工作流ID', 400),
  
  // 资源错误
  WORKFLOW_NOT_FOUND: createError('WORKFLOW_NOT_FOUND', '工作流不存在或已过期', 404),
  REPORT_NOT_FOUND: createError('REPORT_NOT_FOUND', '报告不存在', 404),
  REPORT_PROCESSING: createError('REPORT_PROCESSING', '报告正在生成中', 202),
  
  // 服务错误
  DIFY_API_ERROR: createError('DIFY_API_ERROR', 'Dify API调用失败', 502),
  WORKFLOW_FAILED: createError('WORKFLOW_FAILED', '工作流执行失败', 500),
  INTERNAL_ERROR: createError('INTERNAL_ERROR', '服务器内部错误', 500),
  
  // 连接错误
  CONNECTION_ERROR: createError('CONNECTION_ERROR', '连接失败', 503),
  FRONTEND_CONNECTION_ERROR: createError('FRONTEND_CONNECTION_ERROR', '前端连接失败', 503),
  
  // 限流错误
  RATE_LIMIT_EXCEEDED: createError('RATE_LIMIT_EXCEEDED', '请求频率超限', 429),
};

/**
 * 处理错误响应
 * @param {Error} error - 错误对象
 * @param {Object} res - Express响应对象
 */
function handleError(error, res) {
  // 检查是否是网络连接相关错误
  if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    console.error('连接错误:', error);
    return res.status(503).json({
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: `连接失败: ${error.code}`,
        details: error.message
      }
    });
  }
  
  // 如果是预定义的错误类型或自定义错误
  if (error.error && error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.error
    });
  }
  
  // Dify API错误
  if (error.response && error.response.data) {
    const statusCode = error.response.status || 500;
    return res.status(statusCode).json({
      success: false,
      error: {
        code: 'DIFY_API_ERROR',
        message: error.response.data.error || '调用Dify API失败'
      }
    });
  }
  
  // 其他未处理错误
  console.error('未处理的错误:', error);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    }
  });
}

module.exports = {
  createError,
  ErrorTypes,
  handleError
}; 