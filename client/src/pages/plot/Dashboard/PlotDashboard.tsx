// PlotDashboard.tsx
import { motion, AnimatePresence } from 'motion/react';
import { ElementType, useCallback, useEffect, useRef, useState, useDeferredValue } from 'react';
import {
  MdOutlineCheckCircle, MdOutlineLock, MdOutlineAccessTime, MdOutlineInfo,
  MdOutlineWarning, MdHelpOutline, MdOutlineLayers, MdKeyboardArrowDown,
  MdOutlineZoomOutMap, MdOutlineZoomInMap, MdRotateRight, MdZoomOut, MdZoomIn,
  MdPauseCircle, MdOutlineLan, MdOutlineDescription,
} from 'react-icons/md';
import { FaRegFileAlt, FaRegStopCircle } from 'react-icons/fa';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { imgPath } from '../../../constant/BaseUrl';
import { getAllProjects, getPlotsFromStatus, getProjectDeatils } from '../../../services/plot/plotApi';
import { ProjectResponse } from '../master/ViewProp';
import { Link } from 'react-router-dom';
import EditPlot from '../master/EditPlot';
import { BiMap, BiMapPin } from 'react-icons/bi';

type PlotStatus = 'O' | 'S' | 'B' | 'R' | 'H' | 'U';
const STATUS_COLORS: Record<string, string> = {
  O: '#2ECC71', H: '#F1C40F', B: '#3498DB', S: '#E74C3C', R: '#9B59B6', U: '#374151',
};
const STATUS_LABELS: Record<string, string> = {
  O: 'Open', H: 'Hold', B: 'Booked', S: 'Sold', R: 'Reserved', U: 'Unknown',
};
const STATUS_ICONS: Record<PlotStatus, ElementType> = {
  O: MdOutlineCheckCircle,
  S: MdOutlineLock,
  B: MdOutlineAccessTime,
  R: MdOutlineInfo,
  H: MdOutlineWarning,
  U: MdHelpOutline,
};
const STATUS_CONFIG = {
  O: { label: 'Open', color: STATUS_COLORS.O },
  S: { label: 'Sold', color: STATUS_COLORS.S },
  B: { label: 'Booked', color: STATUS_COLORS.B },
  R: { label: 'Reserved', color: STATUS_COLORS.R },
  H: { label: 'Hold', color: STATUS_COLORS.H },
};
const VIEWER_H = 600;
const MARKER_R = 18;

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v);

const getFileType = (fp: string) => {
  const ext = fp?.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext ?? '')) return 'image';
  return 'unknown';
};

// Skeleton
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />
);

// KPICard─
interface KPIProps {
  icon: ElementType; label: string; value: string | number;
  colorClass: string; iconColor: string; loading?: boolean;
}

