import { IMAGE_TOOLS, type ImageToolId } from './lib/image-tools';
import { PDF_TOOLS, type PdfToolId } from './lib/pdf-tools';

export type Category = 'converter' | 'calculator' | 'image' | 'pdf';
export type Field = { key: string; label: string; placeholder?: string; type?: 'number' | 'date' | 'select' | 'text'; options?: string[]; step?: string };
export type Tool = {
  slug: string;
  label: string;
  category: Category;
  keywords: string[];
  description: string;
  fields?: Field[];
  units?: { label: string; factor: number }[];
  calculate?: (values: Record<string, string>) => { value: string; note?: string } | null;
  fileToolId?: ImageToolId | PdfToolId;
  supported?: boolean;
};

const converterData: Array<[string, string, string, string[], Array<[string, number]>]> = [
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
  ['data-storage', 'Data Storage', 'Convert decimal and binary data sizes, including bits and bytes.', ['data','byte','bit','gigabyte','gibibyte','storage'], [['Bit',1],['Byte',8],['Kilobit (kbit)',1000],['Kilobyte (kB)',8000],['Kibibyte (KiB)',8192],['Megabit (Mbit)',1000000],['Megabyte (MB)',8000000],['Mebibyte (MiB)',8388608],['Gigabit (Gbit)',1e9],['Gigabyte (GB)',8e9],['Gibibyte (GiB)',8589934592],['Terabyte (TB)',8e12],['Tebibyte (TiB)',8796093022208]]],
  ['data-transfer-rate', 'Data Transfer Rate', 'Translate bandwidth between bits and bytes per second.', ['bandwidth','mbps','megabits','download','bytes per second'], [['Bit per second (bit/s)',1],['Kilobit per second (kbit/s)',1000],['Megabit per second (Mbit/s)',1e6],['Gigabit per second (Gbit/s)',1e9],['Byte per second (B/s)',8],['Kilobyte per second (kB/s)',8000],['Megabyte per second (MB/s)',8e6],['Kibibyte per second (KiB/s)',8192],['Mebibyte per second (MiB/s)',8388608]]],
  ['angle', 'Angle', 'Convert degrees, radians, gradians and turns.', ['degrees','radians','turn'], [['Degree',1],['Radian',180/Math.PI],['Gradian',.9],['Turn',360],['Arcminute',1/60],['Arcsecond',1/3600]]],
  ['fuel-economy', 'Fuel Economy', 'Compare fuel consumption and distance-per-fuel ratings.', ['mpg','miles per gallon','liters per 100 km','efficiency'], [['Kilometers per liter',1],['Miles per US gallon',.425143707],['Miles per Imperial gallon',.35400619],['Liters per 100 km',100]]],
  ['frequency', 'Frequency', 'Convert cycles per second through radio frequencies.', ['hertz','khz','mhz','ghz'], [['Hertz',1],['Kilohertz',1000],['Megahertz',1e6],['Gigahertz',1e9],['Terahertz',1e12],['RPM',1/60]]],
  ['force', 'Force', 'Convert force units used in mechanics and engineering.', ['newton','pound force','kgf'], [['Newton',1],['Kilonewton',1000],['Pound-force',4.4482216153],['Kilogram-force',9.80665],['Dyne',.00001]]],
  ['density', 'Density', 'Convert density by mass per unit volume.', ['kg/m3','g/cm3','pounds per cubic foot'], [['Kilogram per cubic meter',1],['Gram per cubic centimeter',1000],['Gram per milliliter',1000],['Pound per cubic foot',16.01846337],['Pound per US gallon',119.826427]]],
  ['cooking-measurement', 'Cooking Measurement', 'Scale common kitchen volume measures.', ['cooking','teaspoon','tablespoon','cup'], [['Milliliter',1],['Teaspoon (US)',4.92892159],['Tablespoon (US)',14.7867648],['Fluid ounce (US)',29.5735296],['Cup (US)',236.5882365],['Cup (metric)',250],['Pint (US)',473.176473],['Liter',1000]]],
  ['torque', 'Torque', 'Convert turning force for tools and engineering.', ['newton meter','lb-ft','torque'], [['Newton meter',1],['Newton centimeter',.01],['Pound-foot',1.3558179483],['Pound-inch',.112984829],['Kilogram-force meter',9.80665]]],
  ['number-system', 'Number System', 'Translate integers across binary, octal, decimal and hexadecimal.', ['binary','hex','octal','base','radix'], [['Binary (base 2)',2],['Octal (base 8)',8],['Decimal (base 10)',10],['Hexadecimal (base 16)',16]]],
];

