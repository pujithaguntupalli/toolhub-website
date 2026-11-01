import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Calculator, ArrowRightLeft, FileText, Image as ImageIcon, 
  Download, Upload, Trash2, RotateCw, Sparkles, AlertCircle, ChevronRight,
  Layers, Lock, Unlock, ArrowLeft, Star, Clock, Percent, Volume2, Cpu,
  Database, Flame, HardDrive, Compass, Thermometer, Box, Scale, Shield, Maximize2, Crop, CheckCircle2, Grid, ZoomIn, ZoomOut, RefreshCw
} from 'lucide-react';

// --- CONVERTER DATA & FORMULAS ---
const CONVERTER_DATA = [
  ['length', 'Length', 'Convert distance and dimensions between metric and imperial units.', ['distance','meter','mile','inch','foot'], [['Millimeter',.001],['Centimeter',.01],['Meter',1],['Kilometer',1000],['Inch',.0254],['Foot',.3048],['Yard',.9144],['Mile',1609.344]]],
  ['weight', 'Weight', 'Move between everyday mass and weight units.', ['mass','kilogram','pound','ounce'], [['Milligram',.000001],['Gram',.001],['Kilogram',1],['Metric tonne',1000],['Ounce',.028349523125],['Pound',.45359237],['Stone',6.35029318]]],
  ['temperature', 'Temperature', 'Switch between Celsius, Fahrenheit and Kelvin scales.', ['celsius','fahrenheit','kelvin','degrees'], [['Celsius',1],['Fahrenheit',1],['Kelvin',1]]],
  ['area', 'Area', 'Convert surface area for rooms, land and projects.', ['square','acre','hectare'], [['Square millimeter',.000001],['Square centimeter',.0001],['Square meter',1],['Square kilometer',1000000],['Square foot',.09290304],['Square yard',.83612736],['Acre',4046.8564224],['Hectare',10000]]],
  ['volume', 'Volume', 'Convert liquid and cubic volume measurements.', ['liter','gallon','cup','fluid ounce'], [['Milliliter',.001],['Liter',1],['Cubic meter',1000],['US fluid ounce',.0295735296],['US cup',.2365882365],['US pint',.473176473],['US quart',.946352946],['US gallon',3.785411784],['Imperial gallon',4.54609]]],
  ['time', 'Time', 'Translate intervals from milliseconds to years.', ['seconds','minutes','hours','days'], [['Millisecond',.001],['Second',1],['Minute',60],['Hour',3600],['Day',86400],['Week',604800],['Month (30 days)',2592000],['Year (365 days)',31536000]]],
  ['speed', 'Speed', 'Convert travel speed across common units.', ['km/h','mph','knot','meters per second'], [['Meters per second',1],['Kilometers per hour',.2777777778],['Miles per hour',.44704],['Knot',.5144444444],['Feet per second',.3048]]],
  ['pressure', 'Pressure', 'Convert pressure for weather, engineering and gauges.', ['pascal','bar','psi','atmosphere'], [['Pascal',1],['Kilopascal',1000],['Bar',100000],['Atmosphere',101325],['Torr',133.322368],['PSI',6894.757293]]],
  ['energy', 'Energy', 'Convert energy and heat units.', ['joule','calorie','kilowatt hour','BTU'], [['Joule',1],['Kilojoule',1000],['Calorie (small)',4.184],['Kilocalorie',4184],['Watt-hour',3600],['Kilowatt-hour',3600000],['BTU',1055.05585262]]],
  ['power', 'Power', 'Compare power ratings in watts, horsepower and more.', ['watt','horsepower'], [['Watt',1],['Kilowatt',1000],['Megawatt',1000000],['Mechanical horsepower',745.699872],['Metric horsepower',735.49875],['BTU per hour',.29307107]]],
  ['data-storage', 'Data Storage', 'Convert decimal and binary data sizes, including bits and bytes.', ['data','byte','bit','gigabyte','gibibyte','storage'], [['Bit',1],['Byte',8],['Kilobit (kbit)',1000],['Kilobyte (kB)',1000],['Kibibyte (KiB)',1024],['Megabit (Mbit)',1e6],['Megabyte (MB)',1e6],['Mebibyte (MiB)',1048576],['Gigabit (Gbit)',1e9],['Gigabyte (GB)',1e9],['Gibibyte (GiB)',1073741824],['Terabyte (TB)',1e12],['Tebibyte (TiB)',1099511627776]]],
  ['data-transfer-rate', 'Data Transfer Rate', 'Translate bandwidth between bits and bytes per second.', ['bandwidth','mbps','megabits','download','bytes per second'], [['Bit per second (bit/s)',1],['Kilobit per second (kbit/s)',1000],['Megabit per second (Mbit/s)',1e6],['Gigabit per second (Gbit/s)',1e9],['Byte per second (B/s)',8],['Kilobyte per second (kB/s)',8000],['Megabyte per second (MB/s)',8e6],['Kibibyte per second (KiB/s)',8388608]]],
  ['angle', 'Angle', 'Convert degrees, radians, gradians and turns.', ['degrees','radians','turn'], [['Degree',1],['Radian',180/Math.PI],['Gradian',.9],['Turn',360],['Arcminute',1/60],['Arcsecond',1/3600]]],
  ['fuel-economy', 'Fuel Economy', 'Compare fuel consumption and distance-per-fuel ratings.', ['mpg','miles per gallon','liters per 100 km','efficiency'], [['Kilometers per liter',1],['Miles per US gallon',.425143707],['Miles per Imperial gallon',.35400619],['Liters per 100 km',100]]],
  ['frequency', 'Frequency', 'Convert cycles per second through radio frequencies.', ['hertz','khz','mhz','ghz'], [['Hertz',1],['Kilohertz',1000],['Megahertz',1e6],['Gigahertz',1e9],['Terahertz',1e12],['RPM',1/60]]],
  ['force', 'Force', 'Convert force units used in mechanics and engineering.', ['newton','pound force','kgf'], [['Newton',1],['Kilonewton',1000],['Pound-force',4.4482216153],['Kilogram-force',9.80665],['Dyne',.00001]]],
  ['density', 'Density', 'Convert density by mass per unit volume.', ['kg/m3','g/cm3','pounds per cubic foot'], [['Kilogram per cubic meter',1],['Gram per cubic centimeter',1000],['Gram per milliliter',1000],['Pound per cubic foot',16.01846337],['Pound per US gallon',119.826427]]],
  ['cooking-measurement', 'Cooking Measurement', 'Scale common kitchen volume and weight measures.', ['cooking','teaspoon','tablespoon','cup','gram'], [['Gram (g)',1],['Milliliter',1],['Teaspoon (US)',4.92892159],['Tablespoon (US)',14.7867648],['Fluid ounce (US)',29.5735296],['Cup (US)',236.5882365],['Cup (metric)',250],['Pint (US)',473.176473],['Liter',1000]]],
  ['torque', 'Torque', 'Convert turning force for tools and engineering.', ['newton meter','lb-ft','torque'], [['Newton meter',1],['Newton centimeter',.01],['Pound-foot',1.3558179483],['Pound-inch',.112984829],['Kilogram-force meter',9.80665]]],
  ['number-system', 'Number System', 'Translate integers across binary, octal, decimal and hexadecimal.', ['binary','hex','octal','base','radix'], [['Binary (base 2)',2],['Octal (base 8)',8],['Decimal (base 10)',10],['Hexadecimal (base 16)',16]]],
];

