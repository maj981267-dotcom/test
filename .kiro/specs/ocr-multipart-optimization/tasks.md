# Implementation Plan

- [x] 1. 安装和配置 multipart 解析依赖


  - 安装 multer 或类似的 multipart 解析库
  - 配置文件大小限制和支持的文件类型
  - _Requirements: 1.1, 1.3_



- [ ] 2. 重构 OCR API 以支持 multipart/form-data
  - 修改 api/ocr.js 以处理 multipart 请求而不是 JSON
  - 实现文件解析逻辑，提取图片文件和 token 参数

  - 保持现有的 CORS 设置和错误处理结构
  - _Requirements: 1.1, 2.3_

- [ ] 3. 实现二进制到 Base64 的内存转换
  - 创建函数将上传的文件 buffer 转换为 Base64 字符串

  - 验证文件类型（JPEG, PNG 等）
  - 实现文件大小检查和错误处理
  - _Requirements: 1.2, 1.3_

- [x] 4. 保持现有的百度 OCR API 调用逻辑


  - 确保转换后的 Base64 数据格式符合百度 API 要求
  - 保持现有的 filterEnglishWords 函数不变
  - 维护相同的响应格式，包括 filtered_english_words 字段
  - _Requirements: 2.1, 2.2_

- [ ] 5. 更新错误处理以支持文件上传场景
  - 添加文件类型不支持的错误处理
  - 添加文件过大的错误处理
  - 添加 multipart 解析失败的错误处理
  - 保持现有的百度 API 错误转发逻辑
  - _Requirements: 1.3, 2.3_