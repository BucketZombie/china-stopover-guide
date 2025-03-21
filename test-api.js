const http = require('http');

// 测试参数数据
const testData = {
  departure_country: 'United States',
  destination: 'Beijing',
  stopover_date: '2023-06-15',
  stopover_duration: '3',
  interests: ['Food & Cuisine', 'Culture & History'],
  budget: 'medium'
};

// 将数据转换为JSON字符串
const data = JSON.stringify(testData);

console.log('正在发送请求到: http://localhost:3001/api/params');
console.log('参数数据:', testData);
console.log('JSON数据:', data);

// 设置请求选项
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/params',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
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

// 发送数据
req.write(data);
req.end();

console.log('请求已发送，等待响应...'); 