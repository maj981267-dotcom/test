// api/products.js - 产品列表接口
export const runtime = 'edge';

export default function handler(req) {
  return new Response(
    JSON.stringify({
      products: [
        { id: 1, name: '笔记本电脑', price: 5999, category: '电子产品' },
        { id: 2, name: '无线鼠标', price: 199, category: '电子产品' },
        { id: 3, name: '机械键盘', price: 399, category: '电子产品' }
      ],
      total: 3,
      timestamp: new Date().toISOString()
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    }
  );
}