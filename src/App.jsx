import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Calculator, ArrowRightLeft, FileText, Image as ImageIcon, 
  Download, Upload, Trash2, RotateCw, Sparkles, AlertCircle, ChevronRight,
  Layers, Lock, Unlock, ArrowLeft, Star, Clock, Percent, Volume2, Cpu,
  Database, Flame, HardDrive, Compass, Thermometer, Box, Scale, Shield, Maximize2, Crop, CheckCircle2, Grid, ZoomIn, ZoomOut, RefreshCw, FlipHorizontal, FlipVertical, FileCheck, Circle
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
const toTempBase = (n, unit) => unit === 'Celsius' ? n : unit === 'Fahrenheit' ? (n - 32) * 5 / 9 : n - 273.15;
const fromTempBase = (c, unit) => unit === 'Celsius' ? c : unit === 'Fahrenheit' ? c * 9 / 5 + 32 : c + 273.15;

function convertUnits(slug, amount, from, to) {
  if (slug === 'temperature') {
    const num = typeof amount === 'number' ? amount : parseFloat(amount);
    if (!Number.isFinite(num)) return null;
    const c = toTempBase(num, from);
    if (c < -273.15) return null;
    return fmt(fromTempBase(c, to));
  }
  if (slug === 'number-system') {
    const radixFrom = from.startsWith('Binary') ? 2 : from.startsWith('Octal') ? 8 : from.startsWith('Hex') ? 16 : 10;
    const radixTo = to.startsWith('Binary') ? 2 : to.startsWith('Octal') ? 8 : to.startsWith('Hex') ? 16 : 10;
    const digits = String(amount).trim().replace(/^[-+]/, '');
    const patterns = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[\da-f]+$/i };
    if (!patterns[radixFrom]?.test(digits)) return null;
    const integer = parseInt(String(amount), radixFrom);
    return Number.isFinite(integer) ? integer.toString(radixTo).toUpperCase() : null;
  }
  const toolEntry = CONVERTER_DATA.find(([s]) => s === slug || `${s}-conv` === slug);
  if (!toolEntry) return null;
  const units = toolEntry[4];
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (!Number.isFinite(num)) return null;

  if (slug === 'fuel-economy' && (from.includes('Liters per 100') || to.includes('Liters per 100'))) {
    if (num <= 0) return null;
    const uFrom = units.find(([l]) => l === from);
    const kmPerLiter = from.includes('Liters per 100') ? 100 / num : num * (uFrom ? uFrom[1] : 1);
    if (!Number.isFinite(kmPerLiter) || kmPerLiter <= 0) return null;
    const uTo = units.find(([l]) => l === to);
    return fmt(to.includes('Liters per 100') ? 100 / kmPerLiter : kmPerLiter / (uTo ? uTo[1] : 1));
  }

  const uFrom = units.find(([l]) => l === from);
  const uTo = units.find(([l]) => l === to);
  if (!uFrom || !uTo) return null;
  return fmt(num * uFrom[1] / uTo[1]);
}

