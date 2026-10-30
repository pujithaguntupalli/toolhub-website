import type { PDFDocument } from "pdf-lib";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export type PdfToolId =
  | "merge-pdf"
  | "split-pdf"
  | "compress-pdf"
  | "rotate-pdf"
  | "delete-pdf-pages"
  | "extract-pdf-pages"
  | "reorder-pdf-pages"
  | "add-page-numbers"
  | "add-watermark"
  | "protect-pdf"
  | "unlock-pdf"
  | "images-to-pdf"
  | "jpg-to-pdf"
  | "png-to-pdf"
  | "pdf-to-jpg"
  | "pdf-to-png"
  | "extract-pdf-text"
  | "add-text-to-pdf"
  | "crop-pdf-pages"
  | "organize-pdf-pages";

export interface PdfTool {
  id: PdfToolId;
  name: string;
  description: string;
  supported: boolean;
  keywords: string[];
}

export const PDF_TOOLS: PdfTool[] = [
  { id: "merge-pdf", name: "Merge PDF", description: "Combine PDF files in the order selected.", supported: true, keywords: ["combine", "join"] },
  { id: "split-pdf", name: "Split PDF", description: "Create a separate PDF for each selected page.", supported: true, keywords: ["separate", "divide"] },
  { id: "compress-pdf", name: "Compress PDF", description: "Rewrite a PDF using compact object streams.", supported: true, keywords: ["reduce", "size"] },
  { id: "rotate-pdf", name: "Rotate PDF", description: "Rotate selected pages by 90, 180, or 270 degrees.", supported: true, keywords: ["turn"] },
  { id: "delete-pdf-pages", name: "Delete PDF Pages", description: "Remove selected pages from a PDF.", supported: true, keywords: ["remove"] },
  { id: "extract-pdf-pages", name: "Extract PDF Pages", description: "Save selected pages as a new PDF.", supported: true, keywords: ["copy"] },
  { id: "reorder-pdf-pages", name: "Reorder PDF Pages", description: "Set a new page order using page numbers.", supported: true, keywords: ["organize", "sort"] },
  { id: "add-page-numbers", name: "Add Page Numbers", description: "Place page numbers on every page.", supported: true, keywords: ["numbering"] },
  { id: "add-watermark", name: "Add Watermark", description: "Place a text watermark on every page.", supported: true, keywords: ["stamp", "text"] },
  { id: "protect-pdf", name: "Protect PDF with Password", description: "PDF encryption is not available in this browser-only build.", supported: false, keywords: ["encrypt", "password"] },
  { id: "unlock-pdf", name: "Unlock PDF", description: "Password removal is not available in this browser-only build.", supported: false, keywords: ["decrypt", "password"] },
  { id: "images-to-pdf", name: "Images to PDF", description: "Combine JPEG or PNG images into a PDF.", supported: true, keywords: ["photo"] },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert JPEG images into PDF pages.", supported: true, keywords: ["jpeg", "photo"] },
  { id: "png-to-pdf", name: "PNG to PDF", description: "Convert PNG images into PDF pages.", supported: true, keywords: ["photo"] },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Render each PDF page as a JPEG image.", supported: true, keywords: ["convert", "image"] },
  { id: "pdf-to-png", name: "PDF to PNG", description: "Render each PDF page as a PNG image.", supported: true, keywords: ["convert", "image"] },
  { id: "extract-pdf-text", name: "Extract PDF Text", description: "Extract selectable text into a text file.", supported: true, keywords: ["copy", "plain text"] },
  { id: "add-text-to-pdf", name: "Add Text to PDF", description: "Add a line of text to each page.", supported: true, keywords: ["write", "annotate"] },
  { id: "crop-pdf-pages", name: "Crop PDF Pages", description: "Set a crop box on every page.", supported: true, keywords: ["trim"] },
  { id: "organize-pdf-pages", name: "Organize PDF Pages", description: "Arrange pages by entering a new page order.", supported: true, keywords: ["reorder", "sort"] },
];

export interface PdfProcessOptions {
  pages?: string;
  rotation?: 90 | 180 | 270;
  text?: string;
  watermark?: string;
  fontSize?: number;
  opacity?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  renderScale?: number;
}

export interface PdfDownload {
  blob: Blob;
  fileName: string;
  mimeType: string;
}

