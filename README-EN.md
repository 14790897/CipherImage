# CipherImage - Key-Based Image Steganography Tool

English | [中文](README.md)

A key-based image steganography tool for securely hiding and extracting text information in images. Uses LSB (Least Significant Bit) steganography technique with a pseudo-random key system to ensure the security of hidden information.

## ✨ Features

- 🔐 **Key-Based Secure Steganography**: Uses custom keys to control steganography positions, enhancing security
- 🖼️ **Multi-Format Support**: Supports PNG, JPG, and JPEG image formats
- 📝 **Text Hiding & Extraction**: Supports hiding and extracting text of any length
- 🎨 **Modern UI**: Beautiful interface based on Next.js and Tailwind CSS
- 📱 **Responsive Design**: Supports both desktop and mobile access
- ⚡ **Real-time Processing**: Instant preview and processing results
- 🌐 **UTF-8 Support**: Full support for Unicode characters including Chinese, emojis, and special characters

## 🚀 Quick Start

### Requirements

- Node.js 18.17 or higher
- pnpm, npm, or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/CipherImage.git
cd CipherImage
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

3. Start the development server
```bash
pnpm dev
# or
npm run dev
```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Hiding Information

1. **Select Carrier Image**: Upload a PNG, JPG, or JPEG format image
2. **Set Key**: Enter a custom key (please remember this key)
3. **Input Text**: Enter the information you want to hide in the text box
4. **Generate Steganographic Image**: Click "Hide Information in Image" button, the system will automatically download the image containing hidden information

### Extracting Information

1. **Select Steganographic Image**: Upload an image containing hidden information
2. **Enter Key**: Enter the same key used when hiding the information
3. **Extract Information**: Click "Extract Hidden Information" button to view the hidden text

## 🔧 Technical Principles

### LSB Steganography Technique

This tool uses LSB (Least Significant Bit) steganography technique:
- Converts text to binary data using UTF-8 encoding
- Modifies the least significant bit of the red channel of image pixels
- These subtle color changes are imperceptible to the human eye

### Key System

- Uses keys to generate pseudo-random number sequences
- Determines pixel access order based on the key
- Hidden information cannot be extracted without the correct key

### Security Features

- Pseudo-random pixel distribution increases cracking difficulty
- Key verification mechanism
- End-of-message markers ensure data integrity

## 📁 Project Structure

```text
CipherImage/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Basic UI components
│   ├── steganography-tool.tsx  # Main steganography tool component
│   └── theme-provider.tsx
├── lib/                  # Core library files
│   ├── steganography.ts  # Steganography algorithm implementation
│   ├── image-utils.ts    # Image processing utilities
│   └── utils.ts          # Common utility functions
├── public/               # Static assets
└── styles/               # Style files
```

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) - React full-stack framework
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled component library
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon components
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/) - Static type checking
- **Package Manager**: pnpm - Fast, disk space efficient package manager

## 🔧 Core API

### Steganography Functions

```typescript
// Embed text in image
embedTextInImage(imageData: ImageData, secretText: string, key: string): ImageData

// Extract text from image
extractTextFromImage(imageData: ImageData, key: string): string
```

### Image Processing Utilities

```typescript
// Convert file to ImageData
fileToImageData(file: File): Promise<ImageData>

// Convert ImageData to Blob
imageDataToBlob(imageData: ImageData): Promise<Blob>

// Download file
downloadFile(blob: Blob, filename: string): void
```

## 📋 Build & Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Static Export

```bash
pnpm build
pnpm export
```

### Vercel Deployment

The project is configured for direct deployment to Vercel:

1. Fork this repository
2. Import the project in Vercel
3. Automatic deployment complete

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/CipherImage)

## ⚠️ Security Notes

1. **Key Security**: Please keep your key safe. Losing the key will make it impossible to recover hidden information
2. **Image Format**: PNG format is recommended for optimal steganography results
3. **Image Size**: Ensure the image has enough pixels to store your text information
4. **Privacy Protection**: This tool runs entirely on the client side and does not upload your images or data

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙋‍♂️ FAQ

**Q: What image formats are supported?**  
A: PNG, JPG, and JPEG formats are supported. PNG format is recommended for best results.

**Q: Is there a length limit for keys?**  
A: There's no strict length limit, but it's recommended to use complex keys of 8 characters or more for security.

**Q: Will hidden text affect image quality?**  
A: LSB steganography has minimal impact on image quality, imperceptible to the human eye.

**Q: How long can the hidden text be?**  
A: The length of hidden text depends on the number of pixels in the image. Generally, one pixel can hide 1 bit of information.

**Q: Does it support non-English characters?**  
A: Yes! The tool uses UTF-8 encoding and fully supports Chinese, Japanese, Korean, emojis, and all Unicode characters.

---

⭐ If this project helps you, please give us a Star!