const KPICard = ({ icon: Icon, label, value, colorClass, iconColor, loading }: KPIProps) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    className="p-4 flex flex-col justify-between rounded-2xl shadow-lg bg-gray-50 dark:bg-gray-600"
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20 hidden`}>
        <Icon size={18} className={iconColor} />
      </div>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-200 uppercase tracking-wider">{label}</span>
    </div>
    {loading ? (
      <Skeleton className="h-8 w-20" />
    ) : (
      <div className="flex items-center gap-1">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
        <span className="text-slate-500 dark:text-slate-400 text-sm">Plots</span>
      </div>
    )}
  </motion.div>
);

// ImageViewer
const ImageViewer = ({ src, alt, plots, onPlotClick, }: { src: string; alt: string; plots: any[]; onPlotClick: (plot: any) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [, tick] = useState(0);

  const panDragging = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; px: number; py: number; distance: number | null }>({ x: 0, y: 0, px: 0, py: 0, distance: null });
  const initialPinch = useRef(1);

  const imgPctToContainerPx = useCallback((pctX: number, pctY: number) => {
    const ir = imgRef.current?.getBoundingClientRect();
    const cr = containerRef.current?.getBoundingClientRect();
    if (!ir || !cr) return { left: 0, top: 0 };
    return { left: ir.left - cr.left + (pctX / 100) * ir.width, top: ir.top - cr.top + (pctY / 100) * ir.height };
  }, []);

  const clampPan = useCallback((p: { x: number; y: number }) => {
    const img = imgRef.current; const con = containerRef.current;
    if (!img || !con) return p;
    const ir = img.getBoundingClientRect(), cr = con.getBoundingClientRect();
    const maxX = Math.max(0, (ir.width - cr.width) / 2);
    const maxY = Math.max(0, (ir.height - cr.height) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, p.x)), y: Math.min(maxY, Math.max(-maxY, p.y)) };
  }, []);

  const applyZoom = useCallback((delta: number) => {
    setZoom(prev => {
      const next = Math.min(20, Math.max(1, Math.round((prev + delta) * 100) / 100));
      if (next === 1) setPan({ x: 0, y: 0 });
      else setPan(p => clampPan(p));
      setTimeout(() => tick(n => n + 1), 50);
      return next;
    });
  }, [clampPan]);

  const zoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setTimeout(() => tick(n => n + 1), 50); };

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    applyZoom(e.deltaY < 0 ? 0.25 : -0.25);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    panDragging.current = true;
    touchStartRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, distance: null };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!panDragging.current || zoom <= 1) return;
    const dx = e.clientX - touchStartRef.current.x;
    const dy = e.clientY - touchStartRef.current.y;
    setPan(clampPan({ x: touchStartRef.current.px + dx, y: touchStartRef.current.py + dy }));
  };
  const onMouseUp = () => { panDragging.current = false; };

  const dist = (t: React.TouchList) => {
    if (t.length < 2) return null;
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  };
  const center = (t: React.TouchList) =>
    t.length >= 2
      ? { x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 }
      : t.length === 1 ? { x: t[0].clientX, y: t[0].clientY } : null;

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const c = center(e.touches);
    if (e.touches.length === 1 && zoom > 1) {
      panDragging.current = true;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: pan.x, py: pan.y, distance: null };
    } else if (e.touches.length === 2) {
      panDragging.current = false;
      touchStartRef.current = { x: c?.x ?? 0, y: c?.y ?? 0, px: pan.x, py: pan.y, distance: dist(e.touches) };
      initialPinch.current = zoom;
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const cr = containerRef.current?.getBoundingClientRect();
    if (e.touches.length === 1 && panDragging.current && zoom > 1) {
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      setPan(clampPan({ x: touchStartRef.current.px + dx, y: touchStartRef.current.py + dy }));
    } else if (e.touches.length === 2 && touchStartRef.current.distance !== null && cr) {
      const nd = dist(e.touches);
      if (nd && touchStartRef.current.distance) {
        const newZoom = Math.round(Math.min(20, Math.max(1, initialPinch.current * nd / touchStartRef.current.distance)) * 100) / 100;
        const c = center(e.touches);
        if (c && newZoom !== zoom) {
          const cx = c.x - cr.left, cy = c.y - cr.top;
          const sf = newZoom / initialPinch.current;
          setZoom(newZoom);
          setPan(p => clampPan({ x: cx - (cx - p.x) * sf, y: cy - (cy - p.y) * sf }));
          setTimeout(() => tick(n => n + 1), 50);
        }
      }
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => { e.preventDefault(); panDragging.current = false; touchStartRef.current.distance = null; };

  const handleMarkerClick = (plot: any, e: React.MouseEvent | React.TouchEvent) => { e.stopPropagation(); onPlotClick(plot); };

  useEffect(() => {
    const h = () => tick(n => n + 1);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const placedPlots = plots.filter(p => p.cX != null && p.cX !== '' && p.cY != null && p.cY !== '');

  return (
    <div style={{
      position: 'relative',
      background: '#e2e8f0',
      overflow: 'hidden',
      isolation: 'isolate'

    }}>
      {/* zoom controls */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 40, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(6px)', borderRadius: 10, padding: '5px 8px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        {([
          { onClick: () => applyZoom(-0.25), disabled: zoom <= 1, Icon: MdZoomOut, title: 'Zoom Out' },
          { onClick: () => applyZoom(+0.25), disabled: false, Icon: MdZoomIn, title: 'Zoom In' },
          { onClick: zoomReset, disabled: zoom === 1 && pan.x === 0 && pan.y === 0, Icon: MdRotateRight, title: 'Reset' },
        ] as const).map(({ onClick, disabled, Icon, title }) => (
          <button key={title} type="button" onClick={onClick} disabled={disabled} title={title}
            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: 'none', background: disabled ? '#f1f5f9' : '#e2e8f0', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1 }}>
            <Icon size={14} color="#334155" />
          </button>
        ))}
        <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
      </div>

      {/* viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}
        style={{
          width: '100%',
          height: VIEWER_H,
          overflow: 'hidden',        // already there ✓
          position: 'relative',
          isolation: 'isolate',      // ← ADD THIS — creates new stacking context
          cursor: panDragging.current ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
          touchAction: 'none'
        }}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: 'center center', transition: panDragging.current ? 'none' : 'transform 0.12s ease-out', willChange: 'transform' }}>
          <img ref={imgRef} src={src} alt={alt} draggable={false}
            onLoad={() => { setLoaded(true); tick(n => n + 1); }}
            style={{ maxWidth: '100%', maxHeight: VIEWER_H, objectFit: 'contain', display: 'block', pointerEvents: 'none', userSelect: 'none' }} />
        </div>

        {loaded && placedPlots.map((plot: any) => {
          const px = imgPctToContainerPx(parseFloat(plot.cX), parseFloat(plot.cY));
          const color = STATUS_COLORS[plot.status] ?? STATUS_COLORS.U;
          const isHov = hovered === plot.plot_sr;
          const size = MARKER_R * 2;
          return (
            <div key={plot.plot_sr}
              onMouseEnter={() => setHovered(plot.plot_sr)} onMouseLeave={() => setHovered(null)}
              onTouchStart={() => setHovered(plot.plot_sr)} onTouchEnd={() => setTimeout(() => setHovered(null), 1500)}
              onClick={(e) => handleMarkerClick(plot, e)}
              style={{ position: 'absolute', left: px.left, top: px.top, transform: 'translate(-50%,-50%)', zIndex: 30, cursor: 'pointer', pointerEvents: 'all' }}>
              <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: color, border: '1px solid #fff', boxShadow: isHov ? `0 0 0 4px ${color}55, 0 4px 14px rgba(0,0,0,0.35)` : '0 2px 8px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', transition: 'box-shadow 0.15s' }}>
                {String(plot.plot_no ?? '').slice(0, 4)}
              </div>
              {isHov && (
                <div style={{ position: 'absolute', bottom: '115%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,23,42,0.93)', color: '#fff', borderRadius: 8, padding: '7px 11px', fontSize: 12, whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,0,0,0.3)', pointerEvents: 'none', zIndex: 50 }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>Plot No: {plot.plot_no}</div>
                  {plot.customer_name && <div style={{ fontWeight: 300, marginBottom: 2 }}>{plot.customer_name}</div>}
                  <div style={{ opacity: 0.75, fontSize: 11 }}>{STATUS_LABELS[plot.status] ?? 'Unknown'}</div>
                  {plot.area && <div style={{ opacity: 0.75, fontSize: 11 }}>Area: {plot.area} sq ft</div>}
                  <div style={{ fontSize: 10, marginTop: 4, color: '#a5b4fc' }}>Click to edit</div>
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(15,23,42,0.93)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// PDFViewer
const PDFViewer = ({ src, title }: { src: string; title: string }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ position: 'relative', background: '#e2e8f0' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading PDF…</p>
          </div>
        </div>
      )}
      <iframe src={`${src}#toolbar=1&navpanes=1`} title={title}
        className="w-full" style={{ height: VIEWER_H, border: 'none' }}
        onLoad={() => setLoading(false)} />
    </div>
  );
};

