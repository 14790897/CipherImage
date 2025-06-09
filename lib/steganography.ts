// 文本转二进制 (UTF-8编码)
function textToBits(text: string): string {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(text);
  return Array.from(utf8Bytes)
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join("");
}

// 二进制转文本 (UTF-8解码)
function bitsToText(bits: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    if (byte.length < 8) break;
    const n = Number.parseInt(byte, 2);
    if (n === 0) break; // 结束符
    bytes.push(n);
  }

  try {
    const decoder = new TextDecoder("utf-8");
    const uint8Array = new Uint8Array(bytes);
    return decoder.decode(uint8Array);
  } catch (error) {
    // 如果UTF-8解码失败，回退到基本字符编码
    return String.fromCharCode(...bytes);
  }
}

// 生成伪随机像素访问顺序
function getPixelOrder(
  width: number,
  height: number,
  key: string
): [number, number][] {
  const coords: [number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      coords.push([x, y]);
    }
  }

  // 使用密钥生成伪随机种子
  let seed = 0;
  for (let i = 0; i < key.length; i++) {
    seed = (seed * 31 + key.charCodeAt(i)) % 2147483647;
  }

  // 伪随机打乱数组
  const rng = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let i = coords.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [coords[i], coords[j]] = [coords[j], coords[i]];
  }

  return coords;
}

// 将文本嵌入图片
export function embedTextInImage(
  imageData: ImageData,
  secretText: string,
  key: string
): ImageData {
  const { width, height, data } = imageData;
  const secretBits = textToBits(secretText) + "00000000"; // 添加结束符
  const totalBits = secretBits.length;

  if (totalBits > width * height) {
    throw new Error("消息太长，图片装不下！");
  }

  const coords = getPixelOrder(width, height, key);
  const newData = new Uint8ClampedArray(data);

  for (let i = 0; i < totalBits && i < coords.length; i++) {
    const [x, y] = coords[i];
    const pixelIndex = (y * width + x) * 4; // RGBA

    // 修改红色通道的最低位
    const r = newData[pixelIndex];
    newData[pixelIndex] = (r & 0b11111110) | Number.parseInt(secretBits[i]);
  }

  return new ImageData(newData, width, height);
}

// 从图片中提取文本
export function extractTextFromImage(
  imageData: ImageData,
  key: string
): string {
  const { width, height, data } = imageData;
  const coords = getPixelOrder(width, height, key);
  let bits = "";

  for (const [x, y] of coords) {
    const pixelIndex = (y * width + x) * 4; // RGBA
    const r = data[pixelIndex];
    bits += (r & 1).toString();

    // 检查是否遇到结束符
    if (bits.length % 8 === 0 && bits.slice(-8) === "00000000") {
      return bitsToText(bits.slice(0, -8));
    }
  }

  return bitsToText(bits);
}
