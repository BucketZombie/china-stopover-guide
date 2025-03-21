/**
 * 请求验证中间件
 * 用于验证API请求参数
 */

const { ErrorTypes } = require('../utils/errorHandler');

/**
 * 验证生成报告请求
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
function validateGenerateReport(req, res, next) {
  const params = req.body;
  
  // 检查是否是有效的JSON对象
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return res.status(400).json(ErrorTypes.INVALID_PARAMS);
  }
  
  // 验证关键参数是否存在
  const requiredFields = ['departure_country', 'destination', 'stopover_date', 'stopover_duration'];
  const missingFields = requiredFields.filter(field => !params[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_REQUIRED_FIELDS',
        message: `缺少必要参数: ${missingFields.join(', ')}`,
        fields: missingFields
      }
    });
  }
  
  // 验证stopover_duration是否为正数
  if (isNaN(params.stopover_duration) || parseInt(params.stopover_duration) <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FIELD_VALUE',
        message: 'stopover_duration必须是正整数',
        field: 'stopover_duration'
      }
    });
  }
  
  next();
}

/**
 * 验证工作流ID参数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
function validateWorkflowId(req, res, next) {
  const { workflowRunId } = req.params;
  
  if (!workflowRunId) {
    return res.status(400).json(ErrorTypes.MISSING_WORKFLOW_ID);
  }
  
  // 可以添加ID格式验证
  // 例如：UUID格式、长度限制等
  
  next();
}

module.exports = {
  validateGenerateReport,
  validateWorkflowId
}; 