// Section skeleton
const PlotCardSkeleton = () => (
  <div className="rounded-xl shadow-md overflow-hidden border border-slate-200 p-3 bg-slate-50 space-y-2">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// Main Dashboard
const PlotDashboard = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(1);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [plotStatus, setPlotStatus] = useState('O');
  const [plotDetails, setPlotDetails] = useState<any[]>([]);
  const [plotsLoading, setPlotsLoading] = useState(false);
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(true);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlotForEdit, setSelectedPlotForEdit] = useState<any>(null);

  //data fetchers
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await getAllProjects();
      setProjects(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchDetails = useCallback(async () => {
    setDetailsLoading(true);
    try {
      const res = await getProjectDeatils(selectedProject);
      setProjectDetails(res?.data ?? null);
    } catch (e: any) {
      console.error(e.message);
      setProjectDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  }, [selectedProject]);

  // BUG FIX: include both projectId & status in deps so stale closure is avoided
  const fetchPlotsByStatus = useCallback(async () => {
    setPlotsLoading(true);
    try {
      const res = await getPlotsFromStatus({ projectId: selectedProject, plotStatus });
      setPlotDetails(Array.isArray(res) ? res : []);
    } catch {
      setPlotDetails([]);
    } finally {
      setPlotsLoading(false);
    }
  }, [selectedProject, plotStatus]);

  const handlePlotClick = (plot: any) => { setSelectedPlotForEdit(plot); setShowEditModal(true); };

  useEffect(() => { fetchProjects(); }, []);
  useEffect(() => { fetchDetails(); }, [fetchDetails]);
  useEffect(() => { fetchPlotsByStatus(); }, [fetchPlotsByStatus]);

  // derived data
  const { project_details, project_statistics, plots } = projectDetails ?? {};

  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: plots?.filter((p: any) => p.status === key).length ?? 0,
    color: cfg.color,
  }));

  // Use deferredSearch so the heavy filter doesn't block typing
  const filteredPlots = plotDetails.filter((p: any) =>
    Object.values(p).some(v => String(v).toLowerCase().includes(deferredSearch.toLowerCase()))
  );

  const fileUrl = project_details?.file_path ? `${imgPath}/${project_details.file_path}` : null;
  const fileType = fileUrl ? getFileType(project_details.file_path) : null;
  const placedCount = plots?.filter((p: any) => p.cX != null && p.cX !== '' && p.cY != null && p.cY !== '').length ?? 0;

  // ── render

  // Global spinner only on initial project list load
  if (projectsLoading && !projects.length) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full sm:m-2 rounded-md">

      {/* ── Header ── */}
      <header className="relative min-h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-6 pt-8 pb-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              {detailsLoading ? (
                <>
                  <Skeleton className="h-5 w-24 mb-2 bg-white/20" />
                  <Skeleton className="h-9 w-64 mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-80 bg-white/20" />
                </>
              ) : (
                <>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                    {project_details?.project_type ?? 'RESIDENTIAL'}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-2 mb-2">
                    {project_details?.project_name ?? 'Select a project'}
                  </h1>
                  <p className="text-slate-300 flex justify-start items-center gap-1">
                    <BiMap className='h-4 w-4 ' />
                    {[project_details?.address?.line1, project_details?.address?.city,
                    project_details?.address?.pin_code, project_details?.address?.state]
                      .filter(Boolean).join(', ')}
                  </p>
                </>
              )}
            </div>

            <div className="md:w-72">
              <label className="block text-[10px] font-bold text-slate-200 uppercase tracking-widest mb-1.5 ml-1">SELECT PROJECT</label>
              <div className="relative">
                <select
                  value={selectedProject}
                  onChange={e => setSelectedProject(Number(e.target.value))}
                  disabled={projectsLoading}
                  className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 pr-12 text-white font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:bg-white/20 w-full disabled:opacity-50"
                >
                  {projects.map(p => (
                    <option key={p?.project_details?.project_id} value={p?.project_details?.project_id} className="text-slate-900">
                      {p?.project_details?.project_name}
                    </option>
                  ))}
                </select>
                <MdKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 -mt-6 relative rounded-lg">

        {/* ── KPI ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {[
            {
              icon: MdOutlineCheckCircle, label: 'Available', value: project_statistics?.available_plots ?? 0,
              colorClass: 'bg-green-500 dark:bg-green-300', iconColor: 'text-green-700'
            },
            { icon: MdOutlineLock, label: 'Sold', value: project_statistics?.sold_plots ?? 0, colorClass: 'bg-red-500', iconColor: 'text-red-700' },
            {
              icon: MdOutlineAccessTime, label: 'Booked', value: project_statistics?.booked_plots ?? 0,
              colorClass: 'bg-yellow-500 dark:bg-yellow-300', iconColor: 'text-yellow-700'
            },
            {
              icon: MdPauseCircle, label: 'Hold', value: project_statistics?.hold_plots ?? 0,
              colorClass: 'bg-orange-500 dark:bg-orange-300', iconColor: 'text-orange-700'
            },
            {
              icon: FaRegStopCircle, label: 'Reserved', value: project_statistics?.reserved_plots ?? 0,
              colorClass: 'bg-purple-500 dark:bg-purple-300', iconColor: 'text-purple-700'
            },
            {
              icon: MdOutlineLayers, label: 'Total', value: project_statistics?.total_plots ?? 0,
              colorClass: 'bg-blue-500 dark:bg-blue-300', iconColor: 'text-blue-700'
            }
          ].map(card => (
            <KPICard key={card.label} {...card} loading={detailsLoading} />
          ))}
        </div>

        {/* ── Layout viewer ── */}
        <section className="overflow-hidden mb-4 rounded-lg shadow-lg">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600"><MdOutlineDescription size={20} /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Project Layout</h3>
                <p className="text-xs text-slate-500">
                  {detailsLoading ? 'Loading…' : placedCount > 0 ? `${placedCount} of ${plots?.length ?? 0} plots pinned` : 'Architectural masterplan'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsLayoutExpanded(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              {isLayoutExpanded ? <MdOutlineZoomInMap size={18} /> : <MdOutlineZoomOutMap size={18} />}
              {isLayoutExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          <motion.div animate={{ height: isLayoutExpanded ? 'auto' : `${VIEWER_H}px` }} className="relative overflow-hidden bg-slate-100">
            {detailsLoading ? (
              <div className="flex items-center justify-center" style={{ height: VIEWER_H }}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">Loading…</p>
                </div>
              </div>
            ) : fileType === 'pdf' ? <PDFViewer src={fileUrl!} title="Project Layout" />
              : fileType === 'image' ? <ImageViewer src={fileUrl!} alt="Project Layout" plots={plots ?? []} onPlotClick={handlePlotClick} />
                : (
                  <div className="flex items-center justify-center min-h-[400px] bg-slate-100">
                    <div className="text-center">
                      <FaRegFileAlt size={48} className="mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-600">No document available</p>
                    </div>
                  </div>
                )}
            {!isLayoutExpanded && fileType !== 'pdf' && !detailsLoading && (
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
            )}
          </motion.div>
        </section>

        {/* ── Status legend & pie chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 " hidden>
          <div className="p-8 rounded-lg shadow-2xl">
            <h3 className="text-lg font-semibold mb-6">Plot Status</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(STATUS_COLORS).filter(([k]) => k !== 'U').map(([code, color]) => (
                <div key={code} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm font-semibold text-slate-700">{STATUS_LABELS[code]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            {detailsLoading ? (
              <div className="flex items-center justify-center" style={{ height: 320 }}>
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
              </div>
            ) : (
              <div className="w-full" style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                    <Pie data={statusData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine>
                      {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, name) => [`${v} plots`, name]}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'white', padding: '8px 12px' }} />
                    <Legend verticalAlign="bottom" align="center" layout="horizontal" wrapperStyle={{ paddingTop: 20, fontSize: 12 }} iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── Plot inventory ── */}
        <section className="mt-2 overflow-hidden rounded-lg shadow-lg mb-8">
          <div className="p-4 border-b border-slate-100 flex justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1">
                <MdOutlineLan size={16} className="text-purple-600" /> Plot List
              </h3>
              <p className="text-sm text-slate-500 mt-1">View all plots in this project</p>
            </div>
            <Link
              to="/plot/master/add-plot"
              className="flex gap-2 items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <span className="hidden sm:inline">Add Projects</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </Link>
          </div>

          <div className="m-2 flex justify-center items-center gap-2">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search plots…"
              className="bg-white/10 backdrop-blur-md rounded-lg px-5 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-1/2"
            />
            <select
              value={plotStatus}
              onChange={e => setPlotStatus(e.target.value)}
              className="w-full sm:w-1/2 px-2 py-2 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold"
            >
              <option value="O">Available</option>
              <option value="H">Hold</option>
              <option value="B">Booked</option>
              <option value="S">Sold</option>
              <option value="R">Reserved</option>
            </select>
          </div>

          <div className="p-2">
            {/* Loading skeleton grid */}
            {plotsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => <PlotCardSkeleton key={i} />)}
              </div>
            ) : filteredPlots.length === 0 ? (
              <div className="flex justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 px-4 text-center">
                  <h4 className="text-xl font-bold text-slate-700 mb-2">No Plots Found</h4>
                  <p className="text-slate-500 mb-4 max-w-md">
                    {deferredSearch.trim() ? `No plots match "${deferredSearch}".` : 'No plots available for this status.'}
                  </p>
                  {deferredSearch.trim() && (
                    <button onClick={() => setSearch('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Clear Search
                    </button>
                  )}
                </motion.div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                  {filteredPlots.map((plot: any) => {
                    const StatusIcon = STATUS_ICONS[plot?.status as PlotStatus] ?? MdHelpOutline;
                    const color = STATUS_COLORS[plot?.status] ?? STATUS_COLORS.U;
                    const bg = { O: 'bg-green-50 hover:bg-green-100', S: 'bg-red-50 hover:bg-red-100', B: 'bg-blue-50 hover:bg-blue-100', R: 'bg-purple-50 hover:bg-purple-100', H: 'bg-yellow-50 hover:bg-yellow-100' }[plot?.status as string] ?? 'bg-gray-50 hover:bg-gray-100';
                    return (
                      <motion.div
                        key={plot?.plot_sr}
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => handlePlotClick(plot)}
                        className={`${bg} rounded-xl shadow-md overflow-hidden border border-slate-200 cursor-pointer`}
                      >
                        <div className="p-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
                                  {STATUS_LABELS[plot?.status] ?? 'Unknown'}
                                </span>
                              </div>
                              <h4 className="text-md font-bold text-slate-800">Plot No: {plot?.plot_no}</h4>
                            </div>
                            <div className="p-2 rounded-lg bg-white/50 backdrop-blur">
                              <StatusIcon size={18} style={{ color }} />
                            </div>
                          </div>
                          {[
                            { label: 'Remark', value: plot?.vc_remarks },
                            { label: 'Area', value: `${Number(plot?.area).toLocaleString()} sq ft` },
                            { label: 'Price', value: formatCurrency(plot?.price) },
                            { label: 'Customer', value: plot?.customer_name || 'N/A' },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between py-1 border-b border-slate-200/50 last:border-0">
                              <span className="text-sm text-slate-600">{label}</span>
                              <span className="text-sm font-semibold text-slate-800">{value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>

      <EditPlot show={showEditModal} setShow={setShowEditModal} selectedPlot={selectedPlotForEdit} fetchProjectData={fetchDetails}
        isEdit />
    </div>
  );
};

export default PlotDashboard;