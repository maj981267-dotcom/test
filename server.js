const express = require('express');
const path = require('path'); // 【新增 1】引入 path 模块
const app = express();

// 【修改 1】使用绝对路径配置静态文件服务
// 这样能确保在 Vercel 环境下也能正确找到 public 文件夹
app.use(express.static(path.join(__dirname, 'public')));

// 【修改 2】根路径直接返回 index.html 文件
// 这样用户打开域名就能直接看到界面，不用手动加 /index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API路由 - 用户信息接口 (保持不变)
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

// API路由 - 产品列表接口 (保持不变)
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