export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

export type ImageToolId =
  | "compress-image"
  | "resize-image"
  | "crop-image"
  | "rotate-image"
  | "flip-image"
  | "jpg-to-png"
  | "png-to-jpg"
  | "webp-to-jpg"
  | "jpg-to-webp"
  | "png-to-webp"
  | "image-format-converter"
  | "change-image-dimensions"
  | "resize-by-percentage"
  | "resize-by-pixels"
  | "make-image-square"
  | "circular-image-crop"
  | "grayscale-image"
  | "blur-image"
  | "add-text-to-image"
  | "remove-image-metadata";

export interface ImageTool {
  id: ImageToolId;
  name: string;
  description: string;
  keywords: string[];
}

export const IMAGE_TOOLS: ImageTool[] = [
  { id: "compress-image", name: "Compress Image", description: "Resize and compress an image with a measured output size.", keywords: ["size", "quality", "optimize"] },
  { id: "resize-image", name: "Resize Image", description: "Resize an image while preserving or changing its proportions.", keywords: ["dimensions", "scale"] },
  { id: "crop-image", name: "Crop Image", description: "Crop to a specific rectangle in pixels.", keywords: ["trim", "cut"] },
  { id: "rotate-image", name: "Rotate Image", description: "Rotate an image by 90, 180, or 270 degrees.", keywords: ["turn"] },
  { id: "flip-image", name: "Flip Image", description: "Flip an image horizontally or vertically.", keywords: ["mirror"] },
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert a JPEG image to PNG.", keywords: ["jpeg", "convert", "format"] },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert a PNG image to JPEG.", keywords: ["jpeg", "convert", "format"] },
  { id: "webp-to-jpg", name: "WEBP to JPG", description: "Convert a WEBP image to JPEG.", keywords: ["jpeg", "convert", "format"] },
  { id: "jpg-to-webp", name: "JPG to WEBP", description: "Convert a JPEG image to WEBP.", keywords: ["jpeg", "convert", "format"] },
  { id: "png-to-webp", name: "PNG to WEBP", description: "Convert a PNG image to WEBP.", keywords: ["convert", "format"] },
  { id: "image-format-converter", name: "Image Format Converter", description: "Choose JPEG, PNG, or WEBP as the output format.", keywords: ["convert", "format"] },
  { id: "change-image-dimensions", name: "Change Image Dimensions", description: "Set exact output dimensions in pixels.", keywords: ["resize", "width", "height"] },
  { id: "resize-by-percentage", name: "Resize by Percentage", description: "Scale an image to a percentage of its current size.", keywords: ["scale", "percent"] },
  { id: "resize-by-pixels", name: "Resize by Pixels", description: "Resize an image to a width and height in pixels.", keywords: ["dimensions", "width", "height"] },
  { id: "make-image-square", name: "Make Image Square", description: "Center-crop an image to a square.", keywords: ["crop", "1:1"] },
  { id: "circular-image-crop", name: "Circular Image Crop", description: "Create a circular PNG with transparent corners.", keywords: ["circle", "avatar", "crop"] },
  { id: "grayscale-image", name: "Convert Image to Grayscale", description: "Convert an image to monochrome grayscale.", keywords: ["black and white", "monochrome"] },
  { id: "blur-image", name: "Blur Image", description: "Apply a configurable blur effect.", keywords: ["soften", "filter"] },
  { id: "add-text-to-image", name: "Add Text to Image", description: "Add a text label over an image.", keywords: ["caption", "watermark", "label"] },
  { id: "remove-image-metadata", name: "Remove Image Metadata", description: "Re-encode an image to remove embedded metadata.", keywords: ["exif", "privacy", "strip"] },
];

export interface ImageProcessOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  percentage?: number;
  format?: ImageFormat;
  quality?: number;
  targetSizeKB?: number;
  optimizeTargetSize?: boolean;
  allowDimensionReduction?: boolean;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  rotation?: 90 | 180 | 270;
  flip?: "horizontal" | "vertical";
  backgroundColor?: string;
  text?: string;
  blurRadius?: number;
}

export interface ProcessedImage {
  blob: Blob;
  fileName: string;
  mimeType: ImageFormat;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  outputSize: number;
  reductionPercent: number;
  targetSizeReached: boolean | null;
}

const MAX_DIMENSION = 16_000;
const MAX_PIXELS = 80_000_000;
const SUPPORTED_INPUT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extensionFor(format: ImageFormat): string {
  if (format === "image/jpeg") return "jpg";
  return format === "image/webp" ? "webp" : "png";
}

function formatForTool(id: ImageToolId, fallback: ImageFormat): ImageFormat {
  const fixed: Partial<Record<ImageToolId, ImageFormat>> = {
    "jpg-to-png": "image/png",
    "png-to-jpg": "image/jpeg",
    "webp-to-jpg": "image/jpeg",
    "jpg-to-webp": "image/webp",
    "png-to-webp": "image/webp",
    "circular-image-crop": "image/png",
  };
  return fixed[id] ?? fallback;
}

