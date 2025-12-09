// api/products.js - 产品列表接口
export default function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    res.status(200).json({
      products: [
        { id: 1, name: '笔记本电脑', price: 5999, category: '电子产品' },
        { id: 2, name: '无线鼠标', price: 199, category: '电子产品' },
        { id: 3, name: '机械键盘', price: 399, category: '电子产品' }
      ],
      total: 3,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}