const toTempBase = (n: number, unit: string) => unit === 'Celsius' ? n : unit === 'Fahrenheit' ? (n - 32) * 5 / 9 : n - 273.15;
const fromTempBase = (c: number, unit: string) => unit === 'Celsius' ? c : unit === 'Fahrenheit' ? c * 9 / 5 + 32 : c + 273.15;
const fmt = (n: number) => Number.isFinite(n) ? Number(n.toPrecision(11)).toLocaleString('en-US', { maximumFractionDigits: 8 }) : '—';
const val = (v: Record<string, string>, k: string) => Number(v[k]);
const fields = (...items: Array<[string, string, string?, string?]>): Field[] => items.map(([key,label,placeholder,step])=>({key,label,placeholder,type:'number',step:step||'any'}));
const calc = (slug: string, label: string, description: string, keywords: string[], fs: Field[], fn: Tool['calculate']): Tool => ({slug,label,category:'calculator',description,keywords,fields:fs,calculate:fn});
const numeric = (v: Record<string,string>, keys: string[]) => keys.every(k => v[k] !== '' && Number.isFinite(Number(v[k])));

const calculators: Tool[] = [
  calc('percentage','Percentage','Find a percentage of a value, or the percentage one value is of another.',['percent','rate','of'],[{key:'mode',label:'Calculate',type:'select',options:['X% of a number','What percent is X of Y']},...fields(['a','Percentage / part','e.g. 18'],['b','Number / whole','e.g. 240'])],v=>{if(!numeric(v,['a','b']))return null;const a=val(v,'a'),b=val(v,'b');if(v.mode==='What percent is X of Y'&&b===0)return null;return {value:fmt(v.mode==='What percent is X of Y'?a/b*100:a*b/100)+(v.mode==='What percent is X of Y'?'%':''),note:v.mode==='What percent is X of Y'?`${fmt(a)} is this share of ${fmt(b)}.`:`${fmt(v.mode==='What percent is X of Y'?a/b*100:a*b/100)} is ${fmt(a)}% of ${fmt(b)}.`}}),
  calc('age','Age','Calculate age in years, months and days from a birth date.',['birthday','birth date','how old'],[{key:'birth',label:'Date of birth',type:'date'},{key:'on',label:'Age on',type:'date'}],v=>{if(!v.birth||!v.on)return null;const b=new Date(`${v.birth}T12:00:00`),d=new Date(`${v.on}T12:00:00`);if(Number.isNaN(+b)||d<b)return null;let y=d.getFullYear()-b.getFullYear(),m=d.getMonth()-b.getMonth(),day=d.getDate()-b.getDate();if(day<0){m--;day+=new Date(d.getFullYear(),d.getMonth(),0).getDate()}if(m<0){y--;m+=12}return {value:`${y} years, ${m} months, ${day} days`,note:'Age is calculated from calendar dates, including leap years.'}}),
  calc('bmi','BMI','Estimate body mass index from height and weight.',['body mass index','health','weight'],[{key:'units',label:'Units',type:'select',options:['Metric (kg, cm)','Imperial (lb, in)']},...fields(['weight','Weight','e.g. 68'],['height','Height','e.g. 172'])],v=>{if(!numeric(v,['weight','height'])||val(v,'weight')<=0||val(v,'height')<=0)return null;const bmi=v.units?.startsWith('Imperial')?val(v,'weight')*703/(val(v,'height')**2):val(v,'weight')/((val(v,'height')/100)**2);return {value:fmt(bmi),note:bmi<18.5?'Below the commonly used adult reference range (18.5–24.9).':bmi<25?'Within the commonly used adult reference range (18.5–24.9).':bmi<30?'Above the commonly used adult reference range (18.5–24.9).':'In the commonly used obesity range. BMI is an estimate, not a diagnosis.'}}),
  calc('simple-interest','Simple Interest','Estimate simple interest and total value over time.',['interest','principal','finance'],fields(['principal','Principal amount','e.g. 5000'],['rate','Annual rate (%)','e.g. 4.5'],['years','Time in years','e.g. 3']),v=>{if(!numeric(v,['principal','rate','years'])||val(v,'principal')<0||val(v,'rate')<0||val(v,'years')<0)return null;const i=val(v,'principal')*val(v,'rate')*val(v,'years')/100;return {value:`Interest ${fmt(i)} · Total ${fmt(val(v,'principal')+i)}`,note:'Simple interest = principal × annual rate × time.'}}),
  calc('compound-interest','Compound Interest','Estimate compounded growth and interest earned.',['investment','annual compound','finance'],[{key:'frequency',label:'Compounding',type:'select',options:['Annually','Semi-annually','Quarterly','Monthly','Daily']},...fields(['principal','Starting amount','e.g. 5000'],['rate','Annual rate (%)','e.g. 5'],['years','Time in years','e.g. 10'])],v=>{if(!numeric(v,['principal','rate','years'])||val(v,'principal')<0||val(v,'rate')<0||val(v,'years')<0)return null;const periods:{[key:string]:number}={'Annually':1,'Semi-annually':2,'Quarterly':4,'Monthly':12,'Daily':365};const n=periods[v.frequency||'Annually'];const total=val(v,'principal')*(1+val(v,'rate')/100/n)**(n*val(v,'years'));return {value:'Final value '+fmt(total)+' · Growth '+fmt(total-val(v,'principal')),note:'Estimate assumes a fixed '+fmt(val(v,'rate'))+'% annual rate, compounded '+(v.frequency||'annually').toLowerCase()+'.'}}),
  calc('loan-emi','Loan EMI','Estimate a fixed monthly loan payment and total repayment.',['mortgage','monthly payment','loan'],fields(['principal','Loan amount','e.g. 250000'],['rate','Annual interest rate (%)','e.g. 6.2'],['years','Loan term (years)','e.g. 30']),v=>{if(!numeric(v,['principal','rate','years'])||val(v,'principal')<=0||val(v,'rate')<0||val(v,'years')<=0)return null;const n=val(v,'years')*12,r=val(v,'rate')/1200,p=val(v,'principal'),emi=r===0?p/n:p*r*(1+r)**n/((1+r)**n-1);return {value:`Monthly payment ${fmt(emi)}`,note:`Estimated total repayment ${fmt(emi*n)} over ${n} payments; excludes fees and taxes.`}}),
  calc('gst','GST','Add or remove a goods and services tax rate.',['tax','vat','sales tax'],[{key:'mode',label:'Calculate',type:'select',options:['Add tax to amount','Remove tax from total']},...fields(['amount','Amount','e.g. 120'],['rate','Tax rate (%)','e.g. 20'])],v=>{if(!numeric(v,['amount','rate'])||val(v,'amount')<0||val(v,'rate')<0)return null;const a=val(v,'amount'),r=val(v,'rate')/100,net=v.mode==='Remove tax from total'?a/(1+r):a,total=v.mode==='Remove tax from total'?a:a*(1+r),tax=total-net;return {value:`Net ${fmt(net)} · Tax ${fmt(tax)} · Total ${fmt(total)}`,note:'Tax amount is derived from the entered rate; local rules may differ.'}}),
  calc('discount','Discount','Find the sale price and amount saved after a discount.',['sale price','markdown','savings'],fields(['price','Original price','e.g. 89.99'],['discount','Discount (%)','e.g. 25']),v=>{if(!numeric(v,['price','discount'])||val(v,'price')<0||val(v,'discount')<0||val(v,'discount')>100)return null;const save=val(v,'price')*val(v,'discount')/100;return {value:'Sale price '+fmt(val(v,'price')-save),note:'You save '+fmt(save)+' ('+fmt(val(v,'discount'))+'% off).'}}),
  calc('profit-and-loss','Profit and Loss','Compare selling and cost prices to find profit or loss.',['margin','markup','business'],fields(['cost','Cost price','e.g. 42'],['selling','Selling price','e.g. 60']),v=>{if(!numeric(v,['cost','selling'])||val(v,'cost')<=0)return null;const diff=val(v,'selling')-val(v,'cost'),pct=diff/val(v,'cost')*100;return {value:`${diff>=0?'Profit':'Loss'} ${fmt(Math.abs(diff))}`,note:`${fmt(Math.abs(pct))}% ${diff>=0?'gain':'loss'} on cost.`}}),
   calc('salary','Salary','Convert gross salary between common pay periods.',['paycheck','annual','hourly','income'],[{key:'period',label:'Salary is per',type:'select',options:['Year','Month','Week','Hour']},...fields(['amount','Gross salary','e.g. 72000'],['hours','Hours per week','e.g. 40'])],v=>{if(!numeric(v,['amount','hours'])||val(v,'amount')<0||val(v,'hours')<=0)return null;const a=val(v,'amount'),hours=val(v,'hours'),annual=v.period==='Month'?a*12:v.period==='Week'?a*52:v.period==='Hour'?a*hours*52:a;return {value:`Annual ${fmt(annual)} · Monthly ${fmt(annual/12)}`,note:`Weekly ${fmt(annual/52)} · Hourly ${fmt(annual/(hours*52))} (assuming 52 weeks and ${fmt(hours)} hours per week). Gross estimate before deductions.`}}),
  calc('date-difference','Date Difference','Count the calendar days between two dates.',['days between','date range','duration'],[{key:'start',label:'Start date',type:'date'},{key:'end',label:'End date',type:'date'}],v=>{if(!v.start||!v.end)return null;const a=new Date(`${v.start}T00:00:00Z`),b=new Date(`${v.end}T00:00:00Z`);if(Number.isNaN(+a)||Number.isNaN(+b))return null;const days=Math.round((b.getTime()-a.getTime())/86400000);return {value:`${Math.abs(days).toLocaleString()} days`,note:days<0?'End date is earlier than start date. Difference is shown as an absolute count.':'Counts elapsed calendar days; the end date is not inclusive.'}}),
  calc('time-duration','Time Duration','Find elapsed time between clock times, including overnight intervals.',['hours between','elapsed','clock'],fields(['start','Start time (HHMM)','09:30'],['end','End time (HHMM)','17:15']).map(f=>({...f,placeholder:f.key==='start'?'09:30':'17:15'})).map(f=>({...f,type:'text' as const})),v=>{const parse=(s:string)=>{const m=s.match(/^(\d{1,2}):(\d{2})$/);return m&&+m[1]<24&&+m[2]<60?+m[1]*60 + +m[2]:NaN};let a=parse(v.start||''),b=parse(v.end||'');if(!Number.isFinite(a)||!Number.isFinite(b))return null;if(b<a)b+=1440;const n=b-a;return {value:`${Math.floor(n/60)} hr ${n%60} min`,note:`${fmt(n/60)} decimal hours.`}}),
  calc('average','Average','Calculate the arithmetic mean of a list of values.',['mean','numbers','statistics'],[{key:'numbers',label:'Numbers, separated by commas',placeholder:'12, 18, 24',type:'text'}],v=>{const ns=(v.numbers||'').split(/[,\s]+/).filter(Boolean).map(Number);if(!ns.length||ns.some(n=>!Number.isFinite(n)))return null;return {value:fmt(ns.reduce((a,b)=>a+b,0)/ns.length),note:`From ${ns.length} value${ns.length===1?'':'s'}; sum ${fmt(ns.reduce((a,b)=>a+b,0))}.`}}),
  calc('ratio','Ratio','Simplify a two-part ratio and find its share.',['proportion','scale','simplify'],fields(['a','First amount','e.g. 12'],['b','Second amount','e.g. 18']),v=>{if(!numeric(v,['a','b'])||!Number.isInteger(val(v,'a'))||!Number.isInteger(val(v,'b'))||(val(v,'a')===0&&val(v,'b')===0)||val(v,'a')+val(v,'b')===0)return null;const gcd=(x:number,y:number):number=>y===0?Math.abs(x):gcd(y,x%y),g=gcd(val(v,'a'),val(v,'b'));return {value:`${val(v,'a')/g} : ${val(v,'b')/g}`,note:`First share ${fmt(val(v,'a')/(val(v,'a')+val(v,'b'))*100)}% of the combined total.`}}),
  calc('fraction','Fraction','Simplify a fraction and show its decimal value.',['numerator','denominator','reduce'],fields(['numerator','Numerator','e.g. 18','1'],['denominator','Denominator','e.g. 24','1']),v=>{if(!numeric(v,['numerator','denominator'])||!Number.isInteger(val(v,'numerator'))||!Number.isInteger(val(v,'denominator'))||val(v,'denominator')===0)return null;const gcd=(x:number,y:number):number=>y===0?Math.abs(x):gcd(y,x%y),g=gcd(val(v,'numerator'),val(v,'denominator')),sign=val(v,'denominator')<0?-1:1;return {value:`${val(v,'numerator')/g*sign} / ${Math.abs(val(v,'denominator')/g)}`,note:`Decimal value ${fmt(val(v,'numerator')/val(v,'denominator'))}.`}}),
  calc('scientific','Scientific','Evaluate a scientific operation on one or two values.',['sin','cos','log','sqrt','exponent'],[{key:'operation',label:'Operation',type:'select',options:['Square root','Square','Cube','Sine (degrees)','Cosine (degrees)','Tangent (degrees)','Natural log','Log base 10','Absolute value','Power (xʸ)']},...fields(['x','Value x','e.g. 45'],['y','Value y (for power)','e.g. 2'])],v=>{if(!numeric(v,['x']))return null;const x=val(v,'x'),y=val(v,'y');let n:number;switch(v.operation){case'Square root':if(x<0)return null;n=Math.sqrt(x);break;case'Square':n=x*x;break;case'Cube':n=x**3;break;case'Sine (degrees)':n=Math.sin(x*Math.PI/180);break;case'Cosine (degrees)':n=Math.cos(x*Math.PI/180);break;case'Tangent (degrees)':n=Math.tan(x*Math.PI/180);break;case'Natural log':if(x<=0)return null;n=Math.log(x);break;case'Log base 10':if(x<=0)return null;n=Math.log10(x);break;case'Absolute value':n=Math.abs(x);break;default:if(!Number.isFinite(y))return null;n=x**y}return Number.isFinite(n)?{value:fmt(n),note:`${v.operation}: ${x}${v.operation==='Power (xʸ)'?` raised to ${y}`:''}.`}:null}),
  calc('basic','Basic','Quickly evaluate two values with a basic arithmetic operation.',['arithmetic','add','subtract','multiply','divide'],[{key:'operation',label:'Operation',type:'select',options:['Add (+)','Subtract (−)','Multiply (×)','Divide (÷)']},...fields(['a','First number','e.g. 28'],['b','Second number','e.g. 4'])],v=>{if(!numeric(v,['a','b'])||(v.operation==='Divide (÷)'&&val(v,'b')===0))return null;const a=val(v,'a'),b=val(v,'b'),n=v.operation==='Subtract (−)'?a-b:v.operation==='Multiply (×)'?a*b:v.operation==='Divide (÷)'?a/b:a+b;return {value:fmt(n),note:`${fmt(a)} ${v.operation?.match(/\((.)\)/)?.[1]||'+'} ${fmt(b)} = ${fmt(n)}`}}),
  calc('hcf-lcm','HCF and LCM','Find the highest common factor and least common multiple.',['gcd','greatest common divisor','multiple'],fields(['a','First integer','e.g. 24','1'],['b','Second integer','e.g. 36','1']),v=>{if(!numeric(v,['a','b'])||!Number.isInteger(val(v,'a'))||!Number.isInteger(val(v,'b'))||(val(v,'a')===0&&val(v,'b')===0))return null;const gcd=(x:number,y:number):number=>y===0?Math.abs(x):gcd(y,x%y),g=gcd(val(v,'a'),val(v,'b'));return {value:`HCF ${g} · LCM ${fmt(Math.abs(val(v,'a')/g*val(v,'b')))}`,note:'HCF is the greatest common divisor; LCM is the least common multiple.'}}),
  calc('unit-price','Unit Price','Compare cost per standard unit for shopping decisions.',['price per unit','compare value','cost'],fields(['price','Pack price','e.g. 4.79'],['quantity','Pack quantity','e.g. 750'],['unit','Quantity unit','e.g. g, ml, item']).map(f=>f.key==='unit'?({...f,type:'text' as const}):f),v=>{if(!numeric(v,['price','quantity'])||val(v,'quantity')<=0||val(v,'price')<0)return null;return {value:`${fmt(val(v,'price')/val(v,'quantity'))} per ${v.unit||'unit'}`,note:`${fmt(val(v,'quantity'))} ${v.unit||'units'} in the pack.`}}),
  calc('savings-goal','Savings Goal','Estimate the monthly amount needed to reach a savings target.',['saving plan','monthly savings','goal'],fields(['goal','Savings target','e.g. 12000'],['current','Already saved','e.g. 2500'],['months','Months to goal','e.g. 18','1']),v=>{if(!numeric(v,['goal','current','months'])||val(v,'goal')<0||val(v,'current')<0||val(v,'months')<=0)return null;const rem=Math.max(0,val(v,'goal')-val(v,'current'));return {value:`${fmt(rem/val(v,'months'))} per month`,note:rem===0?'You have already reached this goal.':'Straight-line estimate; excludes interest and changes in contributions.'}}),
];

