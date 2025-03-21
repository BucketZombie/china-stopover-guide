/**
 * API路由
 * 设置API端点和中间件
 */

const express = require('express');
const router = express.Router();

// 控制器
const reportController = require('../controllers/reportController');
const dataController = require('../controllers/dataController');

// 中间件
const { validateGenerateReport, validateWorkflowId } = require('../middleware/validation');
const applyRateLimit = require('../middleware/rateLimiter');

// 报告生成相关路由
router.post('/generate-report', applyRateLimit, validateGenerateReport, reportController.generateReport);
router.get('/report-status/:workflowRunId', validateWorkflowId, reportController.getReportStatus);
router.get('/report/:workflowRunId', validateWorkflowId, reportController.getReport);
router.post('/cancel-report/:workflowRunId', validateWorkflowId, reportController.cancelReport);

// Dify工作流数据传输端点
router.get('/workflow-data/:workflowRunId', validateWorkflowId, dataController.getWorkflowData);
router.post('/workflow-output/:workflowRunId', validateWorkflowId, dataController.saveWorkflowOutput);
router.get('/latest-params', dataController.getLatestParams);

// 特殊重定向处理 - 将dify-params请求重定向到latest-params
router.get('/dify-params', (req, res) => {
  console.log('收到/api/dify-params请求，重定向到/api/latest-params');
  // 直接调用getLatestParams处理程序，而不是HTTP重定向
  dataController.getLatestParams(req, res);
});

router.post('/params', dataController.saveParams);

// 健康检查
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: Date.now(),
    server: 'API Server',
    version: '1.0.0'
  });
});

module.exports = router; 