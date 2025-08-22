# Photo Stylizer

一个基于 Next.js 的 AI 照片风格化应用，支持将人像照片转换为多种艺术风格。

## ✨ 功能特性

- 🖼️ **图片上传**：支持 JPG、PNG、WebP 格式，最大 10MB
- 🎨 **多种风格**：内置 17+ 种预设风格，包括：
  - Q版手办、玩具包装、3D模型
  - 皮克斯动画、多啦A梦、史努比
  - 日本插画、羊毛毡、珐琅别针
  - 时尚杂志、水晶球等
- 🤖 **双AI引擎**：支持 Kolors 和 OpenAI 两种 AI 模型
- ⚙️ **参数调节**：可调整生成步数、引导强度、随机种子等
- 💾 **本地缓存**：自动保存最近生成结果
- 📱 **响应式设计**：支持桌面和移动设备

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置 API 密钥：
```env
# Kolors API 配置
NEXT_PUBLIC_KOLORS_API_KEY=your_kolors_api_key

# OpenAI API 配置 (可选)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_OPENAI_BASE_URL=https://api.openai.com/v1
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 🛠️ 技术栈

- **框架**：Next.js 15.2.4
- **UI 库**：Radix UI + Tailwind CSS
- **状态管理**：React Hooks
- **图标**：Lucide React
- **主题**：next-themes (支持暗色模式)
- **AI 模型**：Kolors、OpenAI DALL-E

## 📁 项目结构
photo-stylizer/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── image-uploader.tsx # 图片上传组件
│   ├── style-selector.tsx # 风格选择器
│   ├── generation-controls.tsx # 生成控制面板
│   ├── result-display.tsx # 结果展示组件
│   └── model-selector.tsx # 模型选择器
├── lib/                   # 工具库
│   ├── kolors.ts         # Kolors API 集成
│   ├── openai.ts         # OpenAI API 集成
│   └── utils.ts          # 通用工具函数
├── hooks/                 # 自定义 Hooks
├── public/               # 静态资源
└── docs/                 # 文档


## 🎨 预设风格

应用内置了丰富的预设风格，包括：

| 风格类型 | 描述 |
|---------|------|
| Q版手办 | 可爱的手办风格，圆润特征 |
| 玩具包装 | 商业产品包装设计风格 |
| 3D模型 | 专业3D渲染效果 |
| 皮克斯 | 迪士尼皮克斯动画风格 |
| 拍立得 | 复古即时相机效果 |
| 日本插画 | 精美的日式插画风格 |
| 羊毛毡 | 手工毛毡工艺质感 |
| 时尚杂志 | 高端时尚摄影风格 |

## 🔧 API 配置

### Kolors API

1. 访问 [Kolors 官网](https://www.kolors.ai/) 获取 API 密钥
2. 在 `.env` 文件中设置 `NEXT_PUBLIC_KOLORS_API_KEY`

### OpenAI API (可选)

1. 访问 [OpenAI Platform](https://platform.openai.com/) 获取 API 密钥
2. 在 `.env` 文件中设置相关配置

## 📝 使用说明

1. **上传图片**：点击上传区域选择人像照片
2. **选择风格**：从预设风格中选择或输入自定义提示词
3. **选择模型**：选择 Kolors 或 OpenAI 模型
4. **调整参数**：根据需要调整生成参数
5. **开始生成**：点击生成按钮等待处理
6. **下载结果**：生成完成后可下载结果图片

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [Kolors](https://www.kolors.ai/) - AI 图像生成服务
- [OpenAI](https://openai.com/) - AI 图像生成服务
- [Radix UI](https://www.radix-ui.com/) - 无障碍 UI 组件
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Next.js](https://nextjs.org/) - React 框架
