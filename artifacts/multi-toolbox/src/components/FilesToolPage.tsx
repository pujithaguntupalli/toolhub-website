import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import { AlertTriangle, ArrowDown, Check, Download, FileText, Image as ImageIcon, LoaderCircle, RotateCw, Upload } from "lucide-react";
import { Link } from "wouter";
import type { Tool } from "../tools";
import { IMAGE_TOOLS, processImage, type ImageFormat, type ImageToolId, type ProcessedImage } from "../lib/image-tools";
import { PDF_TOOLS, getPdfPageCount, getPdfPageSize, processPdf, renderPdfPage, type PdfDownload, type PdfProcessResult, type PdfToolId } from "../lib/pdf-tools";

const imageIds = new Set(IMAGE_TOOLS.map((item) => item.id));
const pdfIds = new Set(PDF_TOOLS.map((item) => item.id));
const IMAGE_FORMATS: Array<{ value: ImageFormat; label: string }> = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WEBP" },
];

function prettyBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ErrorNotice({ message }: { message: string }) {
  return <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert" data-testid="status-file-error"><AlertTriangle size={17} className="mt-0.5 shrink-0"/><p>{message}</p></div>;
}

function UploadZone({ accept, multiple, busy, onFiles, files, images = false }: {
  accept: string;
  multiple: boolean;
  busy: boolean;
  onFiles: (files: File[]) => void;
  files: File[];
  images?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const receive = (list: FileList | null) => {
    if (!list) return;
    onFiles(Array.from(list));
  };
  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!busy) receive(event.dataTransfer.files);
  };
  return <label
    className={`flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-7 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/45 hover:bg-secondary/40"} ${busy ? "pointer-events-none opacity-60" : ""}`}
    onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
    onDragLeave={() => setDragging(false)}
    onDrop={onDrop}
    data-testid="dropzone-file"
  >
    <input type="file" accept={accept} multiple={multiple} className="sr-only" disabled={busy} onChange={(event: ChangeEvent<HTMLInputElement>) => { receive(event.target.files); event.target.value = ""; }} data-testid="input-upload-file"/>
    <span className="mb-3 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">{images ? <ImageIcon size={20}/> : <Upload size={20}/>}</span>
    <span className="font-display text-base font-semibold tracking-[-.025em]">{files.length ? "Choose different files" : "Drop files here or browse"}</span>
    <span className="mt-1.5 text-xs text-muted-foreground">{multiple ? "Select multiple files; they will be processed in the order shown." : "Files are processed locally in this browser."}</span>
    {files.length > 0 && <span className="mt-3 max-w-full truncate rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">{files.length === 1 ? files[0].name : `${files.length} files selected`}</span>}
  </label>;
}