export interface PdfProcessResult {
  downloads: PdfDownload[];
  pageCount?: number;
  notice?: string;
}

const MAX_PDF_BYTES = 100 * 1024 * 1024;
const MAX_PAGE_COUNT = 500;

async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  return pdfjs;
}

function baseName(file: File): string {
  return file.name.replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "_") || "document";
}

function validatePdf(file: File): void {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error(`"${file.name}" is not a PDF file.`);
  }
  if (file.size > MAX_PDF_BYTES) throw new Error("PDF files must be 100 MB or smaller for browser processing.");
}

function parsePageSelection(value: string | undefined, pageCount: number): number[] {
  const input = value?.trim();
  if (!input) return Array.from({ length: pageCount }, (_, index) => index);
  const pages: number[] = [];
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(trimmed);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < start || end > pageCount) throw new Error(`Page range "${trimmed}" is invalid. This file has ${pageCount} pages.`);
      for (let page = start; page <= end; page += 1) pages.push(page - 1);
      continue;
    }
    if (!/^\d+$/.test(trimmed)) throw new Error(`Enter page numbers like 1, 3-5. "${trimmed}" is not a valid page number.`);
    const page = Number(trimmed);
    if (page < 1 || page > pageCount) throw new Error(`Page ${page} does not exist. This file has ${pageCount} pages.`);
    pages.push(page - 1);
  }
  if (pages.length === 0) throw new Error("Select at least one page.");
  return pages;
}

async function loadPdf(file: File): Promise<PDFDocument> {
  validatePdf(file);
  try {
    const { PDFDocument } = await import("pdf-lib");
    const document = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
    if (document.getPageCount() > MAX_PAGE_COUNT) throw new Error(`Files are limited to ${MAX_PAGE_COUNT} pages in this browser tool.`);
    return document;
  } catch (error) {
    if (error instanceof Error && error.message.includes("limited to")) throw error;
    throw new Error("This PDF could not be opened. It may be damaged, encrypted, or use unsupported features.");
  }
}

async function asPdfDownload(document: PDFDocument, fileName: string): Promise<PdfDownload> {
  const bytes = await document.save({ useObjectStreams: true });
  return { blob: new Blob([new Uint8Array(bytes).buffer as ArrayBuffer], { type: "application/pdf" }), fileName, mimeType: "application/pdf" };
}

export async function getPdfPageCount(file: File): Promise<number> {
  return (await loadPdf(file)).getPageCount();
}

export async function getPdfPageSize(file: File): Promise<{ width: number; height: number }> {
  const document = await loadPdf(file);
  const firstPage = document.getPage(0);
  return { width: firstPage.getWidth(), height: firstPage.getHeight() };
}

export async function renderPdfPage(file: File, pageNumber: number, scale = 0.9, format: "image/png" | "image/jpeg" = "image/png"): Promise<Blob> {
  validatePdf(file);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) throw new Error("Page number must be a positive whole number.");
  const pdfjs = await getPdfJs();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  try {
    const pdf = await task.promise;
    if (pageNumber > pdf.numPages || pdf.numPages > MAX_PAGE_COUNT) throw new Error(`Page ${pageNumber} is not available.`);
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: Math.max(0.25, Math.min(2, scale)) });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not render a PDF preview.");
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, 0.9));
    if (!blob) throw new Error("Your browser could not export the rendered PDF page.");
    return blob;
  } finally {
    await task.destroy();
  }
}

async function renderPdfImages(file: File, format: "image/jpeg" | "image/png", scale: number): Promise<PdfDownload[]> {
  validatePdf(file);
  const pdfjs = await getPdfJs();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const downloads: PdfDownload[] = [];
  try {
    const pdf = await task.promise;
    if (pdf.numPages > MAX_PAGE_COUNT) throw new Error(`Files are limited to ${MAX_PAGE_COUNT} pages in this browser tool.`);
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: Math.max(0.5, Math.min(3, scale)) });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not render a PDF page.");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, 0.9));
      if (!blob) throw new Error(`Page ${pageNumber} could not be converted.`);
      const extension = format === "image/jpeg" ? "jpg" : "png";
      downloads.push({ blob, fileName: `${baseName(file)}_page_${pageNumber}.${extension}`, mimeType: format });
      page.cleanup();
    }
    return downloads;
  } finally {
    await task.destroy();
  }
}

