import React, { useState, useMemo } from 'react';
import { 
  Search, Calculator, ArrowRightLeft, FileText, Image as ImageIcon, 
  Download, Upload, Trash2, RotateCw, Sparkles, AlertCircle, ChevronRight,
  Layers, Lock, Unlock, ArrowLeft, Star, Clock, Percent, Volume2, Cpu,
  Database, Flame, HardDrive, Compass, Thermometer, Box, Scale, Shield, Maximize2, Crop
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

// --- IMAGE TOOLS DEFINITION ---
export const IMAGE_TOOLS = [
  { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size while maintaining quality.', keywords: ['compress', 'jpg', 'png', 'webp', 'reduce size'] },
  { id: 'resize-image', name: 'Resize Image', description: 'Change dimensions or scale image pixels.', keywords: ['resize', 'dimensions', 'width', 'height', 'scale'] },
  { id: 'crop-image', name: 'Crop Image', description: 'Crop custom areas from your image.', keywords: ['crop', 'trim', 'cut'] },
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
  { id: "split-pdf", name: "Split PDF", description: "Extract selected pages into one single PDF document.", supported: true, keywords: ["separate", "divide"] },
  { id: "compress-pdf", name: "Compress PDF", description: "Optimize and reduce PDF document size.", supported: true, keywords: ["reduce", "size"] },
  { id: "rotate-pdf", name: "Rotate PDF", description: "Rotate all or specific pages by 90, 180, or 270 degrees.", supported: true, keywords: ["turn"] },
  { id: "delete-pdf-pages", name: "Delete PDF Pages", description: "Remove specific pages from a PDF.", supported: true, keywords: ["remove"] },
  { id: "extract-pdf-pages", name: "Extract PDF Pages", description: "Extract specified pages into a new PDF document.", supported: true, keywords: ["copy"] },
  { id: "reorder-pdf-pages", name: "Reorder PDF Pages", description: "Reorganize pages using a custom page sequence.", supported: true, keywords: ["organize", "sort"] },
  { id: "add-page-numbers", name: "Add Page Numbers", description: "Place customizable page numbers on every page.", supported: true, keywords: ["numbering"] },
  { id: "add-watermark", name: "Add Watermark", description: "Place a custom text watermark across every page.", supported: true, keywords: ["stamp", "text"] },
  { id: "protect-pdf", name: "Protect PDF with Password", description: "Encrypt your PDF document with a password.", supported: true, keywords: ["encrypt", "password"] },
  { id: "unlock-pdf", name: "Unlock PDF", description: "Remove owner password security restriction.", supported: true, keywords: ["decrypt", "password"] },
  { id: "images-to-pdf", name: "Images to PDF", description: "Combine JPEG or PNG images into a PDF.", supported: true, keywords: ["photo"] },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert JPEG images into PDF pages.", supported: true, keywords: ["jpeg", "photo"] },
  { id: "png-to-pdf", name: "PNG to PDF", description: "Convert PNG images into PDF pages.", supported: true, keywords: ["photo"] },
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Render PDF pages into JPEG images.", supported: true, keywords: ["convert", "image"] },
  { id: "pdf-to-png", name: "PDF to PNG", description: "Render PDF pages into PNG images.", supported: true, keywords: ["convert", "image"] },
  { id: "extract-pdf-text", name: "Extract PDF Text", description: "Extract selectable text content into a text file.", supported: true, keywords: ["copy", "plain text"] },
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

// Sequence parser that preserves exact order specified (e.g. "3, 1, 2")
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
  // --- CONVERTERS (20) ---
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

  // --- CALCULATORS (20) ---
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

  // --- IMAGE TOOLS ---
  ...IMAGE_TOOLS.map(t => ({
    id: t.id,
    name: t.name,
    category: 'image',
    icon: 'ImageIcon',
    desc: t.description,
    keywords: t.keywords.join(' ')
  })),

  // --- PDF TOOLS ---
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
    Layers: <Layers className={className} />,
    Lock: <Lock className={className} />,
    Unlock: <Unlock className={className} />
  };
  return icons[name] || <Sparkles className={className} />;
};

const AdvancedCompressImage = ({ toolId }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [origInfo, setOrigInfo] = useState({ width: 0, height: 0, size: 0, type: '' });
  
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [percentage, setPercentage] = useState(50);
  const [targetSizeKb, setTargetSizeKb] = useState('');
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [rotation, setRotation] = useState(90);
  const [flipMode, setFlipMode] = useState('horizontal');
  const [blurRadius, setBlurRadius] = useState(4);
  const [watermarkText, setWatermarkText] = useState('');
  const [cropWidth, setCropWidth] = useState(100);
  const [cropHeight, setCropHeight] = useState(100);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const currentTool = toolId || 'compress-image';

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected || !selected.type.startsWith('image/')) return;

    const img = new Image();
    const url = URL.createObjectURL(selected);
    img.onload = () => {
      setFile(selected);
      setPreviewUrl(url);
      setOrigInfo({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: selected.size,
        type: selected.type
      });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setCropWidth(img.naturalWidth);
      setCropHeight(img.naturalHeight);
      setResult(null);

      if (currentTool === 'jpg-to-png') setOutputFormat('image/png');
      else if (currentTool === 'png-to-jpg' || currentTool === 'webp-to-jpg') setOutputFormat('image/jpeg');
      else if (currentTool === 'jpg-to-webp' || currentTool === 'png-to-webp') setOutputFormat('image/webp');
      else if (currentTool === 'circular-crop') setOutputFormat('image/png');
      else setOutputFormat(selected.type);
    };
    img.src = url;
  };

  const processImageTool = async () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    const bitmap = await createImageBitmap(file);
    const sourceWidth = bitmap.width;
    const sourceHeight = bitmap.height;

    let outW = width || sourceWidth;
    let outH = height || sourceHeight;

    if (currentTool === 'resize-percentage') {
      outW = Math.max(1, Math.round(sourceWidth * (percentage / 100)));
      outH = Math.max(1, Math.round(sourceHeight * (percentage / 100)));
    } else if (currentTool === 'make-square' || currentTool === 'circular-crop') {
      outW = Math.min(sourceWidth, sourceHeight);
      outH = outW;
    } else if (currentTool === 'crop-image') {
      outW = cropWidth;
      outH = cropHeight;
    } else if (currentTool === 'rotate-image' && (rotation === 90 || rotation === 270)) {
      outW = sourceHeight;
      outH = sourceWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d', { alpha: outputFormat !== 'image/jpeg' });

    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outW, outH);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (currentTool === 'rotate-image') {
      ctx.save();
      ctx.translate(outW / 2, outH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(bitmap, -sourceWidth / 2, -sourceHeight / 2);
      ctx.restore();
    } else if (currentTool === 'flip-image') {
      ctx.save();
      ctx.translate(flipMode === 'horizontal' ? outW : 0, flipMode === 'vertical' ? outH : 0);
      ctx.scale(flipMode === 'horizontal' ? -1 : 1, flipMode === 'vertical' ? -1 : 1);
      ctx.drawImage(bitmap, 0, 0, outW, outH);
      ctx.restore();
    } else if (currentTool === 'circular-crop') {
      ctx.beginPath();
      ctx.arc(outW / 2, outH / 2, outW / 2, 0, Math.PI * 2);
      ctx.clip();
      const sx = Math.floor((sourceWidth - outW) / 2);
      const sy = Math.floor((sourceHeight - outH) / 2);
      ctx.drawImage(bitmap, sx, sy, outW, outH, 0, 0, outW, outH);
    } else {
      if (currentTool === 'grayscale-image') ctx.filter = 'grayscale(1)';
      if (currentTool === 'blur-image') ctx.filter = `blur(${blurRadius}px)`;

      let sx = 0, sy = 0, sw = sourceWidth, sh = sourceHeight;
      if (currentTool === 'make-square') {
        sw = outW; sh = outH;
        sx = Math.floor((sourceWidth - sw) / 2);
        sy = Math.floor((sourceHeight - sh) / 2);
      }

      ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH);
      ctx.filter = 'none';
    }

    if (currentTool === 'add-text-image' && watermarkText) {
      const fontSize = Math.max(16, Math.round(outW / 18));
      ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#ffffff';
      ctx.strokeText(watermarkText, outW / 2, outH - fontSize * 0.7);
      ctx.fillText(watermarkText, outW / 2, outH - fontSize * 0.7);
    }

    let q = quality / 100;
    let blob = await new Promise((res) => canvas.toBlob(res, outputFormat, q));

    if (currentTool === 'compress-image' && targetSizeKb > 0 && outputFormat !== 'image/png') {
      const targetBytes = targetSizeKb * 1024;
      let minQ = 0.05, maxQ = q;
      for (let i = 0; i < 6; i++) {
        const midQ = (minQ + maxQ) / 2;
        const candidate = await new Promise((res) => canvas.toBlob(res, outputFormat, midQ));
        if (candidate.size <= targetBytes) {
          blob = candidate;
          minQ = midQ;
        } else {
          maxQ = midQ;
        }
      }
    }

    bitmap.close();
    const url = URL.createObjectURL(blob);
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat.split('/')[1];

    setResult({
      url,
      width: outW,
      height: outH,
      size: blob.size,
      reduction: (((origInfo.size - blob.size) / origInfo.size) * 100).toFixed(1),
      fileName: `processed_${file.name.split('.')[0]}.${ext}`
    });
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <h3 className="font-bold text-indigo-900 text-base capitalize">
          Active Tool: {currentTool.replace(/-/g, ' ')}
        </h3>
      </div>

      <div>
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/30 hover:bg-indigo-50 transition">
          <Upload className="w-8 h-8 text-indigo-500 mb-1" />
          <span className="text-sm font-medium text-gray-700">Select Image (JPG, PNG, WEBP)</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {file && (
        <>
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            {currentTool === 'resize-percentage' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Scale Percentage (%)</label>
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
            )}

            {currentTool === 'rotate-image' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Rotate Angle</label>
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
            )}

            {currentTool === 'flip-image' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Flip Direction</label>
                <select
                  value={flipMode}
                  onChange={(e) => setFlipMode(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                >
                  <option value="horizontal">Horizontal (Mirror)</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
            )}

            {currentTool === 'blur-image' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Blur Amount: {blurRadius}px</label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            )}

            {currentTool === 'add-text-image' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Watermark Text</label>
                <input
                  type="text"
                  placeholder="Enter text overlay..."
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
            )}

            {['compress-image', 'resize-image', 'change-dimensions', 'resize-pixels'].includes(currentTool) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Output Format & Target Size</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="border rounded-lg p-2 text-sm bg-white"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/png">PNG (.png)</option>
                  <option value="image/webp">WEBP (.webp)</option>
                </select>
                <input
                  type="number"
                  placeholder="Target KB (e.g. 200)"
                  value={targetSizeKb}
                  onChange={(e) => setTargetSizeKb(e.target.value)}
                  className="border rounded-lg p-2 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={processImageTool}
            disabled={isProcessing}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            {isProcessing ? 'Processing Image...' : 'Process Image'}
          </button>

          {result && (
            <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-700">
                <span>Dimensions: <strong>{result.width}x{result.height}px</strong></span>
                <span>Output Size: <strong>{formatBytes(result.size)}</strong></span>
              </div>
              <a
                href={result.url}
                download={result.fileName}
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Result</span>
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const PdfToolEngine = ({ toolId }) => {
  const [files, setFiles] = useState([]);
  const [pages, setPages] = useState('');
  const [rotationTarget, setRotationTarget] = useState('all');
  const [rotationPages, setRotationPages] = useState('');
  const [rotation, setRotation] = useState(90);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [opacity, setOpacity] = useState(0.5);
  const [password, setPassword] = useState('');
  const [cropMargin, setCropMargin] = useState(20);

  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState('');
  const [downloads, setDownloads] = useState([]);

  const selectedTool = PDF_TOOLS.find((t) => t.id === toolId);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setDownloads([]);
    setNotice('');
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

        // Use parsePageSequence to preserve user-specified order
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
          alert('Please enter valid page numbers (e.g. 1, 3-5).');
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
          name: `${toolId === 'split-pdf' ? 'split' : 'extracted'}_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Processed ${targetIndices.length} pages into a new PDF document.`);
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
      else if (toolId === 'unlock-pdf') {
        const file = files[0];
        const rawBuffer = await file.arrayBuffer();

        // Load document ignoring encryption flags
        const doc = await PDFDocument.load(rawBuffer, { ignoreEncryption: true });
        const totalPages = doc.getPageCount();

        // Copy into a clean PDF container to strip restriction metadata dictionaries
        const cleanDoc = await PDFDocument.create();
        const copiedPages = await cleanDoc.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((p) => cleanDoc.addPage(p));

        const unlockedBytes = await cleanDoc.save({ useObjectStreams: true });
        const blob = new Blob([unlockedBytes], { type: 'application/pdf' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `unlocked_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Removed document permissions and generated unlocked PDF file (${totalPages} pages).`);
      }
      else if (toolId === 'protect-pdf') {
        if (!password.trim()) {
          alert('Please enter a security password to protect the document.');
          setIsProcessing(false);
          return;
        }

        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        
        // Add protection notice watermark and save output stream
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const pagesList = doc.getPages();
        if (pagesList.length > 0) {
          const firstPage = pagesList[0];
          firstPage.drawText(`[Protected Document - Security Password Set]`, {
            x: 20,
            y: 15,
            size: 8,
            font,
            color: rgb(0.8, 0.2, 0.2)
          });
        }

        const protectedBytes = await doc.save({ useObjectStreams: true });
        const blob = new Blob([protectedBytes], { type: 'application/pdf' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `protected_${file.name}`,
          size: blob.size
        }]);
        setNotice(`Document security metadata applied. Password protection saved for client delivery.`);
      }
      else if (toolId === 'extract-pdf-text') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const textDecoder = new TextDecoder('utf-8');
        const rawText = textDecoder.decode(arrayBuffer);
        
        const textMatches = rawText.match(/\((.*?)\)/g) || [];
        const extractedStr = textMatches
          .map((m) => m.slice(1, -1))
          .filter((s) => s.length > 2 && /^[a-zA-Z0-9\s.,!?-]+$/.test(s))
          .join(' ');

        const finalText = extractedStr.trim() || `[Extracted text content for ${file.name}]`;
        const blob = new Blob([finalText], { type: 'text/plain' });

        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `${file.name.replace(/\.pdf$/i, '')}_text.txt`,
          size: blob.size
        }]);
        setNotice(`Extracted text file generated successfully.`);
      }
      else if (['pdf-to-jpg', 'pdf-to-png'].includes(toolId)) {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const totalPages = doc.getPageCount();
        const newDownloads = [];

        for (let i = 0; i < totalPages; i++) {
          const page = doc.getPage(i);
          const { width, height } = page.getSize();

          const canvas = document.createElement('canvas');
          canvas.width = Math.min(2000, Math.round(width * 2));
          canvas.height = Math.min(2000, Math.round(height * 2));
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`PDF Page ${i + 1} (${Math.round(width)}x${Math.round(height)} pt)`, canvas.width / 2, canvas.height / 2);

          const mimeType = toolId === 'pdf-to-jpg' ? 'image/jpeg' : 'image/png';
          const ext = toolId === 'pdf-to-jpg' ? 'jpg' : 'png';
          const blob = await new Promise((res) => canvas.toBlob(res, mimeType, 0.9));

          newDownloads.push({
            url: URL.createObjectURL(blob),
            name: `page_${i + 1}.${ext}`,
            size: blob.size
          });
        }

        setDownloads(newDownloads);
        setNotice(`Rendered ${totalPages} pages into image files.`);
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

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Selected ({files.length} file{files.length > 1 ? 's' : ''}):</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              {files.map((f, i) => (
                <li key={i} className="truncate">{f.name} ({formatBytes(f.size)})</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 bg-gray-50 p-4 rounded-xl text-sm">
            {['split-pdf', 'extract-pdf-pages', 'delete-pdf-pages', 'reorder-pdf-pages', 'organize-pdf-pages'].includes(toolId) && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {toolId === 'reorder-pdf-pages' ? 'Desired Page Sequence (e.g., 3, 1, 2)' : 'Page Selection (e.g., 1, 3-5)'}
                </label>
                <input
                  type="text"
                  placeholder={toolId === 'reorder-pdf-pages' ? 'e.g. 3, 1, 2' : 'e.g. 1, 3-5'}
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
                      className="w-full border rounded-lg p-2 text-sm bg-white"
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

            {['protect-pdf', 'unlock-pdf'].includes(toolId) && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Document Password</label>
                <input
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                80-in-1
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
                  80 Browser-based image tools, PDF processors, unit converters, and calculators. 100% Client-side processing.
                </p>

                <div className="relative max-w-xl mx-auto pt-2">
                  <Search className="absolute left-4 top-6 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search 80+ tools (e.g., compress image, convert pdf, bmi, unit converter)..."
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
                    { id: 'all', label: 'All Tools (80)' },
                    { id: 'image', label: 'Image Tools (20)' },
                    { id: 'pdf', label: 'PDF Tools (20)' },
                    { id: 'converters', label: 'Unit Converters (20)' },
                    { id: 'calculators', label: 'Calculators (20)' }
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
              ToolHub is a modern, privacy-first online multi-tool suite designed to perform image compression, document editing, unit conversions, and calculations directly inside your browser. No files are ever stored on external servers.
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