function ImageFileTool({ tool }: { tool: Tool }) {
  const id = tool.fileToolId as ImageToolId;
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [format, setFormat] = useState<ImageFormat>("image/jpeg");
  const [quality, setQuality] = useState(85);
  const [percentage, setPercentage] = useState(50);
  const [targetSizeKB, setTargetSizeKB] = useState("");
  const [optimizeTarget, setOptimizeTarget] = useState(true);
  const [allowDimensionReduction, setAllowDimensionReduction] = useState(false);
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropWidth, setCropWidth] = useState("");
  const [cropHeight, setCropHeight] = useState("");
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [flip, setFlip] = useState<"horizontal" | "vertical">("horizontal");
  const [blurRadius, setBlurRadius] = useState(4);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");

  useEffect(() => {
    if (!result) {
      setResultUrl("");
      return;
    }
    const url = URL.createObjectURL(result.blob);
    setResultUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [result]);
  useEffect(() => {
    if (!file) {
      setOriginalUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const setImage = async (selected: File[]) => {
    const next = selected[0];
    setResult(null);
    setError("");
    setDimensions(null);
    if (!next) {
      setFile(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setFile(next);
      setError("Choose a JPEG, PNG, or WEBP image.");
      return;
    }
    if (next.size > 50 * 1024 * 1024) {
      setFile(next);
      setError("This image is larger than the 50 MB browser-processing limit.");
      return;
    }
    setFile(next);
    setFormat(next.type === "image/jpeg" ? "image/jpeg" : next.type === "image/webp" ? "image/webp" : "image/png");
    try {
      const bitmap = await createImageBitmap(next);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      setDimensions(size);
      setWidth(String(size.width));
      setHeight(String(size.height));
      setCropWidth(String(size.width));
      setCropHeight(String(size.height));
    } catch {
      setError("The image could not be opened. It may be damaged or unsupported.");
    }
  };

  const withDimensions = ["compress-image", "resize-image", "change-image-dimensions", "resize-by-pixels"].includes(id);
  const hasFormat = ["compress-image", "image-format-converter", "remove-image-metadata"].includes(id);
  const hasCrop = id === "crop-image";
  const hasImage = !!file && !!dimensions;
  const aspect = dimensions ? dimensions.width / dimensions.height : 1;
  const sourceHasPotentialTransparency = file?.type === "image/png";

  const updateWidth = (value: string) => {
    setWidth(value);
    const number = Number(value);
    if (maintainRatio && value && number > 0) setHeight(String(Math.max(1, Math.round(number / aspect))));
  };
  const updateHeight = (value: string) => {
    setHeight(value);
    const number = Number(value);
    if (maintainRatio && value && number > 0) setWidth(String(Math.max(1, Math.round(number * aspect))));
  };
  const setPercent = (value: number) => {
    setPercentage(value);
    if (dimensions) {
      setWidth(String(Math.max(1, Math.round(dimensions.width * value / 100))));
      setHeight(String(Math.max(1, Math.round(dimensions.height * value / 100))));
    }
  };

  const run = async (resizeOnly = false) => {
    if (!file || !dimensions) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      if (withDimensions && (!Number.isInteger(Number(width)) || !Number.isInteger(Number(height)) || Number(width) < 1 || Number(height) < 1)) {
        throw new Error("Width and height must be positive whole numbers.");
      }
      const sizeKb = targetSizeKB.trim() ? Number(targetSizeKB) : undefined;
      if (id === "compress-image" && sizeKb !== undefined && (!Number.isFinite(sizeKb) || sizeKb <= 0)) {
        throw new Error("Enter a target file size greater than zero KB.");
      }
      const output = await processImage(file, id, {
        width: Number(width),
        height: Number(height),
        maintainAspectRatio: maintainRatio,
        percentage,
        format,
        quality: resizeOnly ? 100 : quality,
        targetSizeKB: resizeOnly ? undefined : sizeKb,
        optimizeTargetSize: !resizeOnly && optimizeTarget,
        allowDimensionReduction: !resizeOnly && allowDimensionReduction,
        cropX: Number(cropX),
        cropY: Number(cropY),
        cropWidth: Number(cropWidth),
        cropHeight: Number(cropHeight),
        rotation,
        flip,
        blurRadius,
        text,
      });
      setResult(output);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The image could not be processed.");
    } finally {
      setBusy(false);
    }
  };

  const processLabel = id === "compress-image" ? "Compress and resize" : "Process image";
  return <section className="surface p-5 sm:p-7" aria-label={`${tool.label} controls`}>
    <div className="mb-5 flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><ImageIcon size={17}/></span>
      <div><h2 className="font-display text-lg font-semibold tracking-[-.03em]">Image tool</h2><p className="text-[11px] text-muted-foreground">Your image stays on this device.</p></div>
    </div>
    <UploadZone accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple={false} busy={busy} onFiles={(selected) => void setImage(selected)} files={file ? [file] : []} images/>
    {file && dimensions && <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-secondary/70 p-3"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">Original dimensions</p><p className="mt-1 font-semibold" data-testid="text-original-dimensions">{dimensions.width} × {dimensions.height} px</p></div>
      <div className="rounded-xl bg-secondary/70 p-3"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">Original size</p><p className="mt-1 font-semibold" data-testid="text-original-size">{prettyBytes(file.size)}</p></div>
    </div>}

    {hasImage && withDimensions && <div className="mt-6 rounded-2xl border border-border p-4">
      <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-sm">Resize dimensions</h3><button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={() => {setWidth(String(dimensions.width));setHeight(String(dimensions.height));setPercentage(100)}} data-testid="button-reset-dimensions">Reset dimensions</button></div>
      {id === "compress-image" && <div className="mb-4 flex flex-wrap gap-2">{[25, 50, 75, 100].map((preset)=><button key={preset} type="button" onClick={()=>setPercent(preset)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${percentage===preset?'border-primary bg-primary/10 text-primary':'border-border hover:bg-secondary'}`} data-testid={`button-resize-${preset}`}>{preset}%</button>)}</div>}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <label className="text-xs font-semibold">Width (px)<input type="number" min="1" max="16000" value={width} onChange={(event)=>updateWidth(event.target.value)} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="input-image-width"/></label>
        <span className="hidden pb-3 text-muted-foreground sm:block">×</span>
        <label className="text-xs font-semibold">Height (px)<input type="number" min="1" max="16000" value={height} onChange={(event)=>updateHeight(event.target.value)} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="input-image-height"/></label>
      </div>
      <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={maintainRatio} onChange={(event)=>setMaintainRatio(event.target.checked)} data-testid="checkbox-maintain-ratio" className="accent-[hsl(var(--primary))]"/> Maintain aspect ratio</label>
      {maintainRatio && <p className="mt-2 text-[11px] leading-5 text-muted-foreground">The result keeps the original proportions. When both dimensions are set, the output fits within those limits.</p>}
    </div>}

    {id === "resize-by-percentage" && <div className="mt-6 rounded-2xl border border-border p-4"><h3 className="font-semibold text-sm">Resize amount</h3><div className="mt-3 grid grid-cols-4 gap-2">{[25,50,75,100].map((preset)=><button key={preset} type="button" onClick={()=>setPercent(preset)} className={`rounded-lg border px-2 py-2 text-xs font-semibold ${percentage===preset?'border-primary bg-primary/10 text-primary':'border-border hover:bg-secondary'}`} data-testid={`button-percentage-${preset}`}>{preset}%</button>)}</div><label className="mt-4 block text-xs font-semibold">Custom percentage<input type="number" min="1" max="1000" value={percentage} onChange={(event)=>setPercentage(Number(event.target.value))} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="input-image-percentage"/></label></div>}

    {hasCrop && dimensions && <div className="mt-6 rounded-2xl border border-border p-4"><h3 className="font-semibold text-sm">Crop rectangle in pixels</h3><p className="mt-1 text-[11px] leading-5 text-muted-foreground">Coordinates start at the top-left of the original image.</p><div className="mt-3 grid grid-cols-2 gap-3">{([["X",cropX,setCropX],["Y",cropY,setCropY],["Width",cropWidth,setCropWidth],["Height",cropHeight,setCropHeight]] as const).map(([label,value,setter])=><label key={label} className="text-xs font-semibold">{label}<input type="number" min="0" value={value} onChange={(event)=>setter(event.target.value)} className="control mt-2 h-10 w-full px-3 text-sm font-normal" data-testid={`input-crop-${label.toLowerCase()}`}/></label>)}</div></div>}

    {id === "rotate-image" && <label className="mt-6 block text-xs font-semibold">Rotation<select value={rotation} onChange={(event)=>setRotation(Number(event.target.value) as 90|180|270)} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="select-image-rotation"><option value={90}>90° clockwise</option><option value={180}>180°</option><option value={270}>270° clockwise</option></select></label>}
    {id === "flip-image" && <label className="mt-6 block text-xs font-semibold">Flip direction<select value={flip} onChange={(event)=>setFlip(event.target.value as "horizontal"|"vertical")} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="select-image-flip"><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></label>}
    {id === "blur-image" && <label className="mt-6 block text-xs font-semibold">Blur radius: {blurRadius}px<input type="range" min="0" max="40" value={blurRadius} onChange={(event)=>setBlurRadius(Number(event.target.value))} className="mt-3 w-full accent-[hsl(var(--primary))]" data-testid="input-blur-radius"/></label>}
    {id === "add-text-to-image" && <label className="mt-6 block text-xs font-semibold">Text to add<input type="text" maxLength={120} value={text} onChange={(event)=>setText(event.target.value)} placeholder="Enter a caption" className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="input-image-text"/></label>}

    {id === "compress-image" && <div className="mt-6 rounded-2xl border border-border p-4">
      <h3 className="font-semibold text-sm">Compression settings</h3>
      <label className="mt-4 block text-xs font-semibold">Quality: {quality}%<input type="range" min="10" max="100" value={quality} onChange={(event)=>setQuality(Number(event.target.value))} className="mt-3 w-full accent-[hsl(var(--primary))]" data-testid="input-image-quality"/></label>
      <div className="mt-4 flex flex-wrap gap-2">{[50,100,200,500,1024].map((preset)=><button type="button" key={preset} onClick={()=>setTargetSizeKB(String(preset))} className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium hover:bg-secondary" data-testid={`button-target-${preset}`}>{preset===1024?"1 MB":`${preset} KB`}</button>)}</div>
      <label className="mt-4 block text-xs font-semibold">Target file size (KB)<input type="number" min="1" value={targetSizeKB} onChange={(event)=>setTargetSizeKB(event.target.value)} placeholder="Optional" className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="input-target-size"/></label>
      <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={optimizeTarget} onChange={(event)=>setOptimizeTarget(event.target.checked)} data-testid="checkbox-optimize-size" className="accent-[hsl(var(--primary))]"/> Try quality adjustments to reach the target size</label>
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={allowDimensionReduction} onChange={(event)=>setAllowDimensionReduction(event.target.checked)} data-testid="checkbox-allow-smaller-dimensions" className="accent-[hsl(var(--primary))]"/> Allow smaller dimensions only if needed</label>
      {targetSizeKB && <p className="mt-2 text-[11px] leading-5 text-muted-foreground">Exact file sizes are not always achievable. The actual output size will be shown.</p>}
    </div>}

    {hasFormat && <div className="mt-6">
      <label className="block text-xs font-semibold">Output format<select value={format} onChange={(event)=>setFormat(event.target.value as ImageFormat)} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="select-image-format">{IMAGE_FORMATS.map((item)=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      {sourceHasPotentialTransparency && format === "image/jpeg" && <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-amber-700"><AlertTriangle size={14} className="mt-0.5 shrink-0"/> JPEG cannot preserve transparency; transparent areas will be filled with white.</p>}
      {id === "compress-image" && format !== "image/png" && <p className="mt-2 text-[11px] text-muted-foreground">JPEG and WEBP support adjustable lossy quality. PNG uses lossless encoding.</p>}
    </div>}

    {error && <ErrorNotice message={error}/>}
    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
      {id === "compress-image" && <button type="button" disabled={!hasImage || busy} onClick={()=>void run(true)} className="action-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-resize-only">{busy?<LoaderCircle size={16} className="animate-spin"/>:<RotateCw size={16}/>} Resize only</button>}
      <button type="button" disabled={!hasImage || busy} onClick={()=>void run()} className="action-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-process-image">{busy?<LoaderCircle size={16} className="animate-spin"/>:<ArrowDown size={16}/>} {busy?"Processing…":processLabel}</button>
    </div>
    {result && resultUrl && <div className="mt-7 border-t border-border pt-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary"><Check size={16}/> Image processed</div>
      {id === "compress-image" && <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-secondary/70 p-3"><p className="font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">Original</p><p className="mt-1 text-xs font-semibold">{dimensions?.width} × {dimensions?.height} · {prettyBytes(file?.size ?? 0)}</p></div>
        <div className="rounded-xl bg-primary/5 p-3"><p className="font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">Output</p><p className="mt-1 text-xs font-semibold" data-testid="text-output-info">{result.width} × {result.height} · {prettyBytes(result.outputSize)}</p></div>
      </div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-xl border border-border bg-secondary/40">
          <div className="flex h-52 items-center justify-center p-3"><img src={originalUrl} alt={`Original image, ${dimensions?.width} by ${dimensions?.height} pixels`} width={dimensions?.width} height={dimensions?.height} loading="lazy" className="max-h-full max-w-full object-contain" data-testid="img-original-preview"/></div>
          <figcaption className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">Original · {prettyBytes(file?.size ?? 0)}</figcaption>
        </figure>
        <figure className="overflow-hidden rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex h-52 items-center justify-center p-3"><img src={resultUrl} alt={`Processed image, ${result.width} by ${result.height} pixels`} width={result.width} height={result.height} loading="lazy" className="max-h-full max-w-full object-contain" data-testid="img-result-preview"/></div>
          <figcaption className="border-t border-primary/15 px-3 py-2 text-[11px] text-muted-foreground">Result · {result.width} × {result.height} px</figcaption>
        </figure>
      </div>
      {id === "compress-image" && <p className="mt-3 text-xs leading-5 text-muted-foreground" data-testid="text-size-reduction">
        {result.reductionPercent >= 0 ? `${result.reductionPercent.toFixed(1)}% smaller` : `${Math.abs(result.reductionPercent).toFixed(1)}% larger`} · {result.targetSizeReached === null ? "No target size set." : result.targetSizeReached ? "Target size reached." : `Target was not reached; actual output is ${prettyBytes(result.outputSize)}.`}
      </p>}
      {id === "compress-image" && result.targetSizeReached === false && targetSizeKB && <p className="mt-2 text-[11px] leading-5 text-muted-foreground">The requested target may not be possible at these dimensions and format. Dimensions were changed only if you enabled that option.</p>}
      <a href={resultUrl} download={result.fileName} className="action-button mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90" data-testid="link-download-image"><Download size={16}/> Download {result.fileName}</a>
    </div>}
  </section>;
}

function PdfFileTool({ tool }: { tool: Tool }) {
  const id = tool.fileToolId as PdfToolId;
  const definition = PDF_TOOLS.find((item)=>item.id===id);
  const unsupported = definition?.supported === false;
  const imageToPdf = ["images-to-pdf", "jpg-to-pdf", "png-to-pdf"].includes(id);
  const multiple = imageToPdf || id === "merge-pdf";
  const accept = imageToPdf ? "image/jpeg,image/png,.jpg,.jpeg,.png" : "application/pdf,.pdf";
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [pages, setPages] = useState("");
  const [rotation, setRotation] = useState<90|180|270>(90);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [opacity, setOpacity] = useState(20);
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropWidth, setCropWidth] = useState("");
  const [cropHeight, setCropHeight] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [downloads, setDownloads] = useState<PdfDownload[]>([]);
  const [pagePreviewUrl, setPagePreviewUrl] = useState("");
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);

  useEffect(() => {
    if (downloads.length === 0) {
      setDownloadUrls([]);
      setPreviewUrl("");
      return;
    }
    const urls = downloads.map((item)=>URL.createObjectURL(item.blob));
    setDownloadUrls(urls);
    setPreviewUrl(urls[0]);
    return () => urls.forEach((url)=>URL.revokeObjectURL(url));
  }, [downloads]);

  useEffect(() => {
    let cancelled = false;
    let localUrl = "";
    setPageCount(null);
    setPagePreviewUrl("");
    if (!files[0] || imageToPdf || unsupported) return;
    const selected = files[0];
    void Promise.all([getPdfPageCount(selected), renderPdfPage(selected, 1, 0.55), getPdfPageSize(selected)]).then(([count, preview, size])=>{
      if (cancelled) return;
      setPageCount(count);
      localUrl = URL.createObjectURL(preview);
      setPagePreviewUrl(localUrl);
      setCropWidth(String(Math.round(size.width)));
      setCropHeight(String(Math.round(size.height)));
    }).catch((caught)=>{
      if (!cancelled) setError(caught instanceof Error ? caught.message : "The PDF preview could not be loaded.");
    });
    return ()=>{cancelled=true;if(localUrl)URL.revokeObjectURL(localUrl)};
  }, [files, imageToPdf, unsupported]);

  const setSelected = (selected: File[]) => {
    setFiles(selected);
    setDownloads([]);
    setError("");
    setNotice("");
  };
  const run = async () => {
    if (unsupported) {
      setError(definition?.description ?? "This operation is not available.");
      return;
    }
    if (files.length === 0) {
      setError(imageToPdf ? "Choose at least one image." : "Choose a PDF file.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    setDownloads([]);
    try {
      if (id === "crop-pdf-pages" && (!Number(cropWidth) || !Number(cropHeight))) throw new Error("Enter a positive crop width and height.");
      if ((id === "add-text-to-pdf" || id === "add-watermark") && !text.trim()) throw new Error("Enter the text to add.");
      const result: PdfProcessResult = await processPdf(files, id, {
        pages,
        rotation,
        text: id === "add-text-to-pdf" ? text : undefined,
        watermark: id === "add-watermark" ? text : undefined,
        fontSize,
        opacity: opacity / 100,
        cropX: Number(cropX),
        cropY: Number(cropY),
        cropWidth: Number(cropWidth),
        cropHeight: Number(cropHeight),
      });
      setDownloads(result.downloads);
      if (result.pageCount) setPageCount(result.pageCount);
      setNotice(result.notice ?? `${result.downloads.length} output${result.downloads.length === 1 ? "" : "s"} ready to download.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The PDF could not be processed.");
    } finally {
      setBusy(false);
    }
  };

  if (unsupported) return <section className="surface p-5 sm:p-7" data-testid="notice-pdf-unsupported">
    <div className="flex items-start gap-3"><AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-700"/><div><h2 className="font-display text-lg font-semibold">{tool.label} is not available</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description} No file is uploaded or changed. Other PDF tools work locally in your browser.</p></div></div>
  </section>;

  return <section className="surface p-5 sm:p-7" aria-label={`${tool.label} controls`}>
    <div className="mb-5 flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><FileText size={17}/></span><div><h2 className="font-display text-lg font-semibold tracking-[-.03em]">PDF tool</h2><p className="text-[11px] text-muted-foreground">Files are processed locally in this browser.</p></div></div>
    <UploadZone accept={accept} multiple={multiple} busy={busy} onFiles={setSelected} files={files} images={imageToPdf}/>
    {files.length > 0 && <div className="mt-3 grid gap-2">{files.map((file,index)=><div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/70 px-3 py-2.5 text-xs"><span className="min-w-0 truncate">{index+1}. {file.name}</span><span className="shrink-0 text-muted-foreground">{prettyBytes(file.size)}</span></div>)}</div>}
    {!imageToPdf && pageCount !== null && <div className="mt-4 flex flex-col gap-4 rounded-xl bg-secondary/50 p-3 sm:flex-row sm:items-center">
      {pagePreviewUrl && <img src={pagePreviewUrl} alt="First page preview" className="max-h-40 min-h-24 w-auto max-w-[130px] rounded border border-border bg-white object-contain" data-testid="img-pdf-preview"/>}
      <p className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">{pageCount} pages</span><br/>The first page preview is rendered locally. Enter page numbers as “1, 3-5”; leave the field blank to use every page.</p>
    </div>}

    {["split-pdf","extract-pdf-pages","delete-pdf-pages","rotate-pdf","reorder-pdf-pages","organize-pdf-pages"].includes(id) && <label className="mt-5 block text-xs font-semibold">Pages{pageCount!==null?` (1–${pageCount})`:""}<input value={pages} onChange={(event)=>setPages(event.target.value)} placeholder={id==="delete-pdf-pages"?"Pages to remove, e.g. 2, 4-6":"e.g. 1, 3-5"} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="input-pdf-pages"/><span className="mt-1.5 block text-[11px] font-normal text-muted-foreground">{id==="delete-pdf-pages"?"Enter pages to remove. Other pages are kept.":id==="split-pdf"?"Each selected page becomes a separate PDF download.":"For reorder and organize, the entered order becomes the new page order."}</span></label>}
    {id === "rotate-pdf" && <label className="mt-4 block text-xs font-semibold">Rotation<select value={rotation} onChange={(event)=>setRotation(Number(event.target.value) as 90|180|270)} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="select-pdf-rotation"><option value={90}>90° clockwise</option><option value={180}>180° clockwise</option><option value={270}>270° clockwise</option></select></label>}
    {(id === "add-watermark" || id === "add-text-to-pdf") && <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold">{id==="add-watermark"?"Watermark text":"Text to add"}<input value={text} maxLength={120} onChange={(event)=>setText(event.target.value)} className="control mt-2 h-11 w-full px-3 text-sm font-normal" placeholder="Enter text" data-testid="input-pdf-text"/></label><label className="text-xs font-semibold">Font size<input type="number" min="8" max="96" value={fontSize} onChange={(event)=>setFontSize(Number(event.target.value))} className="control mt-2 h-11 w-full px-3 text-sm font-normal" data-testid="input-pdf-font-size"/></label>{id==="add-watermark"&&<label className="text-xs font-semibold sm:col-span-2">Opacity: {opacity}%<input type="range" min="10" max="100" value={opacity} onChange={(event)=>setOpacity(Number(event.target.value))} className="mt-3 w-full accent-[hsl(var(--primary))]" data-testid="input-pdf-opacity"/></label>}</div>}
    {id==="crop-pdf-pages"&&<div className="mt-5"><p className="text-xs font-semibold">Crop box (PDF points, origin at top-left)</p><div className="mt-3 grid grid-cols-2 gap-3">{([["X",cropX,setCropX],["Y",cropY,setCropY],["Width",cropWidth,setCropWidth],["Height",cropHeight,setCropHeight]] as const).map(([label,value,setter])=><label key={label} className="text-xs font-medium">{label}<input type="number" min="0" value={value} onChange={(event)=>setter(event.target.value)} className="control mt-2 h-10 w-full px-3 text-sm font-normal" data-testid={`input-pdf-crop-${label.toLowerCase()}`}/></label>)}</div><p className="mt-2 text-[11px] leading-5 text-muted-foreground">Crop values apply to every page and must fit inside each page’s dimensions. This changes the visible crop box, not the underlying page content.</p></div>}
    {id==="compress-pdf"&&<p className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground">This browser-only operation rewrites the PDF using compact object streams. It does not recompress embedded images, and the result may be larger; the actual outcome will be reported.</p>}
    {(id==="jpg-to-pdf"||id==="png-to-pdf"||id==="images-to-pdf")&&<p className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground">JPEG and PNG images become one PDF page each. Other image formats are not supported for this operation.</p>}

    {error && <ErrorNotice message={error}/>}
    <button type="button" onClick={()=>void run()} disabled={busy || files.length===0} className="action-button mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-process-pdf">{busy?<LoaderCircle size={16} className="animate-spin"/>:<ArrowDown size={16}/>} {busy?"Processing…":"Process PDF"}</button>

    {downloads.length > 0 && <div className="mt-6 border-t border-border pt-5">
      <div className="mb-3 flex items-start gap-2 text-sm font-semibold text-primary"><Check size={16} className="mt-0.5"/><span>{notice}</span></div>
      {id==="pdf-to-jpg"||id==="pdf-to-png" ? <p className="mb-3 text-xs leading-5 text-muted-foreground">This tool creates separate image files for each page. Download each page below.</p> : null}
      <div className="grid gap-2">{downloads.map((item,index)=>{
        const url=downloadUrls[index] ?? previewUrl;
        return <div key={`${item.fileName}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
          <span className="min-w-0 truncate text-xs font-medium">{item.fileName}</span>
          <a href={url} download={item.fileName} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground" data-testid={`link-download-pdf-${index}`}><Download size={14}/> Download</a>
        </div>;
      })}</div>
      {downloads[0]?.mimeType==="application/pdf"&&previewUrl&&<a href={previewUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline" data-testid="link-preview-output"><FileText size={14}/> Open the first output</a>}
    </div>}
  </section>;
}

export default function FilesToolPage({ tool }: { tool: Tool }) {
  const isImage = tool.category === "image" && imageIds.has(tool.fileToolId as ImageToolId);
  const isPdf = tool.category === "pdf" && pdfIds.has(tool.fileToolId as PdfToolId);
  const note = useMemo(() => isImage
    ? "Choose a JPEG, PNG, or WEBP file and see the actual result before downloading."
    : tool.fileToolId === "images-to-pdf" || tool.fileToolId === "jpg-to-pdf" || tool.fileToolId === "png-to-pdf"
      ? "Choose JPEG or PNG images, then download the generated PDF."
      : "Choose a PDF and download the processed output.", [isImage, tool.fileToolId]);
  return <main className="mx-auto max-w-[1020px] px-5 py-8 lg:px-8">
    <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/" className="hover:text-primary" data-testid="breadcrumb-home">Toolbox</Link><span>/</span><Link href={`/category/${tool.category==="image"?"images":"pdf"}`} className="hover:text-primary" data-testid="breadcrumb-category">{tool.category==="image"?"Image Tools":"PDF Tools"}</Link><span>/</span><span className="text-foreground">{tool.label}</span></div>
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section className="pt-1">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[.17em] text-primary">{tool.category==="image"?"Image tool":"PDF tool"}</p>
        <h1 className="font-display text-[clamp(2.3rem,6vw,4rem)] font-semibold leading-[1] tracking-[-.065em]">{tool.label}</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{tool.description}</p>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-[hsl(var(--card)/.7)] p-3.5"><span className="mt-0.5 shrink-0 text-primary"><Check size={17}/></span><p className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Private, right in your browser.</span> {note} Files are not sent to an external service.</p></div>
      </section>
      {isImage?<ImageFileTool tool={tool}/>:isPdf?<PdfFileTool tool={tool}/>:<div className="surface p-5 text-sm text-muted-foreground">This file tool is not available.</div>}
    </div>
  </main>;
}

