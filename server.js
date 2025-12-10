const express = require('express');
const path = require('path'); // 【新增 1】引入 path 模块
const axios = require('axios');
const natural = require('natural');
const validator = require('validator');
const app = express();

// 文本过滤函数
function filterEnglishWords(wordsResult) {
  if (!wordsResult || !Array.isArray(wordsResult)) {
    return [];
  }

  return wordsResult
    .map(item => item.words)
    .filter(text => {
      if (!text || typeof text !== 'string') return false;

      // 移除空格和特殊字符，只保留字母
      const cleanText = text.replace(/[^a-zA-Z]/g, '');

      // 过滤条件：
      // 1. 不包含中文字符
      if (/[\u4e00-\u9fff]/.test(text)) return false;

      // 2. 清理后的文本长度至少2个字符
      if (cleanText.length < 2) return false;

      // 3. 必须是纯英文字母
      if (!/^[a-zA-Z]+$/.test(cleanText)) return false;

      // 4. 使用natural库检查是否像英文单词
      // 检查是否包含常见的英文字母组合
      const hasVowel = /[aeiouAEIOU]/.test(cleanText);
      if (!hasVowel && cleanText.length > 3) return false;

      // 5. 过滤明显的无意义组合
      const meaninglessPatterns = [
        /^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{4,}$/, // 连续辅音
        /(.)\1{2,}/, // 连续重复字母超过2次
        /^[aeiouAEIOU]{4,}$/ // 连续元音超过3个
      ];

      for (const pattern of meaninglessPatterns) {
        if (pattern.test(cleanText)) return false;
      }

      return true;
    })
    .map(text => text.replace(/[^a-zA-Z]/g, '')) // 返回清理后的纯英文
    .filter(text => text.length >= 2); // 最终长度检查
}

// 添加JSON解析中间件
app.use(express.json({ limit: '50mb' })); // 支持大图片的base64数据

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

// API路由 - 百度OCR接口 (二次封装)
app.post('/api/ocr', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { token, image } = req.body;

    // 验证必需参数
    if (!token || !image) {
      return res.status(400).json({
        error: 'Missing required parameters: token and image'
      });
    }

    // 提取base64数据 (移除data:image/jpeg;base64,前缀)
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');

    // 调用百度OCR API
    const baiduResponse = await axios.post(
      `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=${token}`,
      `image=${encodeURIComponent(base64Data)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // 处理百度API的结果
    const originalData = baiduResponse.data;

    // 如果有words_result，进行过滤
    if (originalData.words_result) {
      const filteredWords = filterEnglishWords(originalData.words_result);

      // 返回包含原始数据和过滤后数据的结果
      res.status(200).json({
        ...originalData,
        filtered_english_words: filteredWords
      });
    } else {
      // 如果没有words_result，直接返回原始结果
      res.status(200).json(originalData);
    }

  } catch (error) {
    // 如果是百度API返回的错误，直接转发
    if (error.response && error.response.data) {
      res.status(error.response.status || 400).json(error.response.data);
    } else {
      // 其他错误
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
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