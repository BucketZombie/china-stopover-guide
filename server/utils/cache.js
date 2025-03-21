/**
 * 内存缓存工具
 * 用于临时存储工作流状态和报告内容
 */

const config = require('../config');

// 内存缓存
const cache = new Map();

// 用于记录缓存键的创建时间，用于过期处理
const cacheTimestamps = new Map();

/**
 * 设置缓存项
 * @param {String} key - 缓存键
 * @param {any} value - 缓存值
 */
function set(key, value) {
  console.log(`正在缓存数据，键: ${key}`);
  
  // 如果缓存已满，删除最旧的缓存
  if (cache.size >= config.report.maxCacheSize && !cache.has(key)) {
    console.log(`缓存已达到最大容量(${config.report.maxCacheSize})，删除最旧的缓存`);
    const oldestKey = [...cacheTimestamps.entries()]
      .sort((a, b) => a[1] - b[1])[0][0];
    
    if (oldestKey) {
      console.log(`删除最旧的缓存键: ${oldestKey}`);
      cache.delete(oldestKey);
      cacheTimestamps.delete(oldestKey);
    }
  }
  
  // 设置/更新缓存
  cache.set(key, value);
  cacheTimestamps.set(key, Date.now());
  console.log(`缓存设置成功，当前缓存键数量: ${cache.size}`);
}

/**
 * 获取缓存项
 * @param {String} key - 缓存键
 * @returns {any|null} 缓存值或null
 */
function get(key) {
  // 检查缓存是否存在且未过期
  if (cache.has(key)) {
    const timestamp = cacheTimestamps.get(key);
    
    // 如果缓存已过期，删除并返回null
    if (Date.now() - timestamp > config.report.cacheExpiry) {
      cache.delete(key);
      cacheTimestamps.delete(key);
      return null;
    }
    
    // 返回缓存值
    return cache.get(key);
  }
  
  return null;
}

/**
 * 更新缓存项（仅当存在时）
 * @param {String} key - 缓存键
 * @param {Object} updates - 要更新的字段
 * @returns {boolean} 是否成功更新
 */
function update(key, updates) {
  if (cache.has(key)) {
    const value = cache.get(key);
    
    // 合并更新
    cache.set(key, { ...value, ...updates });
    cacheTimestamps.set(key, Date.now());
    
    return true;
  }
  
  return false;
}

/**
 * 删除缓存项
 * @param {String} key - 缓存键
 * @returns {boolean} 是否成功删除
 */
function remove(key) {
  cacheTimestamps.delete(key);
  return cache.delete(key);
}

/**
 * 清理过期缓存
 */
function cleanExpired() {
  const now = Date.now();
  
  for (const [key, timestamp] of cacheTimestamps.entries()) {
    if (now - timestamp > config.report.cacheExpiry) {
      cache.delete(key);
      cacheTimestamps.delete(key);
    }
  }
}

// 定期清理过期缓存
setInterval(cleanExpired, 60000); // 每分钟清理一次

/**
 * 获取所有缓存键
 * @returns {Array} 所有缓存键的数组
 */
function getAllKeys() {
  const keys = Array.from(cache.keys());
  console.log(`获取所有缓存键，数量: ${keys.length}`);
  if (keys.length > 0) {
    console.log(`缓存键列表: ${keys.join(', ')}`);
  } else {
    console.log('缓存为空');
  }
  return keys;
}

module.exports = {
  set,
  get,
  update,
  remove,
  cleanExpired,
  getAllKeys
}; 