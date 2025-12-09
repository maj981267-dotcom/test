// api/user.js - 独立接口函数，使用Edge运行时消除冷启动
export const runtime = 'edge';

export default function handler(req) {
  // Edge Functions用Response对象返回，而非res.json
  return new Response(
    JSON.stringify({
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      age: 25,
      city: '北京',
      timestamp: new Date().toISOString()
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    }
  );
}