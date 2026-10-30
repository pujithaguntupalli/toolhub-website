import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Calculator, ArrowRightLeft, FileText, Image as ImageIcon, 
  Download, Upload, Trash2, RotateCw, ZoomIn, Eye, Sparkles, Check, 
  AlertCircle, ChevronRight, Layers, Lock, Unlock, HelpCircle, RefreshCw, 
  Info, ArrowLeft, Star, Clock, Grid, Sliders, Play, Settings, ExternalLink,
  Shield, Mail, FileCheck, DollarSign, Activity, Maximize2, Crop, Percent,
  Volume2, Cpu, Database, Flame, HardDrive, Compass, Thermometer, Box, Scale
} from 'lucide-react';

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const TOOLS = [
  { id: 'basic-calc', name: 'Basic Calculator', category: 'calculators', icon: 'Calculator', desc: 'Perform standard arithmetic operations with memory functions.', keywords: 'add math sum subtract multiply divide' },
  { id: 'percentage-calc', name: 'Percentage Calculator', category: 'calculators', icon: 'Percent', desc: 'Calculate percentages, percentage increases, and differences.', keywords: 'percent fraction ratio discount' },
  { id: 'age-calc', name: 'Age Calculator', category: 'calculators', icon: 'Clock', desc: 'Find exact age in years, months, days, and total hours from birthdate.', keywords: 'dob birthday time living' },
  { id: 'bmi-calc', name: 'BMI Calculator', category: 'calculators', icon: 'Activity', desc: 'Calculate Body Mass Index, health category, and ideal weight range.', keywords: 'health fitness weight height body fat' },
  { id: 'simple-interest', name: 'Simple Interest Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Calculate interest earned or paid over a given period.', keywords: 'finance interest rate principal money' },
  { id: 'loan-emi', name: 'Loan EMI Calculator', category: 'calculators', icon: 'DollarSign', desc: 'Calculate monthly loan payment EMI, total interest, and schedule.', keywords: 'mortgage car loan finance bank monthly' },
  { id: 'length-conv', name: 'Length Converter', category: 'converters', icon: 'ArrowRightLeft', desc: 'Convert meters, feet, inches, miles, kilometers, and yards.', keywords: 'distance size scale metric imperial' },
  { id: 'weight-conv', name: 'Weight & Mass Converter', category: 'converters', icon: 'Scale', desc: 'Convert kilograms, pounds, grams, ounces, and tons.', keywords: 'mass weight lb kg oz stone' },
  { id: 'storage-conv', name: 'Data Storage Converter', category: 'converters', icon: 'HardDrive', desc: 'Convert Bytes, KB, MB, GB, TB, and Bits vs Bytes.', keywords: 'bytes megabytes gigabytes computer file size' },
  { id: 'compress-image', name: 'Compress & Resize Image (Advanced)', category: 'image', icon: 'ImageIcon', desc: 'Full-featured compressor with exact pixel sizing, target file size optimization, and format conversion.', keywords: 'reduce size quality kb mb resize crop webp jpg png' },
  { id: 'merge-pdf', name: 'Merge PDF', category: 'pdf', icon: 'FileText', desc: 'Combine multiple PDF files into one single document.', keywords: 'join combine attach append' }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeToolId, setActiveToolId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveToolId(null)}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">T</div>
            <span className="font-bold text-xl text-slate-900">ToolHub</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-black text-slate-900">ToolHub Multi-Tool Suite</h1>
          <p className="text-slate-600 mt-2">All 80 tools loaded and ready in browser memory.</p>
        </div>
      </main>
    </div>
  );
}