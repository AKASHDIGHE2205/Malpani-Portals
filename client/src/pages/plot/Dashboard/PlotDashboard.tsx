// PlotDashboard.tsx
import { motion } from 'motion/react';
import { ElementType, useCallback, useEffect, useRef, useState } from 'react';
import {
  MdOutlineCheckCircle, MdOutlineLock, MdOutlineAccessTime, MdOutlineInfo,
  MdOutlineWarning, MdHelpOutline, MdOutlineLayers,
  MdKeyboardArrowDown, MdOutlineZoomOutMap, MdOutlineZoomInMap, MdRotateRight,
  MdZoomOut, MdZoomIn, MdPauseCircle, MdOutlineCurrencyRupee, MdOutlineMaximize,
  MdOutlineLan, MdOutlineDescription
} from 'react-icons/md';
import { FaRegFileAlt } from 'react-icons/fa';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { imgPath } from '../../../constant/BaseUrl';
import { getAllProjects, getProjectDeatils } from '../../../services/plot/plotApi';
import { ProjectResponse } from '../master/ViewProp';
import { Link } from 'react-router-dom';

type PlotStatus = 'O' | 'S' | 'B' | 'R' | 'H' | 'U';

const STATUS_COLORS: Record<string, string> = { O: '#2ECC71', H: '#F1C40F', B: '#3498DB', S: '#E74C3C', R: '#9B59B6', U: '#374151', };
const STATUS_LABELS: Record<string, string> = { O: 'Open', H: 'Hold', B: 'Booked', S: 'Sold', R: 'Reserved', U: 'Unknown', };
const STATUS_ICONS: Record<PlotStatus, ElementType> = { O: MdOutlineCheckCircle, S: MdOutlineLock, B: MdOutlineAccessTime, R: MdOutlineInfo, H: MdOutlineWarning, U: MdHelpOutline, };
const STATUS_CONFIG = {
  O: { label: 'Open', color: STATUS_COLORS.O },
  S: { label: 'Sold', color: STATUS_COLORS.S },
  B: { label: 'Booked', color: STATUS_COLORS.B },
  R: { label: 'Reserved', color: STATUS_COLORS.R },
  H: { label: 'Hold', color: STATUS_COLORS.H },
};

