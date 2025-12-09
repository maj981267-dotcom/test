const express = require('express');
const app = express();

// 根路径直接显示test
app.get('/', (req, res) => {
  res.send('test');
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