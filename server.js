const express = require('express');
const app = express();

// 添加JSON解析中间件
app.use(express.json());

// 静态文件服务
app.use(express.static('public'));

// 根路径返回HTML页面
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>API测试页面</title>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            button { padding: 10px 20px; margin: 10px; background: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer; }
            button:hover { background: #005a87; }
            .result { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>API接口测试</h1>
        <button onclick="getUserInfo()">获取用户信息</button>
        <button onclick="getProducts()">获取产品列表</button>
        <div id="result" class="result">点击按钮测试接口...</div>

        <script>
            async function getUserInfo() {
                try {
                    const response = await fetch('/api/user');
                    const data = await response.json();
                    document.getElementById('result').innerHTML = 
                        '<h3>用户信息:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('result').innerHTML = '错误: ' + error.message;
                }
            }

            async function getProducts() {
                try {
                    const response = await fetch('/api/products');
                    const data = await response.json();
                    document.getElementById('result').innerHTML = 
                        '<h3>产品列表:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                    document.getElementById('result').innerHTML = '错误: ' + error.message;
                }
            }
        </script>
    </body>
    </html>
  `);
});

// API接口1: 获取用户信息
app.get('/api/user', (req, res) => {
  res.json({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    city: '北京',
    timestamp: new Date().toISOString()
  });
});

// API接口2: 获取产品列表
app.get('/api/products', (req, res) => {
  res.json({
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