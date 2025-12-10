# Requirements Document

## Introduction

优化现有的 OCR API 文件上传机制，从 Base64 编码传输改为 multipart/form-data 二进制传输，以提高传输效率和减少带宽使用。当前实现要求客户端将图片转换为 Base64 后发送，这会增加 33% 的数据体积。新的实现将支持直接上传二进制文件，在服务端内存中转换为 Base64 后调用百度 OCR API。

## Requirements

### Requirement 1

**User Story:** 作为开发者，我希望能够直接上传图片文件而不需要在客户端进行 Base64 编码，以便减少客户端处理负担和网络传输数据量。

#### Acceptance Criteria

1. WHEN 用户通过 multipart/form-data 上传图片文件 THEN 系统 SHALL 接受并处理该文件
2. WHEN 接收到二进制图片数据 THEN 系统 SHALL 在内存中将其转换为 Base64 格式
3. WHEN 文件大小超过合理限制 THEN 系统 SHALL 返回适当的错误信息

### Requirement 2

**User Story:** 作为系统管理员，我希望保持与百度 OCR API 的兼容性，以便现有的 OCR 功能继续正常工作。

#### Acceptance Criteria

1. WHEN 服务端处理完文件上传 THEN 系统 SHALL 使用 Base64 格式调用百度 OCR API
2. WHEN 百度 OCR API 返回结果 THEN 系统 SHALL 保持现有的响应格式和过滤逻辑
3. WHEN API 调用失败 THEN 系统 SHALL 返回与现有实现相同的错误处理

### Requirement 3

**User Story:** 作为性能监控人员，我希望能够验证新实现的性能提升，以便确认优化效果。

#### Acceptance Criteria

1. WHEN 使用新的 multipart 上传方式 THEN 传输数据量 SHALL 比 Base64 方式减少约 25%
2. WHEN 处理相同大小的图片 THEN 上传时间 SHALL 有明显改善
3. WHEN 系统处理文件转换 THEN 内存使用 SHALL 保持在合理范围内