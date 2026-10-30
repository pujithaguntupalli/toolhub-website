import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Calculator, Check, ChevronDown, Clock3, Copy, FileText, Gauge, Image as ImageIcon, Menu, Search, ShieldCheck, Sparkles, Wrench, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { convert, findTool, popularSlugs, tools, type Field, type Tool } from './tools';
import FilesToolPage from './components/FilesToolPage';

const queryClient = new QueryClient();
const RECENT_KEY = 'multi-toolbox-recent-v1';

function todayForDateInput() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function getRecent(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(value) ? value.filter((s): s is string => typeof s === 'string' && !!findTool(s)).slice(0, 8) : [];
  } catch { return []; }
}
function rememberTool(slug: string) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify([slug, ...getRecent().filter(s => s !== slug)].slice(0, 8))); } catch { /* storage can be unavailable in private mode */ }
}

function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [location]);
  return <header className="topbar">
    <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
      <Link href="/" data-testid="link-brand" className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-[13px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Wrench size={20}/></span>
        <span className="leading-tight"><span className="font-display block text-[17px] font-bold tracking-[-.04em]">multi-toolbox</span><span className="text-[10px] uppercase tracking-[.17em] text-muted-foreground">Useful by design</span></span>
      </Link>
      <nav className="hidden items-center gap-6 lg:gap-8 md:flex" aria-label="Main navigation">
        <Link href="/" className={`nav-link ${location === '/' ? 'text-foreground' : ''}`} data-testid="link-home">Home</Link>
        <Link href="/category/converters" className={`nav-link ${location.includes('converters') ? 'text-foreground' : ''}`} data-testid="link-converters">Converters</Link>
        <Link href="/category/calculators" className={`nav-link ${location.includes('calculators') ? 'text-foreground' : ''}`} data-testid="link-calculators">Calculators</Link>
        <Link href="/category/images" className={`nav-link ${location.includes('images') ? 'text-foreground' : ''}`} data-testid="link-images">Images</Link>
        <Link href="/category/pdf" className={`nav-link ${location.includes('/pdf') ? 'text-foreground' : ''}`} data-testid="link-pdf">PDF</Link>
        <Link href="/about" className="nav-link" data-testid="link-about">About</Link>
      </nav>
      <button className="action-button grid size-10 place-items-center rounded-xl border border-border md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">{mobileOpen ? <X size={18}/> : <Menu size={18}/>}</button>
    </div>
    {mobileOpen && <nav className="grid gap-1 border-t border-border px-5 py-3 md:hidden" aria-label="Mobile navigation">
      {([['Home','/'],['Converters','/category/converters'],['Calculators','/category/calculators'],['Images','/category/images'],['PDF','/category/pdf'],['About','/about']] as const).map(([label,href])=><Link key={href} href={href} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary" data-testid={`mobile-link-${label.toLowerCase()}`}>{label}</Link>)}
    </nav>}
  </header>;
}

function Footer() {
  return <footer className="mt-20 border-t border-border">
    <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-9 md:flex-row md:items-center md:justify-between lg:px-8">
      <div><p className="font-display font-semibold tracking-[-.03em]">Tools for the things in between.</p><p className="mt-1 text-xs text-muted-foreground">Private by default. Calculations happen in your browser.</p></div>
      <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <Link href="/about" data-testid="link-footer-about">About</Link><Link href="/contact" data-testid="link-footer-contact">Contact</Link><Link href="/privacy" data-testid="link-footer-privacy">Privacy</Link><Link href="/terms" data-testid="link-footer-terms">Terms</Link>
      </nav>
    </div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell flex flex-col"><Header/><div className="flex-1">{children}</div><Footer/></div>;
}

function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const Icon = tool.category === 'converter' ? Gauge : tool.category === 'calculator' ? Calculator : tool.category === 'image' ? ImageIcon : FileText;
  const typeLabel = tool.category === 'converter' ? 'Converter' : tool.category === 'calculator' ? 'Calculator' : tool.category === 'image' ? 'Image tool' : 'PDF tool';
  const unavailable = tool.supported === false;
  return <Link href={`/tool/${tool.slug}`} className="tool-card group block p-4 fade-in" style={{ animationDelay: `${Math.min(index, 9) * 25}ms` }} data-testid={`card-tool-${tool.slug}`}>
    <div className="mb-4 flex items-start justify-between">
      <span className={`grid size-10 place-items-center rounded-xl ${tool.category === 'converter' || tool.category === 'image' ? 'bg-[hsl(var(--primary)/.1)] text-primary' : 'bg-[hsl(var(--accent)/.15)] text-[hsl(var(--accent))]'}`}><Icon size={18}/></span>
      <ArrowUpRight size={16} className="mt-1 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"/>
    </div>
    <h3 className="font-display text-[15px] font-semibold tracking-[-.025em]">{tool.label}</h3>
    <p className="mt-1.5 line-clamp-2 min-h-[38px] text-xs leading-[1.6] text-muted-foreground">{tool.description}</p>
    <span className={`mt-3 inline-block font-mono text-[9px] uppercase tracking-[.14em] ${unavailable?'text-amber-700':'text-muted-foreground'}`}>{unavailable?'Not available in browser':typeLabel}</span>
  </Link>;
}

function SearchBox({ onQuery }: { onQuery?: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => query.trim() ? tools.filter(t => `${t.label} ${t.description} ${t.keywords.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7) : [], [query]);
  return <div className="relative z-10 w-full max-w-[620px]">
    <div className="flex h-[58px] items-center gap-3 rounded-2xl border border-border bg-[hsl(var(--card))] px-4 shadow-[0_10px_28px_hsl(168_20%_20%/.06)] focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
      <Search size={19} className="shrink-0 text-muted-foreground"/>
      <input value={query} onChange={e=>{setQuery(e.target.value);onQuery?.(e.target.value)}} onKeyDown={e=>{if(e.key==='Escape')setQuery('')}} placeholder="What do you need to figure out?" aria-label="Search tools" data-testid="input-tool-search" className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/80"/>
      {query && <button onClick={()=>setQuery('')} aria-label="Clear search" data-testid="button-clear-search" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary"><X size={15}/></button>}
      <kbd className="hidden rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground sm:block">{tools.filter((tool)=>tool.supported!==false).length} TOOLS</kbd>
    </div>
    {query && <div className="absolute left-0 right-0 top-[66px] overflow-hidden rounded-2xl border border-border bg-[hsl(var(--card))] p-2 shadow-xl">
      {results.length ? results.map(t=><Link key={t.slug} href={`/tool/${t.slug}`} data-testid={`search-result-${t.slug}`} className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-secondary"><span><span className="block text-sm font-semibold">{t.label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{t.description}</span></span><ArrowRight size={16} className="text-muted-foreground"/></Link>) : <p className="px-3 py-5 text-center text-sm text-muted-foreground">No tools found. Try a different word.</p>}
    </div>}
  </div>;
}

function Home() {
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(()=>setRecent(getRecent()),[]);
  const popular = popularSlugs.map(findTool).filter((t):t is Tool=>!!t);
  const recentTools = recent.map(findTool).filter((t):t is Tool=>!!t);
  return <main>
    <section className="hero-grid relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute -right-20 top-4 size-[380px] rounded-full border border-primary/10 md:right-[4%] md:top-[-80px] md:size-[520px]"><div className="absolute inset-8 rounded-full border border-primary/10"/><div className="absolute inset-[72px] rounded-full border border-primary/10"/><div className="absolute inset-[136px] rounded-full border border-primary/10"/></div>
      <div className="relative mx-auto max-w-[1240px] px-5 pb-16 pt-14 md:pb-24 md:pt-20 lg:px-8">
        <div className="max-w-[720px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[hsl(var(--background)/.82)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-primary"><ShieldCheck size={13}/> Your files stay yours</div>
          <h1 className="font-display max-w-[760px] text-[clamp(2.55rem,6vw,4.65rem)] font-semibold leading-[.98] tracking-[-.075em]">Every tool you need<br/><span className="text-primary">for PDFs, images,<br/>and calculations.</span></h1>
          <p className="mt-6 max-w-[460px] text-[15px] leading-7 text-muted-foreground md:text-base">100% free online tools for PDF compression, high-resolution image editing, quick conversions, and everyday calculations. No accounts, no uploads — just useful answers, right here in your browser.</p>
          <div className="mt-8"><SearchBox/></div>
           <p className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground"><span className="inline-block size-1.5 rounded-full bg-[hsl(var(--accent))]"/> 78 working tools across four categories</p>
        </div>
        <div className="absolute bottom-8 right-[8%] hidden rotate-[-5deg] rounded-2xl border border-primary/15 bg-[hsl(var(--card))] p-4 shadow-lg lg:block">
          <p className="font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">A quick conversion</p><p className="mt-2 font-display text-2xl font-semibold tracking-[-.06em]">5 mi <span className="text-accent">→</span> 8.05 km</p>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1240px] px-5 pt-12 lg:px-8">
      <div className="mb-5 flex items-end justify-between"><div><p className="mb-1 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Your workbench</p><h2 className="font-display text-2xl font-semibold tracking-[-.045em]">Pick up where you left off</h2></div><span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"><Clock3 size={14}/> Stored only on this device</span></div>
      {recentTools.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{recentTools.slice(0,4).map((t,i)=><ToolCard key={t.slug} tool={t} index={i}/>)}</div> : <div className="surface flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-sm">Your recent tools will show up here.</p><p className="mt-1 text-xs text-muted-foreground">Open any tool and it will be saved on this device for next time.</p></div><Link href="/category/converters" className="inline-flex items-center gap-2 text-xs font-semibold text-primary" data-testid="link-browse-tools">Browse tools <ArrowRight size={14}/></Link></div>}
    </section>
    <section className="mx-auto max-w-[1240px] px-5 pt-14 lg:px-8">
       <div className="mb-5 flex items-end justify-between"><div><p className="mb-1 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">A good place to start</p><h2 className="font-display text-2xl font-semibold tracking-[-.045em]">Popular tools</h2></div><Link href="/category/converters" className="hidden items-center gap-2 text-xs font-semibold text-primary sm:flex" data-testid="link-all-tools">Browse tools <ArrowRight size={14}/></Link></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{popular.map((t,i)=><ToolCard key={t.slug} tool={t} index={i}/>)}</div>
    </section>
     <section className="mx-auto max-w-[1240px] px-5 pt-16 lg:px-8">
       <div className="surface grid overflow-hidden md:grid-cols-2">
        <Link href="/category/converters" data-testid="feature-converters" className="group border-b border-border p-6 md:border-b-0 md:border-r md:p-8"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-primary">01 / Convert</span><div className="mt-4 flex items-center justify-between"><h3 className="font-display text-2xl font-semibold tracking-[-.04em]">Make units make sense.</h3><ArrowDownRight className="text-primary transition-transform group-hover:translate-x-1 group-hover:translate-y-1"/></div><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Length, temperature, data, cooking measures and more — with the units clearly labeled.</p><p className="mt-5 text-xs font-semibold text-primary">Explore 20 converters <ArrowRight size={14} className="ml-1 inline"/></p></Link>
        <Link href="/category/calculators" data-testid="feature-calculators" className="group p-6 md:p-8"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">02 / Calculate</span><div className="mt-4 flex items-center justify-between"><h3 className="font-display text-2xl font-semibold tracking-[-.04em]">Get to your answer.</h3><ArrowDownRight className="text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1 group-hover:translate-y-1"/></div><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Everyday math, money estimates and date calculations without a spreadsheet.</p><p className="mt-5 text-xs font-semibold text-[hsl(var(--accent))]">Explore 20 calculators <ArrowRight size={14} className="ml-1 inline"/></p></Link>
         <Link href="/category/images" data-testid="feature-images" className="group border-t border-border p-6 md:border-r md:p-8"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-primary">03 / Images</span><div className="mt-4 flex items-center justify-between"><h3 className="font-display text-2xl font-semibold tracking-[-.04em]">Make images work harder.</h3><ArrowDownRight className="text-primary transition-transform group-hover:translate-x-1 group-hover:translate-y-1"/></div><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Resize, convert, crop, compress and make common edits in your browser.</p><p className="mt-5 text-xs font-semibold text-primary">Explore 20 image tools <ArrowRight size={14} className="ml-1 inline"/></p></Link>
         <Link href="/category/pdf" data-testid="feature-pdf" className="group border-t border-border p-6 md:p-8"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">04 / PDF</span><div className="mt-4 flex items-center justify-between"><h3 className="font-display text-2xl font-semibold tracking-[-.04em]">Get more from a PDF.</h3><ArrowDownRight className="text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1 group-hover:translate-y-1"/></div><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Reorder, convert, merge, extract text and edit PDF pages without uploading files.</p><p className="mt-5 text-xs font-semibold text-[hsl(var(--accent))]">Explore 18 working PDF tools <ArrowRight size={14} className="ml-1 inline"/></p></Link>
      </div>
       <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Sparkles size={14} className="mt-0.5 shrink-0 text-accent"/> Two PDF actions are unavailable in a browser-only build: password protection and password removal. They are labeled clearly and do not claim to process files.</p>
    </section>
  </main>;
}

function CategoryPage({ category }: { category: Tool['category'] }) {
  const isConverter=category==='converter';
  const categoryName=category==='converter'?'Converters':category==='calculator'?'Calculators':category==='image'?'Image Tools':'PDF Tools';
  const items=tools.filter(t=>t.category===category);
  const availableCount=items.filter((tool)=>tool.supported!==false).length;
  const nextCategory=category==='converter'?'calculators':category==='calculator'?'images':category==='image'?'pdf':'converters';
  return <main className="mx-auto max-w-[1240px] px-5 py-10 lg:px-8">
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
       <div><p className="mb-2 font-mono text-[10px] uppercase tracking-[.17em] text-muted-foreground">Multi-toolbox / {categoryName}</p><h1 className="font-display text-4xl font-semibold tracking-[-.06em]">{categoryName}<span className="ml-3 align-middle font-mono text-sm font-normal tracking-normal text-muted-foreground">{availableCount} available</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{category==='converter'?'Clear answers across units, measurements and scales.':category==='calculator'?'Practical answers for planning, comparing and figuring things out.':category==='image'?'Resize, convert, crop and optimize common image formats in your browser.':'Work with PDF pages and convert between PDFs and images without uploading files.'}</p>{category==='pdf'&&<p className="mt-2 text-xs text-amber-700">Password protection and password removal are not supported in this browser-only version.</p>}</div>
       <Link href={`/category/${nextCategory}`} className="inline-flex items-center gap-2 self-start rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-secondary sm:self-auto" data-testid="link-switch-category">View {nextCategory} <ArrowRight size={14}/></Link>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{items.map((t,i)=><ToolCard key={t.slug} tool={t} index={i}/>)}</div>
  </main>;
}

function ResultBlock({ value, note, error }: { value: string; note?: string; error?: string }) {
  return <div className="mt-5 rounded-2xl border border-primary/15 bg-[hsl(var(--primary)/.055)] p-5" aria-live="polite" data-testid="output-result">
    <p className="font-mono text-[10px] uppercase tracking-[.15em] text-primary">Result</p>
    <p className="mt-2 break-words font-display text-[clamp(1.5rem,4vw,2.1rem)] font-semibold leading-tight tracking-[-.05em]">{value || 'Your answer will appear here'}</p>
    {note && <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>}
    {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
  </div>;
}

function ToolPage({ slug }: { slug: string }) {
  const tool=findTool(slug);
  const [, setLocation]=useLocation();
  const [amount,setAmount]=useState('1');
  const [from,setFrom]=useState('');
  const [to,setTo]=useState('');
  const [values,setValues]=useState<Record<string,string>>({});
  const [copied,setCopied]=useState(false);
  useEffect(()=>{if(tool)rememberTool(tool.slug)},[tool?.slug]);
  useEffect(()=>{if(tool?.units?.length){setFrom(tool.units[0].label);setTo(tool.units[1]?.label||tool.units[0].label)}},[tool?.slug]);
  useEffect(()=>{if(tool?.fields){const defaults:Record<string,string>={};tool.fields.forEach(f=>{if(f.type==='select')defaults[f.key]=f.options?.[0]||'';if(f.type==='date'&&f.key==='on')defaults[f.key]=todayForDateInput()});setValues(defaults)}},[tool?.slug]);
  if(!tool)return <NotFound/>;
  if(tool.category==='image'||tool.category==='pdf')return <FilesToolPage tool={tool}/>;
  const isConverter=tool.category==='converter';
  const converterResult=amount===''?null:convert(tool,tool.slug==='number-system'?amount:Number(amount),from,to);
  const calculation=tool.calculate?.(values) ?? null;
  const isTouched=Object.entries(values).some(([k,v])=>v!=='' && !(tool.fields?.find(f=>f.key===k)?.type==='select'));
  const invalid= isConverter ? (amount!=='' && converterResult===null) : (isTouched && !calculation);
  const explanation=isConverter ? (converterResult===null && amount!==''?'Enter a valid value for the selected units.':`${amount || 0} ${from} equals ${converterResult ?? '—'} ${to}.`) : undefined;
  const resultText=isConverter?(converterResult===null?'':`${converterResult} ${to}`):(calculation?.value||'');
  const reset=()=>{setAmount('1');if(tool.fields){const d:Record<string,string>={};tool.fields.forEach(f=>{if(f.type==='select')d[f.key]=f.options?.[0]||'';if(f.type==='date'&&f.key==='on')d[f.key]=todayForDateInput()});setValues(d)}};
  const copy=async()=>{if(!resultText)return;try{await navigator.clipboard.writeText(resultText);setCopied(true);window.setTimeout(()=>setCopied(false),1300)}catch{setCopied(false)}};
  const renderField=(field:Field)=> <label key={field.key} className="block text-xs font-semibold text-foreground">{field.label}
    {field.type==='select'?<select value={values[field.key]??field.options?.[0]??''} onChange={e=>setValues(v=>({...v,[field.key]:e.target.value}))} data-testid={`select-${field.key}`} className="control mt-2 h-12 w-full px-3 text-sm font-normal">{field.options?.map(o=><option key={o} value={o}>{o}</option>)}</select>:
      <input type={field.type==='date'?'date':field.type==='text'?'text':'number'} step={field.step||'any'} value={values[field.key]??''} placeholder={field.placeholder||''} onChange={e=>setValues(v=>({...v,[field.key]:e.target.value}))} data-testid={`input-${field.key}`} className="control mt-2 h-12 w-full px-3 text-sm font-normal placeholder:text-muted-foreground/60"/>}
  </label>;

  return <main className="mx-auto max-w-[1020px] px-5 py-8 lg:px-8">
    <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/" data-testid="breadcrumb-home" className="hover:text-primary">Toolbox</Link><span>/</span><Link href={`/category/${isConverter?'converters':'calculators'}`} data-testid="breadcrumb-category" className="hover:text-primary">{isConverter?'Converters':'Calculators'}</Link><span>/</span><span className="text-foreground">{tool.label}</span></div>
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section className="pt-1">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[.17em] text-primary">{isConverter?'Converter':'Calculator'} / {String(tools.findIndex(t=>t.slug===tool.slug)+1).padStart(2,'0')}</p>
        <h1 className="font-display text-[clamp(2.3rem,6vw,4rem)] font-semibold leading-[1] tracking-[-.065em]">{tool.label}</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{tool.description}</p>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-[hsl(var(--card)/.7)] p-3.5"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-primary"/><p className="text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Private, right in your browser.</span> Your inputs are not uploaded or saved to a server.</p></div>
      </section>
      <section className="surface p-5 sm:p-7">
        {isConverter ? <div className="space-y-5">
          {tool.slug==='number-system' ? <label className="block text-xs font-semibold">Integer<input type="text" inputMode="text" value={amount} onChange={e=>setAmount(e.target.value)} data-testid="input-convert-amount" className="control mt-2 h-12 w-full px-3 text-sm font-normal" placeholder="Enter a whole number"/></label> :
            <label className="block text-xs font-semibold">Value<input type="number" step="any" value={amount} onChange={e=>setAmount(e.target.value)} data-testid="input-convert-amount" className="control mt-2 h-12 w-full px-3 font-mono text-base" placeholder="Enter a value"/></label>}
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <label className="block text-xs font-semibold">From<select value={from} onChange={e=>setFrom(e.target.value)} data-testid="select-convert-from" className="control mt-2 h-12 w-full px-3 text-sm font-normal">{tool.units?.map(u=><option key={u.label}>{u.label}</option>)}</select></label>
            <button onClick={()=>{setFrom(to);setTo(from)}} aria-label="Swap units" data-testid="button-swap-units" className="action-button mb-0.5 grid size-11 place-items-center rounded-xl border border-border hover:bg-secondary"><ArrowRight size={17} className="rotate-90 sm:rotate-0"/></button>
            <label className="block text-xs font-semibold">To<select value={to} onChange={e=>setTo(e.target.value)} data-testid="select-convert-to" className="control mt-2 h-12 w-full px-3 text-sm font-normal">{tool.units?.map(u=><option key={u.label}>{u.label}</option>)}</select></label>
          </div>
          <ResultBlock value={resultText} note={explanation} error={invalid?'Please check the entered value and units.':''}/>
        </div> : <div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">{tool.fields?.map(renderField)}</div>
          <ResultBlock value={calculation?.value||''} note={calculation?.note} error={invalid?'Enter valid values for every required field. Check that dates and denominators are valid.':''}/>
        </div>}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-[11px] text-muted-foreground">Updates as you type</span>
          <div className="flex gap-2">
            <button onClick={reset} data-testid="button-reset-tool" className="action-button rounded-lg border border-border px-3.5 py-2 text-xs font-semibold hover:bg-secondary">Reset</button>
            <button onClick={copy} disabled={!resultText} data-testid="button-copy-result" className="action-button inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied':'Copy result'}</button>
          </div>
        </div>
      </section>
    </div>
    <div className="mt-10 flex items-center justify-between border-t border-border pt-5">
      <p className="text-xs text-muted-foreground">Looking for another quick answer?</p><button onClick={()=>setLocation(`/category/${isConverter?'converters':'calculators'}`)} data-testid="button-back-category" className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline">Browse {isConverter?'converters':'calculators'} <ChevronDown className="-rotate-90" size={14}/></button>
    </div>
  </main>;
}

const infoCopy: Record<string,{eyebrow:string;title:string;intro:string;blocks:Array<[string,string]>}> = {
  about:{eyebrow:'A practical little project',title:'Useful tools, without the fuss.',intro:'Multi-toolbox is a browser-first set of everyday converters, calculators, image tools and PDF tools. We believe the answer to a small question should be easy to find — and private by default.',blocks:[['Made for the in-between moments','Checking a measurement while cooking. Comparing a rate. Working out a date. Multi-toolbox is built for the small tasks that make a day go more smoothly.'],['Your data stays with you','Calculations and file processing run locally in your browser. Inputs and files are not sent to a service, and recent tools are stored only in your browser’s local storage.'],['Tools ready today','78 tools are available across four categories. Password protection and password removal for PDFs are not supported in this browser-only version, and those actions are labeled unavailable.']]},
  contact:{eyebrow:'Say hello',title:'We welcome useful feedback.',intro:'Found a confusing label, a calculation that needs a closer look, or a tool you would genuinely use? The contact channel has not been configured yet.',blocks:[['Contact details','The site owner has not provided a public email address or feedback destination. No message is sent from this page.'],['Help make it better','Please do not include sensitive personal or financial information in public feedback. A useful report includes the tool, values and units involved.']]},
  privacy:{eyebrow:'Plain-language privacy',title:'Your inputs stay in your browser.',intro:'Multi-toolbox does not need an account and does not upload tool inputs or selected files to a processing service.',blocks:[['Local calculations and file processing','Converter calculations and supported image and PDF operations run on your device in the browser. Files and input values are not sent to the app server or an external processing service.'],['Recent tools','We use browser local storage to remember the tool slugs you opened recently. This preference stays on your device and can be cleared through your browser settings.'],['Browser and hosting limits','Your browser and the website host may process ordinary connection information to deliver the site. The app does not collect your uploaded files or tool inputs.']]},
  terms:{eyebrow:'Use of this toolbox',title:'Helpful estimates, not professional advice.',intro:'Multi-toolbox provides general-purpose calculations and conversions for convenience. Please check important results independently.',blocks:[['Accuracy and limits','We aim to use standard formulas and clearly labeled units. Results may not reflect local rules, fees, rounding conventions, or specialist requirements.'],['Your decisions','Financial, health and other results are estimates and are not professional advice. You are responsible for confirming any result before acting on it.'],['Availability','Tools are provided as-is and may change as the product develops. Do not use this site for emergency, safety-critical or regulated decisions.']]},
};
function InfoPage({ page }: { page:keyof typeof infoCopy }) {
  const item=infoCopy[page];
  return <main className="mx-auto max-w-[900px] px-5 py-14 lg:px-8">
    <p className="font-mono text-[10px] uppercase tracking-[.17em] text-primary">{item.eyebrow}</p><h1 className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[.98] tracking-[-.07em]">{item.title}</h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">{item.intro}</p>
    <div className="mt-12 grid gap-4">{item.blocks.map(([title,copy],i)=><article key={title} className="surface grid gap-3 p-5 sm:grid-cols-[130px_1fr] sm:p-6"><p className="font-mono text-[10px] uppercase tracking-[.13em] text-muted-foreground">0{i+1} /</p><div><h2 className="font-display text-lg font-semibold tracking-[-.03em]">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div></article>)}</div>
  </main>;
}

function NotFound() {
  return <main className="mx-auto flex min-h-[55vh] max-w-[900px] flex-col justify-center px-5 py-16 lg:px-8"><p className="font-mono text-xs uppercase tracking-[.17em] text-primary">404 / Not on the bench</p><h1 className="mt-3 font-display text-5xl font-semibold tracking-[-.07em]">That tool isn’t here.</h1><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">The link may have moved, or this tool hasn’t been added yet. Browse the tools that are ready today.</p><Link href="/" data-testid="link-not-found-home" className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Back to the toolbox <ArrowRight size={15}/></Link></main>;
}

function Router() {
  const [location] = useLocation();
  useEffect(() => {
    const slug = location.startsWith('/tool/') ? location.slice('/tool/'.length) : '';
    const tool = slug ? findTool(slug) : undefined;
    const routeTitles: Record<string, string> = {
      '/': 'Private browser tools for everyday questions',
      '/category/converters': 'Unit converters',
      '/category/calculators': 'Calculators',
      '/category/images': 'Image tools',
      '/category/pdf': 'PDF tools',
      '/about': 'About',
      '/contact': 'Contact',
      '/privacy': 'Privacy policy',
      '/terms': 'Terms of use',
    };
    const title = tool?.label || routeTitles[location] || 'Page not found';
    const description = tool?.description || (location === '/' ? '100% free online tools for PDF compression, high-resolution image editing, quick conversions, and everyday calculations. No accounts or uploads; files stay in your browser.' : `${title} in Multi-Toolbox: free tools that work in your browser.`);
    document.title = `${title} | Multi-Toolbox`;
    const setMeta = (selector: string, attribute: 'name'|'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', `${title} | Multi-Toolbox`);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', `${title} | Multi-Toolbox`);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${window.location.origin}${location}`);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${location}`;
  }, [location]);
  return <RoutedErrorBoundary><Shell><Switch>
    <Route path="/" component={Home}/>
    <Route path="/category/converters"><CategoryPage category="converter"/></Route>
    <Route path="/category/calculators"><CategoryPage category="calculator"/></Route>
    <Route path="/category/images"><CategoryPage category="image"/></Route>
    <Route path="/category/pdf"><CategoryPage category="pdf"/></Route>
    <Route path="/tool/:slug">{params=><ToolPage slug={params.slug}/>}</Route>
    <Route path="/about"><InfoPage page="about"/></Route>
    <Route path="/contact"><InfoPage page="contact"/></Route>
    <Route path="/privacy"><InfoPage page="privacy"/></Route>
    <Route path="/terms"><InfoPage page="terms"/></Route>
    <Route component={NotFound}/>
  </Switch></Shell></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}

export default App;
