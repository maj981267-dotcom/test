const express = require('express');
const app = express();

// 静态文件服务
app.use(express.static('public'));

// 根路径简单返回文本
app.get('/', (req, res) => {
  res.send('欢迎访问 Node.js Express 测试应用！请访问 /index.html 查看完整页面。');
});

// API路由 - 用户信息接口
app.get('/api/user', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  res.status(200).json({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    city: '北京',
    timestamp: new Date().toISOString()
  });
});

// API路由 - 产品列表接口
app.get('/api/products', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  res.status(200).json({
    products: [
      { id: 1, name: '笔记本电脑', price: 5999, category: '电子产品' },
      { id: 2, name: '无线鼠标', price: 199, category: '电子产品' },
      { id: 3, name: '机械键盘', price: 399, category: '电子产品' }
    ],
    total: 3,
    timestamp: new Date().toISOString()
  });
});

// 导出app供Vercel使用
module.exports = app;

// 本地开发时启动服务器
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
  });
}