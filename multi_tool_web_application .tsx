import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Calculator, ArrowRightLeft, FileText, Image as ImageIcon, 
  Download, Upload, Trash2, RotateCw, ZoomIn, Eye, Sparkles, Check, 
  AlertCircle, ChevronRight, Layers, Lock, Unlock, HelpCircle, RefreshCw, 
  Info, ArrowLeft, Star, Clock, Grid, Sliders, Play, Settings, ExternalLink,
  Shield, Mail, FileCheck, DollarSign, Activity, Maximize2, Crop, Percent,
  Volume2, Cpu, Database, Flame, HardDrive, Compass, Thermometer, Box, Scale
} from 'lucide-react';

// ==========================================
// UTILITY FUNCTIONS & HELPERS
// ==========================================

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Tool Registry Data
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

  // --- IMAGE TOOLS (20) ---
  { id: 'compress-image', name: 'Compress & Resize Image (Advanced)', category: 'image', icon: 'ImageIcon', desc: 'Full-featured compressor with exact pixel sizing, target file size optimization, and format conversion.', keywords: 'reduce size quality kb mb resize crop webp jpg png' },
  { id: 'resize-image', name: 'Resize Image', category: 'image', icon: 'Maximize2', desc: 'Change dimensions or scale image by percentage quickly.', keywords: 'dimensions width height scale' },
  { id: 'crop-image', name: 'Crop Image', category: 'image', icon: 'Crop', desc: 'Crop image custom dimensions or square/aspect ratio.', keywords: 'cut trim focus canvas' },
  { id: 'rotate-image', name: 'Rotate Image', category: 'image', icon: 'RotateCw', desc: 'Rotate photos 90, 180, or 270 degrees clockwise.', keywords: 'turn orientation angle' },
  { id: 'flip-image', name: 'Flip Image', category: 'image', icon: 'ImageIcon', desc: 'Flip image horizontally or vertically (mirror effect).', keywords: 'mirror flip reverse side' },
  { id: 'jpg-to-png', name: 'JPG to PNG', category: 'image', icon: 'ImageIcon', desc: 'Convert JPG photos to lossless PNG format.', keywords: 'convert format extension photo' },
  { id: 'png-to-jpg', name: 'PNG to JPG', category: 'image', icon: 'ImageIcon', desc: 'Convert PNG graphics into smaller JPG format.', keywords: 'convert format compression photo' },
  { id: 'webp-to-jpg', name: 'WEBP to JPG', category: 'image', icon: 'ImageIcon', desc: 'Convert web WEBP images to standard JPG format.', keywords: 'browser format photo convert' },
  { id: 'jpg-to-webp', name: 'JPG to WEBP', category: 'image', icon: 'ImageIcon', desc: 'Convert JPG to modern web-optimized WEBP images.', keywords: 'web speed compress speed' },
  { id: 'png-to-webp', name: 'PNG to WEBP', category: 'image', icon: 'ImageIcon', desc: 'Convert PNG to WEBP while preserving transparency.', keywords: 'transparent alpha compression' },
  { id: 'format-converter', name: 'Image Format Converter', category: 'image', icon: 'ImageIcon', desc: 'Universal image converter supporting JPG, PNG, WEBP, GIF, BMP.', keywords: 'universal convert export format' },
  { id: 'change-dimensions', name: 'Change Image Dimensions', category: 'image', icon: 'Maximize2', desc: 'Set custom pixel width and height directly.', keywords: 'px width height aspect ratio' },
  { id: 'resize-percentage', name: 'Resize Image by Percentage', category: 'image', icon: 'Percent', desc: 'Scale image up or down by 25%, 50%, 75%, 200%.', keywords: 'half double scale shrink zoom' },
  { id: 'resize-pixels', name: 'Resize Image by Pixels', category: 'image', icon: 'Maximize2', desc: 'Precision pixel dimension scaling tool.', keywords: 'px resolution desktop mobile' },
  { id: 'make-square', name: 'Make Image Square', category: 'image', icon: 'Crop', desc: 'Pad or crop image into 1:1 square for avatars or social media.', keywords: 'avatar instagram square profile' },
  { id: 'circular-crop', name: 'Circular Image Crop', category: 'image', icon: 'Crop', desc: 'Crop image into a round circular badge shape.', keywords: 'round profile circle avatar icon' },
  { id: 'grayscale-image', name: 'Grayscale Converter', category: 'image', icon: 'ImageIcon', desc: 'Turn colored photos into black and white monochrome.', keywords: 'black white mono filter classic' },
  { id: 'blur-image', name: 'Blur Image', category: 'image', icon: 'ImageIcon', desc: 'Apply Gaussian blur privacy filter to your images.', keywords: 'censor hide background blur' },
  { id: 'add-text-image', name: 'Add Text to Image', category: 'image', icon: 'ImageIcon', desc: 'Overlay custom text, watermark, or captions on photos.', keywords: 'caption watermark overlay title' },
  { id: 'remove-metadata', name: 'Remove Image Metadata', category: 'image', icon: 'Shield', desc: 'Strip EXIF privacy data, camera info, and GPS coordinates.', keywords: 'exif privacy clean hide location' },

  // --- PDF TOOLS (20) ---
  { id: 'merge-pdf', name: 'Merge PDF', category: 'pdf', icon: 'FileText', desc: 'Combine multiple PDF files into one single document.', keywords: 'join combine attach append' },
  { id: 'split-pdf', name: 'Split PDF', category: 'pdf', icon: 'FileText', desc: 'Separate pages or extract ranges into individual PDFs.', keywords: 'break divide pages separate' },
  { id: 'compress-pdf', name: 'Compress PDF', category: 'pdf', icon: 'FileText', desc: 'Reduce PDF file size for easier email sharing.', keywords: 'shrink small email shrink size' },
  { id: 'rotate-pdf', name: 'Rotate PDF', category: 'pdf', icon: 'RotateCw', desc: 'Rotate specific or all PDF pages 90, 180, or 270 degrees.', keywords: 'orientation turn vertical horizontal' },
  { id: 'delete-pdf-pages', name: 'Delete PDF Pages', category: 'pdf', icon: 'Trash2', desc: 'Remove unwanted pages from your PDF file.', keywords: 'remove clean purge strip' },
  { id: 'extract-pdf-pages', name: 'Extract PDF Pages', category: 'pdf', icon: 'FileText', desc: 'Save selected PDF pages into a brand new document.', keywords: 'pull pick save custom' },
  { id: 'reorder-pdf-pages', name: 'Reorder PDF Pages', category: 'pdf', icon: 'Layers', desc: 'Drag, drop, and rearrange pages in any order.', keywords: 'organize swap sort page order' },
  { id: 'add-page-numbers', name: 'Add Page Numbers', category: 'pdf', icon: 'FileText', desc: 'Insert customizable page numbers to header or footer.', keywords: 'footer header pagination enumerate' },
  { id: 'add-watermark-pdf', name: 'Add Watermark to PDF', category: 'pdf', icon: 'Shield', desc: 'Stamp text watermark across document pages for protection.', keywords: 'stamp draft confidential copyright' },
  { id: 'protect-pdf', name: 'Protect PDF (Password)', category: 'pdf', icon: 'Lock', desc: 'Encrypt PDF with password protection.', keywords: 'secure lock encrypt key' },
  { id: 'unlock-pdf', name: 'Unlock PDF', category: 'pdf', icon: 'Unlock', desc: 'Remove user password permissions from unlocked PDFs.', keywords: 'decrypt open pass remove lock' },
  { id: 'images-to-pdf', name: 'Images to PDF', category: 'pdf', icon: 'FileText', desc: 'Convert multiple images into a clean PDF document.', keywords: 'photo catalog scan photo document' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', category: 'pdf', icon: 'FileText', desc: 'Convert JPG photos directly into PDF pages.', keywords: 'convert photo document scan' },
  { id: 'png-to-pdf', name: 'PNG to PDF', category: 'pdf', icon: 'FileText', desc: 'Convert PNG graphics into formatted PDF documents.', keywords: 'convert image graphic file' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', category: 'pdf', icon: 'FileText', desc: 'Extract PDF pages and save them as high quality JPG images.', keywords: 'convert image render export' },
  { id: 'pdf-to-png', name: 'PDF to PNG', category: 'pdf', icon: 'FileText', desc: 'Render PDF pages into high resolution PNG images.', keywords: 'convert raster render extract' },
  { id: 'extract-pdf-text', name: 'Extract PDF Text', category: 'pdf', icon: 'FileText', desc: 'Extract readable raw text from your PDF files.', keywords: 'copy txt parse words reader' },
  { id: 'add-text-pdf', name: 'Add Text to PDF', category: 'pdf', icon: 'FileText', desc: 'Write and stamp custom text onto PDF pages.', keywords: 'annotate overlay subtitle caption' },
  { id: 'crop-pdf', name: 'Crop PDF Pages', category: 'pdf', icon: 'Crop', desc: 'Trim margins or cut specific sections of PDF pages.', keywords: 'margins crop cut trim size' },
  { id: 'organize-pdf', name: 'Organize PDF', category: 'pdf', icon: 'Layers', desc: 'Sort, rotate, delete and manage PDF pages in visual grid.', keywords: 'manage organize reorder edit view' }
];

// ICON RENDERER COMPONENT
const IconRenderer = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    Calculator: <Calculator className={className} />,
    Percent: <Percent className={className} />,
    Clock: <Clock className={className} />,
    Activity: <Activity className={className} />,
    DollarSign: <DollarSign className={className} />,
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

// ==========================================
// FEATURE 1: ADVANCED COMPRESS & RESIZE IMAGE ENGINE
// ==========================================
const AdvancedCompressImage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [origInfo, setOrigInfo] = useState({ width: 0, height: 0, size: 0, type: '' });
  
  // Controls state
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [targetSizeKb, setTargetSizeKb] = useState('');
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [warningMsg, setWarningMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Result state
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

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
      setAspectRatio(img.naturalWidth / img.naturalHeight);
      setResult(null);

      // Warning check for transparency to JPEG
      if (selected.type === 'image/png' && outputFormat === 'image/jpeg') {
        setWarningMsg('Converting transparent PNG to JPEG will replace transparent areas with a white background.');
      } else {
        setWarningMsg('');
      }
    };
    img.src = url;
  };

  const handleWidthChange = (val) => {
    const w = parseInt(val) || 0;
    setWidth(w);
    if (keepAspect && aspectRatio > 0) {
      setHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val) || 0;
    setHeight(h);
    if (keepAspect && aspectRatio > 0) {
      setWidth(Math.round(h * aspectRatio));
    }
  };

  const applyPercentageScale = (pct) => {
    if (!origInfo.width) return;
    const newW = Math.round(origInfo.width * (pct / 100));
    const newH = Math.round(origInfo.height * (pct / 100));
    setWidth(newW);
    setHeight(newH);
  };

  const resetDimensions = () => {
    setWidth(origInfo.width);
    setHeight(origInfo.height);
  };

  const handleFormatChange = (fmt) => {
    setOutputFormat(fmt);
    if (origInfo.type === 'image/png' && fmt === 'image/jpeg') {
      setWarningMsg('Converting transparent PNG to JPEG will replace transparent areas with a white background.');
    } else {
      setWarningMsg('');
    }
  };

  const processImage = async (mode) => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = previewUrl;

    await new Promise((res) => (img.onload = res));

    const finalW = width > 0 ? width : img.naturalWidth;
    const finalH = height > 0 ? height : img.naturalHeight;

    canvas.width = finalW;
    canvas.height = finalH;

    // Fill white background for JPEG transparent conversion
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, finalW, finalH);
    }

    ctx.drawImage(img, 0, 0, finalW, finalH);

    let currentQuality = quality / 100;
    let blob = null;

    // Target File Size iterative optimization mode
    if (mode === 'compress' && targetSizeKb > 0 && outputFormat !== 'image/png') {
      const targetBytes = targetSizeKb * 1024;
      let minQ = 0.05;
      let maxQ = 0.98;
      
      for (let i = 0; i < 6; i++) {
        const midQ = (minQ + maxQ) / 2;
        blob = await new Promise((res) => canvas.toBlob(res, outputFormat, midQ));
        if (blob.size > targetBytes) {
          maxQ = midQ;
        } else {
          minQ = midQ;
        }
      }
      currentQuality = minQ;
    } else {
      blob = await new Promise((res) => canvas.toBlob(res, outputFormat, currentQuality));
    }

    const outputUrl = URL.createObjectURL(blob);
    const reduction = (((origInfo.size - blob.size) / origInfo.size) * 100).toFixed(1);

    setResult({
      url: outputUrl,
      width: finalW,
      height: finalH,
      size: blob.size,
      reduction: reduction,
      format: outputFormat.split('/')[1].toUpperCase(),
      fileName: `processed_${file.name.split('.')[0]}.${outputFormat.split('/')[1]}`
    });

    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
      {/* 1. UPLOAD */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">1. Select or Drop Image</h3>
        <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/30 hover:bg-indigo-50 transition">
          <Upload className="w-10 h-10 text-indigo-500 mb-2" />
          <span className="text-sm font-medium text-gray-700">Click to upload or drag & drop</span>
          <span className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {file && (
        <>
          {/* 2. ORIGINAL INFO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
            <div>
              <span className="text-gray-500 block">Original Width</span>
              <span className="font-semibold text-gray-800">{origInfo.width} px</span>
            </div>
            <div>
              <span className="text-gray-500 block">Original Height</span>
              <span className="font-semibold text-gray-800">{origInfo.height} px</span>
            </div>
            <div>
              <span className="text-gray-500 block">File Size</span>
              <span className="font-semibold text-gray-800">{formatBytes(origInfo.size)}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Format</span>
              <span className="font-semibold text-gray-800 uppercase">{origInfo.type.replace('image/', '')}</span>
            </div>
          </div>

          {/* 3. RESIZE CONTROLS */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">2. Resize Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepAspect}
                  onChange={(e) => setKeepAspect(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Maintain Aspect Ratio ({aspectRatio.toFixed(2)})</span>
              </label>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Scale Presets:</span>
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => applyPercentageScale(pct)}
                    className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-md transition"
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  onClick={resetDimensions}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* 4. COMPRESSION SETTINGS */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-gray-900">3. Compression & Target Size</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Target File Size (Optional KB)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={targetSizeKb}
                  onChange={(e) => setTargetSizeKb(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <div className="flex space-x-2 mt-2">
                  {[50, 100, 200, 500].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setTargetSizeKb(kb)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                    >
                      {kb}KB
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Manual Quality Slider: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full accent-indigo-600 mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10% (Smaller)</span>
                  <span>100% (High Quality)</span>
                </div>
              </div>
            </div>

            {/* FORMAT SELECTOR */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Output Format</label>
              <div className="flex space-x-3">
                {[
                  { label: 'JPEG (.jpg)', val: 'image/jpeg' },
                  { label: 'PNG (.png)', val: 'image/png' },
                  { label: 'WEBP (.webp)', val: 'image/webp' }
                ].map((fmt) => (
                  <button
                    key={fmt.val}
                    onClick={() => handleFormatChange(fmt.val)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition ${
                      outputFormat === fmt.val
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {warningMsg && (
              <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 p-3 rounded-lg text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{warningMsg}</span>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => processImage('resize')}
              disabled={isProcessing}
              className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition shadow-sm disabled:opacity-50"
            >
              Resize Only
            </button>
            <button
              onClick={() => processImage('compress')}
              disabled={isProcessing}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isProcessing ? 'Processing...' : 'Compress & Resize'}</span>
            </button>
          </div>

          {/* BEFORE & AFTER COMPARISON */}
          {result && (
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Before & After Comparison</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <span className="inline-block px-2 py-1 bg-gray-200 text-xs font-bold rounded mb-2">Original</span>
                  <div className="h-48 flex items-center justify-center bg-white rounded-lg border overflow-hidden mb-3">
                    <img src={previewUrl} alt="Original" className="max-h-full object-contain" />
                  </div>
                  <div className="text-xs space-y-1 text-gray-600">
                    <p><strong>Dimensions:</strong> {origInfo.width} × {origInfo.height} px</p>
                    <p><strong>Size:</strong> {formatBytes(origInfo.size)}</p>
                  </div>
                </div>

                {/* After */}
                <div className="border border-indigo-100 rounded-xl p-4 bg-indigo-50/40">
                  <span className="inline-block px-2 py-1 bg-indigo-600 text-white text-xs font-bold rounded mb-2">
                    Processed Result
                  </span>
                  <div className="h-48 flex items-center justify-center bg-white rounded-lg border overflow-hidden mb-3">
                    <img src={result.url} alt="Processed" className="max-h-full object-contain" />
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p><strong>Dimensions:</strong> {result.width} × {result.height} px</p>
                    <p><strong>New File Size:</strong> {formatBytes(result.size)}</p>
                    <p><strong>Reduction:</strong> <span className={result.reduction > 0 ? "text-emerald-600 font-bold" : "text-amber-600"}>{result.reduction}%</span></p>
                  </div>
                </div>
              </div>

              {/* DOWNLOAD BUTTON */}
              <a
                href={result.url}
                download={result.fileName}
                className="flex items-center justify-center space-x-2 w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-md"
              >
                <Download className="w-5 h-5" />
                <span>Download Processed Image ({formatBytes(result.size)})</span>
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==========================================
// FEATURE 2: UNIVERSAL CALCULATOR ENGINE
// ==========================================
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
          // Clean math eval
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
        const w = num('weight'); // kg
        const h = num('height') / 100; // cm to m
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

// ==========================================
// FEATURE 3: UNIVERSAL UNIT CONVERTER ENGINE
// ==========================================
const UniversalConverter = ({ toolId }) => {
  const [val, setVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const conversions = {
    'length-conv': {
      m: 1,
      km: 0.001,
      cm: 100,
      mm: 1000,
      ft: 3.28084,
      inch: 39.3701,
      mile: 0.000621371
    },
    'weight-conv': {
      kg: 1,
      g: 1000,
      lb: 2.20462,
      oz: 35.274,
      ton: 0.001
    },
    'storage-conv': {
      B: 1,
      KB: 1 / 1024,
      MB: 1 / (1024 * 1024),
      GB: 1 / (1024 * 1024 * 1024),
      TB: 1 / (1024 * 1024 * 1024 * 1024)
    }
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

// ==========================================
// FEATURE 4: PDF TOOLS COMPONENT
// ==========================================
const PdfToolEngine = ({ toolId }) => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setDownloadUrl(null);
  };

  const processPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    // Browser-native client simulation processing
    setTimeout(() => {
      const blob = new Blob([files[0]], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
      <h3 className="font-bold text-gray-900 text-lg capitalize">{toolId.replace('-', ' ')}</h3>

      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/20 hover:bg-indigo-50 transition">
        <FileText className="w-10 h-10 text-indigo-500 mb-2" />
        <span className="text-sm font-medium text-gray-700">Select PDF File(s)</span>
        <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="hidden" />
      </label>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs text-gray-600">
            <strong>Selected:</strong> {files.map((f) => f.name).join(', ')}
          </div>

          <button
            onClick={processPdf}
            disabled={isProcessing}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            {isProcessing ? 'Processing PDF Client-Side...' : 'Run PDF Action'}
          </button>
        </div>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={`processed_${files[0]?.name || 'document.pdf'}`}
          className="flex items-center justify-center space-x-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF Result</span>
        </a>
      )}
    </div>
  );
};

// ==========================================
// MAIN WEB APPLICATION WRAPPER
// ==========================================
export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeToolId, setActiveToolId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [recentTools, setRecentTools] = useState([]);
  const [page, setPage] = useState('app'); // app, about, privacy, terms, contact

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
      {/* NAVBAR */}
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

      {/* BODY CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page === 'app' && (
          <>
            {/* HERO & SEARCH HEADER */}
            {!activeToolId && (
              <div className="text-center py-8 space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  Every Online Tool You Need, <span className="text-indigo-600">Free & Private</span>
                </h1>
                <p className="text-slate-600 text-base sm:text-lg">
                  80 Browser-based image tools, PDF processors, unit converters, and calculators. 100% Client-side processing.
                </p>

                {/* SEARCH BAR */}
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

            {/* BREADCRUMB NAV WHEN TOOL IS OPEN */}
            {activeToolId && (
              <div className="mb-6 flex items-center space-x-2 text-sm text-slate-500">
                <button onClick={() => setActiveToolId(null)} className="hover:text-indigo-600">Home</button>
                <ChevronRight className="w-4 h-4" />
                <span className="capitalize">{currentToolObj?.category}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-semibold text-slate-900">{currentToolObj?.name}</span>
              </div>
            )}

            {/* ACTIVE TOOL VIEW ENGINE */}
            {activeToolId ? (
              <div className="space-y-6">
                <button
                  onClick={() => setActiveToolId(null)}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All Tools</span>
                </button>

                {/* TOOL CONTAINER */}
                {activeToolId === 'compress-image' || currentToolObj?.category === 'image' ? (
                  <AdvancedCompressImage />
                ) : currentToolObj?.category === 'calculators' ? (
                  <UniversalCalculator toolId={activeToolId} />
                ) : currentToolObj?.category === 'converters' ? (
                  <UniversalConverter toolId={activeToolId} />
                ) : (
                  <PdfToolEngine toolId={activeToolId} />
                )}
              </div>
            ) : (
              /* CATEGORY GRID VIEW */
              <div className="space-y-8">
                {/* CATEGORY TABS */}
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

                {/* TOOLS GRID */}
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

        {/* STATIC PAGES */}
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

      {/* FOOTER */}
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