async function createPdfFromImages(files: File[], id: PdfToolId): Promise<PdfProcessResult> {
  if (files.length === 0) throw new Error("Choose at least one image.");
  const accepted = files.filter((file) => file.type === "image/jpeg" || file.type === "image/png");
  if (accepted.length !== files.length) throw new Error("Only JPEG and PNG images can be added to a PDF.");
  if (id === "jpg-to-pdf" && accepted.some((file) => file.type !== "image/jpeg")) throw new Error("Choose only JPG or JPEG images for this tool.");
  if (id === "png-to-pdf" && accepted.some((file) => file.type !== "image/png")) throw new Error("Choose only PNG images for this tool.");
  const { PDFDocument } = await import("pdf-lib");
  const output = await PDFDocument.create();
  for (const file of accepted) {
    const bytes = await file.arrayBuffer();
    const image = file.type === "image/jpeg" ? await output.embedJpg(bytes) : await output.embedPng(bytes);
    const page = output.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return { downloads: [await asPdfDownload(output, "images.pdf")], pageCount: accepted.length };
}

export async function processPdf(files: File[], id: PdfToolId, options: PdfProcessOptions = {}): Promise<PdfProcessResult> {
  if (id === "protect-pdf" || id === "unlock-pdf") {
    throw new Error(id === "protect-pdf"
      ? "Password encryption is not available in this browser-only version. No protected file was created."
      : "Password removal is not available in this browser-only version. No unlocked file was created.");
  }
  if (["images-to-pdf", "jpg-to-pdf", "png-to-pdf"].includes(id)) return createPdfFromImages(files, id);
  if (files.length === 0) throw new Error("Choose a PDF file.");
  if (id === "merge-pdf" && files.length < 2) throw new Error("Choose at least two PDF files to merge.");
  if (id !== "merge-pdf" && files.length > 1) throw new Error("Choose one PDF file for this operation.");

  if (id === "merge-pdf") {
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();
    for (const file of files) {
      const source = await loadPdf(file);
      const pages = await merged.copyPages(source, source.getPageIndices());
      pages.forEach((page) => merged.addPage(page));
      if (merged.getPageCount() > MAX_PAGE_COUNT) throw new Error(`Combined files are limited to ${MAX_PAGE_COUNT} pages.`);
    }
    return { downloads: [await asPdfDownload(merged, "merged.pdf")], pageCount: merged.getPageCount() };
  }

  const file = files[0];
  if (id === "pdf-to-jpg" || id === "pdf-to-png") {
    const format = id === "pdf-to-jpg" ? "image/jpeg" : "image/png";
    const downloads = await renderPdfImages(file, format, options.renderScale ?? 1.4);
    return { downloads, pageCount: downloads.length, notice: "Each page is downloaded as an individual image." };
  }
  if (id === "extract-pdf-text") {
    validatePdf(file);
    const pdfjs = await getPdfJs();
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    try {
      const pdf = await task.promise;
      if (pdf.numPages > MAX_PAGE_COUNT) throw new Error(`Files are limited to ${MAX_PAGE_COUNT} pages in this browser tool.`);
      const output: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const lines = content.items.filter((item) => "str" in item).map((item) => ("str" in item ? item.str : ""));
        output.push(`--- Page ${pageNumber} ---\n${lines.join(" ")}`);
      }
      const blob = new Blob([output.join("\n\n")], { type: "text/plain;charset=utf-8" });
      return { downloads: [{ blob, fileName: `${baseName(file)}_text.txt`, mimeType: "text/plain" }], pageCount: pdf.numPages };
    } finally {
      await task.destroy();
    }
  }

  const source = await loadPdf(file);
  const pageCount = source.getPageCount();
  const selectedPages = parsePageSelection(options.pages, pageCount);
  const filename = baseName(file);
  const { PDFDocument, StandardFonts, degrees, rgb } = await import("pdf-lib");

  if (id === "split-pdf") {
    const downloads = [];
    for (const pageIndex of selectedPages) {
      const output = await PDFDocument.create();
      const [page] = await output.copyPages(source, [pageIndex]);
      output.addPage(page);
      downloads.push(await asPdfDownload(output, `${filename}_page_${pageIndex + 1}.pdf`));
    }
    return { downloads, pageCount: downloads.length, notice: "Each selected page is a separate PDF download." };
  }
  if (id === "extract-pdf-pages" || id === "reorder-pdf-pages" || id === "organize-pdf-pages") {
    const output = await PDFDocument.create();
    const pages = await output.copyPages(source, selectedPages);
    pages.forEach((page) => output.addPage(page));
    return { downloads: [await asPdfDownload(output, `${filename}_pages.pdf`)], pageCount: pages.length };
  }
  if (id === "delete-pdf-pages") {
    const remove = new Set(selectedPages);
    const keep = source.getPageIndices().filter((index) => !remove.has(index));
    if (keep.length === 0) throw new Error("At least one page must remain in the PDF.");
    const output = await PDFDocument.create();
    (await output.copyPages(source, keep)).forEach((page) => output.addPage(page));
    return { downloads: [await asPdfDownload(output, `${filename}_pages_removed.pdf`)], pageCount: keep.length };
  }
  if (id === "rotate-pdf") {
    const rotation = options.rotation ?? 90;
    selectedPages.forEach((index) => {
      const page = source.getPage(index);
      page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
    });
    return { downloads: [await asPdfDownload(source, `${filename}_rotated.pdf`)], pageCount };
  }
  if (id === "add-page-numbers") {
    const font = await source.embedFont(StandardFonts.Helvetica);
    const size = Math.min(12, Math.max(8, options.fontSize ?? 10));
    source.getPages().forEach((page, index) => {
      const { width } = page.getSize();
      page.drawText(String(index + 1), { x: width / 2 - 5, y: 18, size, font, color: rgb(0.16, 0.2, 0.25) });
    });
    return { downloads: [await asPdfDownload(source, `${filename}_numbered.pdf`)], pageCount };
  }
  if (id === "add-watermark" || id === "add-text-to-pdf") {
    const text = (id === "add-watermark" ? options.watermark : options.text)?.trim();
    if (!text) throw new Error(id === "add-watermark" ? "Enter watermark text." : "Enter the text to add.");
    const font = await source.embedFont(StandardFonts.Helvetica);
    const size = Math.max(8, Math.min(96, options.fontSize ?? 24));
    for (const page of source.getPages()) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: Math.max(12, (width - textWidth) / 2),
        y: id === "add-watermark" ? height / 2 : 36,
        size,
        font,
        color: rgb(0.18, 0.2, 0.24),
        opacity: Math.max(0.1, Math.min(1, options.opacity ?? (id === "add-watermark" ? 0.2 : 1))),
        rotate: degrees(id === "add-watermark" ? -35 : 0),
      });
    }
    return { downloads: [await asPdfDownload(source, `${filename}_${id === "add-watermark" ? "watermarked" : "text_added"}.pdf`)], pageCount };
  }
  if (id === "crop-pdf-pages") {
    const x = options.cropX ?? 0;
    const yFromTop = options.cropY ?? 0;
    const width = options.cropWidth;
    const height = options.cropHeight;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width! <= 0 || height! <= 0) {
      throw new Error("Enter a positive crop width and height.");
    }
    source.getPages().forEach((page) => {
      const pageHeight = page.getHeight();
      if (x < 0 || yFromTop < 0 || x + width! > page.getWidth() || yFromTop + height! > pageHeight) {
        throw new Error("The crop box must fit within every PDF page.");
      }
      page.setCropBox(x, pageHeight - yFromTop - height!, width!, height!);
    });
    return { downloads: [await asPdfDownload(source, `${filename}_cropped.pdf`)], pageCount };
  }
  if (id === "compress-pdf") {
    const beforeSize = file.size;
    const output = await asPdfDownload(source, `${filename}_compressed.pdf`);
    return {
      downloads: [output],
      pageCount,
      notice: output.blob.size < beforeSize
        ? `Output is ${(100 * (beforeSize - output.blob.size) / beforeSize).toFixed(1)}% smaller. PDF size reduction depends on the source content.`
        : "The PDF was rewritten, but this file did not get smaller. Text and vector content may already be optimized; embedded images are not recompressed.",
    };
  }
  throw new Error("This PDF operation is not supported.");
}