// --- CONSOLIDATED IMAGE TOOLS DEFINITION ---
export const IMAGE_TOOLS = [
  { id: 'format-converter', name: 'Image Format Converter', description: 'Universal format converter supporting JPG, JPEG, PNG, WEBP, and BMP with high quality batch exports.', keywords: ['format', 'convert', 'image', 'jpg', 'jpeg', 'png', 'webp', 'bmp'] },
  { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size (KB/MB) while keeping pixel dimensions sharp.', keywords: ['compress', 'jpg', 'png', 'webp', 'reduce size', 'kb', 'mb'] },
  { id: 'resize-image', name: 'Resize Image', description: 'Batch scale resolution with px/% controls, aspect ratio lock & live file size estimator.', keywords: ['resize', 'dimensions', 'width', 'height', 'scale', 'pixels', 'batch'] },
  { id: 'crop-image', name: 'Crop Image', description: 'Interactive cropper with composition grids, zoom, continuous rotation & high-res rendering.', keywords: ['crop', 'trim', 'cut', 'aspect ratio', 'interactive', 'rotate'] },
  { id: 'rotate-image', name: 'Rotate Image', description: 'Rotate image by 90, 180, or 270 degrees.', keywords: ['rotate', 'turn', 'angle'] },
  { id: 'flip-image', name: 'Flip Image', description: 'Horizontal, vertical & dual-axis 180° inversion with selective region flipping & non-destructive preview.', keywords: ['flip', 'mirror', 'horizontal', 'vertical', 'dual axis', 'selective', 'invert'] },
  { id: 'change-dimensions', name: 'Change Dimensions', description: 'Set specific width and height in pixels.', keywords: ['dimensions', 'px', 'resize'] },
  { id: 'resize-percentage', name: 'Resize by Percentage', description: 'Scale image size by percentage.', keywords: ['percentage', 'scale'] },
  { id: 'resize-pixels', name: 'Resize by Pixels', description: 'Scale image resolution directly.', keywords: ['pixels', 'resolution'] },
  { id: 'make-square', name: 'Make Image Square', description: 'Crop or frame image into a 1:1 square ratio with crop, pad or blur options.', keywords: ['square', '1:1', 'avatar', 'pad', 'center crop'] },
  { id: 'circular-crop', name: 'Circular Image Crop', description: 'Crop image into a round circular badge with transparent corners.', keywords: ['circle', 'round', 'profile', 'avatar', 'badge'] },
  { id: 'grayscale-image', name: 'Grayscale Filter', description: 'Convert colored images into black & white.', keywords: ['grayscale', 'black white', 'monochrome'] },
  { id: 'blur-image', name: 'Blur Image', description: 'Apply privacy blur filter to your images.', keywords: ['blur', 'censor', 'filter'] },
  { id: 'add-text-image', name: 'Add Text to Image', description: 'Overlay watermark or caption text on photos.', keywords: ['text', 'watermark', 'caption'] },
  { id: 'remove-metadata', name: 'Remove Metadata', description: 'Strip EXIF privacy details and camera tags.', keywords: ['exif', 'metadata', 'privacy'] }
];

// --- PDF TOOLS DEFINITION ---
export const PDF_TOOLS = [
  { id: "merge-pdf", name: "Merge PDF", description: "Combine PDF files in the order selected.", supported: true, keywords: ["combine", "join"] },
  { id: "split-pdf", name: "Split PDF", description: "Extract selected pages into one single PDF document.", supported: true, keywords: ["separate", "divide"] },
  { id: "compress-pdf", name: "Compress PDF", description: "Optimize and reduce PDF document size.", supported: true, keywords: ["reduce", "size"] },
  { id: "rotate-pdf", name: "Rotate PDF", description: "Rotate all or specific pages by 90, 180, or 270 degrees.", supported: true, keywords: ["turn"] },
  { id: "delete-pdf-pages", name: "Delete PDF Pages", description: "Remove specific pages from a PDF.", supported: true, keywords: ["remove"] },
  { id: "extract-pdf-pages", name: "Extract PDF Pages", description: "Extract specified pages into a new PDF document.", supported: true, keywords: ["copy"] },
  { id: "reorder-pdf-pages", name: "Reorder PDF Pages", description: "Reorganize pages using a custom page sequence.", supported: true, keywords: ["organize", "sort"] },
  { id: "add-page-numbers", name: "Add Page Numbers", description: "Place customizable page numbers on every page.", supported: true, keywords: ["numbering"] },
  { id: "add-watermark", name: "Add Watermark", description: "Place a custom text watermark across every page.", supported: true, keywords: ["stamp", "text"] },
  { id: "images-to-pdf", name: "Images to PDF", description: "Combine JPEG or PNG images into a PDF.", supported: true, keywords: ["photo"] },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert JPEG images into PDF pages.", supported: true, keywords: ["jpeg", "photo"] },
  { id: "png-to-pdf", name: "PNG to PDF", description: "Convert PNG images into PDF pages.", supported: true, keywords: ["photo"] },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Render PDF pages into JPEG images.", supported: true, keywords: ["convert", "image"] },
  { id: "pdf-to-png", name: "PDF to PNG", description: "Render PDF pages into PNG images.", supported: true, keywords: ["convert", "image"] },
  { id: "extract-pdf-text", name: "Extract PDF Text", description: "Extract selectable text content from specific pages into a plain text file.", supported: true, keywords: ["copy", "plain text", "read text"] },
  { id: "add-text-to-pdf", name: "Add Text to PDF", description: "Annotate and add customizable text lines to pages.", supported: true, keywords: ["write", "annotate"] },
  { id: "crop-pdf-pages", name: "Crop PDF Pages", description: "Trim page margins by applying custom margins.", supported: true, keywords: ["trim"] },
  { id: "organize-pdf-pages", name: "Organize PDF Pages", description: "Filter or rearrange PDF page structure.", supported: true, keywords: ["reorder", "sort"] }
];

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const parsePageRange = (rangeStr, totalPages) => {
  if (!rangeStr || !rangeStr.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set();
  const parts = rangeStr.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map((v) => parseInt(v.trim(), 10));
      if (start && end && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) pages.add(i);
        }
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (p && p >= 1 && p <= totalPages) pages.add(p);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
};

const parsePageSequence = (rangeStr, totalPages) => {
  if (!rangeStr || !rangeStr.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const list = [];
  const parts = rangeStr.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map((v) => parseInt(v.trim(), 10));
      if (start && end && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) list.push(i);
        }
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (p && p >= 1 && p <= totalPages) list.push(p);
    }
  }
  return list;
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

  { id: 'percentage-calc', name: 'Percentage Calculator', category: 'calculators', icon: 'Percent', desc: 'Find a percentage of a value, or the percentage one value is of another.', keywords: 'percent rate of fraction' },
  { id: 'age-calc', name: 'Age Calculator', category: 'calculators', icon: 'Clock', desc: 'Calculate age in years, months and days from a birth date.', keywords: 'birthday birth date how old living' },
  { id: 'bmi-calc', name: 'BMI Calculator', category: 'calculators', icon: 'Activity', desc: 'Estimate body mass index from height and weight.', keywords: 'body mass index health weight fitness' },
  { id: 'simple-interest', name: 'Simple Interest Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Estimate simple interest and total value over time.', keywords: 'interest principal finance money rate' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Estimate compounded growth and interest earned.', keywords: 'investment annual compound finance savings wealth' },
  { id: 'loan-emi', name: 'Loan EMI Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Estimate a fixed monthly loan payment and total repayment.', keywords: 'mortgage monthly payment loan bank car' },
  { id: 'gst-calc', name: 'GST / Sales Tax Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Add or remove a goods and services tax rate.', keywords: 'tax vat sales tax price gross net' },
  { id: 'discount-calc', name: 'Discount Calculator', category: 'calculators', icon: 'Percent', desc: 'Find the sale price and amount saved after a discount.', keywords: 'sale price markdown savings shopping' },
  { id: 'profit-loss', name: 'Profit and Loss Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Compare selling and cost prices to find profit or loss.', keywords: 'margin markup business revenue' },
  { id: 'salary-calc', name: 'Salary / Wage Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Convert gross salary between common pay periods.', keywords: 'paycheck annual hourly income wage' },
  { id: 'date-diff', name: 'Date Difference Calculator', category: 'calculators', icon: 'Clock', desc: 'Count the calendar days between two dates.', keywords: 'days between date range duration calendar' },
  { id: 'time-duration', name: 'Time Duration Calculator', category: 'calculators', icon: 'Clock', desc: 'Find elapsed time between clock times, including overnight intervals.', keywords: 'hours between elapsed clock timer' },
  { id: 'average-calc', name: 'Average Calculator', category: 'calculators', icon: 'Calculator', desc: 'Calculate the arithmetic mean of a list of values.', keywords: 'mean numbers statistics median data' },
  { id: 'ratio-calc', name: 'Ratio Calculator', category: 'calculators', icon: 'Calculator', desc: 'Simplify a two-part ratio and find its share.', keywords: 'proportion scale simplify aspect divide' },
  { id: 'fraction-calc', name: 'Fraction Calculator', category: 'calculators', icon: 'Calculator', desc: 'Simplify a fraction and show its decimal value.', keywords: 'numerator denominator reduce math' },
  { id: 'scientific-calc', name: 'Scientific Calculator', category: 'calculators', icon: 'Calculator', desc: 'Evaluate a scientific operation on one or two values.', keywords: 'sin cos log sqrt exponent trig' },
  { id: 'basic-calc', name: 'Basic Calculator', category: 'calculators', icon: 'Calculator', desc: 'Quickly evaluate two values with a basic arithmetic operation.', keywords: 'arithmetic add subtract multiply divide math' },
  { id: 'hcf-lcm', name: 'HCF and LCM Calculator', category: 'calculators', icon: 'Calculator', desc: 'Find the highest common factor and least common multiple.', keywords: 'gcd greatest common divisor multiple prime' },
  { id: 'unit-price', name: 'Unit Price Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Compare cost per standard unit for shopping decisions.', keywords: 'price per unit compare value cost grocery' },
  { id: 'savings-goal', name: 'Savings Goal Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Estimate the monthly amount needed to reach a savings target.', keywords: 'saving plan monthly savings goal target' },

  ...IMAGE_TOOLS.map(t => ({
    id: t.id,
    name: t.name,
    category: 'image',
    icon: 'ImageIcon',
    desc: t.description,
    keywords: t.keywords.join(' ')
  })),

  ...PDF_TOOLS.map(t => ({
    id: t.id,
    name: t.name,
    category: 'pdf',
    icon: 'FileText',
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
    Box: <Box className={className} />,
    Volume2: <Volume2 className={className} />,
    Compass: <Compass className={className} />,
    Flame: <Flame className={className} />,
    Cpu: <Cpu className={className} />,
    HardDrive: <HardDrive className={className} />,
    Database: <Database className={className} />,
    ImageIcon: <ImageIcon className={className} />,
    Maximize2: <Maximize2 className={className} />,
    Crop: <Crop className={className} />,
    RotateCw: <RotateCw className={className} />,
    Shield: <Shield className={className} />,
    FileText: <FileText className={className} />,
    Trash2: <Trash2 className={className} />,
    Layers: <Layers className={className} />
  };
  return icons[name] || <Sparkles className={className} />;
};

const AdvancedCompressImage = ({ toolId }) => {
  // Batch Upload File Management
  const [files, setFiles] = useState([]);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [origInfos, setOrigInfos] = useState([]);

  // --- FORMAT CONVERTER STATES ---
  const [targetFormat, setTargetFormat] = useState('image/png');

  // --- RESIZER STATES ---
  const [resizeMode, setResizeMode] = useState(toolId === 'resize-percentage' ? '%' : 'px');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pctVal, setPctVal] = useState(50);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [quality, setQuality] = useState(85);
  const [outputFormat, setOutputFormat] = useState(toolId === 'circular-crop' ? 'image/png' : 'image/jpeg');

  // --- MAKE SQUARE SPECIFIC STATES ---
  const [squareMode, setSquareMode] = useState('crop'); // 'crop', 'pad-white', 'pad-black', 'pad-blur'
  const [squareOffset, setSquareOffset] = useState(50); // 0% to 100% position shift

  // --- CIRCULAR CROP SPECIFIC STATES ---
  const [circleScale, setCircleScale] = useState(80); // % scale of circle relative to min dimension
  const [circleCenterX, setCircleCenterX] = useState(50); // % center offset X
  const [circleCenterY, setCircleCenterY] = useState(50); // % center offset Y

  useEffect(() => {
    if (toolId === 'resize-percentage') {
      setResizeMode('%');
    } else if (toolId === 'resize-pixels' || toolId === 'change-dimensions') {
      setResizeMode('px');
    } else if (toolId === 'circular-crop') {
      setOutputFormat('image/png');
    }
  }, [toolId]);

  // --- CROPPER & ROTATION STATES ---
  const [cropRatioPreset, setCropRatioPreset] = useState('Freeform');
  const [gridOverlay, setGridOverlay] = useState('thirds');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rotation, setRotation] = useState(90);
  
  // --- FLIP IMAGE DEDICATED STATES ---
  const [flipAxis, setFlipAxis] = useState('horizontal');
  const [flipScope, setFlipScope] = useState('full');
  
  const [flipHoriz, setFlipHoriz] = useState(false);
  const [flipVert, setFlipVert] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });

  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [blurRadius, setBlurRadius] = useState(4);
  const [watermarkText, setWatermarkText] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState([]);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragType = useRef(null);
  const startMouse = useRef({ x: 0, y: 0 });
  const startBox = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const startPan = useRef({ x: 0, y: 0 });

  const currentTool = toolId || 'format-converter';
  const activeInfo = origInfos[activeFileIdx] || { width: 0, height: 0, size: 0, url: '', format: 'image/jpeg' };

  const estimatedSizeBytes = useMemo(() => {
    if (!activeInfo.size || activeInfo.width === 0 || activeInfo.height === 0) return 0;
    let targetW = width || activeInfo.width;
    let targetH = height || activeInfo.height;

    if (currentTool === 'crop-image') {
      targetW = Math.round((activeInfo.width * cropBox.w) / 100);
      targetH = Math.round((activeInfo.height * cropBox.h) / 100);
    } else if (currentTool === 'resize-percentage' || resizeMode === '%') {
      targetW = Math.round(activeInfo.width * (pctVal / 100));
      targetH = Math.round(activeInfo.height * (pctVal / 100));
    } else if (currentTool === 'make-square') {
      const maxDim = Math.max(activeInfo.width, activeInfo.height);
      const minDim = Math.min(activeInfo.width, activeInfo.height);
      targetW = squareMode.startsWith('pad') ? maxDim : minDim;
      targetH = targetW;
    } else if (currentTool === 'circular-crop') {
      const circleDiam = Math.round(Math.min(activeInfo.width, activeInfo.height) * (circleScale / 100));
      targetW = circleDiam;
      targetH = circleDiam;
    }

    const areaRatio = (targetW * targetH) / (activeInfo.width * activeInfo.height);
    const selectedFormat = currentTool === 'format-converter' ? targetFormat : outputFormat;
    const formatMultiplier = selectedFormat === 'image/png' ? 1.2 : selectedFormat === 'image/webp' ? 0.7 : 0.85;
    const estimated = activeInfo.size * areaRatio * (quality / 100) * formatMultiplier;
    return Math.max(1024, Math.round(estimated));
  }, [activeInfo, width, height, pctVal, cropBox, quality, currentTool, resizeMode, targetFormat, outputFormat, squareMode, circleScale]);

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
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type || 'image/jpeg',
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

  const removeFile = (idx) => {
    const updatedFiles = files.filter((_, i) => i !== idx);
    const updatedInfos = origInfos.filter((_, i) => i !== idx);
    setFiles(updatedFiles);
    setOrigInfos(updatedInfos);
    if (activeFileIdx >= updatedFiles.length) {
      setActiveFileIdx(Math.max(0, updatedFiles.length - 1));
    }
  };

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

  const executeImageEngine = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const results = [];

    const effectiveFormat = currentTool === 'format-converter' ? targetFormat : outputFormat;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bitmap = await createImageBitmap(file);
      const sourceW = bitmap.width;
      const sourceH = bitmap.height;

      let renderW = sourceW;
      let renderH = sourceH;

      if (currentTool === 'resize-percentage' || (currentTool === 'resize-image' && resizeMode === '%')) {
        renderW = Math.round(sourceW * (pctVal / 100));
        renderH = Math.round(sourceH * (pctVal / 100));
      } else if (['resize-image', 'change-dimensions', 'resize-pixels'].includes(currentTool) || (currentTool === 'resize-image' && resizeMode === 'px')) {
        renderW = width > 0 ? width : sourceW;
        renderH = height > 0 ? height : sourceH;
      } else if (currentTool === 'crop-image') {
        renderW = Math.round((sourceW * cropBox.w) / 100);
        renderH = Math.round((sourceH * cropBox.h) / 100);
      } else if (currentTool === 'make-square') {
        const maxDim = Math.max(sourceW, sourceH);
        const minDim = Math.min(sourceW, sourceH);
        renderW = squareMode.startsWith('pad') ? maxDim : minDim;
        renderH = renderW;
      } else if (currentTool === 'circular-crop') {
        const baseMin = Math.min(sourceW, sourceH);
        renderW = Math.round(baseMin * (circleScale / 100));
        renderH = renderW;
      }

      const currentAngle = currentTool === 'rotate-image' ? rotation : currentTool === 'crop-image' ? rotationAngle : 0;
      const normalizedAngle = ((currentAngle % 360) + 360) % 360;
      if (normalizedAngle === 90 || normalizedAngle === 270) {
        const temp = renderW;
        renderW = renderH;
        renderH = temp;
      }

      const canvas = document.createElement('canvas');
      canvas.width = renderW;
      canvas.height = renderH;
      const ctx = canvas.getContext('2d');

      if (effectiveFormat === 'image/jpeg' && currentTool !== 'circular-crop') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, renderW, renderH);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // --- DEDICATED MAKE SQUARE LOGIC ---
      if (currentTool === 'make-square') {
        const side = renderW;

        if (squareMode === 'crop') {
          const offsetFrac = squareOffset / 100;
          let sx = 0, sy = 0, sw = sourceW, sh = sourceH;

          if (sourceW > sourceH) {
            sw = sourceH;
            sx = Math.round((sourceW - sourceH) * offsetFrac);
          } else {
            sh = sourceW;
            sy = Math.round((sourceH - sourceW) * offsetFrac);
          }
          ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, side, side);
        } else {
          if (squareMode === 'pad-white') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, side, side);
          } else if (squareMode === 'pad-black') {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, side, side);
          } else if (squareMode === 'pad-blur') {
            ctx.save();
            ctx.filter = 'blur(30px)';
            ctx.drawImage(bitmap, -side * 0.1, -side * 0.1, side * 1.2, side * 1.2);
            ctx.restore();
          }

          const scale = side / Math.max(sourceW, sourceH);
          const drawW = Math.round(sourceW * scale);
          const drawH = Math.round(sourceH * scale);
          const dx = Math.round((side - drawW) / 2);
          const dy = Math.round((side - drawH) / 2);
          ctx.drawImage(bitmap, 0, 0, sourceW, sourceH, dx, dy, drawW, drawH);
        }
      } 
      // --- DEDICATED CIRCULAR CROP LOGIC (FIXED DUAL-AXIS UNLIMITED PANNING) ---
      else if (currentTool === 'circular-crop') {
        const circleDiam = renderW;
        ctx.clearRect(0, 0, circleDiam, circleDiam);

        // Apply Circular Clipping Path
        ctx.beginPath();
        ctx.arc(circleDiam / 2, circleDiam / 2, circleDiam / 2, 0, Math.PI * 2);
        ctx.clip();

        // Determine crop box size based on scale slider
        const baseMin = Math.min(sourceW, sourceH);
        const cropDim = Math.round(baseMin * (circleScale / 100));

        // Calculate maximum shift allowance for both axes independently
        const maxOffsetX = Math.max(0, sourceW - cropDim);
        const maxOffsetY = Math.max(0, sourceH - cropDim);

        // Calculate actual source X and Y top-left anchors
        const sx = Math.round(maxOffsetX * (circleCenterX / 100));
        const sy = Math.round(maxOffsetY * (circleCenterY / 100));

        ctx.drawImage(bitmap, sx, sy, cropDim, cropDim, 0, 0, circleDiam, circleDiam);
      } 
      else if (currentTool === 'flip-image' && flipScope === 'selective') {
        ctx.drawImage(bitmap, 0, 0, sourceW, sourceH, 0, 0, renderW, renderH);

        const srcX = Math.round((sourceW * cropBox.x) / 100);
        const srcY = Math.round((sourceH * cropBox.y) / 100);
        const srcW = Math.round((sourceW * cropBox.w) / 100);
        const srcH = Math.round((sourceH * cropBox.h) / 100);

        ctx.clearRect(srcX, srcY, srcW, srcH);
        if (effectiveFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(srcX, srcY, srcW, srcH);
        }

        const scaleX = (flipAxis === 'horizontal' || flipAxis === 'dual') ? -1 : 1;
        const scaleY = (flipAxis === 'vertical' || flipAxis === 'dual') ? -1 : 1;

        ctx.save();
        ctx.translate(srcX + srcW / 2, srcY + srcH / 2);
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(bitmap, srcX, srcY, srcW, srcH, -srcW / 2, -srcH / 2, srcW, srcH);
        ctx.restore();
      } else {
        if (currentTool === 'grayscale-image') ctx.filter = 'grayscale(1)';
        if (currentTool === 'blur-image') ctx.filter = `blur(${blurRadius}px)`;

        ctx.save();
        ctx.translate(renderW / 2, renderH / 2);
        ctx.rotate((currentAngle * Math.PI) / 180);

        if (currentTool === 'flip-image') {
          const scaleX = flipAxis === 'horizontal' || flipAxis === 'dual' ? -1 : 1;
          const scaleY = flipAxis === 'vertical' || flipAxis === 'dual' ? -1 : 1;
          ctx.scale(scaleX, scaleY);
        } else if (currentTool === 'crop-image') {
          ctx.scale(flipHoriz ? -1 : 1, flipVert ? -1 : 1);
        }

        if (currentTool === 'crop-image') {
          const cropX = Math.round((sourceW * cropBox.x) / 100);
          const cropY = Math.round((sourceH * cropBox.y) / 100);
          const cropW = Math.round((sourceW * cropBox.w) / 100);
          const cropH = Math.round((sourceH * cropBox.h) / 100);
          ctx.drawImage(bitmap, cropX, cropY, cropW, cropH, -renderW / 2, -renderH / 2, renderW, renderH);
        } else {
          const drawW = (normalizedAngle === 90 || normalizedAngle === 270) ? renderH : renderW;
          const drawH = (normalizedAngle === 90 || normalizedAngle === 270) ? renderW : renderH;
          ctx.drawImage(bitmap, -drawW / 2, -drawH / 2, drawW, drawH);
        }
        ctx.restore();
        ctx.filter = 'none';
      }

      if (currentTool === 'add-text-image' && watermarkText) {
        const fontSize = Math.max(16, Math.round(renderW / 18));
        ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        ctx.strokeText(watermarkText, renderW / 2, renderH - fontSize * 0.7);
        ctx.fillText(watermarkText, renderW / 2, renderH - fontSize * 0.7);
      }

      const blob = await new Promise((res) => canvas.toBlob(res, effectiveFormat, quality / 100));
      bitmap.close();

      const extMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/bmp': 'bmp'
      };
      const ext = extMap[effectiveFormat] || 'jpg';

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
          {currentTool === 'make-square'
            ? 'Crop or pad rectangular photos into a 1:1 square canvas. Choose between Center Crop, White/Black Padding, or Blurred Background.'
            : currentTool === 'circular-crop'
            ? 'Crop photos into a round avatar badge with transparent outer corners (Exported as PNG).'
            : currentTool === 'format-converter'
            ? 'Convert images between JPG, PNG, WEBP, and BMP formats with instant quality settings & live file size estimation.'
            : currentTool === 'flip-image'
            ? 'Horizontal (left-right), Vertical (top-bottom), and Dual-Axis 180° inversion flipping. Supports selective layer flipping and live preview.'
            : ['resize-image', 'change-dimensions', 'resize-pixels', 'resize-percentage'].includes(currentTool)
            ? 'Batch scale dimensions via manual px inputs, percentage shortcuts, aspect ratio locking & real-time file size estimation.'
            : currentTool === 'crop-image'
            ? 'Interactive cropper featuring Rule-of-Thirds & Golden Ratio overlays, zoom, pan controls, continuous rotation & high-resolution rendering.'
            : 'Client-side image processing suite.'}
        </p>
      </div>

      <div>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/30 hover:bg-indigo-50 transition">
          <Upload className="w-7 h-7 text-indigo-500 mb-1" />
          <span className="text-sm font-medium text-gray-700">Select Images (Batch Upload Supported)</span>
          <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="hidden" />
        </label>
      </div>

      {/* --- UPLOAD CONFIRMATION STATE BADGE & PREVIEW CARDS --- */}
      {files.length > 0 && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{files.length} Image{files.length > 1 ? 's' : ''} Ready & Loaded</span>
            </div>
            <button
              onClick={() => { setFiles([]); setOrigInfos([]); setBatchResults([]); }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Uploads</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {origInfos.map((info, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFileIdx(idx)}
                className={`p-2.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition ${
                  activeFileIdx === idx
                    ? 'bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-200'
                    : 'bg-white/80 border-emerald-100 hover:border-indigo-300'
                }`}
              >
                <img
                  src={info.url}
                  alt={info.name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{info.name}</p>
                  <p className="text-[11px] text-gray-500">{info.width} × {info.height} px</p>
                  <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded mt-0.5">
                    {formatBytes(info.size)}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && activeInfo && (
        <>
          {/* --- MAKE IMAGE SQUARE TOOL CONTROLS & PREVIEW --- */}
          {currentTool === 'make-square' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-600">Square Formatting Strategy</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'crop', label: '1:1 Center Crop' },
                    { id: 'pad-white', label: 'Pad (White Frame)' },
                    { id: 'pad-black', label: 'Pad (Black Frame)' },
                    { id: 'pad-blur', label: 'Pad (Blurred Background)' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSquareMode(m.id)}
                      className={`p-2.5 rounded-lg text-xs font-bold transition border ${
                        squareMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {squareMode === 'crop' && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>Crop Position Offset: {squareOffset}%</span>
                      <span className="text-gray-400">
                        {activeInfo.width > activeInfo.height ? 'Shift Horizontal' : 'Shift Vertical'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={squareOffset}
                      onChange={(e) => setSquareOffset(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                )}
              </div>

              {/* Square Live Preview */}
              <div className="w-full h-[320px] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                <div
                  className="relative aspect-square max-h-full overflow-hidden rounded-xl border-2 border-dashed border-indigo-400 flex items-center justify-center"
                  style={{
                    backgroundColor: squareMode === 'pad-white' ? '#fff' : squareMode === 'pad-black' ? '#000' : '#1e293b'
                  }}
                >
                  {squareMode === 'pad-blur' && (
                    <img
                      src={activeInfo.url}
                      alt="Blur BG"
                      className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-70"
                    />
                  )}
                  <img
                    src={activeInfo.url}
                    alt="Square Target"
                    style={{
                      objectFit: squareMode === 'crop' ? 'cover' : 'contain',
                      objectPosition: squareMode === 'crop'
                        ? activeInfo.width > activeInfo.height ? `${squareOffset}% 50%` : `50% ${squareOffset}%`
                        : 'center'
                    }}
                    className="relative z-10 max-h-full max-w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- CIRCULAR CROP TOOL CONTROLS & UPDATED LIVE PREVIEW --- */}
          {currentTool === 'circular-crop' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>Circle Size: {circleScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={circleScale}
                      onChange={(e) => setCircleScale(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>Center X: {circleCenterX}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={circleCenterX}
                      onChange={(e) => setCircleCenterX(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>Center Y: {circleCenterY}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={circleCenterY}
                      onChange={(e) => setCircleCenterY(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
                  Note: Outer cut-out corners are converted to alpha transparency. Recommended export format: PNG.
                </p>
              </div>

              {/* Circular Live Preview */}
              <div className="w-full h-[320px] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                <div
                  className="relative rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl bg-slate-800 flex items-center justify-center"
                  style={{
                    width: `${Math.min(260, 260 * (circleScale / 100))}px`,
                    height: `${Math.min(260, 260 * (circleScale / 100))}px`
                  }}
                >
                  <img
                    src={activeInfo.url}
                    alt="Circle Preview Target"
                    style={{
                      objectFit: 'cover',
                      objectPosition: `${circleCenterX}% ${circleCenterY}%`,
                      width: '100%',
                      height: '100%',
                      transform: `scale(${100 / Math.max(20, circleScale)})`
                    }}
                    className="max-w-none transition-all duration-75"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- FORMAT CONVERTER UNIFIED TOOL CONTROLS --- */}
          {currentTool === 'format-converter' && (
            <div className="p-5 bg-gray-50 rounded-xl space-y-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Source Format (Detected)</label>
                  <div className="p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 uppercase">
                    {activeInfo.type ? activeInfo.type.replace('image/', '') : 'JPG / PNG'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Target Export Format</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full border border-indigo-300 rounded-lg p-2.5 text-sm bg-white font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="image/png">PNG (.png)</option>
                    <option value="image/jpeg">JPG / JPEG (.jpg)</option>
                    <option value="image/webp">WEBP (.webp)</option>
                    <option value="image/bmp">BMP (.bmp)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* --- FLIP IMAGE TOOL INTERACTIVE CANVAS & CONTROLS --- */}
          {currentTool === 'flip-image' && (
            <div className="space-y-5">
              <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Flip Axis Target</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFlipAxis('horizontal')}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-bold transition border ${
                          flipAxis === 'horizontal' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <FlipHorizontal className="w-4 h-4 mb-1" />
                        <span>Horizontal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipAxis('vertical')}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-bold transition border ${
                          flipAxis === 'vertical' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <FlipVertical className="w-4 h-4 mb-1" />
                        <span>Vertical</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipAxis('dual')}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-bold transition border ${
                          flipAxis === 'dual' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <RefreshCw className="w-4 h-4 mb-1" />
                        <span>Dual-Axis (180°)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Flipping Scope</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFlipScope('full')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold transition border ${
                          flipScope === 'full' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Full Background Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipScope('selective')}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold transition border ${
                          flipScope === 'selective' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Selective / Layer Region
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-indigo-700 bg-indigo-50/80 p-2.5 rounded-lg font-medium border border-indigo-100">
                  {flipScope === 'full'
                    ? `Mode: Full Canvas Image ${flipAxis === 'horizontal' ? 'Horizontal (Mirror Left-Right)' : flipAxis === 'vertical' ? 'Vertical (Mirror Top-Bottom)' : 'Dual-Axis (180° Inversion)'}`
                    : `Mode: Selective Layer Region. Drag handle on preview below to select area to flip.`}
                </div>
              </div>

              <div
                ref={containerRef}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                className="relative w-full h-[360px] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center select-none"
              >
                <div className="relative max-h-full max-w-full flex items-center justify-center">
                  <img
                    src={activeInfo.url}
                    alt="Flip Live Preview Target"
                    style={{
                      transform: flipScope === 'full' 
                        ? `scale(${flipAxis === 'horizontal' || flipAxis === 'dual' ? -1 : 1}, ${flipAxis === 'vertical' || flipAxis === 'dual' ? -1 : 1})`
                        : 'none',
                      maxHeight: '340px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                    className="pointer-events-none transition-transform duration-150"
                  />

                  {flipScope === 'selective' && (
                    <div
                      style={{
                        left: `${cropBox.x}%`,
                        top: `${cropBox.y}%`,
                        width: `${cropBox.w}%`,
                        height: `${cropBox.h}%`
                      }}
                      onMouseDown={(e) => startDrag(e, 'move')}
                      className="absolute border-2 border-dashed border-amber-400 bg-amber-400/20 cursor-move"
                    >
                      <div className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        Selective Layer Region
                      </div>
                      <div onMouseDown={(e) => startDrag(e, 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-500 border border-white rounded-full cursor-nwse-resize" />
                      <div onMouseDown={(e) => startDrag(e, 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 border border-white rounded-full cursor-nesw-resize" />
                      <div onMouseDown={(e) => startDrag(e, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-amber-500 border border-white rounded-full cursor-nesw-resize" />
                      <div onMouseDown={(e) => startDrag(e, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 border border-white rounded-full cursor-nwse-resize" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- CROPPER TOOL INTERACTIVE CANVAS & CONTROLS --- */}
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

                  <div onMouseDown={(e) => startDrag(e, 'nw')} className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nwse-resize" />
                  <div onMouseDown={(e) => startDrag(e, 'ne')} className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nesw-resize" />
                  <div onMouseDown={(e) => startDrag(e, 'sw')} className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nesw-resize" />
                  <div onMouseDown={(e) => startDrag(e, 'se')} className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 border border-white rounded-full cursor-nwse-resize" />
                </div>
              </div>

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

          {/* --- ROTATE IMAGE DEDICATED CONTROL --- */}
          {currentTool === 'rotate-image' && (
            <div className="p-5 bg-gray-50 rounded-xl space-y-4">
              <label className="block text-xs font-semibold text-gray-600">Rotation Angle</label>
              <select
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full border rounded-lg p-2.5 text-sm bg-white font-semibold"
              >
                <option value={90}>90° Clockwise</option>
                <option value={180}>180° Turn</option>
                <option value={270}>270° Counter-Clockwise</option>
              </select>
            </div>
          )}

          {/* --- RESIZER TOOL CONTROLS --- */}
          {['resize-image', 'change-dimensions', 'resize-pixels', 'resize-percentage'].includes(currentTool) && (
            <div className="p-5 bg-gray-50 rounded-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg text-xs font-bold">
                  {currentTool !== 'resize-percentage' && (
                    <button
                      onClick={() => setResizeMode('px')}
                      className={`px-3 py-1 rounded-md transition ${resizeMode === 'px' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                    >
                      Pixels (px)
                    </button>
                  )}
                  {currentTool !== 'resize-pixels' && currentTool !== 'change-dimensions' && (
                    <button
                      onClick={() => setResizeMode('%')}
                      className={`px-3 py-1 rounded-md transition ${resizeMode === '%' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
                    >
                      Percentage (%)
                    </button>
                  )}
                </div>

                {resizeMode === 'px' && (
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
                )}
              </div>

              {resizeMode === 'px' && currentTool !== 'resize-percentage' ? (
                <div className="space-y-3">
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
                  <p className="text-xs text-gray-500 font-medium">Original Dimensions: {activeInfo.width} × {activeInfo.height} px</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Resize Scale: {pctVal}%</span>
                    <span className="text-indigo-600 font-bold">
                      Calculated Target: {Math.round(activeInfo.width * (pctVal / 100))} × {Math.round(activeInfo.height * (pctVal / 100))} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={pctVal}
                    onChange={(e) => applyPresetScaling(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex space-x-2 pt-1">
                    {[25, 50, 75, 100, 125, 150].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => applyPresetScaling(p)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
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

          {/* Export Settings */}
          {currentTool !== 'format-converter' && (
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Export Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white font-semibold"
                >
                  <option value="image/png">PNG (.png) - Supports Transparency</option>
                  <option value="image/jpeg">JPEG (.jpg)</option>
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
          )}

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

const PdfToolEngine = ({ toolId }) => {
  const [files, setFiles] = useState([]);
  const [pdfMeta, setPdfMeta] = useState([]);
  const [pages, setPages] = useState('');
  const [rotationTarget, setRotationTarget] = useState('all');
  const [rotationPages, setRotationPages] = useState('');
  const [rotation, setRotation] = useState(90);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [opacity, setOpacity] = useState(0.5);
  const [cropMargin, setCropMargin] = useState(20);

  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState('');
  const [downloads, setDownloads] = useState([]);

  const selectedTool = PDF_TOOLS.find((t) => t.id === toolId);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setDownloads([]);
    setNotice('');

    const metaList = [];
    try {
      const pdfLib = await import('pdf-lib');
      for (const file of selectedFiles) {
        if (file.type === 'application/pdf') {
          const bytes = await file.arrayBuffer();
          const doc = await pdfLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          metaList.push({
            name: file.name,
            size: file.size,
            pageCount: doc.getPageCount()
          });
        } else {
          metaList.push({
            name: file.name,
            size: file.size,
            pageCount: 1
          });
        }
      }
      setPdfMeta(metaList);
    } catch (err) {
      setPdfMeta(selectedFiles.map(f => ({ name: f.name, size: f.size, pageCount: 1 })));
    }
  };

  const removePdfFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setPdfMeta(pdfMeta.filter((_, i) => i !== idx));
  };

  const processPdfClient = async () => {
    if (files.length === 0) return;

    if (toolId === 'merge-pdf' && files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setNotice('');

    try {
      const pdfLib = await import('pdf-lib');
      const { PDFDocument, StandardFonts, degrees, rgb } = pdfLib;

      if (toolId === 'merge-pdf') {
        const merged = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
          const copiedPages = await merged.copyPages(doc, doc.getPageIndices());
          copiedPages.forEach((page) => merged.addPage(page));
        }
        const mergedBytes = await merged.save({ useObjectStreams: true });
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        
        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `merged_document.pdf`,
          size: blob.size
        }]);
        setNotice(`Successfully merged ${files.length} PDF files (${merged.getPageCount()} total pages).`);
      } 
      else if (['images-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(toolId)) {
        const output = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const image = (file.type === 'image/jpeg' || toolId === 'jpg-to-pdf')
            ? await output.embedJpg(bytes)
            : await output.embedPng(bytes);
          const page = output.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
        const pdfBytes = await output.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `converted_images.pdf`,
          size: blob.size
        }]);
      } 
      else if (['reorder-pdf-pages'].includes(toolId)) {
        const file = files[0];
        const srcDoc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const totalPages = srcDoc.getPageCount();

        const selectedPageNums = parsePageSequence(pages, totalPages);

        if (selectedPageNums.length === 0) {
          alert(`Please enter page numbers in desired order (e.g., 3, 1, 2) up to total ${totalPages} pages.`);
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        for (const pageNum of selectedPageNums) {
          const [copiedPage] = await newDoc.copyPages(srcDoc, [pageNum - 1]);
          newDoc.addPage(copiedPage);
        }

        const pdfBytes = await newDoc.save({ useObjectStreams: true });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `reordered_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Reordered document to ${selectedPageNums.length} pages sequence (${selectedPageNums.join(', ')}).`);
      }
      else if (['split-pdf', 'extract-pdf-pages', 'delete-pdf-pages', 'organize-pdf-pages'].includes(toolId)) {
        const file = files[0];
        const srcDoc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const totalPages = srcDoc.getPageCount();
        const newDoc = await PDFDocument.create();
        
        const selectedPageNums = parsePageRange(pages, totalPages);

        if (selectedPageNums.length === 0) {
          alert(`Please enter valid page numbers between 1 and ${totalPages}.`);
          setIsProcessing(false);
          return;
        }

        let targetIndices = [];
        if (toolId === 'delete-pdf-pages') {
          const deleteSet = new Set(selectedPageNums);
          for (let i = 1; i <= totalPages; i++) {
            if (!deleteSet.has(i)) targetIndices.push(i - 1);
          }
        } else {
          targetIndices = selectedPageNums.map((p) => p - 1);
        }

        if (targetIndices.length === 0) {
          alert('Action results in 0 pages.');
          setIsProcessing(false);
          return;
        }

        const copiedPages = await newDoc.copyPages(srcDoc, targetIndices);
        copiedPages.forEach((page) => newDoc.addPage(page));

        const pdfBytes = await newDoc.save({ useObjectStreams: true });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `${toolId}_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Successfully processed ${targetIndices.length} page(s) into a new document.`);
      }
      else if (toolId === 'extract-pdf-text') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        let extractedContent = '';

        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdfDoc = await loadingTask.promise;
          const totalPages = pdfDoc.numPages;

          const targetPages = parsePageRange(pages, totalPages);

          if (targetPages.length === 0) {
            alert(`Please enter valid page numbers between 1 and ${totalPages}.`);
            setIsProcessing(false);
            return;
          }

          for (const pageNum of targetPages) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageStrings = textContent.items.map((item) => item.str);
            extractedContent += `--- Page ${pageNum} ---\n` + pageStrings.join(' ') + '\n\n';
          }
        } catch (pdfErr) {
          const rawText = new TextDecoder('latin1').decode(new Uint8Array(arrayBuffer));
          const matches = rawText.match(/\(([^()]+)\)/g) || [];
          const textChunks = matches
            .map((m) => m.slice(1, -1).trim())
            .filter((s) => s.length > 2 && /^[\x20-\x7E]+$/.test(s));

          extractedContent = textChunks.length > 0 
            ? textChunks.join('\n') 
            : '[No extractable text found. This document may be a scanned image or photo.]';
        }

        const blob = new Blob([extractedContent.trim()], { type: 'text/plain;charset=utf-8' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `${file.name.replace(/\.pdf$/i, '')}_extracted_text.txt`,
          size: blob.size
        }]);
        setNotice(`Successfully extracted text content from document.`);
      }
      else if (toolId === 'rotate-pdf') {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const totalPages = doc.getPageCount();

        let pageIndicesToRotate = [];
        if (rotationTarget === 'specific') {
          const targetPages = parsePageRange(rotationPages, totalPages);
          pageIndicesToRotate = targetPages.map((p) => p - 1);
        } else {
          pageIndicesToRotate = Array.from({ length: totalPages }, (_, i) => i);
        }

        doc.getPages().forEach((page, index) => {
          if (pageIndicesToRotate.includes(index)) {
            page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
          }
        });

        const bytes = await doc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `rotated_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Rotated ${pageIndicesToRotate.length} pages by ${rotation}°.`);
      } 
      else if (toolId === 'add-page-numbers') {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const totalPages = doc.getPageCount();

        doc.getPages().forEach((page, index) => {
          const { width } = page.getSize();
          const label = `${index + 1} / ${totalPages}`;
          const labelWidth = font.widthOfTextAtSize(label, fontSize || 10);
          page.drawText(label, {
            x: (width - labelWidth) / 2,
            y: 18,
            size: fontSize || 10,
            font,
            color: rgb(0.16, 0.2, 0.25)
          });
        });

        const bytes = await doc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `numbered_${file.name}`,
          size: blob.size
        }]);
      } 
      else if (toolId === 'add-watermark' || toolId === 'add-text-to-pdf') {
        if (!textInput.trim()) {
          alert("Please enter text content.");
          setIsProcessing(false);
          return;
        }
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.Helvetica);
        
        for (const page of doc.getPages()) {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(textInput, fontSize || 24);
          page.drawText(textInput, {
            x: Math.max(12, (width - textWidth) / 2),
            y: toolId === 'add-watermark' ? height / 2 : 36,
            size: fontSize || 24,
            font,
            color: rgb(0.18, 0.2, 0.24),
            opacity: opacity || 0.3,
            rotate: degrees(toolId === 'add-watermark' ? -35 : 0)
          });
        }
        const bytes = await doc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `annotated_${file.name}`,
          size: blob.size
        }]);
      }
      else if (toolId === 'crop-pdf-pages') {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const margin = Math.max(0, Number(cropMargin) || 10);

        doc.getPages().forEach((page) => {
          const { width, height } = page.getSize();
          page.setCropBox(margin, margin, Math.max(10, width - margin * 2), Math.max(10, height - margin * 2));
        });

        const bytes = await doc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `cropped_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Applied ${margin}px margin crop box to all pages.`);
      }
      else if (toolId === 'compress-pdf') {
        const file = files[0];
        const srcDoc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const totalPages = srcDoc.getPageCount();
        const compressedDoc = await PDFDocument.create();

        const indices = Array.from({ length: totalPages }, (_, i) => i);
        const copiedPages = await compressedDoc.copyPages(srcDoc, indices);
        copiedPages.forEach((p) => compressedDoc.addPage(p));

        const bytes = await compressedDoc.save({ useObjectStreams: true, addDefaultPage: false });
        const blob = new Blob([bytes], { type: 'application/pdf' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `compressed_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Re-encoded PDF with optimized stream structures.`);
      }
      else if (['pdf-to-jpg', 'pdf-to-png'].includes(toolId)) {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();

        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        const newDownloads = [];

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };

          await page.render(renderContext).promise;

          const mimeType = toolId === 'pdf-to-jpg' ? 'image/jpeg' : 'image/png';
          const ext = toolId === 'pdf-to-jpg' ? 'jpg' : 'png';
          
          const blob = await new Promise((res) => canvas.toBlob(res, mimeType, 0.92));

          newDownloads.push({
            url: URL.createObjectURL(blob),
            name: `page_${i}.${ext}`,
            size: blob.size
          });
        }

        setDownloads(newDownloads);
        setNotice(`Successfully rendered ${totalPages} page(s) into high-resolution ${toolId === 'pdf-to-jpg' ? 'JPG' : 'PNG'} images.`);
      }
      else {
        const file = files[0];
        const blob = new Blob([file], { type: 'application/pdf' });
        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `processed_${file.name}`,
          size: file.size
        }]);
      }
    } catch (err) {
      alert(err.message || 'Error processing PDF file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <h3 className="font-bold text-indigo-900 text-base capitalize">
          PDF Tool: {selectedTool?.name || toolId.replace(/-/g, ' ')}
        </h3>
        <p className="text-xs text-indigo-700 mt-0.5">{selectedTool?.description}</p>
      </div>

      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/20 hover:bg-indigo-50 transition">
        <FileText className="w-8 h-8 text-indigo-500 mb-1" />
        <span className="text-sm font-medium text-gray-700">
          {toolId === 'merge-pdf'
            ? 'Select 2 or More PDF Files'
            : ['images-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(toolId)
            ? 'Select Image Files'
            : 'Select PDF File'}
        </span>
        <input 
          type="file" 
          accept={['images-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(toolId) ? "image/*" : "application/pdf"} 
          multiple={['merge-pdf', 'images-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(toolId)} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </label>

      {/* --- PDF UPLOAD CONFIRMATION VISUAL FEEDBACK CARDS --- */}
      {files.length > 0 && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>{files.length} Document / File{files.length > 1 ? 's' : ''} Uploaded Successfully</span>
            </div>
            <button
              onClick={() => { setFiles([]); setPdfMeta([]); setDownloads([]); }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pdfMeta.map((meta, i) => (
              <div key={i} className="p-3 bg-white border border-emerald-100 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3 truncate">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-gray-900 truncate">{meta.name}</p>
                    <p className="text-[11px] text-gray-500">
                      {formatBytes(meta.size)} • {meta.pageCount} page{meta.pageCount > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removePdfFile(i)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl text-sm">
            {['split-pdf', 'extract-pdf-pages', 'delete-pdf-pages', 'reorder-pdf-pages', 'organize-pdf-pages', 'extract-pdf-text'].includes(toolId) && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {toolId === 'reorder-pdf-pages' 
                    ? 'Desired Page Sequence (e.g., 3, 1, 2)' 
                    : toolId === 'extract-pdf-text'
                    ? 'Target Pages to Extract Text From (leave blank for all pages, e.g., 1, 3-5)'
                    : 'Page Selection (e.g., 1, 3-5)'}
                </label>
                <input
                  type="text"
                  placeholder={toolId === 'reorder-pdf-pages' ? 'e.g. 3, 1, 2' : 'e.g. 1, 3-5 (leave empty for all)'}
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                />
              </div>
            )}

            {toolId === 'rotate-pdf' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Which pages to rotate?</label>
                  <select
                    value={rotationTarget}
                    onChange={(e) => setRotationTarget(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="all">Rotate All Pages</option>
                    <option value="specific">Rotate Specific Pages Only</option>
                  </select>
                </div>

                {rotationTarget === 'specific' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Target Page Numbers (e.g., 1, 3-5)</label>
                    <input
                      type="text"
                      placeholder="e.g., 1, 3, 5-7"
                      value={rotationPages}
                      onChange={(e) => setRotationPages(e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rotation Angle</label>
                  <select
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
                  >
                    <option value={90}>90° Clockwise</option>
                    <option value={180}>180° Turn</option>
                    <option value={270}>270° Counter-Clockwise</option>
                  </select>
                </div>
              </div>
            )}

            {['add-watermark', 'add-text-to-pdf'].includes(toolId) && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Text / Watermark Content</label>
                  <input
                    type="text"
                    placeholder="Enter text..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Font Size (px)</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full border rounded-lg p-2 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Opacity (0.1 to 1.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="1"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full border rounded-lg p-2 text-sm bg-white font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {toolId === 'crop-pdf-pages' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Margin Crop Amount (px)</label>
                <input
                  type="number"
                  placeholder="20"
                  value={cropMargin}
                  onChange={(e) => setCropMargin(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                />
              </div>
            )}
          </div>

          <button
            onClick={processPdfClient}
            disabled={isProcessing}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isProcessing ? 'Processing PDF...' : 'Execute PDF Action'}
          </button>
        </div>
      )}

      {notice && (
        <p className="text-xs text-indigo-600 bg-indigo-50 p-2.5 rounded-lg">{notice}</p>
      )}

      {downloads.length > 0 && (
        <div className="space-y-2 pt-2">
          {downloads.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              download={item.name}
              className="flex items-center justify-between w-full p-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition text-sm"
            >
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span className="truncate">{item.name}</span>
              </div>
              <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded">{formatBytes(item.size)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const UniversalCalculator = ({ toolId }) => {
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const handleInputChange = (field, val) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const calculate = () => {
    const val = (k) => Number(inputs[k]);
    const numeric = (keys) => keys.every(k => inputs[k] !== undefined && inputs[k] !== '' && Number.isFinite(Number(inputs[k])));

    switch (toolId) {
      case 'percentage-calc': {
        if (!numeric(['a', 'b'])) return;
        const a = val('a'), b = val('b');
        const mode = inputs.mode || 'X% of a number';
        if (mode === 'What percent is X of Y') {
          if (b === 0) return setResult({ error: 'Denominator cannot be zero.' });
          const res = (a / b) * 100;
          setResult({ output: `${fmt(res)}%`, note: `${fmt(a)} is this share of ${fmt(b)}.` });
        } else {
          const res = (a * b) / 100;
          setResult({ output: fmt(res), note: `${fmt(res)} is ${fmt(a)}% of ${fmt(b)}.` });
        }
        break;
      }
      case 'age-calc': {
        if (!inputs.birth || !inputs.on) return;
        const b = new Date(`${inputs.birth}T12:00:00`), d = new Date(`${inputs.on}T12:00:00`);
        if (Number.isNaN(+b) || d < b) return setResult({ error: 'Invalid date selection.' });
        let y = d.getFullYear() - b.getFullYear(), m = d.getMonth() - b.getMonth(), day = d.getDate() - b.getDate();
        if (day < 0) { m--; day += new Date(d.getFullYear(), d.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        setResult({ output: `${y} years, ${m} months, ${day} days`, note: 'Age is calculated from calendar dates, including leap years.' });
        break;
      }
      case 'bmi-calc': {
        if (!numeric(['weight', 'height']) || val('weight') <= 0 || val('height') <= 0) return;
        const isImperial = inputs.units?.startsWith('Imperial');
        const bmi = isImperial ? val('weight') * 703 / (val('height') ** 2) : val('weight') / ((val('height') / 100) ** 2);
        const note = bmi < 18.5 ? 'Below common adult reference range (18.5–24.9).' : bmi < 25 ? 'Within normal adult reference range (18.5–24.9).' : bmi < 30 ? 'Above normal adult reference range.' : 'In obesity range.';
        setResult({ output: `BMI: ${fmt(bmi)}`, note });
        break;
      }
      case 'simple-interest': {
        if (!numeric(['principal', 'rate', 'years'])) return;
        const i = val('principal') * val('rate') * val('years') / 100;
        setResult({ output: `Interest: ${fmt(i)}`, note: `Total Value: ${fmt(val('principal') + i)}` });
        break;
      }
      case 'compound-interest': {
        if (!numeric(['principal', 'rate', 'years'])) return;
        const periods = { 'Annually': 1, 'Semi-annually': 2, 'Quarterly': 4, 'Monthly': 12, 'Daily': 365 };
        const n = periods[inputs.frequency || 'Annually'];
        const total = val('principal') * (1 + val('rate') / 100 / n) ** (n * val('years'));
        setResult({ output: `Final Value: ${fmt(total)}`, note: `Total Growth: ${fmt(total - val('principal'))}` });
        break;
      }
      case 'loan-emi': {
        if (!numeric(['principal', 'rate', 'years'])) return;
        const n = val('years') * 12, r = val('rate') / 1200, p = val('principal');
        const emi = r === 0 ? p / n : p * r * (1 + r) ** n / ((1 + r) ** n - 1);
        setResult({ output: `Monthly EMI: ${fmt(emi)}`, note: `Total Repayment: ${fmt(emi * n)} over ${n} payments.` });
        break;
      }
      case 'gst-calc': {
        if (!numeric(['amount', 'rate'])) return;
        const a = val('amount'), r = val('rate') / 100;
        const isRemove = inputs.mode === 'Remove tax from total';
        const net = isRemove ? a / (1 + r) : a;
        const total = isRemove ? a : a * (1 + r);
        setResult({ output: `Total: ${fmt(total)}`, note: `Net Amount: ${fmt(net)} | Tax: ${fmt(total - net)}` });
        break;
      }
      case 'discount-calc': {
        if (!numeric(['price', 'discount'])) return;
        const save = val('price') * val('discount') / 100;
        setResult({ output: `Sale Price: ${fmt(val('price') - save)}`, note: `You save ${fmt(save)} (${fmt(val('discount'))}% off).` });
        break;
      }
      case 'profit-loss': {
        if (!numeric(['cost', 'selling'])) return;
        const diff = val('selling') - val('cost'), pct = (diff / val('cost')) * 100;
        setResult({ output: `${diff >= 0 ? 'Profit' : 'Loss'}: ${fmt(Math.abs(diff))}`, note: `${fmt(Math.abs(pct))}% ${diff >= 0 ? 'gain' : 'loss'} on cost.` });
        break;
      }
      case 'salary-calc': {
        if (!numeric(['amount', 'hours'])) return;
        const a = val('amount'), hours = val('hours');
        const period = inputs.period || 'Year';
        const annual = period === 'Month' ? a * 12 : period === 'Week' ? a * 52 : period === 'Hour' ? a * hours * 52 : a;
        setResult({ output: `Annual: ${fmt(annual)}`, note: `Monthly: ${fmt(annual / 12)} | Weekly: ${fmt(annual / 52)} | Hourly: ${fmt(annual / (hours * 52))}` });
        break;
      }
      case 'date-diff': {
        if (!inputs.start || !inputs.end) return;
        const a = new Date(`${inputs.start}T00:00:00Z`), b = new Date(`${inputs.end}T00:00:00Z`);
        const days = Math.round((b.getTime() - a.getTime()) / 86400000);
        setResult({ output: `${Math.abs(days).toLocaleString()} Days`, note: days < 0 ? 'End date is earlier than start date.' : 'Counts elapsed calendar days.' });
        break;
      }
      case 'time-duration': {
        const parseTime = (str) => {
          if (!str) return NaN;
          const trimmed = str.trim().toUpperCase();
          const isPm = trimmed.includes('PM');
          const isAm = trimmed.includes('AM');
          const cleanStr = trimmed.replace(/[A-Z]/g, '').trim();
          const match = cleanStr.match(/^(\d{1,2}):(\d{2})$/);
          if (!match) return NaN;
          let hrs = parseInt(match[1], 10);
          const mins = parseInt(match[2], 10);
          if (hrs < 0 || hrs > 23 || mins < 0 || mins > 59) return NaN;
          if (isPm && hrs < 12) hrs += 12;
          if (isAm && hrs === 12) hrs = 0;
          return hrs * 60 + mins;
        };

        let startMins = parseTime(inputs.start);
        let endMins = parseTime(inputs.end);

        if (!Number.isFinite(startMins) || !Number.isFinite(endMins)) {
          return setResult({ error: 'Please enter valid times (e.g., "09:30 AM" or "17:15").' });
        }

        if (endMins < startMins) endMins += 1440;
        const diff = endMins - startMins;
        const hrs = Math.floor(diff / 60);
        const mins = diff % 60;

        setResult({ 
          output: `${hrs} hr ${mins} min`, 
          note: `Total elapsed time: ${fmt(diff / 60)} hours.` 
        });
        break;
      }
      case 'average-calc': {
        const ns = (inputs.numbers || '').split(/[,\s]+/).filter(Boolean).map(Number);
        if (!ns.length || ns.some(n => !Number.isFinite(n))) return;
        const mean = ns.reduce((x, y) => x + y, 0) / ns.length;
        setResult({ output: `Mean: ${fmt(mean)}`, note: `From ${ns.length} values; Sum: ${fmt(ns.reduce((x, y) => x + y, 0))}` });
        break;
      }
      case 'ratio-calc': {
        if (!numeric(['a', 'b'])) return;
        const gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);
        const g = gcd(val('a'), val('b'));
        setResult({ output: `Simplified Ratio: ${val('a') / g} : ${val('b') / g}`, note: `First share: ${fmt((val('a') / (val('a') + val('b'))) * 100)}% of total.` });
        break;
      }
      case 'fraction-calc': {
        if (!numeric(['numerator', 'denominator']) || val('denominator') === 0) return;
        const gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);
        const g = gcd(val('numerator'), val('denominator'));
        const sign = val('denominator') < 0 ? -1 : 1;
        setResult({ output: `Simplified Fraction: ${(val('numerator') / g) * sign} / ${Math.abs(val('denominator') / g)}`, note: `Decimal value: ${fmt(val('numerator') / val('denominator'))}` });
        break;
      }
      case 'scientific-calc': {
        if (!numeric(['x'])) return;
        const x = val('x');
        const y = inputs.y !== undefined && inputs.y !== '' ? val('y') : 1;
        const op = inputs.operation || 'Square root';
        let n;

        switch (op) {
          case 'Square root': n = x >= 0 ? Math.sqrt(x) : NaN; break;
          case 'Square': n = x * x; break;
          case 'Cube': n = x ** 3; break;
          case 'Sine (degrees)': n = Math.sin((x * Math.PI) / 180); break;
          case 'Cosine (degrees)': n = Math.cos((x * Math.PI) / 180); break;
          case 'Tangent (degrees)': n = Math.tan((x * Math.PI) / 180); break;
          case 'Natural log': n = x > 0 ? Math.log(x) : NaN; break;
          case 'Log base 10': n = x > 0 ? Math.log10(x) : NaN; break;
          case 'Power (xʸ)': n = x ** y; break;
          default: n = Math.sqrt(x);
        }

        if (!Number.isFinite(n)) {
          return setResult({ error: 'Invalid mathematical operation for the provided value.' });
        }

        setResult({ output: fmt(n), note: `Operation: ${op}` });
        break;
      }
      case 'basic-calc': {
        if (!numeric(['a', 'b'])) return;
        const a = val('a'), b = val('b');
        const op = inputs.operation || 'Add (+)';
        if (op.includes('Divide') && b === 0) return setResult({ error: 'Cannot divide by zero.' });
        const res = op.includes('Subtract') ? a - b : op.includes('Multiply') ? a * b : op.includes('Divide') ? a / b : a + b;
        setResult({ output: fmt(res), note: `Calculation: ${a} ${op.match(/\((.)\)/)?.[1] || '+'} ${b}` });
        break;
      }
      case 'hcf-lcm': {
        const ns = (inputs.numbers || '')
          .split(/[,\s]+/)
          .filter(Boolean)
          .map(Number);

        if (!ns.length || ns.some(n => !Number.isFinite(n) || n <= 0 || !Number.isInteger(n))) {
          return setResult({ error: 'Please enter valid positive integers separated by commas.' });
        }

        const gcdTwo = (x, y) => (y === 0 ? Math.abs(x) : gcdTwo(y, x % y));
        const lcmTwo = (x, y) => (x * y) / gcdTwo(x, y);

        const overallHCF = ns.reduce((acc, curr) => gcdTwo(acc, curr));
        const overallLCM = ns.reduce((acc, curr) => lcmTwo(acc, curr));

        setResult({
          output: `HCF (GCD): ${overallHCF}`,
          note: `LCM: ${fmt(overallLCM)} | Calculated for ${ns.length} numbers: (${ns.join(', ')})`
        });
        break;
      }
      case 'unit-price': {
        if (!numeric(['price', 'quantity']) || val('quantity') <= 0) return;
        setResult({ output: `${fmt(val('price') / val('quantity'))} per ${inputs.unit || 'unit'}`, note: `${fmt(val('quantity'))} ${inputs.unit || 'units'} in pack.` });
        break;
      }
      case 'savings-goal': {
        if (!numeric(['goal', 'months']) || val('months') <= 0) return;
        const current = inputs.current !== undefined && inputs.current !== '' ? val('current') : 0;
        const goal = val('goal');
        const months = val('months');

        const remaining = Math.max(0, goal - current);
        const monthlyNeeded = remaining / months;

        setResult({
          output: `${fmt(monthlyNeeded)} per month`,
          note: remaining === 0 
            ? 'Goal already reached!' 
            : `Total remaining to save: ${fmt(remaining)} over ${months} months.`
        });
        break;
      }
      default: {
        setResult({ output: 'Calculator executed.' });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-lg capitalize">{toolId.replace('-', ' ')}</h3>

      {toolId === 'percentage-calc' && (
        <div className="space-y-3">
          <select onChange={(e) => handleInputChange('mode', e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-white">
            <option>X% of a number</option>
            <option>What percent is X of Y</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Value A (18)" onChange={(e) => handleInputChange('a', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
            <input type="number" placeholder="Value B (240)" onChange={(e) => handleInputChange('b', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          </div>
        </div>
      )}

      {toolId === 'age-calc' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
            <input type="date" onChange={(e) => handleInputChange('birth', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Age On Date</label>
            <input type="date" onChange={(e) => handleInputChange('on', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
          </div>
        </div>
      )}

      {toolId === 'bmi-calc' && (
        <div className="space-y-3">
          <select onChange={(e) => handleInputChange('units', e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-white">
            <option>Metric (kg, cm)</option>
            <option>Imperial (lb, in)</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Weight" onChange={(e) => handleInputChange('weight', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
            <input type="number" placeholder="Height" onChange={(e) => handleInputChange('height', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          </div>
        </div>
      )}

      {['simple-interest', 'compound-interest', 'loan-emi'].includes(toolId) && (
        <div className="grid grid-cols-3 gap-3">
          <input type="number" placeholder="Principal ($)" onChange={(e) => handleInputChange('principal', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Annual Rate (%)" onChange={(e) => handleInputChange('rate', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Years" onChange={(e) => handleInputChange('years', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
        </div>
      )}

      {toolId === 'gst-calc' && (
        <div className="space-y-3">
          <select onChange={(e) => handleInputChange('mode', e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-white">
            <option>Add tax to amount</option>
            <option>Remove tax from total</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Amount ($)" onChange={(e) => handleInputChange('amount', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
            <input type="number" placeholder="Tax Rate (%)" onChange={(e) => handleInputChange('rate', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          </div>
        </div>
      )}

      {toolId === 'discount-calc' && (
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Original Price ($)" onChange={(e) => handleInputChange('price', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Discount (%)" onChange={(e) => handleInputChange('discount', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
        </div>
      )}

      {toolId === 'profit-loss' && (
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Cost Price ($)" onChange={(e) => handleInputChange('cost', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Selling Price ($)" onChange={(e) => handleInputChange('selling', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
        </div>
      )}

      {toolId === 'salary-calc' && (
        <div className="space-y-3">
          <select onChange={(e) => handleInputChange('period', e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-white">
            <option>Year</option>
            <option>Month</option>
            <option>Week</option>
            <option>Hour</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Gross Salary ($)" onChange={(e) => handleInputChange('amount', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
            <input type="number" placeholder="Hours per week (e.g. 40)" onChange={(e) => handleInputChange('hours', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          </div>
        </div>
      )}

      {toolId === 'date-diff' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
            <input type="date" onChange={(e) => handleInputChange('start', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
            <input type="date" onChange={(e) => handleInputChange('end', e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
          </div>
        </div>
      )}

      {toolId === 'time-duration' && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Format: <strong>09:30 AM</strong>, <strong>05:15 PM</strong>, or <strong>17:15</strong> (24-hour format)</p>
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="text" 
              placeholder="Start Time (e.g., 09:30 AM)" 
              onChange={(e) => handleInputChange('start', e.target.value)} 
              className="border rounded-lg p-2.5 text-sm" 
            />
            <input 
              type="text" 
              placeholder="End Time (e.g., 05:15 PM)" 
              onChange={(e) => handleInputChange('end', e.target.value)} 
              className="border rounded-lg p-2.5 text-sm" 
            />
          </div>
        </div>
      )}

      {toolId === 'average-calc' && (
        <input type="text" placeholder="Numbers separated by commas (12, 18, 24)" onChange={(e) => handleInputChange('numbers', e.target.value)} className="w-full border rounded-lg p-2.5 text-sm" />
      )}

      {toolId === 'fraction-calc' && (
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Numerator" onChange={(e) => handleInputChange('numerator', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Denominator" onChange={(e) => handleInputChange('denominator', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
        </div>
      )}

      {toolId === 'scientific-calc' && (
        <div className="space-y-3">
          <select onChange={(e) => handleInputChange('operation', e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-white">
            <option>Square root</option>
            <option>Square</option>
            <option>Cube</option>
            <option>Sine (degrees)</option>
            <option>Cosine (degrees)</option>
            <option>Tangent (degrees)</option>
            <option>Natural log</option>
            <option>Log base 10</option>
            <option>Power (xʸ)</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Value X" onChange={(e) => handleInputChange('x', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
            <input type="number" placeholder="Value Y (only for Power xʸ)" onChange={(e) => handleInputChange('y', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          </div>
        </div>
      )}

      {toolId === 'basic-calc' && (
        <div className="space-y-3">
          <select onChange={(e) => handleInputChange('operation', e.target.value)} className="w-full border rounded-lg p-2.5 text-sm bg-white">
            <option>Add (+)</option>
            <option>Subtract (−)</option>
            <option>Multiply (×)</option>
            <option>Divide (÷)</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="First Number" onChange={(e) => handleInputChange('a', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
            <input type="number" placeholder="Second Number" onChange={(e) => handleInputChange('b', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          </div>
        </div>
      )}

      {toolId === 'hcf-lcm' && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-600">
            Enter integers separated by commas
          </label>
          <input 
            type="text" 
            placeholder="e.g., 12, 18, 24, 36" 
            onChange={(e) => handleInputChange('numbers', e.target.value)} 
            className="w-full border rounded-lg p-2.5 text-sm" 
          />
        </div>
      )}

      {toolId === 'savings-goal' && (
        <div className="grid grid-cols-3 gap-3">
          <input type="number" placeholder="Goal ($)" onChange={(e) => handleInputChange('goal', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Already Saved ($)" onChange={(e) => handleInputChange('current', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Months" onChange={(e) => handleInputChange('months', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
        </div>
      )}

      {toolId === 'unit-price' && (
        <div className="grid grid-cols-3 gap-3">
          <input type="number" placeholder="Pack Price ($)" onChange={(e) => handleInputChange('price', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Quantity" onChange={(e) => handleInputChange('quantity', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="text" placeholder="Unit (g, ml)" onChange={(e) => handleInputChange('unit', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
        </div>
      )}

      {toolId === 'ratio-calc' && (
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="First Amount" onChange={(e) => handleInputChange('a', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
          <input type="number" placeholder="Second Amount" onChange={(e) => handleInputChange('b', e.target.value)} className="border rounded-lg p-2.5 text-sm" />
        </div>
      )}

      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
        Calculate Result
      </button>

      {result && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
          {result.error ? (
            <p className="text-red-600 font-medium text-sm">{result.error}</p>
          ) : (
            <>
              <p className="text-indigo-900 font-bold text-lg">{result.output}</p>
              {result.note && <p className="text-indigo-700 text-xs">{result.note}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const UniversalConverter = ({ toolId }) => {
  const toolObj = TOOLS.find(t => t.id === toolId);
  const rawSlug = toolObj?.rawSlug || toolId.replace('-conv', '');
  const units = toolObj?.units || [];

  const [val, setVal] = useState('1');
  const [fromUnit, setFromUnit] = useState(units[0]?.[0] || '');
  const [toUnit, setToUnit] = useState(units[1]?.[0] || units[0]?.[0] || '');

  const result = convertUnits(rawSlug, val, fromUnit, toUnit);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
      <h3 className="font-bold text-gray-900 text-lg capitalize">{toolObj?.name || toolId.replace('-', ' ')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Value</label>
          <input
            type={rawSlug === 'number-system' ? 'text' : 'number'}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm bg-white"
          >
            {units.map(([u]) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm bg-white"
          >
            {units.map(([u]) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
        <span className="text-xs text-indigo-600 uppercase font-bold tracking-wider">Converted Output</span>
        <p className="text-3xl font-extrabold text-indigo-900 mt-1">
          {result || '—'} <span className="text-lg font-medium">{toUnit}</span>
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeToolId, setActiveToolId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [recentTools, setRecentTools] = useState([]);
  const [page, setPage] = useState('app');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectTool = (id) => {
    setActiveToolId(id);
    setPage('app');
    if (!recentTools.includes(id)) {
      setRecentTools((prev) => [id, ...prev.slice(0, 4)]);
    }
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentToolObj = TOOLS.find((t) => t.id === activeToolId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => { setActiveToolId(null); setPage('app'); }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              T
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">ToolHub</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full ml-2">
                Unified Tools
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <button onClick={() => { setActiveToolId(null); setPage('app'); setActiveCategory('all'); }} className="hover:text-indigo-600">All Tools</button>
            <button onClick={() => { setActiveToolId(null); setPage('app'); setActiveCategory('image'); }} className="hover:text-indigo-600">Image Tools</button>
            <button onClick={() => { setActiveToolId(null); setPage('app'); setActiveCategory('pdf'); }} className="hover:text-indigo-600">PDF Tools</button>
            <button onClick={() => { setActiveToolId(null); setPage('app'); setActiveCategory('converters'); }} className="hover:text-indigo-600">Converters</button>
            <button onClick={() => { setActiveToolId(null); setPage('app'); setActiveCategory('calculators'); }} className="hover:text-indigo-600">Calculators</button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page === 'app' && (
          <>
            {!activeToolId && (
              <div className="text-center py-8 space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  Every Online Tool You Need, <span className="text-indigo-600">Free & Private</span>
                </h1>
                <p className="text-slate-600 text-base sm:text-lg">
                  Unified image format converter, PDF processors, unit converters, and calculators. 100% Client-side processing.
                </p>

                <div className="relative max-w-xl mx-auto pt-2">
                  <Search className="absolute left-4 top-6 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tools (e.g., format converter, compress image, convert pdf, bmi)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-base"
                  />
                </div>
              </div>
            )}

            {activeToolId && (
              <div className="mb-6 flex items-center space-x-2 text-sm text-slate-500">
                <button onClick={() => setActiveToolId(null)} className="hover:text-indigo-600">Home</button>
                <ChevronRight className="w-4 h-4" />
                <span className="capitalize">{currentToolObj?.category}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold text-slate-900">{currentToolObj?.name}</span>
              </div>
            )}

            {activeToolId ? (
              <div className="space-y-6">
                <button
                  onClick={() => setActiveToolId(null)}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All Tools</span>
                </button>

                {currentToolObj?.category === 'image' ? (
                  <AdvancedCompressImage toolId={activeToolId} />
                ) : currentToolObj?.category === 'calculators' ? (
                  <UniversalCalculator toolId={activeToolId} />
                ) : currentToolObj?.category === 'converters' ? (
                  <UniversalConverter toolId={activeToolId} />
                ) : (
                  <PdfToolEngine toolId={activeToolId} />
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-center space-x-2 border-b border-slate-200 pb-4 overflow-x-auto">
                  {[
                    { id: 'all', label: 'All Tools' },
                    { id: 'image', label: 'Image Tools' },
                    { id: 'pdf', label: 'PDF Tools' },
                    { id: 'converters', label: 'Unit Converters' },
                    { id: 'calculators', label: 'Calculators' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                        activeCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => selectTool(tool.id)}
                      className="group bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition cursor-pointer relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                            <IconRenderer name={tool.icon} />
                          </div>
                          <button
                            onClick={(e) => toggleFavorite(e, tool.id)}
                            className="text-slate-300 hover:text-amber-400"
                          >
                            <Star className={`w-5 h-5 ${favorites.includes(tool.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                        <span>Open Tool</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {page === 'about' && (
          <div className="bg-white p-8 rounded-2xl border max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">About ToolHub</h2>
            <p className="text-slate-600 leading-relaxed">
              ToolHub is a modern, privacy-first online multi-tool suite designed to perform image conversion, document editing, unit conversions, and calculations directly inside your browser. No files are ever stored on external servers.
            </p>
          </div>
        )}

        {page === 'privacy' && (
          <div className="bg-white p-8 rounded-2xl border max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold">Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              Your privacy is guaranteed. All PDF processing, image compression, calculations, and conversions happen locally on your client device using browser Canvas APIs and WebAssembly.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center space-x-6 text-sm text-slate-500 font-medium">
            <button onClick={() => setPage('about')} className="hover:text-indigo-600">About</button>
            <button onClick={() => setPage('privacy')} className="hover:text-indigo-600">Privacy Policy</button>
            <button onClick={() => setPage('terms')} className="hover:text-indigo-600">Terms of Use</button>
            <button onClick={() => setPage('contact')} className="hover:text-indigo-600">Contact</button>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} ToolHub Web Application. All rights reserved. Client-side Processing Architecture.
          </p>
        </div>
      </footer>
    </div>
  );
}
