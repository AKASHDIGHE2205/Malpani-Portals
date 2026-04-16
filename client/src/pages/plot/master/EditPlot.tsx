import { FC, useState, useEffect } from "react";
import { Plot } from "./EditProp";
import { FiX } from "react-icons/fi";
import CryptoJS from "crypto-js"
import { UpdatePlotProperty } from "../../../services/plot/plotApi";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedPlot: Plot | undefined;
  fetchProjectData: () => void;
  isEdit: boolean
}

interface PlotFormData {
  project_id: number;
  plot_sr: number;
  plot_no: string;
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

const EditPlot: FC<Props> = ({ show, setShow, selectedPlot, fetchProjectData, isEdit }) => {
  const [formData, setFormData] = useState<PlotFormData>({
    project_id: 0,
    plot_sr: 0,
    plot_no: "",
    area: "",
    price: "",
    survey_no: "",
    status: "O",
    plot_type: "plot",
    customer_name: "",
    reference_by: "",
    book_date: "",
    book_amount: "",
    sold_date: "",
    sold_amount: "",
    vc_remarks: "",
    cX: "",
    cY: "",
  });
  const secretKey = "Malpani@2025";
  // Populate form data when selectedPlot changes
  useEffect(() => {
    if (selectedPlot) {
      setFormData({
        project_id: selectedPlot.project_id || 0,
        plot_sr: selectedPlot.plot_sr || 0,
        plot_no: selectedPlot.plot_no?.toString() || "",
        area: selectedPlot.area?.toString() || "",
        price: selectedPlot.price?.toString() || "",
        survey_no: selectedPlot.survey_no || "",
        status: selectedPlot.status || "O",
        plot_type: selectedPlot.plot_type || "plot",
        customer_name: selectedPlot.customer_name || "",
        reference_by: selectedPlot.reference_by || "",
        book_date: selectedPlot.book_date ? selectedPlot.book_date.split('T')[0] : "",
        book_amount: selectedPlot.book_amount?.toString() || "",
        sold_date: selectedPlot.sold_date ? selectedPlot.sold_date.split('T')[0] : "",
        sold_amount: selectedPlot.sold_amount?.toString() || "",
        vc_remarks: selectedPlot.vc_remarks || "",
        cX: selectedPlot.cX?.toString() || "",
        cY: selectedPlot.cY?.toString() || "",
      });
    }
  }, [selectedPlot]);

  if (!show) return null;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const Body = {
      formData,
      UserId: user?.user?.id || 0
    }
    const response = await UpdatePlotProperty(Body);
    if (response?.status === 200) {
      toast.success(response.data.message);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setShow(false);
    fetchProjectData();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShow(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-xl">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {isEdit ? "Edit Plot Details" : "View Plot Details"}
            </h2>
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
              Plot - {selectedPlot?.plot_no}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <FiX className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Plot Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="plot_no"
                  value={formData.plot_no}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter plot number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Area (sq.ft) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Survey Number
                </label>
                <input
                  type="text"
                  name="survey_no"
                  value={formData.survey_no}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter survey number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Plot Type
                </label>
                <select
                  name="plot_type"
                  value={formData.plot_type}
                  onChange={handleChange} 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                >
                  <option value="plot">Plot</option>
                  <option value="open_space">Open Space</option>
                  <option value="amenity">Amenity Plot</option>
                  <option value="corner">Corner Plot</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer & Booking Information */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
              Customer & Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent  disabled:cursor-not-allowed"
                >
                  <option value="O">Open</option>
                  <option value="H">Hold</option>
                  <option value="B">Booked</option>
                  <option value="S">Sold</option>
                  <option value="R">Reserved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent  disabled:cursor-not-allowed"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Booking Date
                </label>
                <input
                  type="date"
                  name="book_date"
                  value={formData.book_date}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent  disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Booking Amount (₹)
                </label>
                <input
                  type="number"
                  name="book_amount"
                  value={formData.book_amount}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent  disabled:cursor-not-allowed"
                  placeholder="Enter booking amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Sold Date
                </label>
                <input
                  type="date"
                  name="sold_date"
                  value={formData.sold_date}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent  disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Sold Amount (₹)
                </label>
                <input
                  type="number"
                  name="sold_amount"
                  value={formData.sold_amount}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter sold amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Reference By
                </label>
                <input
                  type="text"
                  name="reference_by"
                  value={formData.reference_by}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed"
                  placeholder="Enter customer name"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
              Additional Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Remarks
              </label>
              <textarea
                name="vc_remarks"
                value={formData.vc_remarks}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter any remarks or notes"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            {isEdit && (
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
              >
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlot;