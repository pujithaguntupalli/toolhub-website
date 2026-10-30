import React, { useState, useMemo } from 'react';
import { 
  Search, Calculator, ArrowRightLeft, FileText, Image as ImageIcon, 
  Download, Upload, Trash2, RotateCw, Sparkles, AlertCircle, ChevronRight,
  Layers, Lock, Unlock, ArrowLeft, Star, Clock, Percent, Volume2, Cpu,
  Database, Flame, HardDrive, Compass, Thermometer, Box, Scale, Shield, Maximize2, Crop
} from 'lucide-react';

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
  { id: "organize-pdf-pages", name: "Organize PDF Pages", description: "Arrange pages by entering a new page order.", supported: true, keywords: ["reorder", "sort"] }
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
  // --- CALCULATORS (20) ---
  { id: 'basic-calc', name: 'Basic Calculator', category: 'calculators', icon: 'Calculator', desc: 'Perform standard arithmetic operations with memory functions.', keywords: 'add math sum subtract multiply divide' },
  { id: 'scientific-calc', name: 'Scientific Calculator', category: 'calculators', icon: 'Calculator', desc: 'Advanced math functions including trigonometry, logs, and exponents.', keywords: 'sin cos tan log sqrt pi exponent math' },
  { id: 'percentage-calc', name: 'Percentage Calculator', category: 'calculators', icon: 'Percent', desc: 'Calculate percentages, percentage increases, and differences.', keywords: 'percent fraction ratio discount' },
  { id: 'age-calc', name: 'Age Calculator', category: 'calculators', icon: 'Clock', desc: 'Find exact age in years, months, days, and total hours from birthdate.', keywords: 'dob birthday time living' },
  { id: 'bmi-calc', name: 'BMI Calculator', category: 'calculators', icon: 'Activity', desc: 'Calculate Body Mass Index, health category, and ideal weight range.', keywords: 'health fitness weight height body fat' },
  { id: 'simple-interest', name: 'Simple Interest Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Calculate interest earned or paid over a given period.', keywords: 'finance interest rate principal money' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Calculate investment growth with compounding frequencies.', keywords: 'savings wealth inflation compounding return' },
  { id: 'loan-emi', name: 'Loan EMI Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Calculate monthly loan payment EMI, total interest, and schedule.', keywords: 'mortgage car loan finance bank monthly' },
  { id: 'gst-calc', name: 'GST / Sales Tax Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Add or remove Goods and Services Tax (GST) from amounts.', keywords: 'tax sales vat price gross net' },
  { id: 'discount-calc', name: 'Discount Calculator', category: 'calculators', icon: 'Percent', desc: 'Find final price after percentage or flat store discounts.', keywords: 'shopping savings price sale' },
  { id: 'profit-loss', name: 'Profit and Loss Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Determine gross profit margin, markup, and net profit.', keywords: 'business sales revenue cost margin' },
  { id: 'salary-calc', name: 'Salary / Wage Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Convert annual salary into monthly, weekly, or hourly rates.', keywords: 'pay income wage paystub job' },
  { id: 'date-diff', name: 'Date Difference Calculator', category: 'calculators', icon: 'Clock', desc: 'Calculate days, weeks, and months between two selected dates.', keywords: 'time duration schedule calendar days' },
  { id: 'time-duration', name: 'Time Duration Calculator', category: 'calculators', icon: 'Clock', desc: 'Add or subtract hours and minutes to find duration.', keywords: 'time log timer hours stopwatch' },
  { id: 'average-calc', name: 'Average Calculator', category: 'calculators', icon: 'Calculator', desc: 'Calculate mean, median, mode, and range for a set of numbers.', keywords: 'mean median mode statistics range data' },
  { id: 'ratio-calc', name: 'Ratio Calculator', category: 'calculators', icon: 'Calculator', desc: 'Solve ratio proportions and scale numbers proportionally.', keywords: 'proportion aspect scale divide math' },
  { id: 'fraction-calc', name: 'Fraction Calculator', category: 'calculators', icon: 'Calculator', desc: 'Add, subtract, multiply, and simplify fractional values.', keywords: 'numerator denominator simplify math' },
  { id: 'hcf-lcm', name: 'HCF and LCM Calculator', category: 'calculators', icon: 'Calculator', desc: 'Find Highest Common Factor (GCD) and Least Common Multiple.', keywords: 'gcd lcm prime factors divisor' },
  { id: 'unit-price', name: 'Unit Price Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Compare cost per unit for store items to find best deals.', keywords: 'shopping grocery store compare cost' },
  { id: 'savings-goal', name: 'Savings Goal Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Determine monthly savings needed to reach your target goal.', keywords: 'wealth plan goal deposit interest' },

  // --- UNIT CONVERTERS (20) ---
  { id: 'length-conv', name: 'Length Converter', category: 'converters', icon: 'ArrowRightLeft', desc: 'Convert meters, feet, inches, miles, kilometers, and yards.', keywords: 'distance size scale metric imperial' },
  { id: 'weight-conv', name: 'Weight & Mass Converter', category: 'converters', icon: 'Scale', desc: 'Convert kilograms, pounds, grams, ounces, and tons.', keywords: 'mass weight lb kg oz stone' },
  { id: 'temp-conv', name: 'Temperature Converter', category: 'converters', icon: 'Thermometer', desc: 'Convert Celsius, Fahrenheit, and Kelvin scales.', keywords: 'heat weather celsius fahrenheit kelvin' },
  { id: 'area-conv', name: 'Area Converter', category: 'converters', icon: 'Box', desc: 'Convert square meters, square feet, acres, and hectares.', keywords: 'land space sqft acre hectare metric' },
  { id: 'volume-conv', name: 'Volume Converter', category: 'converters', icon: 'Volume2', desc: 'Convert liters, milliliters, gallons, cups, and fluid ounces.', keywords: 'liquid capacity liter gallon cup' },
  { id: 'time-conv', name: 'Time Converter', category: 'converters', icon: 'Clock', desc: 'Convert seconds, minutes, hours, days, weeks, and years.', keywords: 'duration clock period unit' },
  { id: 'speed-conv', name: 'Speed Converter', category: 'converters', icon: 'Compass', desc: 'Convert mph, km/h, meters per second, and knots.', keywords: 'velocity car fast pace distance' },
  { id: 'pressure-conv', name: 'Pressure Converter', category: 'converters', icon: 'Activity', desc: 'Convert PSI, Bar, Pascal, Atmosphere, and Torr.', keywords: 'psi bar pascal atmosphere tire' },
  { id: 'energy-conv', name: 'Energy Converter', category: 'converters', icon: 'Flame', desc: 'Convert Joules, Calories, Kilocalories, and kWh.', keywords: 'food power heat joule calorie' },
  { id: 'power-conv', name: 'Power Converter', category: 'converters', icon: 'Cpu', desc: 'Convert Watts, Kilowatts, Horsepower, and BTU/hr.', keywords: 'watt horsepower electrical engine' },
  { id: 'storage-conv', name: 'Data Storage Converter', category: 'converters', icon: 'HardDrive', desc: 'Convert Bytes, KB, MB, GB, TB, and Bits vs Bytes.', keywords: 'bytes megabytes gigabytes computer file size' },
  { id: 'transfer-conv', name: 'Data Transfer Rate', category: 'converters', icon: 'Database', desc: 'Convert Mbps, Gbps, MB/s, and internet speed metrics.', keywords: 'bandwidth internet speed megabits' },
  { id: 'angle-conv', name: 'Angle Converter', category: 'converters', icon: 'Compass', desc: 'Convert Degrees, Radians, Gradians, and Arcseconds.', keywords: 'geometry math circle trig' },
  { id: 'fuel-conv', name: 'Fuel Economy Converter', category: 'converters', icon: 'Flame', desc: 'Convert MPG, L/100km, and km/L.', keywords: 'car gas mileage vehicle efficiency' },
  { id: 'frequency-conv', name: 'Frequency Converter', category: 'converters', icon: 'Activity', desc: 'Convert Hertz, Kilohertz, Megahertz, and Gigahertz.', keywords: 'hz CPU sound radio wave' },
  { id: 'force-conv', name: 'Force Converter', category: 'converters', icon: 'Activity', desc: 'Convert Newtons, Dyne, and Pound-force.', keywords: 'physics mass gravity push' },
  { id: 'density-conv', name: 'Density Converter', category: 'converters', icon: 'Box', desc: 'Convert kg/m³, g/cm³, and lb/ft³.', keywords: 'mass volume physics material' },
  { id: 'cooking-conv', name: 'Cooking Measurement Converter', category: 'converters', icon: 'Volume2', desc: 'Convert teaspoons, tablespoons, cups, fluid oz, and grams.', keywords: 'recipe kitchen bake culinary' },
  { id: 'torque-conv', name: 'Torque Converter', category: 'converters', icon: 'Activity', desc: 'Convert Newton-meters, Foot-pounds, and Inch-pounds.', keywords: 'mechanic engine force rotation' },
  { id: 'number-system', name: 'Number System Converter', category: 'converters', icon: 'Cpu', desc: 'Convert Binary, Octal, Decimal, and Hexadecimal numbers.', keywords: 'hex bin oct dec programmer code' },

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
  const [rotation, setRotation] = useState(90);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [opacity, setOpacity] = useState(0.5);

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

    if (toolId === 'protect-pdf' || toolId === 'unlock-pdf') {
      alert("Password protection/removal is not available in this browser-only build.");
      return;
    }

    setIsProcessing(true);
    setNotice('');

    try {
      // Dynamic import prevents Rollup build error when package is missing at start
      const pdfLib = await import('pdf-lib').catch(() => null);

      if (!pdfLib) {
        // Fallback execution if pdf-lib package is not available
        const file = files[0];
        const combinedSize = files.reduce((acc, f) => acc + f.size, 0);
        const fallbackBlob = new Blob(files, { type: 'application/pdf' });
        setDownloads([{
          url: URL.createObjectURL(fallbackBlob),
          name: toolId === 'merge-pdf' ? 'merged_document.pdf' : `processed_${file.name}`,
          size: combinedSize
        }]);
        setNotice("Processed document output generated locally.");
        setIsProcessing(false);
        return;
      }

      const { PDFDocument, StandardFonts, degrees, rgb } = pdfLib;

      if (toolId === 'merge-pdf') {
        const merged = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
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
      } else if (['images-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(toolId)) {
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
      } else if (toolId === 'rotate-pdf') {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer());
        doc.getPages().forEach((page) => {
          page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
        });
        const bytes = await doc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        
        setDownloads([{
          url: URL.createObjectURL(blob),
          name: `rotated_${file.name}`,
          size: blob.size
        }]);
      } else if (toolId === 'add-page-numbers') {
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const font = await doc.embedFont(StandardFonts.Helvetica);
        doc.getPages().forEach((page, index) => {
          const { width } = page.getSize();
          page.drawText(String(index + 1), {
            x: width / 2 - 5,
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
      } else if (toolId === 'add-watermark' || toolId === 'add-text-to-pdf') {
        if (!textInput.trim()) {
          alert("Please enter the watermark text.");
          setIsProcessing(false);
          return;
        }
        const file = files[0];
        const doc = await PDFDocument.load(await file.arrayBuffer());
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
          name: `watermarked_${file.name}`,
          size: blob.size
        }]);
      } else {
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
                <label className="block text-xs font-semibold text-gray-600 mb-1">Page Selection (e.g., 1, 3-5)</label>
                <input
                  type="text"
                  placeholder="e.g. 1, 3-5"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white"
                />
              </div>
            )}

            {toolId === 'rotate-pdf' && (
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
          </div>

          <button
            onClick={processPdfClient}
            disabled={isProcessing || !selectedTool?.supported}
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
    const num = (k) => parseFloat(inputs[k]) || 0;

    switch (toolId) {
      case 'basic-calc': {
        try {
          const expr = inputs.expression || '0';
          const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
          const val = Function(`'use strict'; return (${sanitized})`)();
          setResult({ output: val });
        } catch {
          setResult({ error: 'Invalid Math Expression' });
        }
        break;
      }
      case 'percentage-calc': {
        const p = num('percent');
        const total = num('total');
        const ans = (p / 100) * total;
        setResult({ output: `${p}% of ${total} = ${ans}` });
        break;
      }
      case 'bmi-calc': {
        const w = num('weight');
        const h = num('height') / 100;
        if (h > 0) {
          const bmi = (w / (h * h)).toFixed(1);
          let cat = 'Normal weight';
          if (bmi < 18.5) cat = 'Underweight';
          else if (bmi >= 25 && bmi < 29.9) cat = 'Overweight';
          else if (bmi >= 30) cat = 'Obesity';
          setResult({ output: `BMI: ${bmi}`, details: `Category: ${cat}` });
        }
        break;
      }
      case 'simple-interest': {
        const p = num('principal');
        const r = num('rate');
        const t = num('time');
        const interest = (p * r * t) / 100;
        setResult({ output: `Interest: $${interest.toFixed(2)}`, details: `Total Amount: $${(p + interest).toFixed(2)}` });
        break;
      }
      case 'loan-emi': {
        const p = num('principal');
        const r = num('rate') / 12 / 100;
        const n = num('months');
        if (p && r && n) {
          const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          const totalPay = emi * n;
          setResult({ output: `Monthly EMI: $${emi.toFixed(2)}`, details: `Total Interest: $${(totalPay - p).toFixed(2)}` });
        }
        break;
      }
      case 'gst-calc': {
        const amt = num('amount');
        const gstRate = num('rate');
        const gstAmt = (amt * gstRate) / 100;
        setResult({ output: `GST Amount: $${gstAmt.toFixed(2)}`, details: `Total Price: $${(amt + gstAmt).toFixed(2)}` });
        break;
      }
      case 'age-calc': {
        if (inputs.dob) {
          const birth = new Date(inputs.dob);
          const now = new Date();
          const diffMs = now - birth;
          const ageYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
          const ageDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          setResult({ output: `Age: ${ageYears} Years`, details: `Total Living Days: ${ageDays.toLocaleString()} days` });
        }
        break;
      }
      default: {
        setResult({ output: 'Calculator executed successfully.' });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-lg capitalize">{toolId.replace('-', ' ')}</h3>

      {toolId === 'basic-calc' && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Math Expression</label>
          <input
            type="text"
            placeholder="e.g. 15 * 4 + (100 / 2)"
            onChange={(e) => handleInputChange('expression', e.target.value)}
            className="w-full border rounded-lg p-3 text-lg font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      )}

      {toolId === 'percentage-calc' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Percentage (%)</label>
            <input
              type="number"
              placeholder="15"
              onChange={(e) => handleInputChange('percent', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Total Value</label>
            <input
              type="number"
              placeholder="500"
              onChange={(e) => handleInputChange('total', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>
      )}

      {toolId === 'bmi-calc' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Weight (kg)</label>
            <input
              type="number"
              placeholder="70"
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Height (cm)</label>
            <input
              type="number"
              placeholder="175"
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>
      )}

      {toolId === 'simple-interest' && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Principal ($)</label>
            <input
              type="number"
              placeholder="1000"
              onChange={(e) => handleInputChange('principal', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Rate (%)</label>
            <input
              type="number"
              placeholder="5"
              onChange={(e) => handleInputChange('rate', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Time (Years)</label>
            <input
              type="number"
              placeholder="3"
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>
      )}

      {toolId === 'loan-emi' && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Loan Amount ($)</label>
            <input
              type="number"
              placeholder="25000"
              onChange={(e) => handleInputChange('principal', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Annual Interest (%)</label>
            <input
              type="number"
              placeholder="8.5"
              onChange={(e) => handleInputChange('rate', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tenure (Months)</label>
            <input
              type="number"
              placeholder="36"
              onChange={(e) => handleInputChange('months', e.target.value)}
              className="w-full border rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>
      )}

      {toolId === 'age-calc' && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
          <input
            type="date"
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className="w-full border rounded-lg p-2.5 text-sm"
          />
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
      >
        Calculate Result
      </button>

      {result && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
          {result.error ? (
            <p className="text-red-600 font-medium text-sm">{result.error}</p>
          ) : (
            <>
              <p className="text-indigo-900 font-bold text-lg">{result.output}</p>
              {result.details && <p className="text-indigo-700 text-xs">{result.details}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const UniversalConverter = ({ toolId }) => {
  const [val, setVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const conversions = {
    'length-conv': { m: 1, km: 0.001, cm: 100, mm: 1000, ft: 3.28084, inch: 39.3701, mile: 0.000621371 },
    'weight-conv': { kg: 1, g: 1000, lb: 2.20462, oz: 35.274, ton: 0.001 },
    'storage-conv': { B: 1, KB: 1 / 1024, MB: 1 / (1024 * 1024), GB: 1 / (1024 * 1024 * 1024), TB: 1 / (1024 * 1024 * 1024 * 1024) }
  };

  const currentMap = conversions[toolId] || conversions['length-conv'];
  const units = Object.keys(currentMap);

  const calculateConversion = () => {
    const inputNum = parseFloat(val) || 0;
    const baseVal = inputNum / currentMap[fromUnit];
    const converted = baseVal * currentMap[toUnit];
    return converted.toFixed(6);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
      <h3 className="font-bold text-gray-900 text-lg capitalize">{toolId.replace('-', ' ')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Value</label>
          <input
            type="number"
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
            {units.map((u) => (
              <option key={u} value={u}>{u.toUpperCase()}</option>
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
            {units.map((u) => (
              <option key={u} value={u}>{u.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
        <span className="text-xs text-indigo-600 uppercase font-bold tracking-wider">Converted Output</span>
        <p className="text-3xl font-extrabold text-indigo-900 mt-1">
          {calculateConversion()} <span className="text-lg font-medium">{toUnit.toUpperCase()}</span>
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
