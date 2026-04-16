/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { getProjectDeatils } from "../../../services/plot/plotApi";
import { BsEye } from "react-icons/bs";
import EditPlot from "./EditPlot";

export interface Plot {
  project_id: number;
  plot_sr: number;
  plot_no: number;
  area: string;
  price: string;
  survey_no: string;
  status: string;
  plot_type: string;
  customer_name: string;
  reference_by: string;
  book_date: string;
  book_amount: string;
  sold_date: string;
  sold_amount: string;
  vc_remarks: string;
  cX: string;
  cY: string;
}

interface PropertyFormData {
  project_name: string;
  nick_name: string;
  add1: string;
  add2: string;
  add3: string;
  city: string;
  pin_code: string;
  area: string;
  district: string;
  state: string;
  ext_code: string;
  geo_location: string;
  project_type: string;
  status: string;
}

interface ProjectResponse {
  project_details: {
    id: number;
    project_name: string;
    nick_name: string;
    ext_code: string;
    project_type: string;
    status: string;
    geo_location: string;
    area: string;
    address: {
      line1: string;
      line2: string;
      line3: string;
      city: string;
      district: string;
      state: string;
      pin_code: string;
      area: string;
    };
    layout_file_url: string;
  };
  plots: any[];
}

export type Status = 'O' | 'S' | 'B' | 'R' | 'H';
export const statusStyles: Record<Status, string> = {
  O: "border-green-400 text-green-600",
  S: "border-red-400 text-red-600",
  B: "border-blue-400 text-blue-600",
  R: "border-purple-400 text-purple-600",
  H: "border-yellow-400 text-yellow-600",
};

// Main EditProp Component
const EditProp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propId = searchParams.get("propId");
  const isEditMode = searchParams.get("isEdit") === "true";
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    project_name: "",
    nick_name: "",
    add1: "",
    add2: "",
    add3: "",
    city: "",
    pin_code: "",
    area: "",
    district: "",
    state: "",
    ext_code: "",
    geo_location: "",
    project_type: "",
    status: "A",
  });
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<Plot>();
  const [isEdit, setIsEdit] = useState(false);

  const fetchProjectData = async () => {
    if (!propId) {
      toast.error("No project ID provided");
      navigate("/plot/master/plot-view");
      return;
    }

    setLoading(true);
    try {
      const response = await getProjectDeatils(parseInt(propId));
      if (response?.data) {
        const project: ProjectResponse = response.data;

        // Set property data
        setPropertyData({
          project_name: project?.project_details?.project_name || "",
          nick_name: project?.project_details?.nick_name || "",
          add1: project?.project_details?.address.line1 || "",
          add2: project?.project_details?.address.line2 || "",
          add3: project?.project_details?.address.line3 || "",
          city: project?.project_details?.address.city || "",
          pin_code: project?.project_details?.address.pin_code || "",
          area: project?.project_details?.area || "",
          district: project?.project_details?.address.district || "",
          state: project?.project_details?.address.state || "",
          ext_code: project?.project_details?.ext_code || "",
          geo_location: project?.project_details?.geo_location || "",
          project_type: project?.project_details?.project_type || "",
          status: project?.project_details?.status || "A",
        });

        // Set plots
        const formattedPlots: Plot[] = project?.plots.map((plot: any) => ({
          project_id: plot?.project_id,
          plot_sr: plot?.plot_sr || 1,
          plot_no: plot?.plot_no || 0,
          area: plot?.area?.toString() || "",
          price: plot?.price?.toString() || "",
          survey_no: plot?.survey_no || "",
          status: plot?.status || "O",
          plot_type: plot?.plot_type || "plot",
          customer_name: plot?.customer_name || "",
          reference_by: plot?.reference_by || "",
          book_date: plot?.book_date || "",
          book_amount: plot?.book_amount?.toString() || "",
          sold_date: plot?.sold_date || "",
          sold_amount: plot?.sold_amount?.toString() || "",
          vc_remarks: plot?.vc_remarks || "",
          cX: plot?.cX || "",
          cY: plot?.cY || "",
        }));
        setPlots(formattedPlots);
      } else {
        toast.error("Project not found");
        navigate("/plot/master/plot-view");
      }
    } catch (error) {
      console.log("Error while fetching project data", error);
      toast.error("Failed to load project data");
      navigate("/plot/master/plot-view");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [propId]);

  // Form handlers
  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!isEditMode) return;
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate("/plot/master/plot-view");
  };

  const handleEdit = (plot: Plot,) => {
    setSelectedPlot(plot);
    setIsEdit(true);
    setShow(true);
  }

  const handleView = (plot: Plot,) => {
    setSelectedPlot(plot);
    setIsEdit(false);
    setShow(true);
  }

  const handleSubmit = async () => {
    const body = {
      project_name: propertyData.project_name,
      nick_name: propertyData.nick_name,
      add1: propertyData.add1,
      add2: propertyData.add2,
      add3: propertyData.add3,
      city: propertyData.city,
      pin_code: propertyData.pin_code,
      area: propertyData.area,
      district: propertyData.district,
      state: propertyData.state,
      ext_code: propertyData.ext_code,
      geo_location: propertyData.geo_location,
      project_type: propertyData.project_type,
      status: propertyData.status,
    }
    console.log(body);

  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Loading project details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isEditMode ? "Edit Property" : "View Property Details"}
            </h1>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Projects
            </button>
          </div>
        </div>

        {/* Section 1 — Property Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-3">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Basic Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="project_name"
                value={propertyData.project_name}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                required
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nick Name</label>
              <input
                type="text"
                name="nick_name"
                value={propertyData.nick_name}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Type</label>
              <select
                name="project_type"
                value={propertyData.project_type}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              >
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address 1</label>
              <input
                type="text"
                name="add1"
                value={propertyData.add1}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address 2</label>
              <input
                type="text"
                name="add2"
                value={propertyData.add2}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address 3</label>
              <input
                type="text"
                name="add3"
                value={propertyData.add3}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="city"
                value={propertyData.city}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                required
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">District</label>
              <input
                type="text"
                name="district"
                value={propertyData.district}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">State <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="state"
                value={propertyData.state}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                required
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">PIN Code</label>
              <input
                type="text"
                name="pin_code"
                value={propertyData.pin_code}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Area</label>
              <input
                type="text"
                name="area"
                value={propertyData.area}
                onChange={handlePropertyChange}
                // disabled={!isEditMode}
                disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Additional Information</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">External Code</label>
              <input
                type="text"
                name="ext_code"
                value={propertyData.ext_code}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
              <select
                name="status"
                value={propertyData.status}
                onChange={handlePropertyChange}
                disabled={!isEditMode}
                // disabled
                className={`w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Status</option>
                <option value="A">Active</option>
                <option value="I">Inactive</option>
                <option value="C">Close</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 — Plots */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Plots Information</h2>

          {plots.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    {["SR", "Plot No *", "Area * (sq.ft)", "Price", "Survey No", "Type", "Status", "Remark", ...(isEditMode ? ["Actions"] : [])].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {plots.map(plot => (
                    <tr key={plot?.plot_sr} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-3 py-1.5 text-sm text-slate-900 dark:text-slate-200">{plot?.plot_sr}</td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={plot?.plot_no}
                          disabled className={`w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
                          placeholder="Plot No"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          value={plot?.area}
                          disabled
                          className={`w-28 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
                          placeholder="Area"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          value={plot?.price}
                          disabled
                          className={`w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
                          placeholder="Price"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={plot?.survey_no}
                          disabled
                          className={`w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
                          placeholder="Survey No"
                        />
                      </td>
                      <td className="px-3 py-1.5">
                        <select
                          value={plot?.plot_type}
                          disabled
                          className={`w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
                        >
                          <option value="plot">Plot</option>
                          <option value="open_space">Open Space</option>
                          <option value="amenity">Amenity Plot</option>
                        </select>
                      </td>
                      <td className="px-3 py-1.5">
                        <select
                          value={plot?.status}
                          disabled
                          className={`w-28 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold
                            ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}
                                ${statusStyles[plot?.status as keyof typeof statusStyles] || ''}`}
                        >
                          <option value="">Select</option>
                          <option value="O">Open</option>
                          <option value="H">Hold</option>
                          <option value="B">Booked</option>
                          <option value="S">Sold</option>
                          <option value="R">Reserved</option>
                        </select>
                      </td>
                      <td className="px-3 py-1.5">
                        <input
                          type="text"
                          value={plot?.vc_remarks}
                          disabled
                          className={`w-24 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${!isEditMode ? 'bg-slate-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
                          placeholder="Remark"
                        />
                      </td>
                      {isEditMode && (
                        <td className="px-3 py-1.5 flex justify-center gap-1">
                          <button
                            type="button"
                            className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all"
                            onClick={() => { handleView(plot) }}
                          >
                            <BsEye className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all"
                            onClick={() => { handleEdit(plot) }}
                          >
                            <CiEdit className="w-6 h-6" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg mb-6">
              <p className="text-slate-600 dark:text-slate-400 text-lg">No plots added yet</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border bg-blue-600 border-blue-300 dark:border-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-700 transition-all"
            >
              Submit
            </button>
          )}
        </div>
      </div>
      {show && (<EditPlot show={show} setShow={setShow} selectedPlot={selectedPlot} fetchProjectData={fetchProjectData} isEdit={isEdit} />)}
    </div>
  );
};

export default EditProp;