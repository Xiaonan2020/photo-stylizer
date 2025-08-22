# 照片风格化（Next.js）MVP 方案 for V0

> 目标：仅支持**人像照片**的风格转化；Web 前端（Next.js）；无需收费/登录（匿名使用）。输出文档面向 V0 平台使用。

---

## 1. MVP 范围（Must/Should/Won't）

* **Must（必须）**

  * 上传单张人像图片（JPG/PNG/WebP；≤ 10MB）。
  * 图片会在前端转为 **base64**，作为 `image` 参数传入 API。
  * 选择风格：预设风格库（10–12 个），或输入文本风格词。
  * 调用 **Kwai-Kolors/Kolors** API 生成风格化结果。
  * 显示生成进度与结果；用户可下载结果（PNG/JPG）。

* **Should（可选）**

  * 调整生成参数：`guidance_scale`、`num_inference_steps`、`seed`。
  * 支持断点恢复（localStorage 保存最近一次结果）。

* **Won't（本期不做）**

  * 登录/账户系统。
  * 批量处理/高分辨率放大。
  * 历史图库、收藏功能。

---

## 2. 用户流程（Single-Page Flow）

1. 访问页面 → 上传人像文件。
2. 文件转 base64，并在前端做预览。
3. 选择风格（预设或自定义文本）。
4. 点击生成 → 调用 API → 展示进度。
5. 完成后展示结果图 → 提供下载按钮。

---

## 3. Kolors API 调用规范

### 3.1 API Endpoint
