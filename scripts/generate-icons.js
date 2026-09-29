import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal PNG generator using Node built-in zlib
function createPng(width, height, drawPixelFn) {
  // 8 bytes PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression method: 0
  ihdrData[11] = 0; // Filter method: 0
  ihdrData[12] = 0; // Interlace method: 0
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image scanlines: (1 filter byte (0) + width * 4 bytes RGBA) * height
  const rawBytes = Buffer.alloc((1 + width * 4) * height);
  let pos = 0;

  for (let y = 0; y < height; y++) {
    rawBytes[pos++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixelFn(x, y, width, height);
      rawBytes[pos++] = r;
      rawBytes[pos++] = g;
      rawBytes[pos++] = b;
      rawBytes[pos++] = a;
    }
  }

  // IDAT chunk with deflated data
  const compressed = zlib.deflateSync(rawBytes, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Visual drawing function for Shorja Markets brand
// Luxurious deep amber/emerald gradient background with golden shopping bag / palm / star
function drawShorjaIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dist = Math.sqrt((nx - cx) * (nx - cx) + (ny - cy) * (ny - cy));

  // Background: Rich warm dark slate / emerald emerald-950 to stone-900 gradient
  const bgR = Math.round(18 + nx * 10 + ny * 15);
  const bgG = Math.round(24 + nx * 20 + ny * 25);
  const bgB = Math.round(27 + nx * 10);

  // If not maskable, round corners smoothly
  if (!isMaskable) {
    const cornerRadius = 0.22;
    const dx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - cornerRadius));
    const dy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - cornerRadius));
    const cornerDist = Math.sqrt(dx * dx + dy * dy);
    if (cornerDist > cornerRadius) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }
  }

  // Golden / Amber center emblem (Bag + Star / Palm)
  // Outer glowing ring
  const ringDist = Math.abs(dist - 0.36);
  if (ringDist < 0.015) {
    return [245, 158, 11, 255]; // Golden ring
  }

  // Shopping Bag shape in center
  const bagLeft = 0.32;
  const bagRight = 0.68;
  const bagTop = 0.38;
  const bagBottom = 0.72;

  // Bag handle
  const handleCx = 0.5;
  const handleCy = 0.38;
  const handleR = 0.11;
  const hDist = Math.sqrt((nx - handleCx) * (nx - handleCx) + (ny - handleCy) * (ny - handleCy));
  if (hDist >= handleR - 0.022 && hDist <= handleR + 0.005 && ny <= handleCy) {
    return [251, 191, 36, 255]; // Gold handle
  }

  // Bag body
  if (nx >= bagLeft && nx <= bagRight && ny >= bagTop && ny <= bagBottom) {
    // Subtle golden gradient
    const goldFactor = (ny - bagTop) / (bagBottom - bagTop);
    const r = Math.round(245 - goldFactor * 30);
    const g = Math.round(158 - goldFactor * 30);
    const b = Math.round(11 + goldFactor * 10);

    // Inner palm/star symbol inside bag
    const inDist = Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.55) * (ny - 0.55));
    if (inDist < 0.065) {
      return [255, 255, 255, 255]; // Pure white core
    }

    return [r, g, b, 255];
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate 192x192
console.log('Generating pwa-192x192.png...');
const png192 = createPng(192, 192, (x, y, w, h) => drawShorjaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// 2. Generate 512x512
console.log('Generating pwa-512x512.png...');
const png512 = createPng(512, 512, (x, y, w, h) => drawShorjaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// 3. Generate maskable 512x512
console.log('Generating pwa-maskable-512x512.png...');
const pngMaskable = createPng(512, 512, (x, y, w, h) => drawShorjaIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);

// 4. Generate apple-touch-icon.png (180x180)
console.log('Generating apple-touch-icon.png...');
const pngApple = createPng(180, 180, (x, y, w, h) => drawShorjaIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);

// 5. Generate favicon.ico / png
console.log('Generating favicon.ico...');
const pngFavicon = createPng(64, 64, (x, y, w, h) => drawShorjaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pngFavicon);

console.log('All icons generated successfully!');