const VIEWER_H = 600
const MARKER_R = 18

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPIProps { icon: ElementType; label: string; value: string | number; colorClass: string; iconColor: string }
const KPICard = ({ icon: Icon, label, value, colorClass, iconColor }: KPIProps) => (
  <motion.div whileHover={{ scale: 1.02, y: -4 }}
    className="p-4 flex flex-col justify-between rounded-2xl shadow-lg bg-gray-50 dark:bg-gray-600">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20`}><Icon size={18} className={iconColor} /></div>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-center gap-1">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
      <span className="text-slate-500 text-sm">Plots</span>
    </div>
  </motion.div>
)

// ─── ImageViewer — zoom/pan + marker overlay (Fixed for mobile) ──────────────────────────────────

const ImageViewer = ({ src, alt, plots }: { src: string; alt: string; plots: any[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [, tick] = useState(0)

  const panDragging = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number; px: number; py: number; distance: number | null }>({ x: 0, y: 0, px: 0, py: 0, distance: null })
  const initialPinchZoom = useRef(1)

  // ── helpers ────────────────────────────────────────────────────────────────

  const imgPctToContainerPx = useCallback((pctX: number, pctY: number) => {
    const ir = imgRef.current?.getBoundingClientRect()
    const cr = containerRef.current?.getBoundingClientRect()
    if (!ir || !cr) return { left: 0, top: 0 }
    return {
      left: ir.left - cr.left + (pctX / 100) * ir.width,
      top: ir.top - cr.top + (pctY / 100) * ir.height,
    }
  }, [])

  // ── zoom with boundary clamping ───────────────────────────────────────────────────

  const clampPan = (p: { x: number; y: number }, z: number) => {
    console.log(z);

    const img = imgRef.current; const con = containerRef.current
    if (!img || !con) return p

    // Get actual scaled dimensions
    const imgRect = img.getBoundingClientRect()
    const conRect = con.getBoundingClientRect()

    // Calculate max pan values based on image bounds
    const maxX = Math.max(0, (imgRect.width - conRect.width) / 2)
    const maxY = Math.max(0, (imgRect.height - conRect.height) / 2)

    return {
      x: Math.min(maxX, Math.max(-maxX, p.x)),
      y: Math.min(maxY, Math.max(-maxY, p.y))
    }
  }

  const applyZoom = (delta: number, centerX?: number, centerY?: number) => {
    setZoom(prev => {
      // Change this line - remove the upper bound (4) or set it to a very high number
      // Option 1: Set a very high max (e.g., 20x or 2000%)
      const next = Math.min(20, Math.max(1, Math.round((prev + delta) * 100) / 100))

      // Option 2: No upper limit at all (uncomment below and comment the line above)
      // const next = Math.max(0.5, Math.round((prev + delta) * 100) / 100)

      if (next === 1) {
        setPan({ x: 0, y: 0 })
      } else if (centerX !== undefined && centerY !== undefined && prev !== 1) {
        const scale = next / prev
        setPan(prevPan => clampPan({
          x: centerX - (centerX - prevPan.x) * scale,
          y: centerY - (centerY - prevPan.y) * scale,
        }, next))
      } else {
        setPan(p => clampPan(p, next))
      }
      setTimeout(() => tick(n => n + 1), 50)
      return next
    })
  }

  const zoomIn = () => applyZoom(+0.25)
  const zoomOut = () => applyZoom(-0.25)
  const zoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setTimeout(() => tick(n => n + 1), 50) }

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    e.deltaY < 0 ? zoomIn() : zoomOut()
  }

  // ── pan (mouse) ────────────────────────────────────────────────────────────────────

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    panDragging.current = true
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      px: pan.x,
      py: pan.y,
      distance: null
    }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!panDragging.current || zoom <= 1) return
    const dx = e.clientX - touchStartRef.current.x
    const dy = e.clientY - touchStartRef.current.y
    setPan(clampPan({
      x: touchStartRef.current.px + dx,
      y: touchStartRef.current.py + dy,
    }, zoom))
  }

  const onMouseUp = () => { panDragging.current = false }

  // ── touch events for mobile (pinch + pan) ─────────────────────────────────────────

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length === 0) return null
    if (touches.length === 1) {
      return { x: touches[0].clientX, y: touches[0].clientY }
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touches = e.touches
    const center = getTouchCenter(touches)

    if (touches.length === 1 && zoom > 1) {
      // Single touch for panning
      panDragging.current = true
      touchStartRef.current = {
        x: touches[0].clientX,
        y: touches[0].clientY,
        px: pan.x,
        py: pan.y,
        distance: null
      }
    } else if (touches.length === 2) {
      // Two touches for pinch zoom
      panDragging.current = false
      const distance = getTouchDistance(touches)
      touchStartRef.current = {
        x: center?.x || 0,
        y: center?.y || 0,
        px: pan.x,
        py: pan.y,
        distance: distance
      }
      initialPinchZoom.current = zoom
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const touches = e.touches
    const containerRect = containerRef.current?.getBoundingClientRect()

    if (touches.length === 1 && panDragging.current && zoom > 1) {
      // Pan with one finger
      const dx = touches[0].clientX - touchStartRef.current.x
      const dy = touches[0].clientY - touchStartRef.current.y
      setPan(clampPan({
        x: touchStartRef.current.px + dx,
        y: touchStartRef.current.py + dy,
      }, zoom))
    } else if (touches.length === 2 && touchStartRef.current.distance !== null) {
      // Pinch zoom
      const newDistance = getTouchDistance(touches)
      if (newDistance && touchStartRef.current.distance) {
        const scale = newDistance / touchStartRef.current.distance
        let newZoom = Math.min(4, Math.max(1, initialPinchZoom.current * scale))
        newZoom = Math.round(newZoom * 100) / 100

        if (newZoom !== zoom && containerRect) {
          const center = getTouchCenter(touches)
          if (center) {
            // Convert screen coordinates to container-relative coordinates
            const containerCenter = {
              x: center.x - containerRect.left,
              y: center.y - containerRect.top
            }

            setZoom(newZoom)
            if (newZoom === 1) {
              setPan({ x: 0, y: 0 })
            } else {
              // Adjust pan to zoom toward pinch center
              const scaleFactor = newZoom / initialPinchZoom.current
              setPan(prevPan => clampPan({
                x: containerCenter.x - (containerCenter.x - prevPan.x) * scaleFactor,
                y: containerCenter.y - (containerCenter.y - prevPan.y) * scaleFactor,
              }, newZoom))
            }
            setTimeout(() => tick(n => n + 1), 50)
          }
        }
      }
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    panDragging.current = false
    touchStartRef.current.distance = null
  }

  // resize → recompute markers
  useEffect(() => {
    const h = () => tick(n => n + 1)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])

  // ── markers ────────────────────────────────────────────────────────────────

  const placedPlots = plots.filter(p => p.cX != null && p.cX !== '' && p.cY != null && p.cY !== '')

  return (
    <div style={{ position: "relative", background: "#e2e8f0" }}>

      {/* zoom controls */}
      <div style={{
        position: "absolute", top: 12, right: 12, zIndex: 40,
        display: "flex", alignItems: "center", gap: 4,
        background: "rgba(255,255,255,0.93)", backdropFilter: "blur(6px)",
        borderRadius: 10, padding: "5px 8px", boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}>
        <button type="button" onClick={zoomOut} disabled={zoom <= 1}
          style={{
            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6, border: "none", background: zoom <= 1 ? "#f1f5f9" : "#e2e8f0",
            cursor: zoom <= 1 ? "not-allowed" : "pointer", opacity: zoom <= 1 ? 0.45 : 1
          }}
          title="Zoom Out (Ctrl+Scroll)">
          <MdZoomOut size={14} color="#334155" />
        </button>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", minWidth: 40, textAlign: "center" }}>
          {Math.round(zoom * 100)}%
        </span>
        <button type="button" onClick={zoomIn}
          style={{
            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6, border: "none", background: "#e2e8f0",
            cursor: "pointer", opacity: 1
          }}
          title="Zoom In (Ctrl+Scroll)">
          <MdZoomIn size={14} color="#334155" />
        </button>
        <button type="button" onClick={zoomReset}
          style={{
            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6, border: "none", background: "#e2e8f0", cursor: "pointer",
            opacity: zoom === 1 && pan.x === 0 && pan.y === 0 ? 0.35 : 1
          }}
          title="Reset View">
          <MdRotateRight size={14} color="#334155" />
        </button>
      </div>

      {/* hint */}
      <div style={{
        position: "absolute", bottom: 14, left: 14, zIndex: 30,
        background: "rgba(0,0,0,0.6)", color: "#fff",
        borderRadius: 20, padding: "4px 12px", fontSize: 11,
        backdropFilter: "blur(4px)", pointerEvents: "none",
      }}>
        {window.innerWidth > 768 ? "Ctrl+Scroll to zoom · Drag to pan" : "Pinch to zoom · Drag to pan"}
      </div>

      {/* viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          width: "100%", height: VIEWER_H,
          overflow: "hidden", position: "relative",
          cursor: panDragging.current ? "grabbing" : zoom > 1 ? "grab" : "default",
          touchAction: "none",
        }}
      >
        {/* transform wrapper — image only */}
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: panDragging.current ? "none" : "transform 0.12s ease-out",
          willChange: "transform",
        }}>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            draggable={false}
            onLoad={() => { setLoaded(true); tick(n => n + 1) }}
            style={{
              maxWidth: "100%", maxHeight: VIEWER_H, objectFit: "contain", display: "block",
              pointerEvents: "none", userSelect: "none"
            }}
          />
        </div>

        {/* markers — outside transform, positioned via imgPctToContainerPx */}
        {loaded && placedPlots.map((plot: any) => {
          const px = imgPctToContainerPx(parseFloat(plot.cX), parseFloat(plot.cY))
          const color = STATUS_COLORS[plot.status] ?? STATUS_COLORS.U
          const isHov = hovered === plot.plot_sr
          const size = MARKER_R * 2

          return (
            <div
              key={plot.plot_sr}
              onMouseEnter={() => setHovered(plot.plot_sr)}
              onMouseLeave={() => setHovered(null)}
              onTouchStart={() => setHovered(plot.plot_sr)}
              onTouchEnd={() => setTimeout(() => setHovered(null), 1500)}
              style={{
                position: "absolute",
                left: px.left,
                top: px.top,
                transform: "translate(-50%, -50%)",
                zIndex: 30,
                cursor: "pointer",
                pointerEvents: "all",
              }}
            >
              {/* badge */}
              <div style={{
                width: size, height: size, borderRadius: "50%",
                backgroundColor: color,
                border: "1px solid #fff",
                boxShadow: isHov ? `0 0 0 4px ${color}55, 0 4px 14px rgba(0,0,0,0.35)` : "0 2px 8px rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff",
                whiteSpace: "nowrap", overflow: "hidden",
                transition: "box-shadow 0.15s",
              }}>
                {String(plot.plot_no ?? '').slice(0, 4)}
              </div>

              {/* tooltip on hover */}
              {isHov && (
                <div style={{
                  position: "absolute",
                  bottom: "115%", left: "50%", transform: "translateX(-50%)",
                  background: "rgba(15,23,42,0.93)", color: "#fff",
                  borderRadius: 8, padding: "7px 11px",
                  fontSize: 12, whiteSpace: "nowrap",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                  pointerEvents: "none", zIndex: 50,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>Plot No : {plot.plot_no}</div>
                  {plot.customer_name && (<div style={{ fontWeight: 300, marginBottom: 2 }}>Plot {plot.customer_name}</div>)}
                  <div style={{ opacity: 0.75, fontSize: 11 }}>{STATUS_LABELS[plot.status] ?? 'Unknown'}</div>
                  {plot.area && <div style={{ opacity: 0.75, fontSize: 11 }}>Area: {plot.area} sq ft</div>}
                  {/* arrow */}
                  <div style={{
                    position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                    width: 0, height: 0,
                    borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                    borderTop: "5px solid rgba(15,23,42,0.93)",
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────

const PDFViewer = ({ src, title }: { src: string; title: string }) => {
  const [loading, setLoading] = useState(true)
  return (
    <div style={{ position: "relative", background: "#e2e8f0" }}>
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading PDF...</p>
          </div>
        </div>
      )}
      <iframe src={`${src}#toolbar=1&navpanes=1`} title={title}
        className="w-full" style={{ height: VIEWER_H, border: "none" }}
        onLoad={() => setLoading(false)} />
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const PlotDashboard = () => {
  const [project, setProject] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(1)
  const [projectDetails, setProjectDetails] = useState<any>(null)
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllProjects()
      setProject(Array.isArray(res?.data) ? res.data : [])
    } catch { setProject([]) }
    finally { setLoading(false) }
  }

  const fetchDetails = async () => {
    try {
      const res = await getProjectDeatils(selectedProject)
      setProjectDetails(res?.data || null)
    } catch (e: any) { console.error(e.message) }
  }

  useEffect(() => { fetchDetails() }, [selectedProject])
  useEffect(() => { fetchData() }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
      </div>
    </div>
  )

  if (!projectDetails) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 dark:text-gray-300">Select a project to view dashboard</p>
    </div>
  )

  const { project_details, project_statistics, plots } = projectDetails

  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: plots?.filter((p: any) => p.status === key).length || 0,
    color: cfg.color,
  }))

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v)

  const getFileType = (fp: string) => {
    const ext = fp?.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'pdf'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext ?? '')) return 'image'
    return 'unknown'
  }

  const fileUrl = project_details?.file_path ? `${imgPath}/${project_details.file_path}` : null
  const fileType = fileUrl ? getFileType(project_details.file_path) : null
  const placedCount = plots?.filter((p: any) => p.cX != null && p.cX !== '' && p.cY != null && p.cY !== '').length ?? 0

  const filteredPlots = plots?.filter((p: any) =>
    Object.values(p).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  ) ?? []

  return (
    <div className="min-h-screen w-full sm:m-2 rounded-md">

      {/* Header */}
      <header className="relative min-h-48 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-6 pt-8 pb-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                {project_details?.project_type || 'RESIDENTIAL'}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-2 mb-2">
                {project_details?.project_name || 'Property'}
              </h1>
              <p className="text-slate-300">
                {[project_details?.address?.line1, project_details?.address?.city,
                project_details?.address?.pin_code, project_details?.address?.state
                ].filter(Boolean).join(', ')}
              </p>
            </div>
            <div className="md:w-72">
              <label className="block text-[10px] font-bold text-slate-200 uppercase tracking-widest mb-1.5 ml-1">SELECT PROJECT</label>
              <div className="relative">
                <select value={selectedProject} onChange={e => setSelectedProject(Number(e.target.value))}
                  className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 pr-12 text-white font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-white/20 w-full">
                  {project.map(p => (
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

      <main className="mx-auto max-w-7xl px-6 -mt-6 relative">

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <KPICard icon={MdOutlineLayers} label="Total" value={project_statistics?.total_plots || 0} colorClass="bg-blue-500" iconColor="text-blue-700" />
          <KPICard icon={MdOutlineCheckCircle} label="Available" value={project_statistics?.available_plots || 0} colorClass="bg-green-500" iconColor="text-green-700" />
          <KPICard icon={MdOutlineLock} label="Sold" value={project_statistics?.sold_plots || 0} colorClass="bg-red-500" iconColor="text-red-700" />
          <KPICard icon={MdOutlineAccessTime} label="Booked" value={project_statistics?.booked_plots || 0} colorClass="bg-yellow-500" iconColor="text-yellow-700" />
          <KPICard icon={MdPauseCircle} label="Hold" value={project_statistics?.hold_plots || 0} colorClass="bg-orange-500" iconColor="text-orange-700" />
          <KPICard icon={MdPauseCircle} label="Reserved" value={project_statistics?.reserved_plots || 0} colorClass="bg-purple-500" iconColor="text-purple-700" />
        </div>

        {/* Layout viewer */}
        <section className="overflow-hidden mb-4 rounded-lg shadow-lg">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600"><MdOutlineDescription size={20} /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Project Layout</h3>
                <p className="text-xs text-slate-500">
                  {placedCount > 0 ? `${placedCount} of ${plots?.length ?? 0} plots pinned` : 'Architectural masterplan'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsLayoutExpanded(!isLayoutExpanded)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              {isLayoutExpanded ? <MdOutlineZoomInMap size={18} /> : <MdOutlineZoomOutMap size={18} />}
              {isLayoutExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          <motion.div animate={{ height: isLayoutExpanded ? 'auto' : `${VIEWER_H}px` }} className="relative overflow-hidden bg-slate-100">
            {fileType === 'pdf' ? <PDFViewer src={fileUrl!} title="Project Layout" />
              : fileType === 'image' ? <ImageViewer src={fileUrl!} alt="Project Layout" plots={plots ?? []} />
                : (
                  <div className="flex items-center justify-center min-h-[400px] bg-slate-100">
                    <div className="text-center">
                      <FaRegFileAlt size={48} className="mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-600">No document available</p>
                    </div>
                  </div>
                )}
            {!isLayoutExpanded && fileType !== 'pdf' && (
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
            )}
          </motion.div>
        </section>

        {/* Status legend & pie chart - FIXED for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status legend */}
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

          {/* Pie Chart - FIXED height and layout */}
          <div className="p-4 rounded-lg shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            <div className="w-full" style={{ height: "320px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {statusData.map((e, i) => (<Cell key={i} fill={e.color} />))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} plots`, name]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      backgroundColor: 'white',
                      padding: '8px 12px'
                    }} />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px"
                    }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Plot inventory */}
        <section className="mt-2 overflow-hidden rounded-lg shadow-lg">
          <div className="p-4 border-b border-slate-100 flex justify-between ">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1">
                <MdOutlineLan size={16} className="text-purple-600" /> Plot Inventory
              </h3>
              <p className="text-sm text-slate-500 mt-1">View all plots in this project</p>
            </div>
            <div>
              <Link
                to={'/plot/master/plot-view'}
                className="flex gap-2 items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <span className="hidden sm:inline">Add Project</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
              </Link>
            </div>
          </div>
          <div className="m-2">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search plots..."
              className="bg-white/10 backdrop-blur-md rounded-lg px-5 py-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-1/2" />
          </div>

          <div className="p-2">
            {filteredPlots.length === 0 ? (
              <div className="flex justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-16 px-4 text-center">
                  <h4 className="text-xl font-bold text-slate-700 mb-2">No Plots Found</h4>
                  <p className="text-slate-500 mb-4 max-w-md">
                    {search.trim() ? `No plots match "${search}".` : 'No plots available.'}
                  </p>
                  {search.trim() && (
                    <button onClick={() => setSearch('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Clear Search
                    </button>
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                {filteredPlots.map((plot: any) => {
                  const StatusIcon = STATUS_ICONS[plot?.status as PlotStatus] ?? MdHelpOutline
                  const color = STATUS_COLORS[plot?.status] ?? STATUS_COLORS.U
                  const bg = { O: 'bg-green-50 hover:bg-green-100', S: 'bg-red-50 hover:bg-red-100', B: 'bg-blue-50 hover:bg-blue-100', R: 'bg-purple-50 hover:bg-purple-100', H: 'bg-yellow-50 hover:bg-yellow-100' }[plot?.status as string] ?? 'bg-gray-50 hover:bg-gray-100'
                  return (
                    <motion.div key={plot?.plot_sr} whileHover={{ scale: 1.02, y: -2 }}
                      className={`${bg} rounded-xl shadow-md overflow-hidden border border-slate-200`}>
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
                        <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
                          <span className="text-sm text-slate-600 flex items-center gap-2"><MdOutlineMaximize size={14} className="text-slate-400" />Area</span>
                          <span className="text-sm font-semibold text-slate-800">{Number(plot?.area).toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
                          <span className="text-sm text-slate-600 flex items-center gap-2"><MdOutlineCurrencyRupee size={14} className="text-slate-400" />Price</span>
                          <span className="text-sm text-slate-800">{formatCurrency(plot?.price)}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-slate-600 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Customer
                          </span>
                          <span className="text-sm font-medium text-slate-800">{plot?.customer_name || 'N/A'}</span>
                        </div>
                        {plot?.cX && plot?.cY && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 mt-1">
                            <span className="text-xs text-slate-500">Map position</span>
                            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Pinned
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
export default PlotDashboard