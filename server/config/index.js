/**
 * 配置文件
 * 包含Dify API的配置以及服务器设置
 */

require('dotenv').config();

// 打印重要配置信息用于调试
console.log('正在加载配置...');
console.log(`DIFY_API_URL=${process.env.DIFY_API_URL || 'http://localhost/v1'}`);
console.log(`DIFY_API_KEY=${process.env.DIFY_API_KEY ? '已设置' : '未设置'}`);
console.log(`PORT=${process.env.PORT || 3001}`);

module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3001,
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },
  
  // Dify API配置
  dify: {
    baseUrl: process.env.DIFY_API_URL || 'http://localhost/v1',
    apiKey: process.env.DIFY_API_KEY || 'your-api-key',
    defaultUser: 'china-stopover-user', // 默认用户标识
    responseMode: 'blocking', // 使用阻塞模式，等待完整报告
  },
  
  // 报告配置
  report: {
    cacheExpiry: 3600 * 1000, // 缓存过期时间，1小时
    maxCacheSize: 100, // 最大缓存数量
  }
}; 