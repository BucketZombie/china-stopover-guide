
```markdown
# Dify Workflow 应用 API 开发文档

## 概述

Dify Workflow 应用 API 提供了一系列接口，用于执行和管理 Workflow 应用。Workflow 应用无会话支持，适用于翻译、文章写作、总结 AI 等场景。

- **Base URL**: `http://localhost/v1`
- **认证**: 使用 API-Key 进行鉴权。API-Key 应在 `Authorization` HTTP Header 中传递，如下所示：
  ```
  Authorization: Bearer {API_KEY}
  ```
  **强烈建议**: 将 API-Key 存储在后端，避免在客户端暴露，以防止泄露导致财产损失。

---

## API 列表

1. **[执行 Workflow](#1-执行-workflow)**  
   `POST /workflows/run`  
   执行 Workflow 应用。

2. **[获取 Workflow 执行情况](#2-获取-workflow-执行情况)**  
   `GET /workflows/run/:workflow_id`  
   根据 Workflow 执行 ID 获取当前执行结果。

3. **[停止响应](#3-停止响应)**  
   `POST /workflows/tasks/:task_id/stop`  
   停止正在执行的 Workflow 任务（仅支持流式模式）。

4. **[上传文件](#4-上传文件)**  
   `POST /files/upload`  
   上传文件以供 Workflow 使用，支持多模态理解。

5. **[获取 Workflow 日志](#5-获取-workflow-日志)**  
   `GET /workflows/logs`  
   获取 Workflow 执行日志，支持分页和过滤。

6. **[获取应用基本信息](#6-获取应用基本信息)**  
   `GET /info`  
   获取应用的基本信息，如名称、描述和标签。

7. **[获取应用参数](#7-获取应用参数)**  
   `GET /parameters`  
   获取应用的功能开关、输入参数名称、类型及默认值等。

---

## 1. 执行 Workflow

**POST** `/workflows/run`

执行 Workflow 应用。必须先发布 Workflow 后才能执行。

### 请求体

| 参数             | 类型          | 是否必填 | 描述                                                                                     |
|------------------|---------------|----------|------------------------------------------------------------------------------------------|
| `inputs`         | object        | 是       | 传入 App 定义的变量值。键为变量名，值为具体值。若为文件类型，需指定 `files` 中所述对象。 |
| `response_mode`  | string        | 是       | 返回响应模式: <br> - `streaming`: 流式模式（推荐，基于 SSE 实现）。<br> - `blocking`: 阻塞模式（等待执行完毕返回，超 100 秒可能中断）。 |
| `user`           | string        | 是       | 用户标识，用于定义终端用户身份，需保证应用内唯一。                                        |
| `files`          | array[object] | 否       | 文件列表，用于传入文件结合文本理解，仅当模型支持时可用。                                  |

#### 文件对象结构

| 参数             | 类型   | 描述                                                                 |
|------------------|--------|----------------------------------------------------------------------|
| `type`           | string | 文件类型: `document`, `image`, `audio`, `video`, `custom`。具体支持类型见下文。 |
| `transfer_method`| string | 传递方式: `remote_url`（远程地址）或 `local_file`（本地文件）。       |
| `url`            | string | 文件地址（仅 `transfer_method` 为 `remote_url` 时）。                |
| `upload_file_id` | string | 上传文件 ID（仅 `transfer_method` 为 `local_file` 时）。             |

**支持的文件类型**:
- `document`: TXT, MD, MARKDOWN, PDF, HTML, XLSX, XLS, DOCX, CSV, EML, MSG, PPTX, PPT, XML, EPUB
- `image`: JPG, JPEG, PNG, GIF, WEBP, SVG
- `audio`: MP3, M4A, WAV, WEBM, AMR
- `video`: MP4, MOV, MPEG, MPGA
- `custom`: 其他文件类型

### 响应

- **`blocking` 模式**: 返回 `CompletionResponse` 对象，`Content-Type: application/json`。
- **`streaming` 模式**: 返回 `ChunkCompletionResponse` 对象流式序列，`Content-Type: text/event-stream`。

#### CompletionResponse

| 参数             | 类型    | 是否可选 | 描述                                      |
|------------------|---------|----------|-------------------------------------------|
| `workflow_run_id`| string  | 否       | Workflow 执行 ID                         |
| `task_id`        | string  | 否       | 任务 ID，用于跟踪和停止响应              |
| `data`           | object  | 否       | 详细内容                                 |
| `data.id`        | string  | 否       | Workflow 执行 ID                         |
| `data.workflow_id`| string | 否       | 关联 Workflow ID                         |
| `data.status`    | string  | 否       | 执行状态: `running`, `succeeded`, `failed`, `stopped` |
| `data.outputs`   | json    | 是       | 输出内容                                 |
| `data.error`     | string  | 是       | 错误原因                                 |
| `data.elapsed_time`| float | 是       | 耗时（秒）                               |
| `data.total_tokens`| int   | 是       | 总使用 tokens                            |
| `data.total_steps`| int   | 否       | 总步数                                   |
| `data.created_at`| timestamp | 否   | 开始时间                                 |
| `data.finished_at`| timestamp | 否  | 结束时间                                 |

#### ChunkCompletionResponse

流式块以 `data:` 开头，块之间以 `\n\n` 分隔。支持以下事件类型：

1. **`workflow_started`**: Workflow 开始执行  
   - `task_id` (string): 任务 ID  
   - `workflow_run_id` (string): Workflow 执行 ID  
   - `event` (string): 固定为 `workflow_started`  
   - `data.id` (string): Workflow 执行 ID  
   - `data.workflow_id` (string): 关联 Workflow ID  
   - `data.sequence_number` (int): 自增序号，从 1 开始  
   - `data.created_at` (timestamp): 开始时间  

2. **`node_started`**: 节点开始执行  
   - `task_id` (string): 任务 ID  
   - `workflow_run_id` (string): Workflow 执行 ID  
   - `event` (string): 固定为 `node_started`  
   - `data.id` (string): Workflow 执行 ID  
   - `data.node_id` (string): 节点 ID  
   - `data.node_type` (string): 节点类型  
   - `data.title` (string): 节点名称  
   - `data.index` (int): 执行序号  
   - `data.predecessor_node_id` (string): 前置节点 ID  
   - `data.inputs` (object): 前置节点变量内容  
   - `data.created_at` (timestamp): 开始时间  

3. **`node_finished`**: 节点执行结束  
   - `task_id` (string): 任务 ID  
   - `workflow_run_id` (string): Workflow 执行 ID  
   - `event` (string): 固定为 `node_finished`  
   - `data.id` (string): 节点执行 ID  
   - `data.node_id` (string): 节点 ID  
   - `data.index` (int): 执行序号  
   - `data.predecessor_node_id` (string, 可选): 前置节点 ID  
   - `data.inputs` (object): 前置节点变量内容  
   - `data.process_data` (json, 可选): 节点过程数据  
   - `data.outputs` (json, 可选): 输出内容  
   - `data.status` (string): 执行状态 (`running`, `succeeded`, `failed`, `stopped`)  
   - `data.error` (string, 可选): 错误原因  
   - `data.elapsed_time` (float, 可选): 耗时（秒）  
   - `data.execution_metadata` (json): 元数据  
   - `data.total_tokens` (int, 可选): 总使用 tokens  
   - `data.total_price` (decimal, 可选): 总费用  
   - `data.currency` (string, 可选): 货币，如 USD / RMB  
   - `data.created_at` (timestamp): 开始时间  

4. **`workflow_finished`**: Workflow 执行结束  
   - 同 `CompletionResponse` 的 `data` 结构。

5. **`tts_message`**: TTS 音频流事件  
   - `task_id` (string): 任务 ID  
   - `message_id` (string): 消息唯一 ID  
   - `audio` (string): Base64 编码的音频块（Mp3 格式）  
   - `created_at` (int): 创建时间戳  

6. **`tts_message_end`**: TTS 音频流结束事件  
   - `task_id` (string): 任务 ID  
   - `message_id` (string): 消息唯一 ID  
   - `audio` (string): 空字符串  
   - `created_at` (int): 创建时间戳  

7. **`ping`**: 每 10 秒一次，保持连接存活。

### 示例

#### 请求
```bash
curl -X POST 'http://localhost/v1/workflows/run' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "inputs": {},
    "response_mode": "streaming",
    "user": "abc-123"
}'
```

#### 文件变量示例
```json
{
  "inputs": {
    "{variable_name}": {
      "transfer_method": "local_file",
      "upload_file_id": "{upload_file_id}",
      "type": "{document_type}"
    }
  }
}
```

#### 响应（blocking 模式）
```json
{
    "workflow_run_id": "djflajgkldjgd",
    "task_id": "9da23599-e713-473b-982c-4328d4f5c78a",
    "data": {
        "id": "fdlsjfjejkghjda",
        "workflow_id": "fldjaslkfjlsda",
        "status": "succeeded",
        "outputs": {
          "text": "Nice to meet you."
        },
        "error": null,
        "elapsed_time": 0.875,
        "total_tokens": 3562,
        "total_steps": 8,
        "created_at": 1705407629,
        "finished_at": 1727807631
    }
}
```

#### 响应（streaming 模式）
```
data: {"event": "workflow_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "sequence_number": 1, "created_at": 1679586595}}
data: {"event": "node_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "created_at": 1679586595}}
data: {"event": "node_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "execution_metadata": {"total_tokens": 63127864, "total_price": 2.378, "currency": "USD"}, "created_at": 1679586595}}
data: {"event": "workflow_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "total_tokens": 63127864, "total_steps": "1", "created_at": 1679586595, "finished_at": 1679976595}}
```

---

## 2. 获取 Workflow 执行情况

**GET** `/workflows/run/:workflow_id`

根据 Workflow 执行 ID 获取当前执行结果。

### 路径参数

| 参数          | 类型   | 描述                |
|---------------|--------|---------------------|
| `workflow_id` | string | Workflow 执行 ID    |

### 响应

| 参数          | 类型      | 描述                                      |
|---------------|-----------|-------------------------------------------|
| `id`          | string    | Workflow 执行 ID                         |
| `workflow_id` | string    | 关联的 Workflow ID                       |
| `status`      | string    | 执行状态: `running`, `succeeded`, `failed`, `stopped` |
| `inputs`      | json      | 任务输入内容                             |
| `outputs`     | json      | 任务输出内容                             |
| `error`       | string    | 错误原因                                 |
| `total_steps` | int       | 任务执行总步数                           |
| `total_tokens`| int       | 任务执行总 tokens                        |
| `created_at`  | timestamp | 任务开始时间                             |
| `finished_at` | timestamp | 任务结束时间                             |
| `elapsed_time`| float     | 耗时（秒）                               |

### 示例

#### 请求
```bash
curl -X GET 'http://localhost/v1/workflows/run/:workflow_id' \
-H 'Authorization: Bearer {api_key}' \
-H 'Content-Type: application/json'
```

#### 响应
```json
{
    "id": "b1ad3277-089e-42c6-9dff-6820d94fbc76",
    "workflow_id": "19eff89f-ec03-4f75-b0fc-897e7effea02",
    "status": "succeeded",
    "inputs": "{\"sys.files\": [], \"sys.user_id\": \"abc-123\"}",
    "outputs": null,
    "error": null,
    "total_steps": 3,
    "total_tokens": 0,
    "created_at": "Thu, 18 Jul 2024 03:17:40 -0000",
    "finished_at": "Thu, 18 Jul 2024 03:18:10 -0000",
    "elapsed_time": 30.098514399956912
}
```

---

## 3. 停止响应

**POST** `/workflows/tasks/:task_id/stop`

停止正在执行的 Workflow 任务（仅支持流式模式）。

### 路径参数

| 参数      | 类型   | 描述          |
|-----------|--------|---------------|
| `task_id` | string | 任务 ID       |

### 请求体

| 参数   | 类型   | 是否必填 | 描述                                      |
|--------|--------|----------|-------------------------------------------|
| `user` | string | 是       | 用户标识，需与发送消息接口的 `user` 一致  |

### 响应

| 参数     | 类型   | 描述            |
|----------|--------|-----------------|
| `result` | string | 固定返回 "success" |

### 示例

#### 请求
```bash
curl -X POST 'http://localhost/v1/workflows/tasks/:task_id/stop' \
-H 'Authorization: Bearer {api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{"user": "abc-123"}'
```

#### 响应
```json
{
  "result": "success"
}
```

---

## 4. 上传文件

**POST** `/files/upload`

上传文件以供 Workflow 使用，支持多模态理解。使用 `multipart/form-data` 格式请求。

### 请求体

| 参数   | 类型   | 是否必填 | 描述                                      |
|--------|--------|----------|-------------------------------------------|
| `file` | file   | 是       | 要上传的文件                              |
| `user` | string | 是       | 用户标识，需与发送消息接口的 `user` 一致  |

### 响应

| 参数         | 类型      | 描述                  |
|--------------|-----------|-----------------------|
| `id`         | uuid      | 文件 ID               |
| `name`       | string    | 文件名                |
| `size`       | int       | 文件大小（byte）      |
| `extension`  | string    | 文件后缀              |
| `mime_type`  | string    | 文件 MIME 类型        |
| `created_by` | uuid      | 上传人 ID             |
| `created_at` | timestamp | 上传时间              |

### 示例

#### 请求
```bash
curl -X POST 'http://localhost/v1/files/upload' \
--header 'Authorization: Bearer {api_key}' \
--form 'file=@localfile;type=image/[png|jpeg|jpg|webp|gif]' \
--form 'user=abc-123'
```

#### 响应
```json
{
  "id": "72fa9618-8f89-4a37-9b33-7e1178a24a67",
  "name": "example.png",
  "size": 1024,
  "extension": "png",
  "mime_type": "image/png",
  "created_by": 123,
  "created_at": 1577836800
}
```

---

## 5. 获取 Workflow 日志

**GET** `/workflows/logs`

获取 Workflow 执行日志，支持分页和过滤，倒序返回。

### 查询参数

| 参数      | 类型   | 是否必填 | 描述                          |
|-----------|--------|----------|-------------------------------|
| `keyword` | string | 否       | 关键字                        |
| `status`  | string | 否       | 执行状态: `succeeded`, `failed`, `stopped` |
| `page`    | int    | 否       | 当前页码，默认 1              |
| `limit`   | int    | 否       | 每页条数，默认 20             |

### 响应

| 参数        | 类型          | 描述                          |
|-------------|---------------|-------------------------------|
| `page`      | int           | 当前页码                      |
| `limit`     | int           | 每页条数                      |
| `total`     | int           | 总条数                        |
| `has_more`  | bool          | 是否还有更多数据              |
| `data`      | array[object] | 当前页码的数据                |

#### `data` 对象结构

| 参数                  | 类型      | 是否可选 | 描述                                      |
|-----------------------|-----------|----------|-------------------------------------------|
| `id`                  | string    | 否       | 标识                                      |
| `workflow_run`        | object    | 否       | Workflow 执行日志                        |
| `workflow_run.id`     | string    | 否       | 标识                                      |
| `workflow_run.version`| string    | 否       | 版本                                      |
| `workflow_run.status` | string    | 否       | 执行状态: `running`, `succeeded`, `failed`, `stopped` |
| `workflow_run.error`  | string    | 是       | 错误                                      |
| `workflow_run.elapsed_time`| float | 否  | 耗时（秒）                                |
| `workflow_run.total_tokens`| int  | 否  | 消耗的 token 数量                         |
| `workflow_run.total_steps`| int   | 否   | 执行步骤长度                              |
| `workflow_run.created_at`| timestamp | 否 | 开始时间                                  |
| `workflow_run.finished_at`| timestamp | 否| 结束时间                                  |
| `created_from`        | string    | 否       | 来源                                      |
| `created_by_role`     | string    | 否       | 角色                                      |
| `created_by_account`  | string    | 是       | 帐号                                      |
| `created_by_end_user` | object    | 否       | 用户                                      |
| `created_by_end_user.id`| string  | 否       | 标识                                      |
| `created_by_end_user.type`| string| 否       | 类型                                      |
| `created_by_end_user.is_anonymous`| bool | 否  | 是否匿名                                  |
| `created_by_end_user.session_id`| string | 否 | 会话标识                                  |
| `created_at`          | timestamp | 否       | 创建时间                                  |

### 示例

#### 请求
```bash
curl -X GET 'http://localhost/v1/workflows/logs' \
--header 'Authorization: Bearer {api_key}'
```

#### 响应
```json
{
    "page": 1,
    "limit": 1,
    "total": 7,
    "has_more": true,
    "data": [
        {
            "id": "e41b93f1-7ca2-40fd-b3a8-999aeb499cc0",
            "workflow_run": {
                "id": "c0640fc8-03ef-4481-a96c-8a13b732a36e",
                "version": "2024-08-01 12:17:09.771832",
                "status": "succeeded",
                "error": null,
                "elapsed_time": 1.3588523610014818,
                "total_tokens": 0,
                "total_steps": 3,
                "created_at": 1726139643,
                "finished_at": 1726139644
            },
            "created_from": "service-api",
            "created_by_role": "end_user",
            "created_by_account": null,
            "created_by_end_user": {
                "id": "7f7d9117-dd9d-441d-8970-87e5e7e687a3",
                "type": "service_api",
                "is_anonymous": false,
                "session_id": "abc-123"
            },
            "created_at": 1726139644
        }
    ]
}
```

---

## 6. 获取应用基本信息

**GET** `/info`

获取应用的基本信息。

### 响应

| 参数          | 类型          | 描述          |
|---------------|---------------|---------------|
| `name`        | string        | 应用名称      |
| `description` | string        | 应用描述      |
| `tags`        | array[string] | 应用标签      |

### 示例

#### 请求
```bash
curl -X GET 'http://localhost/v1/info' \
-H 'Authorization: Bearer {api_key}'
```

#### 响应
```json
{
  "name": "My App",
  "description": "This is my app.",
  "tags": [
    "tag1",
    "tag2"
  ]
}
```

---

## 7. 获取应用参数

**GET** `/parameters`

获取应用的功能开关、输入参数名称、类型及默认值等。

### 响应

| 参数               | 类型          | 描述                          |
|--------------------|---------------|-------------------------------|
| `user_input_form`  | array[object] | 用户输入表单配置              |
| `file_upload`      | object        | 文件上传配置                  |
| `system_parameters`| object        | 系统参数                      |

#### `user_input_form` 对象结构

1. **`text-input`**: 文本输入控件  
   - `label` (string): 控件展示标签名  
   - `variable` (string): 控件 ID  
   - `required` (bool): 是否必填  
   - `default` (string): 默认值  

2. **`paragraph`**: 段落文本输入控件  
   - `label` (string): 控件展示标签名  
   - `variable` (string): 控件 ID  
   - `required` (bool): 是否必填  
   - `default` (string): 默认值  

3. **`select`**: 下拉控件  
   - `label` (string): 控件展示标签名  
   - `variable` (string): 控件 ID  
   - `required` (bool): 是否必填  
   - `default` (string): 默认值  
   - `options` (array[string]): 选项值  

#### `file_upload` 对象结构

- **`image`**: 图片设置  
  - `enabled` (bool): 是否开启  
  - `number_limits` (int): 图片数量限制，默认 3  
  - `transfer_methods` (array[string]): 传递方式列表: `remote_url`, `local_file`  

#### `system_parameters` 对象结构

- `file_size_limit` (int): 文档上传大小限制 (MB)  
- `image_file_size_limit` (int): 图片文件上传大小限制 (MB)  
- `audio_file_size_limit` (int): 音频文件上传大小限制 (MB)  
- `video_file_size_limit` (int): 视频文件上传大小限制 (MB)  

### 示例

#### 请求
```bash
curl -X GET 'http://localhost/v1/parameters'
```

#### 响应
```json
{
  "user_input_form": [
      {
          "paragraph": {
              "label": "Query",
              "variable": "query",
              "required": true,
              "default": ""
          }
      }
  ],
  "file_upload": {
      "image": {
          "enabled": false,
          "number_limits": 3,
          "detail": "high",
          "transfer_methods": [
              "remote_url",
              "local_file"
          ]
      }
  },
  "system_parameters": {
      "file_size_limit": 15,
      "image_file_size_limit": 10,
      "audio_file_size_limit": 50,
      "video_file_size_limit": 100
  }
}
```

---

## 错误码

| 状态码 | 错误码                   | 描述                     |
|--------|--------------------------|--------------------------|
| 400    | `invalid_param`          | 传入参数异常             |
| 400    | `app_unavailable`        | App 配置不可用           |
| 400    | `provider_not_initialize`| 无可用模型凭据配置       |
| 400    | `provider_quota_exceeded`| 模型调用额度不足         |
| 400    | `model_currently_not_support`| 当前模型不可用       |
| 400    | `workflow_request_error` | Workflow 执行失败        |
| 500    | -                        | 服务内部异常             |

### 文件上传特定错误码

| 状态码 | 错误码                   | 描述                          |
|--------|--------------------------|-------------------------------|
| 400    | `no_file_uploaded`       | 必须提供文件                  |
| 400    | `too_many_files`         | 目前只接受一个文件            |
| 400    | `unsupported_preview`    | 该文件不支持预览              |
| 400    | `unsupported_estimate`   | 该文件不支持估算              |
| 413    | `file_too_large`         | 文件太大                      |
| 415    | `unsupported_file_type`  | 不支持的扩展名                |
| 503    | `s3_connection_failed`   | 无法连接到 S3 服务            |
| 503    | `s3_permission_denied`   | 无权限上传文件到 S3           |
| 503    | `s3_file_too_large`      | 文件超出 S3 大小限制          |

---

## 文件上传示例代码

以下是一个 Python 示例，用于上传文件并执行 Workflow：

```python
import requests
import json

def upload_file(file_path, user):
    upload_url = "https://api.dify.ai/v1/files/upload"
    headers = {
        "Authorization": "Bearer app-xxxxxxxx",
    }
    
    try:
        print("上传文件中...")
        with open(file_path, 'rb') as file:
            files = {
                'file': (file_path, file, 'text/plain')  # 确保文件以适当的 MIME 类型上传
            }
            data = {
                "user": user,
                "type": "TXT"  # 设置文件类型为 TXT
            }
            
            response = requests.post(upload_url, headers=headers, files=files, data=data)
            if response.status_code == 201:  # 201 表示创建成功
                print("文件上传成功")
                return response.json().get("id")  # 获取上传的文件 ID
            else:
                print(f"文件上传失败，状态码: {response.status_code}")
                return None
    except Exception as e:
        print(f"发生错误: {str(e)}")
        return None

def run_workflow(file_id, user, response_mode="blocking"):
    workflow_url = "https://api.dify.ai/v1/workflows/run"
    headers = {
        "Authorization": "Bearer app-xxxxxxxxx",
        "Content-Type": "application/json"
    }

    data = {
        "inputs": {
            "orig_mail": {
                "transfer_method": "local_file",
                "upload_file_id": file_id,
                "type": "document"
            }
        },
        "response_mode": response_mode,
        "user": user
    }

    try:
        print("运行工作流...")
        response = requests.post(workflow_url, headers=headers, json=data)
        if response.status_code == 200:
            print("工作流执行成功")
            return response.json()
        else:
            print(f"工作流执行失败，状态码: {response.status_code}")
            return {"status": "error", "message": f"Failed to execute workflow, status code: {response.status_code}"}
    except Exception as e:
        print(f"发生错误: {str(e)}")
        return {"status": "error", "message": str(e)}

# 使用示例
file_path = "{your_file_path}"
user = "difyuser"

# 上传文件
file_id = upload_file(file_path, user)
if file_id:
    # 文件上传成功，继续运行工作流
    result = run_workflow(file_id, user)
    print(result)
else:
    print("文件上传失败，无法执行工作流")
```

---

```

### 保存步骤
1. **复制内容**：选中上面的代码块（从 `# Dify Workflow 应用 API 开发文档` 开始到最后的 `---`），右键复制。
2. **粘贴到编辑器**：打开一个文本编辑器（推荐使用支持 Markdown 的编辑器，如 VS Code 或 Typora），粘贴内容。
3. **保存文件**：点击“文件” > “保存为”，文件名可以设为 `DifyWorkflowAPI.md`，选择保存位置后确认。

希望这能帮您顺利保存文档！如果有其他问题，随时告诉我。