const fmt = (n) => Number.isFinite(n) ? Number(n.toPrecision(11)).toLocaleString('en-US', { maximumFractionDigits: 8 }) : '—';

// --- IMAGE TOOLS DEFINITION ---
export const IMAGE_TOOLS = [
  { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size (KB/MB) while keeping pixel dimensions sharp.', keywords: ['compress', 'jpg', 'png', 'webp', 'reduce size', 'kb', 'mb'] },
  { id: 'resize-image', name: 'Resize Image', description: 'Batch scale resolution with percentage shortcuts, target file estimation & aspect lock.', keywords: ['resize', 'dimensions', 'width', 'height', 'scale', 'pixels', 'batch'] },
  { id: 'crop-image', name: 'Crop Image', description: 'Interactive cropper with composition grids, zoom, continuous rotation & high-res rendering.', keywords: ['crop', 'trim', 'cut', 'aspect ratio', 'interactive', 'rotate'] },
  { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate image by 90, 180, or 270 degrees.', keywords: ['rotate', 'turn', 'angle'] },
  { id: 'flip-image', name: 'Flip Image', description: 'Flip image horizontally or vertically.', keywords: ['flip', 'mirror'] },
  { id: 'jpg-to-png', name: 'JPG to PNG', description: 'Convert JPG images to PNG format.', keywords: ['jpg', 'png', 'convert'] },
  { id: 'png-to-jpg', name: 'PNG to JPG', description: 'Convert PNG images to JPG format.', keywords: ['png', 'jpg', 'convert'] },
  { id: 'webp-to-jpg', name: 'WEBP to JPG', description: 'Convert WEBP images to JPG format.', keywords: ['webp', 'jpg', 'convert'] },
  { id: 'jpg-to-webp', name: 'JPG to WEBP', description: 'Convert JPG images to WebP format.', keywords: ['jpg', 'webp', 'convert'] },
  { id: 'png-to-webp', name: 'PNG to WEBP', description: 'Convert PNG images to WebP format.', keywords: ['png', 'webp', 'convert'] },
  { id: 'format-converter', name: 'Image Format Converter', description: 'Universal format converter (JPG, PNG, WEBP).', keywords: ['format', 'convert', 'image'] },
  { id: 'change-dimensions', name: 'Change Dimensions', description: 'Set specific width and height in pixels.', keywords: ['dimensions', 'px', 'resize'] },
  { id: 'resize-percentage', name: 'Resize by Percentage', description: 'Scale image size by percentage.', keywords: ['percentage', 'scale'] },
  { id: 'resize-pixels', name: 'Resize by Pixels', description: 'Scale image resolution directly.', keywords: ['pixels', 'resolution'] },
  { id: 'make-square', name: 'Make Image Square', description: 'Crop image into a 1:1 square aspect ratio.', keywords: ['square', '1:1', 'avatar'] },
  { id: 'circular-crop', name: 'Circular Image Crop', description: 'Crop image into a round circular badge.', keywords: ['circle', 'round', 'profile'] },
  { id: 'grayscale-image', name: 'Grayscale Filter', description: 'Convert colored images into black & white.', keywords: ['grayscale', 'black white', 'monochrome'] },
  { id: 'blur-image', name: 'Blur Image', description: 'Apply privacy blur filter to your images.', keywords: ['blur', 'censor', 'filter'] },
  { id: 'add-text-image', name: 'Add Text to Image', description: 'Overlay watermark or caption text on photos.', keywords: ['text', 'watermark', 'caption'] },
  { id: 'remove-metadata', name: 'Remove Metadata', description: 'Strip EXIF privacy details and camera tags.', keywords: ['exif', 'metadata', 'privacy'] }
];

// --- PDF TOOLS DEFINITION ---
export const PDF_TOOLS = [
  { id: "merge-pdf", name: "Merge PDF", description: "Combine PDF files in the order selected.", supported: true, keywords: ["combine", "join"] },
  { id: "split-pdf", name: "Split PDF", description: "Extract selected pages into one single PDF document.", supported: true, keywords: ["separate", "divide"] }
];

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const TOOLS = [
  ...CONVERTER_DATA.map(([slug, name, desc, keywords, units]) => ({
    id: `${slug}-conv`,
    rawSlug: slug,
    name: `${name} Converter`,
    category: 'converters',
    icon: 'ArrowRightLeft',
    desc,
    keywords: keywords.join(' '),
    units
  })),

  ...IMAGE_TOOLS.map(t => ({
    id: t.id,
    name: t.name,
    category: 'image',
    icon: 'ImageIcon',
    desc: t.description,
    keywords: t.keywords.join(' ')
  }))
];

const IconRenderer = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    Calculator: <Calculator className={className} />,
    Percent: <Percent className={className} />,
    Clock: <Clock className={className} />,
    ArrowRightLeft: <ArrowRightLeft className={className} />,
    Scale: <Scale className={className} />,
    Thermometer: <Thermometer className={className} />,
    ImageIcon: <ImageIcon className={className} />,
    Maximize2: <Maximize2 className={className} />,
    Crop: <Crop className={className} />,
    RotateCw: <RotateCw className={className} />,
    FileText: <FileText className={className} />
  };
  return icons[name] || <Sparkles className={className} />;
};