function validateDimensions(width: number, height: number): void {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    throw new Error("Width and height must be positive whole numbers.");
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION || width * height > MAX_PIXELS) {
    throw new Error(`Output is too large. Keep each side at or below ${MAX_DIMENSION}px and the image under ${MAX_PIXELS.toLocaleString()} pixels.`);
  }
}

function canvasBlob(canvas: HTMLCanvasElement, mimeType: ImageFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Your browser could not encode this image. Try another output format."));
      } else if (blob.type !== mimeType) {
        reject(new Error(`${mimeType.replace("image/", "").toUpperCase()} export is not supported by this browser. Choose a different output format.`));
      } else {
        resolve(blob);
      }
    }, mimeType, quality);
  });
}

function roundDimension(value: number): number {
  return Math.max(1, Math.round(value));
}

export async function processImage(
  file: File,
  toolId: ImageToolId,
  options: ImageProcessOptions = {},
): Promise<ProcessedImage> {
  if (!SUPPORTED_INPUT_TYPES.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, or WEBP image.");
  }
  const expectedInput: Partial<Record<ImageToolId, string>> = {
    "jpg-to-png": "image/jpeg",
    "jpg-to-webp": "image/jpeg",
    "png-to-jpg": "image/png",
    "png-to-webp": "image/png",
    "webp-to-jpg": "image/webp",
  };
  if (expectedInput[toolId] && file.type !== expectedInput[toolId]) {
    throw new Error(`${IMAGE_TOOLS.find((item) => item.id === toolId)?.name} requires a ${expectedInput[toolId]?.replace("image/", "").toUpperCase()} input image.`);
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("This image is larger than the 50 MB browser-processing limit.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("The image could not be opened. It may be damaged or unsupported.");
  }

  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  let outputWidth = sourceWidth;
  let outputHeight = sourceHeight;
  const rotation = options.rotation ?? 90;

  if (toolId === "resize-by-percentage") {
    const percentage = options.percentage ?? 50;
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 1000) {
      bitmap.close();
      throw new Error("Choose a resize percentage above 0 and no greater than 1000.");
    }
    outputWidth = roundDimension(sourceWidth * percentage / 100);
    outputHeight = roundDimension(sourceHeight * percentage / 100);
  } else if (["resize-image", "change-image-dimensions", "resize-by-pixels", "compress-image"].includes(toolId)) {
    const width = options.width ?? sourceWidth;
    const height = options.height ?? sourceHeight;
    if (options.maintainAspectRatio) {
      const scale = Math.min(width / sourceWidth, height / sourceHeight);
      outputWidth = roundDimension(sourceWidth * scale);
      outputHeight = roundDimension(sourceHeight * scale);
    } else {
      outputWidth = roundDimension(width);
      outputHeight = roundDimension(height);
    }
  } else if (toolId === "make-image-square" || toolId === "circular-image-crop") {
    outputWidth = Math.min(sourceWidth, sourceHeight);
    outputHeight = outputWidth;
  } else if (toolId === "crop-image") {
    outputWidth = roundDimension(options.cropWidth ?? sourceWidth);
    outputHeight = roundDimension(options.cropHeight ?? sourceHeight);
  } else if (toolId === "rotate-image" && (rotation === 90 || rotation === 270)) {
    outputWidth = sourceHeight;
    outputHeight = sourceWidth;
  }

  try {
    validateDimensions(outputWidth, outputHeight);
  } catch (error) {
    bitmap.close();
    throw error;
  }

  let sourceX = 0;
  let sourceY = 0;
  let sourceCropWidth = sourceWidth;
  let sourceCropHeight = sourceHeight;
  if (toolId === "make-image-square") {
    sourceCropWidth = outputWidth;
    sourceCropHeight = outputHeight;
    sourceX = Math.floor((sourceWidth - sourceCropWidth) / 2);
    sourceY = Math.floor((sourceHeight - sourceCropHeight) / 2);
  }
  if (toolId === "crop-image") {
    sourceX = Math.round(options.cropX ?? 0);
    sourceY = Math.round(options.cropY ?? 0);
    sourceCropWidth = outputWidth;
    sourceCropHeight = outputHeight;
    if (sourceX < 0 || sourceY < 0 || sourceX + sourceCropWidth > sourceWidth || sourceY + sourceCropHeight > sourceHeight) {
      bitmap.close();
      throw new Error("The crop rectangle must fit inside the original image.");
    }
  }

  const format = formatForTool(toolId, options.format ?? (file.type === "image/jpeg" ? "image/jpeg" : file.type as ImageFormat));
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const context = canvas.getContext("2d", { alpha: format !== "image/jpeg" });
  if (!context) {
    bitmap.close();
    throw new Error("Your browser could not create an image canvas.");
  }

  if (format === "image/jpeg") {
    context.fillStyle = options.backgroundColor ?? "#ffffff";
    context.fillRect(0, 0, outputWidth, outputHeight);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  if (toolId === "rotate-image") {
    context.save();
    context.translate(outputWidth / 2, outputHeight / 2);
    context.rotate(rotation * Math.PI / 180);
    context.drawImage(bitmap, -sourceWidth / 2, -sourceHeight / 2);
    context.restore();
  } else if (toolId === "flip-image") {
    const flip = options.flip ?? "horizontal";
    context.save();
    context.translate(flip === "horizontal" ? outputWidth : 0, flip === "vertical" ? outputHeight : 0);
    context.scale(flip === "horizontal" ? -1 : 1, flip === "vertical" ? -1 : 1);
    context.drawImage(bitmap, 0, 0, outputWidth, outputHeight);
    context.restore();
  } else if (toolId === "circular-image-crop") {
    context.beginPath();
    context.arc(outputWidth / 2, outputHeight / 2, Math.min(outputWidth, outputHeight) / 2, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    const cropX = Math.floor((sourceWidth - outputWidth) / 2);
    const cropY = Math.floor((sourceHeight - outputHeight) / 2);
    context.drawImage(bitmap, cropX, cropY, outputWidth, outputHeight, 0, 0, outputWidth, outputHeight);
  } else {
    if (toolId === "grayscale-image") context.filter = "grayscale(1)";
    if (toolId === "blur-image") {
      const blur = options.blurRadius ?? 4;
      if (!Number.isFinite(blur) || blur < 0 || blur > 40) {
        bitmap.close();
        throw new Error("Blur radius must be between 0 and 40 pixels.");
      }
      context.filter = `blur(${blur}px)`;
    }
    context.drawImage(bitmap, sourceX, sourceY, sourceCropWidth, sourceCropHeight, 0, 0, outputWidth, outputHeight);
    context.filter = "none";
  }
  if (toolId === "circular-image-crop") {
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.arc(outputWidth / 2, outputHeight / 2, Math.min(outputWidth, outputHeight) / 2, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";
  }
  if (toolId === "add-text-to-image") {
    const text = options.text?.trim();
    if (!text) throw new Error("Enter text to add to the image.");
    const fontSize = Math.max(16, Math.round(outputWidth / 18));
    context.font = `600 ${fontSize}px system-ui, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.lineWidth = Math.max(2, Math.round(fontSize / 10));
    context.strokeStyle = "rgba(0, 0, 0, 0.72)";
    context.fillStyle = "#ffffff";
    context.strokeText(text, outputWidth / 2, outputHeight - fontSize * 0.7);
    context.fillText(text, outputWidth / 2, outputHeight - fontSize * 0.7);
  }

  const quality = Math.max(0.1, Math.min(1, (options.quality ?? 85) / 100));
  let blob = await canvasBlob(canvas, format, quality);
  if (toolId === "compress-image" && options.optimizeTargetSize && options.targetSizeKB) {
    const targetBytes = options.targetSizeKB * 1024;
    if (format !== "image/png") {
      let low = 0.1;
      let high = quality;
      let smallest = blob;
      for (let attempt = 0; attempt < 7 && Math.abs(high - low) > 0.015; attempt += 1) {
        const mid = (low + high) / 2;
        const candidate = await canvasBlob(canvas, format, mid);
        if (candidate.size <= targetBytes) {
          smallest = candidate;
          low = mid;
        } else {
          high = mid;
        }
      }
      blob = smallest;
    }
    if (options.allowDimensionReduction && blob.size > targetBytes) {
      let reducedWidth = outputWidth;
      let reducedHeight = outputHeight;
      for (let attempt = 0; attempt < 5 && blob.size > targetBytes; attempt += 1) {
        reducedWidth = Math.max(1, Math.round(reducedWidth * 0.85));
        reducedHeight = Math.max(1, Math.round(reducedHeight * 0.85));
        canvas.width = reducedWidth;
        canvas.height = reducedHeight;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        if (format === "image/jpeg") {
          context.fillStyle = options.backgroundColor ?? "#ffffff";
          context.fillRect(0, 0, reducedWidth, reducedHeight);
        }
        context.drawImage(bitmap, 0, 0, reducedWidth, reducedHeight);
        blob = await canvasBlob(canvas, format, 0.1);
        outputWidth = reducedWidth;
        outputHeight = reducedHeight;
      }
    }
  }
  bitmap.close();

  const normalizedName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "_") || "image";
  const suffix = toolId === "compress-image" ? "compressed" : toolId.replaceAll("-", "_");
  return {
    blob,
    fileName: `${normalizedName}_${suffix}.${extensionFor(format)}`,
    mimeType: format,
    width: outputWidth,
    height: outputHeight,
    originalWidth: sourceWidth,
    originalHeight: sourceHeight,
    originalSize: file.size,
    outputSize: blob.size,
    reductionPercent: ((file.size - blob.size) / file.size) * 100,
    targetSizeReached: options.targetSizeKB ? blob.size <= options.targetSizeKB * 1024 : null,
  };
}

