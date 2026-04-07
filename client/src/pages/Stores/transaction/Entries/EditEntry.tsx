/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CategoryModal from "./CategoryModal";
import FirmMidal from "./FirmModal";
import LocationModal from "./LocationModal";
import SectionModal from "./SectionModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { updateEntry } from "../../../../services/Stores/transaction/transactionApi";
import { handleBranch, handleCategory, handleFirm, handleLocation, handleSection } from "../../../../feature/Stores/transaction/TransactionSlice";
import { formatDate } from "../../../../helper/DateFormate";
import moment from "moment";
import BranchModal from "./BranchModal";

interface Props {
  show: boolean,
  setShow: (show: boolean) => void
  data: any
  fetchData: any
}

const EditEntry: FC<Props> = ({ show, setShow, data, fetchData }) => {
  const dispatch = useDispatch();
  const [showFirm, setShowFirm] = useState(false);
  const [showBranch, setShowBranch] = useState(false);
  const [showSeaction, setShowSeaction] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [input, setInput] = useState({
    doc_code: 0,
    date: "",
    entry_code: "",
    desc: "",
    year: "",
    remark: "",
    rackNO: "",
    slotNo: "",
    subSlotNo: "",
    fileNo: "",
    firm: "",
    branch: "",
    location: "",
    section: "",
    category: "",
    type_code: 0,
    firm_code: 0,
    loc_code: 0,
    sec_code: 0,
    branch_code: 0
  });
  const { firmID, firmName, locationID, locationName, catgID, catgName, secID, secName, branchID, branchName } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    setInput({
      doc_code: data?.doc_code || 0,
      date: data?.date || "",
      entry_code: data?.entry_code || "",
      desc: data?.desc || "",
      year: data?.year || "",
      remark: data?.remark || "",
      rackNO: data?.cub_code || "",
      slotNo: data?.s_code || "",
      subSlotNo: data?.su_code || "",
      fileNo: data?.doc_code || "",
      firm: firmName || data?.firm_name || "",
      branch: branchName || data?.branch_name || "",
      location: locationName || data?.loc_name || "",
      section: secName || data?.sec_name || "",
      category: catgName || data?.type_name || "",
      type_code: catgID || data?.type_code || 0,
      firm_code: firmID || data?.firm_code || 0,
      loc_code: locationID || data?.loc_code || 0,
      sec_code: secID || data?.sec_code || 0,
      branch_code: branchID || data?.branch_code || 0
    });
  }, [data, show, locationID, firmID, catgID, secID, branchID]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      doc_code: input.doc_code,
      date: moment(input.date).format('YYYY-MM-DD'),
      year: input.year,
      cub_code: input.rackNO,
      s_code: input.slotNo,
      su_code: input.subSlotNo,
      remark: input.remark,
      desc: input.desc,
      type_code: catgID || input.type_code,
      firm_code: firmID || input.firm_code,
      loc_code: locationID || input.loc_code,
      sec_code: secID || input.sec_code,
      branch_code: branchID || input.branch_code,
    };
    try {
      const response = await updateEntry(body);
      if (response === 200) {
        dispatch(handleFirm({ id: 0, name: "" }));
        dispatch(handleCategory({ id: 0, name: "" }));
        dispatch(handleLocation({ id: 0, name: "" }));
        dispatch(handleSection({ id: 0, name: "" }));
        setShow(false);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setInput({
        doc_code: 0,
        date: "",
        entry_code: "",
        desc: "",
        year: "",
        remark: "",
        rackNO: "",
        slotNo: "",
        subSlotNo: "",
        fileNo: "",
        firm: "",
        location: "",
        section: "",
        category: "",
        type_code: 0,
        firm_code: 0,
        loc_code: 0,
        sec_code: 0,
        branch: "",
        branch_code: 0
      });
      fetchData();
    }
  };

  const handleCancel = () => {
    setInput({
      doc_code: 0,
      date: "",
      entry_code: "",
      desc: "",
      year: "",
      remark: "",
      rackNO: "",
      slotNo: "",
      subSlotNo: "",
      fileNo: "",
      firm: "",
      location: "",
      section: "",
      category: "",
      type_code: 0,
      firm_code: 0,
      loc_code: 0,
      sec_code: 0,
      branch: "",
      branch_code: 0
    });
    dispatch(handleFirm({ id: 0, name: "" }));
    dispatch(handleCategory({ id: 0, name: "" }));
    dispatch(handleLocation({ id: 0, name: "" }));
    dispatch(handleSection({ id: 0, name: "" }));
    dispatch(handleBranch({ id: 0, name: "" }));
    setShow(false);
  }

  return (
    <>
      <div
        id="edit-entry-modal"
        className={`fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden bg-slate-500 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        role="dialog"
        aria-labelledby="edit-entry-modal-label"
      >
        <div className="flex justify-center items-center mx-2 w-full h-full">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center  py-3 px-4 border-b border-slate-400 dark:border-slate-700 ">
              <h3 id="edit-entry-modal-label" className="font-bold text-slate-800 dark:text-white">
                Edit Entry
              </h3>
              <button
                type="button"
                className="p-2 rounded-full  border border-slate-400 "
                onClick={() => setShow(false)}
              >
                <IoMdClose />
              </button>
            </div>
            <div className="justify-center max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col p-4 sm:p-6 lg:p-5 ">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 lg:gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-2">
                      <div>
                        <label htmlFor="date" className="block mb-2 dark:text-white">Entry Date:</label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={formatDate(input.date)}
                          onChange={handleChange}
                          className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          readOnly />
                      </div>
                      <div>
                        <label htmlFor="entry_code" className="block mb-2 dark:text-white">
                          File No:</label>
                        <input
                          type="text"
                          name="entry_code"
                          id="entry_code"
                          value={input.entry_code}
                          onChange={handleChange}
                          className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500" readOnly />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="member" className="block mb-2 dark:text-white">Firm Name</label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="firm"
                            name="firm"
                            value={input.firm}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="Select firm name" readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                            onClick={() => setShowFirm(true)}
                          >
                            ☰
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="branch" className="block mb-2 dark:text-white">Branch Name</label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="branch"
                            name="branch"
                            value={input.branch}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="Select branch name" readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                            onClick={() => setShowBranch(true)}
                          >
                            ☰
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block mb-2 dark:text-white">Location</label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={input.location}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="Select location" readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800 "
                            onClick={() => setShowLocation(true)}>
                            ☰
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">

                      <div>
                        <label htmlFor="year" className="block mb-2 dark:text-white">Year</label>
                        <div className="relative">
                          <div className="flex rounded-lg shadow-sm">
                            <input
                              type="text"
                              id="year"
                              name="year"
                              defaultValue={input.year}
                              onChange={handleChange}
                              className="rounded-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500" placeholder="Type in format(YYYY-YYYY)" />

                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="rackNo" className="block mb-2 dark:text-white">Rack No.</label>
                        <div className="relative">
                          <div className="flex rounded-lg shadow-sm">
                            <input
                              type="text"
                              id="rackNO"
                              name="rackNO"
                              value={input.rackNO}
                              onChange={handleChange}
                              className="rounded-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                              placeholder="Enter Rack No." />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label htmlFor="slotNo" className="block mb-2 dark:text-white">Slot No: <span className="font-bold text-red-600">*</span></label>
                        <input
                          type="text"
                          name="slotNo"
                          id="slotNo"
                          value={input.slotNo}
                          onChange={handleChange}
                          className="rounded-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          placeholder="Enter Slot No."
                        />
                      </div>
                      <div>
                        <label htmlFor="subSlotNo" className="block mb-2 dark:text-white">
                          Sub Slot No:</label>
                        <input
                          type="text"
                          name="subSlotNo"
                          id="subSlotNo"
                          value={input.subSlotNo}
                          onChange={handleChange}
                          className="rounded-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          placeholder="Enter Sub Slot No."
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="section" className="block mb-2 dark:text-white">Section</label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="section"
                            name="section"
                            value={input.section}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="Select section" readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800 "
                            onClick={() => setShowSeaction(true)}
                          >
                            ☰
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="category" className="block mb-2 dark:text-white">Category</label>
                      <div className="relative">
                        <div className="flex rounded-lg shadow-sm">
                          <input
                            type="text"
                            id="category"
                            name="category"
                            value={input.category}
                            className="rounded-l-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                            placeholder="Select category" readOnly />
                          <button type="button" className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800 "
                            onClick={() => setShowCategory(true)}
                          >
                            ☰
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label htmlFor="desc" className="block mb-2 dark:text-white">
                          Description: <span className="font-bold text-red-600">*</span></label>
                        <textarea
                          name="desc"
                          id="desc"
                          value={input.desc}
                          onChange={handleChange}
                          className="rounded-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          placeholder="Enter description" />
                      </div>

                      <div>
                        <label htmlFor="remark" className="block mb-2 dark:text-white">
                          remark: <span className="font-bold text-red-600">*</span></label>
                        <textarea
                          name="remark"
                          id="remark"
                          value={input.remark}
                          onChange={handleChange}
                          className="rounded-lg py-3 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                          placeholder="Enter remark" />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-4">
                      <div>
                        <button type="submit" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-hidden focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none">Submit</button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-slate-500 text-white hover:bg-slate-600 focus:outline-hidden focus:bg-slate-600 disabled:opacity-50 disabled:pointer-events-none"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FirmMidal show={showFirm} setShow={setShowFirm} />
      <SectionModal show={showSeaction} setShow={setShowSeaction} />
      <CategoryModal show={showCategory} setShow={setShowCategory} />
      <LocationModal show={showLocation} setShow={setShowLocation} />
      <BranchModal show={showBranch} setShow={setShowBranch} />
    </>
  )
}

export default EditEntry