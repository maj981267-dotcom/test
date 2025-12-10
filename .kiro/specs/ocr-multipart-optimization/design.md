# Design Document

## Overview

本设计文档描述了如何优化现有的 OCR API，从 Base64 编码传输改为 multipart/form-data 二进制传输。核心思路是在客户端和服务端之间使用更高效的二进制传输，而在服务端内部处理与百度 OCR API 的 Base64 要求。

## Architecture

### 当前架构
```
客户端 -> Base64编码 -> Vercel API -> Base64传输 -> 百度OCR
```

### 优化后架构
```
客户端 -> 二进制文件 -> Vercel API -> 内存转Base64 -> 百度OCR
```

### 关键改进点
1. **传输优化**: 客户端到服务端使用原生二进制传输，减少33%数据量
2. **兼容性保持**: 服务端内部仍使用Base64调用百度API
3. **内存效率**: 在内存中进行格式转换，避免临时文件

## Components and Interfaces

### 1. 文件上传处理器 (Multipart Handler)
```javascript
// 处理 multipart/form-data 请求
function parseMultipartData(req) {
  // 解析 multipart 数据
  // 提取文件和其他字段
  // 返回文件buffer和metadata
}
```

### 2. 文件转换器 (File Converter)
```javascript
// 将二进制数据转换为Base64
function bufferToBase64(buffer, mimeType) {
  // 验证文件类型
  // 转换为Base64格式
  // 返回百度API需要的格式
}
```

### 3. 更新后的OCR API端点
- **输入**: multipart/form-data 包含图片文件和token
- **处理**: 解析文件 -> 转换格式 -> 调用百度API
- **输出**: 保持现有的JSON响应格式

### 4. 客户端调用方式
```javascript
// 客户端使用FormData进行文件上传
const formData = new FormData();
formData.append('image', file);        // 直接添加File对象
formData.append('token', accessToken); // 百度API令牌

fetch('/api/ocr', {
  method: 'POST',
  body: formData  // 浏览器自动设置multipart/form-data头
});
```

## Data Models

### 请求格式
```javascript
// Multipart form data
{
  image: File,           // 图片文件 (二进制)
  token: string         // 百度API访问令牌
}
```

### 响应格式 (保持不变)
```javascript
{
  words_result: [...],           // 百度OCR原始结果
  filtered_english_words: [...], // 过滤后的英文单词
  // 其他百度API返回的字段
}
```

### 内部数据流
```javascript
// 1. 解析后的文件数据
{
  buffer: Buffer,        // 文件二进制数据
  mimetype: string,      // 文件类型
  size: number          // 文件大小
}

// 2. 转换后的Base64数据
{
  base64Data: string,    // 纯Base64字符串
  mimeType: string      // 原始文件类型
}
```

## Error Handling

### 文件上传错误
- **文件过大**: 返回413状态码和明确错误信息
- **文件类型不支持**: 返回400状态码，列出支持的格式
- **multipart解析失败**: 返回400状态码和解析错误详情

### 格式转换错误
- **内存不足**: 返回500状态码，建议减小文件大小
- **文件损坏**: 返回400状态码，提示重新上传

### 百度API错误
- **保持现有错误处理逻辑**: 直接转发百度API的错误响应
- **网络超时**: 返回504状态码和重试建议

## Testing Strategy

### 单元测试
1. **multipart解析器测试**
   - 测试各种文件格式的解析
   - 测试边界条件和错误情况
   
2. **Base64转换器测试**
   - 验证转换结果的正确性
   - 测试不同大小文件的处理

3. **文件验证器测试**
   - 测试文件类型检查
   - 测试文件大小限制

### 集成测试
1. **端到端上传流程**
   - 从前端文件选择到OCR结果返回
   - 测试不同格式和大小的图片

2. **性能对比测试**
   - 对比Base64和multipart的传输时间
   - 测量数据量减少的实际效果

3. **错误场景测试**
   - 测试各种错误情况的处理
   - 验证错误信息的准确性

### 性能测试
1. **传输效率测试**
   - 测量不同文件大小的传输时间
   - 对比Base64和二进制传输的性能差异

2. **内存使用测试**
   - 监控文件转换过程的内存消耗
   - 确保大文件处理不会导致内存泄漏

3. **并发处理测试**
   - 测试同时处理多个文件上传的能力
   - 验证系统在高负载下的稳定性