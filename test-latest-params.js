const http = require('http');

console.log('正在获取最新参数...');

// 设置请求选项
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/latest-params',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

// 发送请求
const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log('响应头:', res.headers);
  
  let responseData = '';
  
  // 接收数据
  res.on('data', (chunk) => {
    responseData += chunk;
    console.log('接收到数据块:', chunk.toString());
  });
  
  // 数据接收完成
  res.on('end', () => {
    console.log('响应接收完成');
    console.log('原始响应:', responseData);
    
    if (responseData) {
      try {
        const jsonResponse = JSON.parse(responseData);
        console.log('解析后的响应:', jsonResponse);
        
        if (jsonResponse.params) {
          console.log('\n最新参数:');
          console.log('出发国家:', jsonResponse.params.departure_country);
          console.log('目的地:', jsonResponse.params.destination);
          console.log('中转日期:', jsonResponse.params.stopover_date);
          console.log('中转时长:', jsonResponse.params.stopover_duration);
          console.log('兴趣爱好:', jsonResponse.params.interests);
          console.log('预算:', jsonResponse.params.budget);
        }
      } catch (e) {
        console.error('解析响应数据失败:', e.message);
      }
    }
  });
});

// 错误处理
req.on('error', (e) => {
  console.error('请求失败:');
  console.error(e);
});

// 结束请求
req.end();

console.log('请求已发送，等待响应...'); 