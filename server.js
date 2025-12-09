const express = require('express');
const app = express();

// 静态文件服务
app.use(express.static('public'));

// 根路径简单返回文本
app.get('/', (req, res) => {
  res.send('欢迎访问 Node.js Express 测试应用！请访问 /index.html 查看完整页面。');
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