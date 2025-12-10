// api/ocr.js - 百度OCR接口 (二次封装)
import axios from 'axios';

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

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
}