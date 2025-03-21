/**
 * 速率限制中间件
 * 用于防止API滥用，限制请求频率
 */

const { ErrorTypes } = require('../utils/errorHandler');

// 简单的内存速率限制器
class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 默认窗口期为1分钟
    this.maxRequests = options.maxRequests || 10; // 默认最大请求数
    this.requestLog = new Map(); // IP -> [timestamps]
  }
  
  /**
   * 检查请求是否应该被限制
   * @param {String} ip - 请求IP
   * @returns {Boolean} 是否应该限制请求
   */
  shouldRateLimit(ip) {
    const now = Date.now();
    
    // 如果IP不在记录中，添加新记录
    if (!this.requestLog.has(ip)) {
      this.requestLog.set(ip, [now]);
      return false;
    }
    
    // 获取该IP的请求时间戳列表
    const timestamps = this.requestLog.get(ip);
    
    // 过滤出窗口期内的请求
    const windowStart = now - this.windowMs;
    const recentRequests = timestamps.filter(time => time > windowStart);
    
    // 更新请求日志
    this.requestLog.set(ip, [...recentRequests, now]);
    
    // 检查是否超过限制
    return recentRequests.length >= this.maxRequests;
  }
  
  /**
   * 清理过期请求记录
   */
  cleanupExpired() {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    for (const [ip, timestamps] of this.requestLog.entries()) {
      const validTimestamps = timestamps.filter(time => time > windowStart);
      
      if (validTimestamps.length === 0) {
        this.requestLog.delete(ip);
      } else {
        this.requestLog.set(ip, validTimestamps);
      }
    }
  }
}

// 创建速率限制器实例
const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1分钟窗口
  maxRequests: 5   // 每分钟最多5个请求
});

// 定期清理过期请求记录
setInterval(() => rateLimiter.cleanupExpired(), 60000);

/**
 * 速率限制中间件函数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件
 */
function applyRateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (rateLimiter.shouldRateLimit(ip)) {
    return res.status(429).json(ErrorTypes.RATE_LIMIT_EXCEEDED);
  }
  
  next();
}

module.exports = applyRateLimit; 