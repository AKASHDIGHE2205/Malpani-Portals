import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSave, FiX } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProjectPlotById, UpdatePlotProperty } from "../../../services/plot/plotApi";

const UpdatePlot = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const project_id = searchParams.get("projectId");
  const plot_sr = searchParams.get("plotId");
  const isEdit = searchParams.get("edit")
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);

  // Plot form data state
  const [plotData, setPlotData] = useState({
    plot_no: "",
    area: "",
    price: "",
    survey_no: "",
    status: "",
    customer_name: "",
    book_date: "",
    book_amount: "",
    sold_date: "",
    sold_amount: "",
    vc_remarks: "",
    cX: "",
    cY: ""
  });

  const fetchData = async () => {
    try {
      const response = await getProjectPlotById(Number(project_id), Number(plot_sr));
      if (response?.data) {
        const data = response.data;
        setProjectDetails(data.project_details);

        // Populate plot form data
        const plot = data.plot;
        setPlotData({
          plot_no: plot.plot_no || "",
          area: plot.area?.toString() || "",
          price: plot.price?.toString() || "",
          survey_no: plot.survey_no || "",
          status: plot.status || "A",
          customer_name: plot.customer_name || "",
          book_date: plot.book_date || "",
          book_amount: plot.book_amount?.toString() || "",
          sold_date: plot.sold_date || "",
          sold_amount: plot.sold_amount?.toString() || "",
          vc_remarks: plot.vc_remarks || "",
          cX: plot.cX?.toString() || "",
          cY: plot.cY?.toString() || ""
        });
      }
    } catch (error) {
      console.error("Error fetching plot data:", error);
      toast.error("Failed to fetch plot data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project_id && plot_sr) {
      fetchData();
    } else {
      setLoading(false);
      toast.error("Missing project or plot information");
    }
  }, [project_id, plot_sr]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlotData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate('/plot/master/plot-view');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plotData.plot_no) {
      toast.error("Plot Number is required");
      return;
    }

    if (!plotData.area) {
      toast.error("Area is required");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        project_id: Number(project_id),
        plot_sr: Number(plot_sr),
        plot_no: plotData.plot_no,
        area: Number(plotData.area),
        price: Number(plotData.price) || 0,
        survey_no: plotData.survey_no,
        status: plotData.status,
        customer_name: plotData.customer_name || null,
        book_date: plotData.book_date || null,
        book_amount: Number(plotData.book_amount) || 0,
        sold_date: plotData.sold_date || null,
        sold_amount: Number(plotData.sold_amount) || 0,
        vc_remarks: plotData.vc_remarks,
      };
      const response = await UpdatePlotProperty(payload);
      if (response) {
        toast.success(response?.message || "Plot updated successfully");
        navigate('/plot/master/plot-view');
      }
    } catch (error) {
      console.error("Error updating plot:", error);
      toast.error("Failed to update plot");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading plot data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Update Plot
          </h1>
        </div>

        {/* Project Details - Read Only View */}
        {projectDetails && (
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Project Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project Name
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {projectDetails.project_name}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nick Name
                </label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {projectDetails.nick_name || "-"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project Type
                </label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {projectDetails.project_type || "-"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  External Code
                </label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {projectDetails.ext_code || "-"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {[
                    projectDetails.address?.line1,
                    projectDetails.address?.line2,
                    projectDetails.address?.line3,
                    projectDetails.address?.city,
                    projectDetails.address?.district,
                    projectDetails.address?.state,
                    projectDetails.address?.pin_code
                  ].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${projectDetails.status === "A"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                    {projectDetails.status === "A" ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Plot Details Form */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Plot Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update the plot information below. Fields marked with <span className="text-red-500">*</span> are required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Plot Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plot Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="plot_no"
                  value={plotData.plot_no}
                  onChange={handleInputChange}
                  disabled={isEdit === "false"}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  required
                  placeholder="Enter plot number"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Area (sq.ft) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="area"
                  value={plotData.area}
                  onChange={handleInputChange}
                  disabled={isEdit === "false"}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  required
                  placeholder="Enter area in sq.ft"
                  step="any"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={plotData.price}
                  onChange={handleInputChange}
                  disabled={isEdit === "false"}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter price"
                  step="any"
                />
              </div>

              {/* Survey Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Survey Number
                </label>
                <input
                  type="text"
                  name="survey_no"
                  value={plotData.survey_no}
                  onChange={handleInputChange}
                  disabled={isEdit === "false"}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter survey number"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={plotData.status}
                  onChange={handleInputChange}
                  disabled={isEdit === "false"}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                >
                  <option value="O">Open</option>
                  <option value="H">Hold</option>
                  <option value="B">Booked</option>
                  <option value="S">Sold</option>
                  <option value="R">Reserved</option>
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={plotData.customer_name}
                  onChange={handleInputChange}
                  disabled={isEdit === "false"}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter customer name"
                />
              </div>
              {plotData?.status === "B" && (
                <>
                  {/* Booking Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      name="book_date"
                      value={plotData.book_date ? plotData.book_date.split('T')[0] : ""}
                      onChange={handleInputChange}
                      disabled={isEdit === "false"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Booking Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Booking Amount
                    </label>
                    <input
                      type="number"
                      name="book_amount"
                      value={plotData.book_amount}
                      onChange={handleInputChange}
                      disabled={isEdit === "false"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                      placeholder="Enter booking amount"
                      step="any"
                    />
                  </div>
                </>
              )}

              {plotData?.status == "S" && (
                <>
                  {/* Sold Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sold Date
                    </label>
                    <input
                      type="date"
                      name="sold_date"
                      value={plotData.sold_date ? plotData.sold_date.split('T')[0] : ""}
                      onChange={handleInputChange}
                      disabled={isEdit === "false"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Sold Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sold Amount
                    </label>
                    <input
                      type="number"
                      name="sold_amount"
                      value={plotData.sold_amount}
                      onChange={handleInputChange}
                      disabled={isEdit === "false"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed "
                      placeholder="Enter sold amount"
                      step="any"
                    />
                  </div>
                </>
              )}

              {/* VC Remarks */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  name="vc_remarks"
                  value={plotData.vc_remarks}
                  onChange={handleInputChange}
                  disabled={isEdit === "false"}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter any additional remarks"
                />
              </div>
              
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              <FiX size={18} />
              Cancel
            </button>
            {isEdit === "false" ? ("") : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    Update Plot
                  </>
                )}
              </button>
            )}

          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePlot;