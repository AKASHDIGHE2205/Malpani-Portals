/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from "crypto-js"
import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { CiTrash } from "react-icons/ci"
import { FiSave, FiX } from "react-icons/fi"
import { IoAddCircleOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { AddPlotProperty } from "../../../services/plot/plotApi"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plot {
  id: string
  plot_sr: string
  plot_no: string
  area: string
  price: string
  survey_no: string
  status: string
  customer_name: string
  book_date: string
  book_amount: string
  sold_date: string
  sold_amount: string
  vc_remarks: string
  cX: string
  cY: string
}

interface PropertyFormData {
  project_name: string
  nick_name: string
  add1: string
  add2: string
  add3: string
  city: string
  pin_code: string
  district: string
  state: string
  ext_code: string
  geo_location: string
  project_type: string
  status: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  O: "#2ECC71",
  H: "#F1C40F",
  B: "#3498DB",
  S: "#E74C3C",
  R: "#9B59B6",
  A: "#374151",
  "": "#374151",
}
const STATUS_LABELS: Record<string, string> = {
  O: "Open", H: "Hold", B: "Booked", S: "Sold", R: "Reserved", A: "Active", "": "—",
}
const MARKER_R = 18 
const VIEWER_H = 560

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// ─── ImageLayoutViewer ────────────────────────────────────────────────────────

interface ViewerProps {
  src: string
  plots: Plot[]
  onMarkerDrop: (id: string, cX: string, cY: string) => void
  pendingId: string | null     // badge selected from tray; click-to-place mode
  onPlaced: () => void
}

const ImageLayoutViewer = ({ src, plots, onMarkerDrop, pendingId, onPlaced }: ViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef       = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan,  setPan]  = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const [, tick] = useState(0)

  // refs to avoid stale closures in event handlers
  const zoomRef = useRef(zoom)
  const panRef  = useRef(pan)
  useEffect(() => { zoomRef.current = zoom }, [zoom])
  useEffect(() => { panRef.current  = pan  }, [pan])

  // pan drag
  const panDragging = useRef(false)
  const panAnchor   = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  // marker drag (re-position a placed marker)
  const mDrag = useRef<{ id: string } | null>(null)

  // ── coordinate helpers ──────────────────────────────────────────────────────

  const getImgRect = useCallback(() => imgRef.current?.getBoundingClientRect() ?? null, [])

  const screenToImgPct = useCallback((cx: number, cy: number) => {
    const r = getImgRect()
    if (!r) return null
    return {
      x: Math.min(100, Math.max(0, ((cx - r.left) / r.width)  * 100)),
      y: Math.min(100, Math.max(0, ((cy - r.top)  / r.height) * 100)),
    }
  }, [getImgRect])

  const imgPctToContainerPx = useCallback((pctX: number, pctY: number) => {
    const ir = getImgRect()
    const cr = containerRef.current?.getBoundingClientRect()
    if (!ir || !cr) return { left: 0, top: 0 }
    return {
      left: ir.left - cr.left + (pctX / 100) * ir.width,
      top:  ir.top  - cr.top  + (pctY / 100) * ir.height,
    }
  }, [getImgRect])

  // ── zoom ───────────────────────────────────────────────────────────────────

  const clampPan = (p: { x: number; y: number }, z: number) => {
    const img = imgRef.current
    const con = containerRef.current
    if (!img || !con) return p
    const iw = img.offsetWidth
    const ih = img.offsetHeight
    const cw = con.offsetWidth
    const ch = con.offsetHeight
    const maxX = Math.max(0, (iw * z - cw) / 2)
    const maxY = Math.max(0, (ih * z - ch) / 2)
    return {
      x: Math.min(maxX,  Math.max(-maxX,  p.x)),
      y: Math.min(maxY,  Math.max(-maxY,  p.y)),
    }
  }

  const applyZoom = (delta: number) => {
    setZoom(prev => {
      const next = Math.min(4, Math.max(1, Math.round((prev + delta) * 100) / 100))
      if (next === 1) setPan({ x: 0, y: 0 })
      else setPan(p => clampPan(p, next))
      setTimeout(() => tick(n => n + 1), 50)  // re-calc marker positions after transform settles
      return next
    })
  }
  const zoomIn    = () => applyZoom(+0.25)
  const zoomOut   = () => applyZoom(-0.25)
  const zoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setTimeout(() => tick(n => n + 1), 50) }

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    e.deltaY < 0 ? zoomIn() : zoomOut()
  }

  // ── pointer events ─────────────────────────────────────────────────────────

  const onContainerDown = (e: React.MouseEvent) => {
    // click-to-place mode (tray badge selected)
    if (pendingId) {
      const pct = screenToImgPct(e.clientX, e.clientY)
      if (pct) { onMarkerDrop(pendingId, pct.x.toFixed(2), pct.y.toFixed(2)); onPlaced() }
      return
    }
    // else start pan
    if (zoom <= 1) return
    panDragging.current = true
    panAnchor.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y }
  }

  const onContainerMove = (e: React.MouseEvent) => {
    if (mDrag.current) {
      // live-update marker DOM directly for smooth feel
      const pct = screenToImgPct(e.clientX, e.clientY)
      if (!pct) return
      const px = imgPctToContainerPx(pct.x, pct.y)
      const el = document.getElementById(`addprop-marker-${mDrag.current.id}`)
      if (el) { el.style.left = `${px.left}px`; el.style.top = `${px.top}px` }
      return
    }
    if (!panDragging.current) return
    const dx = e.clientX - panAnchor.current.mx
    const dy = e.clientY - panAnchor.current.my
    setPan(clampPan({ x: panAnchor.current.px + dx, y: panAnchor.current.py + dy }, zoom))
  }

  const onContainerUp = (e: React.MouseEvent) => {
    if (mDrag.current) {
      const pct = screenToImgPct(e.clientX, e.clientY)
      if (pct) onMarkerDrop(mDrag.current.id, pct.x.toFixed(2), pct.y.toFixed(2))
      mDrag.current = null
      tick(n => n + 1)
      return
    }
    panDragging.current = false
  }

  const onContainerLeave = () => {
    panDragging.current = false
    if (mDrag.current) { mDrag.current = null; tick(n => n + 1) }
  }

  // Recompute marker positions when window resizes
  useEffect(() => {
    const handler = () => tick(n => n + 1)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  // ── render ─────────────────────────────────────────────────────────────────

  const placedPlots = plots.filter(p => p.cX !== "" && p.cY !== "")

  return (
    <div style={{ position: "relative", background: "#e2e8f0", borderRadius: 12 }}>

      {/* ── zoom controls ── */}
      <div style={{
        position: "absolute", top: 12, right: 12, zIndex: 40,
        display: "flex", alignItems: "center", gap: 4,
        background: "rgba(255,255,255,0.93)", backdropFilter: "blur(6px)",
        borderRadius: 10, padding: "5px 8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}>
        {/* zoom out */}
        <button type="button" onClick={zoomOut} disabled={zoom <= 1} title="Zoom Out (Ctrl+Scroll)"
          style={{ width: 30, height: 30, display:"flex", alignItems:"center", justifyContent:"center",
            borderRadius: 6, border: "none", background: zoom <= 1 ? "#f1f5f9" : "#e2e8f0",
            cursor: zoom <= 1 ? "not-allowed" : "pointer", opacity: zoom <= 1 ? 0.45 : 1 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/>
          </svg>
        </button>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", minWidth: 40, textAlign: "center" }}>
          {Math.round(zoom * 100)}%
        </span>
        {/* zoom in */}
        <button type="button" onClick={zoomIn} disabled={zoom >= 4} title="Zoom In (Ctrl+Scroll)"
          style={{ width: 30, height: 30, display:"flex", alignItems:"center", justifyContent:"center",
            borderRadius: 6, border: "none", background: zoom >= 4 ? "#f1f5f9" : "#e2e8f0",
            cursor: zoom >= 4 ? "not-allowed" : "pointer", opacity: zoom >= 4 ? 0.45 : 1 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
          </svg>
        </button>
        {/* reset */}
        <button type="button" onClick={zoomReset} title="Reset View"
          style={{ width: 30, height: 30, display:"flex", alignItems:"center", justifyContent:"center",
            borderRadius: 6, border: "none", background: "#e2e8f0",
            cursor: "pointer", opacity: zoom === 1 && pan.x === 0 && pan.y === 0 ? 0.35 : 1 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      {/* ── click-to-place hint ── */}
      {pendingId && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 38, pointerEvents: "none",
          display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 18,
        }}>
          <span style={{
            background: "rgba(37,99,235,0.88)", color: "#fff", borderRadius: 20,
            padding: "6px 16px", fontSize: 12, fontWeight: 600,
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}>
            Click anywhere on the image to place the selected marker
          </span>
        </div>
      )}

      {/* ── viewport ── */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={onContainerDown}
        onMouseMove={onContainerMove}
        onMouseUp={onContainerUp}
        onMouseLeave={onContainerLeave}
        style={{
          width: "100%", height: VIEWER_H,
          overflow: "hidden", position: "relative",
          cursor: pendingId ? "crosshair"
                : panDragging.current ? "grabbing"
                : zoom > 1 ? "grab"
                : "default",
          borderRadius: 12,
        }}
      >
        {/* transform wrapper — contains ONLY the image */}
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: panDragging.current || mDrag.current ? "none" : "transform 0.12s ease-out",
          willChange: "transform",
        }}>
          <img
            ref={imgRef}
            src={src}
            alt="Layout"
            draggable={false}
            onLoad={() => { setLoaded(true); tick(n => n + 1) }}
            style={{
              maxWidth: "100%", maxHeight: VIEWER_H,
              objectFit: "contain", display: "block",
              pointerEvents: "none", userSelect: "none",
            }}
          />
        </div>

        {/* ── markers (NOT inside transform; positioned via imgPctToContainerPx) ── */}
        {loaded && placedPlots.map(plot => {
          const px    = imgPctToContainerPx(parseFloat(plot.cX), parseFloat(plot.cY))
          const color = STATUS_COLORS[plot.status] ?? "#374151"
          const size  = MARKER_R * 2

          return (
            <div
              id={`addprop-marker-${plot.id}`}
              key={plot.id}
              title={`Plot ${plot.plot_no} — drag to reposition`}
              onMouseDown={e => {
                e.stopPropagation()
                e.preventDefault()
                mDrag.current = { id: plot.id }
              }}
              style={{
                position: "absolute",
                left: px.left,
                top:  px.top,
                transform: "translate(-50%, -50%)",
                zIndex: 30,
                cursor: "grab",
                userSelect: "none",
                touchAction: "none",
                pointerEvents: "all",
              }}
            >
              <div style={{
                width: size, height: size, borderRadius: "50%",
                backgroundColor: color,
                border: "2.5px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff",
                whiteSpace: "nowrap", overflow: "hidden",
              }}>
                {String(plot.plot_no).slice(0, 4)}
              </div>
              <div style={{
                position: "absolute", top: "100%", left: "50%",
                transform: "translateX(-50%)", marginTop: 2,
                background: "rgba(0,0,0,0.72)", color: "#fff",
                fontSize: 9, borderRadius: 4, padding: "1px 5px",
                whiteSpace: "nowrap", pointerEvents: "none",
              }}>
                {plot.plot_no}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main AddProp ─────────────────────────────────────────────────────────────

const AddProp = () => {
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    project_name: "", nick_name: "", add1: "", add2: "", add3: "",
    city: "", pin_code: "", district: "", state: "",
    ext_code: "", geo_location: "", project_type: "", status: "A",
  })
  const [plots, setPlots]               = useState<Plot[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl]     = useState<string | null>(null)
  const [fileType, setFileType]         = useState<"image" | "pdf" | null>(null)
  const [pendingId, setPendingId]       = useState<string | null>(null)
  const navigate = useNavigate()

  const secretKey = "Malpani@2025"
  const dcryptdata = (enc: string, key: string) => {
    try {
      const b = CryptoJS.AES.decrypt(enc, key)
      const s = b.toString(CryptoJS.enc.Utf8)
      if (!s) throw new Error("empty")
      return JSON.parse(s)
    } catch { return null }
  }
  const user = (() => {
    const enc = sessionStorage.getItem("user")
    return enc ? dcryptdata(enc, secretKey) : null
  })()

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  // ── plots ──────────────────────────────────────────────────────────────────

  const handleAddPlot = () =>
    setPlots(prev => [...prev, {
      id: generateId(), plot_sr: (prev.length + 1).toString(),
      plot_no: "", area: "", price: "", survey_no: "",
      status: "O", customer_name: "", book_date: "", book_amount: "",
      sold_date: "", sold_amount: "", vc_remarks: "", cX: "", cY: "",
    }])

  const handleUpdatePlot = (id: string, field: keyof Plot, value: string) =>
    setPlots(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

  const handleDeletePlot = (id: string) => {
    if (!window.confirm("Delete this plot?")) return
    setPlots(prev => prev.filter(p => p.id !== id))
    if (pendingId === id) setPendingId(null)
  }

  const handleResetMarker = (id: string) =>
    setPlots(prev => prev.map(p => p.id === id ? { ...p, cX: "", cY: "" } : p))

  const handleMarkerDrop = (id: string, cX: string, cY: string) =>
    setPlots(prev => prev.map(p => p.id === id ? { ...p, cX, cY } : p))

  // ── file ───────────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setSelectedFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setFileType(f.type === "application/pdf" ? "pdf" : "image")
  }

  // ── form ───────────────────────────────────────────────────────────────────

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPropertyData(prev => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setPropertyData({ project_name:"",nick_name:"",add1:"",add2:"",add3:"",city:"",pin_code:"",district:"",state:"",ext_code:"",geo_location:"",project_type:"",status:"A" })
    setPlots([]); setSelectedFile(null); setPreviewUrl(null); setFileType(null); setPendingId(null)
    navigate("/plot/master/plot-view")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!propertyData.project_name || !propertyData.city || !propertyData.state)
      return toast.error("Please fill in all required fields (Project Name, City, State)")
    if (plots.length === 0) return toast.error("Please add at least one plot for this property")
    if (plots.some(p => !p.plot_no || !p.area))
      return toast.error("Please ensure all plots have Plot Number and Area filled")

    const fd = new FormData()
    fd.append("propertyData", JSON.stringify(propertyData))
    fd.append("plots", JSON.stringify(plots))
    fd.append("userId", JSON.stringify(user?.user?.id || 0))
    if (selectedFile) fd.append("file", selectedFile)

    const res = await AddPlotProperty(fd)
    if (res) { toast.success(res?.message || "Project added successfully"); handleCancel() }
  }

  const unplacedPlots = plots.filter(p => p.cX === "" || p.cY === "")
  const placedPlots   = plots.filter(p => p.cX !== "" && p.cY !== "")

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">

        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-white">Add New Property</h1>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Section 1 — Property Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-3">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Basic Information</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Name <span className="text-red-500">*</span></label>
                <input type="text" name="project_name" value={propertyData.project_name} onChange={handlePropertyChange} required
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nick Name</label>
                <input type="text" name="nick_name" value={propertyData.nick_name} onChange={handlePropertyChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Type</label>
                <select name="project_type" value={propertyData.project_type} onChange={handlePropertyChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Select Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Agricultural">Agricultural</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Address Information</h2>
              </div>
              {(["add1","add2","add3"] as const).map((f,i) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address {i+1}</label>
                  <input type="text" name={f} value={propertyData[f]} onChange={handlePropertyChange}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              ))}
              {([["city","City",true],["district","District",false],["state","State",true],["pin_code","PIN Code",false]] as [string,string,boolean][]).map(([name,label,req]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label} {req && <span className="text-red-500">*</span>}</label>
                  <input type="text" name={name} value={(propertyData as any)[name]} onChange={handlePropertyChange} required={req}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              ))}

              <div className="lg:col-span-3">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Additional Information</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">External Code</label>
                <input type="text" name="ext_code" value={propertyData.ext_code} onChange={handlePropertyChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select name="status" value={propertyData.status} onChange={handlePropertyChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Select Status</option>
                  <option value="A">Active</option>
                  <option value="I">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Layout</label>
                <input type="file" name="file" accept="image/*,application/pdf" onChange={handleFileChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Section 2 — Plots */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Plots Information</h2>
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={handleAddPlot}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
                <IoAddCircleOutline size={18} /> Add Plot
              </button>
            </div>

            {plots.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-700">
                    <tr>
                      {["SR","Plot No *","Area * (sq.ft)","Price","Survey No","Status","Remark","Position","Actions"].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {plots.map(plot => (
                      <tr key={plot.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-3 py-1.5 text-sm text-slate-900 dark:text-slate-200">{plot.plot_sr}</td>
                        <td className="px-3 py-1.5"><input type="text" value={plot.plot_no} onChange={e=>handleUpdatePlot(plot.id,"plot_no",e.target.value)}
                          className="w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Plot No"/></td>
                        <td className="px-3 py-1.5"><input type="number" value={plot.area} onChange={e=>handleUpdatePlot(plot.id,"area",e.target.value)}
                          className="w-28 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Area"/></td>
                        <td className="px-3 py-1.5"><input type="number" value={plot.price} onChange={e=>handleUpdatePlot(plot.id,"price",e.target.value)}
                          className="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Price"/></td>
                        <td className="px-3 py-1.5"><input type="text" value={plot.survey_no} onChange={e=>handleUpdatePlot(plot.id,"survey_no",e.target.value)}
                          className="w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Survey No"/></td>
                        <td className="px-3 py-1.5">
                          <select value={plot.status} onChange={e=>handleUpdatePlot(plot.id,"status",e.target.value)}
                            className="w-28 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                            <option value="">Select</option>
                            <option value="O">Open</option>
                            <option value="H">Hold</option>
                            <option value="B">Booked</option>
                            <option value="S">Sold</option>
                            <option value="R">Reserved</option>
                          </select>
                        </td>
                        <td className="px-3 py-1.5"><input type="text" value={plot.vc_remarks} onChange={e=>handleUpdatePlot(plot.id,"vc_remarks",e.target.value)}
                          className="w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" placeholder="Remark"/></td>
                        <td className="px-3 py-1.5 text-xs whitespace-nowrap">
                          {plot.cX && plot.cY ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <span className="w-2 h-2 rounded-full" style={{backgroundColor: STATUS_COLORS[plot.status]??"#374151"}}/>
                              Placed
                              <button type="button" onClick={()=>handleResetMarker(plot.id)} className="ml-1 text-red-400 hover:text-red-600 underline">Reset</button>
                            </span>
                          ) : <span className="text-amber-500">Not placed</span>}
                        </td>
                        <td className="px-3 py-1.5">
                          <button type="button" onClick={()=>handleDeletePlot(plot.id)}
                            className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all">
                            <CiTrash className="h-5 w-5"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg mb-6">
                <p className="text-slate-600 dark:text-slate-400 text-lg">No plots added yet</p>
                <p className="text-slate-500 text-sm mt-1">Click "Add Plot" to add plots for this property</p>
              </div>
            )}
          </div>

          {/* Section 3 — Interactive Placement (image only) */}
          {previewUrl && plots.length > 0 && fileType === "image" && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                Plot Placement on Layout
              </h2>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                Click a badge → then click its location on the image. Placed markers can be dragged to reposition.
                Use zoom/pan to work on detailed areas — marker positions are always saved relative to the image, not the screen.
              </p>

              {/* Unplaced tray */}
              {unplacedPlots.length > 0 && (
                <div className="mb-4 p-3 rounded-lg border border-dashed border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-700">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">
                    Unplaced plots — click to select, then click on the image
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {unplacedPlots.map(plot => {
                      const color  = STATUS_COLORS[plot.status] ?? "#374151"
                      const active = pendingId === plot.id
                      return (
                        <button key={plot.id} type="button"
                          onClick={() => setPendingId(active ? null : plot.id)}
                          title={`Select Plot ${plot.plot_no}`}
                          style={{
                            width: MARKER_R * 2 + 8, height: MARKER_R * 2 + 8,
                            borderRadius: "50%", backgroundColor: color,
                            border: active ? "3px solid #1e40af" : "2.5px solid #fff",
                            boxShadow: active ? `0 0 0 3px #3b82f6, 0 4px 12px rgba(0,0,0,0.3)` : "0 2px 8px rgba(0,0,0,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700, color: "#fff", cursor: "pointer", padding: 0,
                            transform: active ? "scale(1.2)" : "scale(1)", transition: "all 0.15s",
                          }}
                        >
                          {String(plot.plot_no).slice(0, 4) || "?"}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Viewer */}
              <ImageLayoutViewer
                src={previewUrl}
                plots={plots}
                onMarkerDrop={handleMarkerDrop}
                pendingId={pendingId}
                onPlaced={() => setPendingId(null)}
              />

              {/* Legend + progress */}
              <div className="mt-3 flex flex-wrap gap-3">
                {Object.entries(STATUS_COLORS).filter(([k]) => k !== "" && k !== "A").map(([code, color]) => (
                  <div key={code} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: color}}/>
                    {STATUS_LABELS[code]}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full bg-green-500 transition-all duration-500"
                    style={{width: plots.length > 0 ? `${Math.round((placedPlots.length/plots.length)*100)}%` : "0%"}}/>
                </div>
                <span className="font-medium whitespace-nowrap">{placedPlots.length}/{plots.length} placed</span>
              </div>
            </div>
          )}

          {/* PDF preview */}
          {previewUrl && fileType === "pdf" && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Layout Preview (PDF)</h2>
              <iframe src={`${previewUrl}#toolbar=0&navpanes=0`} title="Layout PDF" className="w-full rounded-xl border border-slate-200" style={{height: 600, border: "none"}}/>
              <p className="mt-2 text-xs text-slate-400">Marker placement is only available for image layouts. Upload a JPG/PNG for interactive placement.</p>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button type="button" onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <FiX size={18}/> Cancel
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
              <FiSave size={18}/> Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProp