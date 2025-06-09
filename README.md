# CipherImage - 密钥图片隐写工具

[English](README-EN.md) | 中文

一个基于密钥的图像隐写工具，用于在图像中安全地隐藏和提取文本信息。使用LSB（最低有效位）隐写技术和伪随机密钥系统，确保隐藏信息的安全性。

## ✨ 特性

- 🔐 **基于密钥的安全隐写**：使用自定义密钥控制隐写位置，增强安全性
- 🖼️ **多格式支持**：支持PNG、JPG、JPEG格式的图片文件  
- 📝 **文本隐藏与提取**：支持任意长度文本的隐藏和提取
- 🎨 **现代化UI**：基于Next.js和Tailwind CSS的美观界面
- 📱 **响应式设计**：支持桌面端和移动端访问
- ⚡ **实时处理**：即时预览和处理结果

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- pnpm, npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/your-username/CipherImage.git
cd CipherImage
```

2. 安装依赖
```bash
pnpm install
# 或
npm install
```

3. 启动开发服务器
```bash
pnpm dev
# 或
npm run dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 使用方法

### 隐藏信息

1. **选择载体图片**：上传一张PNG、JPG或JPEG格式的图片
2. **设置密钥**：输入一个自定义密钥（请牢记此密钥）
3. **输入文本**：在文本框中输入要隐藏的信息
4. **生成隐写图片**：点击"隐藏信息到图片"按钮，系统会自动下载含有隐藏信息的图片

### 提取信息

1. **选择隐写图片**：上传含有隐藏信息的图片
2. **输入密钥**：输入隐藏信息时使用的相同密钥
3. **提取信息**：点击"提取隐藏信息"按钮查看隐藏的文本

## 🔧 技术原理

### LSB隐写技术

本工具使用LSB（Least Significant Bit）隐写技术：
- 将文本转换为二进制数据
- 修改图像像素红色通道的最低有效位
- 人眼无法察觉到这种微小的颜色变化

### 密钥系统

- 使用密钥生成伪随机数序列
- 根据密钥确定像素的访问顺序
- 没有正确密钥无法提取隐藏信息

### 安全特性

- 伪随机像素分布，增加破解难度
- 密钥验证机制
- 结束符标记确保数据完整性

## 📁 项目结构

```text
CipherImage/
├── app/                    # Next.js 应用目录
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # 基础UI组件
│   ├── steganography-tool.tsx  # 主要隐写工具组件
│   └── theme-provider.tsx
├── lib/                  # 核心库文件
│   ├── steganography.ts  # 隐写算法实现
│   ├── image-utils.ts    # 图像处理工具
│   └── utils.ts          # 通用工具函数
├── public/               # 静态资源
└── styles/               # 样式文件
```

## 🛠️ 技术栈

- **前端框架**：[Next.js 15](https://nextjs.org/) - React 全栈框架
- **UI组件**：[Radix UI](https://www.radix-ui.com/) - 无样式组件库
- **样式系统**：[Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- **图标库**：[Lucide React](https://lucide.dev/) - 精美的图标组件
- **类型检查**：[TypeScript](https://www.typescriptlang.org/) - 静态类型检查
- **包管理器**：pnpm - 快速、节省磁盘空间的包管理器

## 🔧 核心API

### 隐写函数

```typescript
// 将文本嵌入图片
embedTextInImage(imageData: ImageData, secretText: string, key: string): ImageData

// 从图片中提取文本
extractTextFromImage(imageData: ImageData, key: string): string
```

### 图像处理工具

```typescript
// 文件转ImageData
fileToImageData(file: File): Promise<ImageData>

// ImageData转Blob
imageDataToBlob(imageData: ImageData): Promise<Blob>

// 下载文件
downloadFile(blob: Blob, filename: string): void
```

## 📋 构建与部署

### 生产构建

```bash
pnpm build
pnpm start
```

### 静态导出

```bash
pnpm build
pnpm export
```

### Vercel部署

项目已配置为可直接部署到Vercel：

1. Fork此仓库
2. 在Vercel中导入项目
3. 自动部署完成

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/CipherImage)

## ⚠️ 安全须知

1. **密钥安全**：请妥善保管您的密钥，丢失密钥将无法恢复隐藏信息
2. **图片格式**：建议使用PNG格式以获得最佳隐写效果
3. **图片大小**：确保图片有足够的像素来存储您的文本信息
4. **隐私保护**：本工具完全在客户端运行，不会上传您的图片或数据

## 🤝 贡献指南

欢迎贡献代码！请按照以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙋‍♂️ 常见问题

**Q: 支持哪些图片格式？**  
A: 支持PNG、JPG、JPEG格式，推荐使用PNG格式以获得最佳效果。

**Q: 密钥有长度限制吗？**  
A: 没有严格的长度限制，但建议使用8位以上的复杂密钥以确保安全性。

**Q: 隐藏的文本会影响图片质量吗？**  
A: LSB隐写技术对图片质量的影响微乎其微，人眼无法察觉。

**Q: 可以隐藏多长的文本？**  
A: 隐藏文本的长度取决于图片的像素数量，一般情况下一个像素可以隐藏1位信息。

---

⭐ 如果这个项目对您有帮助，请给我们一个Star！