const AdvancedCompressImage = ({ toolId }) => {
  // Files Array for Batch Processing Support
  const [files, setFiles] = useState([]);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [origInfos, setOrigInfos] = useState([]);

  // --- IMAGE RESIZER STATES ---
  const [resizeMode, setResizeMode] = useState('px'); // 'px' or '%'
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pctVal, setPctVal] = useState(100);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [quality, setQuality] = useState(85);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');

  // --- IMAGE CROPPER STATES ---
  const [cropRatioPreset, setCropRatioPreset] = useState('Freeform');
  const [gridOverlay, setGridOverlay] = useState('thirds'); // 'none', 'thirds', 'golden'
  const [rotationAngle, setRotationAngle] = useState(0); // continuous rotation -180 to 180
  const [flipHoriz, setFlipHoriz] = useState(false);
  const [flipVert, setFlipVert] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });

  // Interactive Bounding Box percentages [x%, y%, w%, h%] relative to displayed container
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });

  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState([]);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragType = useRef(null); // 'move', 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w', 'pan'
  const startMouse = useRef({ x: 0, y: 0 });
  const startBox = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const startPan = useRef({ x: 0, y: 0 });

  const currentTool = toolId || 'compress-image';
  const activeFile = files[activeFileIdx];
  const activeInfo = origInfos[activeFileIdx] || { width: 0, height: 0, size: 0 };

  const estimatedSizeBytes = useMemo(() => {
    if (!activeInfo.size || activeInfo.width === 0 || activeInfo.height === 0) return 0;
    let targetW = width;
    let targetH = height;

    if (currentTool === 'crop-image') {
      targetW = Math.round((activeInfo.width * cropBox.w) / 100);
      targetH = Math.round((activeInfo.height * cropBox.h) / 100);
    } else if (resizeMode === '%') {
      targetW = Math.round(activeInfo.width * (pctVal / 100));
      targetH = Math.round(activeInfo.height * (pctVal / 100));
    }

    const areaRatio = (targetW * targetH) / (activeInfo.width * activeInfo.height);
    const estimated = activeInfo.size * areaRatio * (quality / 100);
    return Math.max(1024, Math.round(estimated));
  }, [activeInfo, width, height, pctVal, cropBox, quality, currentTool, resizeMode]);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
    if (selected.length === 0) return;

    setFiles(selected);
    setActiveFileIdx(0);
    setBatchResults([]);
    const loadedInfos = [];

    selected.forEach((file, index) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        loadedInfos[index] = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type,
          url
        };
        if (index === 0) {
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
          setCropBox({ x: 10, y: 10, w: 80, h: 80 });
        }
        if (loadedInfos.filter(Boolean).length === selected.length) {
          setOrigInfos([...loadedInfos]);
        }
      };
      img.src = url;
    });
  };

  // Dimensional Sync for Resizer
  const handleWidthInput = (val) => {
    const w = Number(val);
    setWidth(w);
    if (keepAspectRatio && activeInfo.width > 0 && w > 0) {
      setHeight(Math.round(w * (activeInfo.height / activeInfo.width)));
    }
  };

  const handleHeightInput = (val) => {
    const h = Number(val);
    setHeight(h);
    if (keepAspectRatio && activeInfo.height > 0 && h > 0) {
      setWidth(Math.round(h * (activeInfo.width / activeInfo.height)));
    }
  };

  const applyPresetScaling = (percent) => {
    setPctVal(percent);
    if (!activeInfo.width || !activeInfo.height) return;
    const scaledW = Math.round(activeInfo.width * (percent / 100));
    const scaledH = Math.round(activeInfo.height * (percent / 100));
    setWidth(scaledW);
    setHeight(scaledH);
  };

  // Aspect Ratio Presets for Cropper
  const applyCropRatio = (preset) => {
    setCropRatioPreset(preset);
    if (preset === 'Freeform') return;

    let targetRatio = 1;
    if (preset === '1:1') targetRatio = 1;
    else if (preset === '16:9') targetRatio = 16 / 9;
    else if (preset === '9:16') targetRatio = 9 / 16;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '4:5') targetRatio = 4 / 5;

    const imgRatio = activeInfo.width / activeInfo.height;
    let boxW = 80;
    let boxH = (boxW * imgRatio) / targetRatio;

    if (boxH > 90) {
      boxH = 80;
      boxW = (boxH * targetRatio) / imgRatio;
    }

    setCropBox({
      x: Math.max(0, Math.round((100 - boxW) / 2)),
      y: Math.max(0, Math.round((100 - boxH) / 2)),
      w: Math.round(boxW),
      h: Math.round(boxH)
    });
  };

  // Interactive Dragging Handlers for Cropper Selection Box
  const startDrag = (e, type) => {
    e.stopPropagation();
    isDragging.current = true;
    dragType.current = type;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startBox.current = { ...cropBox };
    startPan.current = { ...panPos };
  };

  const onMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPct = ((e.clientX - startMouse.current.x) / rect.width) * 100;
    const dyPct = ((e.clientY - startMouse.current.y) / rect.height) * 100;

    if (dragType.current === 'pan') {
      setPanPos({
        x: startPan.current.x + (e.clientX - startMouse.current.x),
        y: startPan.current.y + (e.clientY - startMouse.current.y)
      });
      return;
    }

    let { x, y, w, h } = startBox.current;

    if (dragType.current === 'move') {
      x = Math.max(0, Math.min(100 - w, x + dxPct));
      y = Math.max(0, Math.min(100 - h, y + dyPct));
    } else {
      if (dragType.current.includes('e')) w = Math.max(10, Math.min(100 - x, w + dxPct));
      if (dragType.current.includes('s')) h = Math.max(10, Math.min(100 - y, h + dyPct));
      if (dragType.current.includes('w')) {
        const nw = Math.max(10, w - dxPct);
        x = x + (w - nw);
        w = nw;
      }
      if (dragType.current.includes('n')) {
        const nh = Math.max(10, h - dyPct);
        y = y + (h - nh);
        h = nh;
      }
    }
    setCropBox({ x, y, w, h });
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  // High-Resolution Batch Processing Engine
  const executeImageEngine = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const info = origInfos[i];
      const bitmap = await createImageBitmap(file);
      const sourceW = bitmap.width;
      const sourceH = bitmap.height;

      let renderW = width;
      let renderH = height;

      if (currentTool === 'crop-image') {
        renderW = Math.round((sourceW * cropBox.w) / 100);
        renderH = Math.round((sourceH * cropBox.h) / 100);
      } else if (resizeMode === '%') {
        renderW = Math.round(sourceW * (pctVal / 100));
        renderH = Math.round(sourceH * (pctVal / 100));
      }

      const canvas = document.createElement('canvas');
      canvas.width = renderW;
      canvas.height = renderH;
      const ctx = canvas.getContext('2d');

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, renderW, renderH);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (currentTool === 'crop-image') {
        const cropX = Math.round((sourceW * cropBox.x) / 100);
        const cropY = Math.round((sourceH * cropBox.y) / 100);
        const cropW = Math.round((sourceW * cropBox.w) / 100);
        const cropH = Math.round((sourceH * cropBox.h) / 100);

        ctx.save();
        ctx.translate(renderW / 2, renderH / 2);
        ctx.rotate((rotationAngle * Math.PI) / 180);
        ctx.scale(flipHoriz ? -1 : 1, flipVert ? -1 : 1);
        ctx.drawImage(bitmap, cropX, cropY, cropW, cropH, -renderW / 2, -renderH / 2, renderW, renderH);
        ctx.restore();
      } else {
        ctx.drawImage(bitmap, 0, 0, sourceW, sourceH, 0, 0, renderW, renderH);
      }

      const blob = await new Promise((res) => canvas.toBlob(res, outputFormat, quality / 100));
      bitmap.close();

      const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat.split('/')[1];
      results.push({
        url: URL.createObjectURL(blob),
        fileName: `${currentTool}_${file.name.split('.')[0]}.${ext}`,
        width: renderW,
        height: renderH,
        size: blob.size
      });
    }

    setBatchResults(results);
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <h3 className="font-bold text-indigo-900 text-base capitalize">
          Active Tool: {currentTool.replace(/-/g, ' ')}
        </h3>
        <p className="text-xs text-indigo-700 mt-0.5">
          {currentTool === 'resize-image'
            ? 'Batch dimension scaling with pixel/percentage inputs, aspect ratio locking & live file size estimation.'
            : currentTool === 'crop-image'
            ? 'Interactive cropper with composition grids, smooth zooming, pan controls & continuous rotation.'
            : 'Client-side image transformation engine.'}
        </p>
      </div>

      <div>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/30 hover:bg-indigo-50 transition">
          <Upload className="w-7 h-7 text-indigo-500 mb-1" />
          <span className="text-sm font-medium text-gray-700">Select Images (Batch Upload Supported)</span>
          <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="hidden" />
        </label>
      </div>

      {files.length > 0 && activeInfo && (
        <>
          {files.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {files.map((f, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveFileIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeFileIdx === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}

          {/* --- CROPPER INTERACTIVE CANVAS & TOOLBAR --- */}
          {currentTool === 'crop-image' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-100 p-2.5 rounded-xl text-xs font-semibold">
                <div className="flex items-center space-x-2">
                  <button onClick={() => setZoomLevel((z) => Math.min(3, z + 0.2))} className="p-1.5 bg-white rounded border hover:bg-gray-50"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.2))} className="p-1.5 bg-white rounded border hover:bg-gray-50"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={() => { setZoomLevel(1); setPanPos({ x: 0, y: 0 }); }} className="p-1.5 bg-white rounded border hover:bg-gray-50"><RefreshCw className="w-4 h-4" /></button>
                  <span className="text-gray-500">Zoom: {Math.round(zoomLevel * 100)}%</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => setFlipHoriz(!flipHoriz)} className={`px-2 py-1 rounded border ${flipHoriz ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>Flip H</button>
                  <button onClick={() => setFlipVert(!flipVert)} className={`px-2 py-1 rounded border ${flipVert ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>Flip V</button>
                  <select value={gridOverlay} onChange={(e) => setGridOverlay(e.target.value)} className="bg-white border rounded px-2 py-1 text-xs font-semibold">
                    <option value="none">No Grid</option>
                    <option value="thirds">Rule of Thirds</option>
                    <option value="golden">Golden Ratio</option>
                  </select>
                </div>
              </div>

              {/* Display Canvas with Interactive Overlays */}
              <div
                ref={containerRef}
                onMouseDown={(e) => startDrag(e, 'pan')}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                className="relative w-full h-[380px] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              >
                <img
                  src={activeInfo.url}
                  alt="Crop Target"
                  style={{
                    transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel}) rotate(${rotationAngle}deg) scale(${flipHoriz ? -1 : 1}, ${flipVert ? -1 : 1})`,
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                  className="pointer-events-none transition-transform duration-75"
                />

                {/* Interactive Crop Box Overlay */}
                <div
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.w}%`,
                    height: `${cropBox.h}%`
                  }}
                  onMouseDown={(e) => startDrag(e, 'move')}
                  className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move"
                >
                  {/* Visual Composition Grids */}
                  {gridOverlay === 'thirds' && (
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/30">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/20" />
                      ))}
                    </div>
                  )}

                  {gridOverlay === 'golden' && (
                    <div className="w-full h-full relative pointer-events-none border border-white/30">
                      <div className="absolute left-[38.2%] top-0 bottom-0 border-r border-white/30" />
                      <div className="absolute right-[38.2%] top-0 bottom-0 border-r border-white/30" />
                      <div className="absolute top-[38.2%] left-0 right-0 border-b border-white/30" />
                      <div className="absolute bottom-[38.2%] left-0 right-0 border-b border-white/30" />
                    </div>
                  )}

                  {/* Corner Handles */}
                  <div onMouseDown={(e) => startDrag(e, 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nwse-resize" />
                  <div onMouseDown={(e) => startDrag(e, 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nesw-resize" />
                  <div onMouseDown={(e) => startDrag(e, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nesw-resize" />
                  <div onMouseDown={(e) => startDrag(e, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nwse-resize" />
                </div>
              </div>

              {/* Continuous Rotation Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Continuous Angle: {rotationAngle}°</span>
                  <button onClick={() => setRotationAngle(0)} className="text-indigo-600 hover:underline">Reset Angle</button>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Aspect Ratio Shortcuts & Readout */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-600">Aspect Ratio Presets</label>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    Selection: {Math.round((activeInfo.width * cropBox.w) / 100)} × {Math.round((activeInfo.height * cropBox.h) / 100)} px
                  </span>
                </div>
                <div className="flex space-x-2">
                  {['Freeform', '1:1', '16:9', '9:16', '4:3', '4:5'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => applyCropRatio(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        cropRatioPreset === r ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- RESIZER CONTROLS --- */}
          {currentTool === 'resize-image' && (
            <div className="p-5 bg-gray-50 rounded-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setResizeMode('px')}
                    className={`px-3 py-1 rounded-md transition ${resizeMode === 'px' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                  >
                    Pixels (px)
                  </button>
                  <button
                    onClick={() => setResizeMode('%')}
                    className={`px-3 py-1 rounded-md transition ${resizeMode === '%' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                  >
                    Percentage (%)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setKeepAspectRatio(!keepAspectRatio)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                    keepAspectRatio ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {keepAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{keepAspectRatio ? 'Aspect Ratio Locked' : 'Ratio Unlocked'}</span>
                </button>
              </div>

              {resizeMode === 'px' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthInput(e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightInput(e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm bg-white font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500">Preset Scaling Shortcuts</label>
                  <div className="flex space-x-2">
                    {[25, 50, 75, 100].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => applyPresetScaling(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          pctVal === p ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700 hover:border-indigo-400'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export Settings & Output Format */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Export Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm bg-white font-semibold"
              >
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/png">PNG (.png)</option>
                <option value="image/webp">WEBP (.webp)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>Compression Quality ({quality}%)</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-900">
            <span>Estimated Output File Size:</span>
            <span className="text-indigo-700 font-bold bg-white px-2.5 py-1 rounded border border-indigo-200">
              ~{formatBytes(estimatedSizeBytes)}
            </span>
          </div>

          <button
            onClick={executeImageEngine}
            disabled={isProcessing}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            {isProcessing ? 'Processing Images...' : `Process ${files.length} Image(s)`}
          </button>

          {/* Batch Download Links */}
          {batchResults.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Processed Output</h4>
              {batchResults.map((res, idx) => (
                <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-900">{res.fileName}</p>
                    <p className="text-xs text-emerald-700">{res.width} × {res.height} px — {formatBytes(res.size)}</p>
                  </div>
                  <a
                    href={res.url}
                    download={res.fileName}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const UniversalCalculator = ({ toolId }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-900 text-lg capitalize">{toolId.replace('-', ' ')}</h3>
      <p className="text-xs text-gray-500 mt-1">Standard calculator module.</p>
    </div>
  );
};

const UniversalConverter = ({ toolId }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-900 text-lg capitalize">{toolId.replace('-', ' ')}</h3>
      <p className="text-xs text-gray-500 mt-1">Standard converter module.</p>
    </div>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeToolId, setActiveToolId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const currentToolObj = TOOLS.find((t) => t.id === activeToolId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div onClick={() => setActiveToolId(null)} className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              T
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">ToolHub</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeToolId ? (
          <div className="space-y-6">
            <div className="text-center py-6 space-y-3">
              <h1 className="text-4xl font-black text-slate-900">Online Multi-Tool Suite</h1>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => setActiveToolId(tool.id)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                      <IconRenderer name={tool.icon} />
                    </div>
                    <h3 className="font-bold text-slate-900">{tool.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setActiveToolId(null)}
              className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tools</span>
            </button>

            {currentToolObj?.category === 'image' ? (
              <AdvancedCompressImage toolId={activeToolId} />
            ) : currentToolObj?.category === 'calculators' ? (
              <UniversalCalculator toolId={activeToolId} />
            ) : (
              <UniversalConverter toolId={activeToolId} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
