/**
 * 管理路由
 * 提供监控API端点
 */

const express = require('express');
const router = express.Router();

// 控制器
const adminController = require('../controllers/adminController');
const { validateWorkflowId } = require('../middleware/validation');

// 系统状态
router.get('/status', adminController.getSystemStatus);

// 请求日志
router.get('/requests', adminController.getRequestLogs);

// 工作流监控
router.get('/workflows', adminController.getWorkflows);
router.get('/workflows/:workflowRunId', validateWorkflowId, adminController.getWorkflowDetail);

module.exports = router; 