export const tools: Tool[] = [
  ...converterData.map(([slug,label,description,keywords,rawUnits])=>({
    slug, label, description, keywords, category:'converter' as Category,
    units:rawUnits.map(([label,factor])=>({label,factor}))
  })),
  ...calculators,
  ...IMAGE_TOOLS.map((tool): Tool => ({
    slug: tool.id,
    label: tool.name,
    description: tool.description,
    keywords: tool.keywords,
    category: 'image',
    fileToolId: tool.id,
    supported: true,
  })),
  ...PDF_TOOLS.map((tool): Tool => ({
    slug: tool.id,
    label: tool.name,
    description: tool.description,
    keywords: tool.keywords,
    category: 'pdf',
    fileToolId: tool.id,
    supported: tool.supported,
  })),
];
export const findTool = (slug: string) => tools.find(t=>t.slug===slug);
export const popularSlugs = ['length','compress-image','percentage','temperature','pdf-to-jpg','age','weight','bmi','data-storage','loan-emi'];

export function convert(tool: Tool, amount: number | string, from: string, to: string): string | null {
  if (tool.slug === 'temperature') {
    if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
    const c=toTempBase(amount,from);
    if (c < -273.15) return null;
    return fmt(fromTempBase(c,to));
  }
  if (tool.slug === 'number-system') {
    const radixFrom=from.startsWith('Binary')?2:from.startsWith('Octal')?8:from.startsWith('Hex')?16:10;
    const radixTo=to.startsWith('Binary')?2:to.startsWith('Octal')?8:to.startsWith('Hex')?16:10;
    const digits=String(amount).trim().replace(/^[-+]/,'');
    const patterns:{[key:number]:RegExp}={2:/^[01]+$/,8:/^[0-7]+$/,10:/^\d+$/,16:/^[\da-f]+$/i};
    if (!patterns[radixFrom].test(digits)) return null;
    const integer=parseInt(String(amount),radixFrom);
    return Number.isFinite(integer)?integer.toString(radixTo).toUpperCase():null;
  }
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
  if (tool.slug === 'fuel-economy' && (from.includes('Liters per 100') || to.includes('Liters per 100'))) {
    if (typeof amount !== 'number' || amount <= 0) return null;
    const kmPerLiter=from.includes('Liters per 100')?100/amount:amount*tool.units!.find(u=>u.label===from)!.factor;
    if (!Number.isFinite(kmPerLiter)||kmPerLiter<=0)return null;
    return fmt(to.includes('Liters per 100')?100/kmPerLiter:kmPerLiter/tool.units!.find(u=>u.label===to)!.factor);
  }
  const uFrom=tool.units?.find(u=>u.label===from),uTo=tool.units?.find(u=>u.label===to);
  if(!uFrom||!uTo)return null;
  return fmt(amount*uFrom.factor/uTo.factor);
}
