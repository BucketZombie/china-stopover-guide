/**
 * API服务器主文件
 * 配置Express应用，启动服务器
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

// 引入路由
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// 引入中间件
const { requestLogger } = require('./controllers/adminController');

// 创建Express应用
const app = express();

// 配置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置CORS
const corsOptions = {
  origin: '*', // 允许所有来源访问API
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // 预检请求缓存24小时
};
app.use(cors(corsOptions));

console.log(`CORS设置: 允许所有来源访问`);

// 添加请求日志中间件
app.use(requestLogger);

// 设置路由
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// 提供管理控制页面的静态文件
app.use('/admin-ui', express.static(path.join(__dirname, 'public')));

// Dify参数请求的备用处理程序
// 捕获任何以/api/开头并包含param或params的路径
app.get(/\/api\/.*param.*/, (req, res, next) => {
  // 检查是否是已知端点
  if (req.path === '/api/latest-params' || req.path === '/api/dify-params') {
    // 如果是已知端点，继续正常处理
    return next();
  }
  
  console.log(`收到未知参数请求路径: ${req.path}，尝试提供参数数据`);
  
  // 调用getLatestParams处理程序提供数据
  const dataController = require('./controllers/dataController');
  dataController.getLatestParams(req, res);
});

// 处理404错误
app.use((req, res, next) => {
  console.log('找不到路由:', req.method, req.path);
  
  // 对于API路径的请求返回JSON错误
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `找不到请求的资源: ${req.path}`
      }
    });
  }
  
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '找不到请求的资源'
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    }
  });
});

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`API服务器运行在 http://localhost:${PORT}`);
  
  console.log('\n可用的API端点:');
  console.log('报告生成相关:');
  console.log(`- POST /api/generate-report - 生成旅行报告`);
  console.log(`- GET /api/report-status/:workflowRunId - 获取报告生成状态`);
  console.log(`- GET /api/report/:workflowRunId - 获取生成的报告`);
  console.log(`- POST /api/cancel-report/:workflowRunId - 取消报告生成`);
  
  console.log('\n工作流数据相关:');
  console.log(`- GET /api/workflow-data/:workflowRunId - 工作流通过ID获取参数数据`);
  console.log(`- GET /api/latest-params - 工作流获取最新提交的参数`);
  console.log(`- GET /api/dify-params - 专门为Dify工作流提供参数数据`);
  console.log(`- POST /api/params - 直接保存参数数据`);
  console.log(`- POST /api/workflow-output/:workflowRunId - 记录工作流输出数据`);
  
  console.log('\n系统相关:');
  console.log(`- GET /api/health - 健康检查`);
  
  console.log('\n管理监控页面:');
  console.log(`- 访问 http://localhost:${PORT}/admin-ui 查看控制面板`);
  console.log(`- GET /admin/status - 获取系统状态`);
  console.log(`- GET /admin/requests - 获取请求日志`);
  console.log(`- GET /admin/workflows - 获取工作流列表`);
});

// 导出Express应用，用于测试
module.exports = app; 