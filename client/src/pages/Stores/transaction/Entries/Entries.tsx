/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import FirmMidal from "./FirmModal";
import { useState } from "react";
import SectionModal from "./SectionModal";
import CategoryModal from "./CategoryModal";
import LocationModal from "./LocationModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import { handleBranch, handleCategory, handleFirm, handleLocation, handleSection } from "../../../../feature/Stores/transaction/TransactionSlice";
import { createNewTranEntry } from "../../../../services/Stores/transaction/transactionApi";
import BranchModal from "./BranchModal";

const Entries = () => {

  const date = new Date().toISOString().split("T")[0];
  const [input, setInput] = useState({
    date: date,
    entry_code: "",
    desc: "",
    year: "",
    remark: "",
    rackNO: "",
    slotNo: "",
    subSlotNo: ""
  });
  const [showFirm, setShowFirm] = useState(false);
  const [showSeaction, setShowSeaction] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showBranch, setShowBranch] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { firmID, firmName, locationID, locationName, catgID, catgName, secID, secName, branchID, branchName } = useSelector((state: RootState) => state.transaction);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      date: input.date,
      entry_code: input.entry_code,
      type_code: catgID,
      firm_code: firmID,
      branch_code: branchID,
      loc_code: locationID,
      sec_code: secID,
      year: input.year,
      cub_code: input.rackNO,
      s_code: input.slotNo,
      su_code: input.subSlotNo,
      desc: input.desc,
      remark: input.remark,
      status: 'A'
    }
    try {
      setLoading(true);
      const response = await createNewTranEntry(body);
      if (response === 201) {
        dispatch(handleCategory({ id: 0, name: "" }));
        dispatch(handleFirm({ id: 0, name: "" }));
        dispatch(handleLocation({ id: 0, name: "" }));
        dispatch(handleSection({ id: 0, name: "" }));
        dispatch(handleBranch({ id: 0, name: "" }));
        setInput({
          date: date,
          entry_code: "",
          desc: "",
          year: "",
          remark: "",
          rackNO: "",
          slotNo: "",
          subSlotNo: ""
        })
        navigate('/transaction/view');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setInput({
      date: date,
      entry_code: "",
      desc: "",
      year: "",
      remark: "",
      rackNO: "",
      slotNo: "",
      subSlotNo: ""
    })
    dispatch(handleCategory({ id: 0, name: "" }));
    dispatch(handleFirm({ id: 0, name: "" }));
    dispatch(handleLocation({ id: 0, name: "" }));
    dispatch(handleSection({ id: 0, name: "" }));
    dispatch(handleSection({ id: 0, name: "" }));
    dispatch(handleBranch({ id: 0, name: "" }));
    navigate('/transaction/view');
  }
  return (
    <>
      <div className="relative items-center w-full sm:max-w-2xl my-2 mx-2 shadow-lg">
        <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-5 dark:border-slate-700 justify-center">
          <h1 className="justify-center items-center flex text-xl font-semibold">Entry Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mt-6 grid gap-4 lg:gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="date" className="block mb-2 dark:text-white">Entry Date: <span className="font-bold text-red-600">*</span></label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    value={input.date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="entry_code" className="block mb-2 dark:text-white">
                    File No: <span className="font-bold text-red-600">*</span></label>
                  <input
                    type="text"
                    name="entry_code"
                    id="entry_code"
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    value={input.entry_code}
                    placeholder="Enter File No"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="member" className="block mb-2 dark:text-white">Firm Name <span className="text-red-600 font-bold">*</span></label>
                <div className="relative">
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      id="firm"
                      name="firm"
                      value={firmName}
                      className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      placeholder="Select firm name" readOnly />
                    <button type="button" className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                      onClick={() => setShowFirm(true)}>
                      ☰
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="branch" className="block mb-2 dark:text-white">Branch Name <span className="text-red-600 font-bold">*</span></label>
                <div className="relative">
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      value={branchName}
                      className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      placeholder="Select Branch name" readOnly />
                    <button type="button" className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800"
                      onClick={() => setShowBranch(true)}>
                      ☰
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="loc" className="block mb-2 dark:text-white">Location <span className="text-red-600 font-bold">*</span></label>
                <div className="relative">
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      id="loc"
                      name="loc"
                      value={locationName}
                      className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                      placeholder="select location"
                      readOnly />
                    <button type="button" className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800 "
                      onClick={() => setShowLocation(true)}>
                      ☰
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">

                <div>
                  <label htmlFor="year" className="block mb-2 dark:text-white">Year (yyyy-yy) <span className="text-red-600 font-bold">*</span></label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="year"
                        name="year"
                        value={input.year}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                        placeholder="Type in format(YYYY-YYYY)" />

                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="rackNo" className="block mb-2 dark:text-white">Rack No. <span className="text-red-600 font-bold">*</span></label>
                  <div className="relative">
                    <div className="flex rounded-lg shadow-sm">
                      <input
                        type="text"
                        id="rackNO"
                        name="rackNO"
                        value={input.rackNO}
                        onChange={handleChange}
                        className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
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
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    placeholder="Enter Slot No."
                    value={input.slotNo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="subSlotNo" className="block mb-2 dark:text-white">
                    Sub Slot No.: <span className="text-red-600 font-bold">*</span></label>
                  <input
                    type="text"
                    name="subSlotNo"
                    id="subSlotNo"
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500"
                    placeholder="Enter Sub Slot No."
                    value={input.subSlotNo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="member" className="block mb-2 dark:text-white">Section <span className="text-red-600 font-bold">*</span></label>
                <div className="relative">
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      id="section"
                      name="section"
                      value={secName}
                      className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 "
                      placeholder="Select section" readOnly />
                    <button type="button" className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800 "
                      onClick={() => setShowSeaction(true)}>
                      ☰
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="member" className="block mb-2 dark:text-white">Category <span className="text-red-600 font-bold">*</span></label>
                <div className="relative">
                  <div className="flex rounded-lg shadow-sm">
                    <input
                      type="text"
                      id="catg"
                      name="catg"
                      value={catgName}
                      className="rounded-l-lg sm:py-3 py-2 px-4 block w-full border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 "
                      placeholder="Select category" readOnly />
                    <button type="button" className="sm:w-[2.875rem] w-[2.6rem] sm:h-[2.875rem] h-[2.6rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-e-md border border-sky-400 focus:outline-none disabled:opacity-50 text-sky-500 dark:bg-slate-800 "
                      onClick={() => setShowCategory(true)}>
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
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 "
                    placeholder="Enter description" />
                </div>

                <div>
                  <label htmlFor="remark" className="block mb-2 dark:text-white">
                    Remark: <span className="font-bold text-red-600">*</span></label>
                  <textarea
                    name="remark"
                    id="remark"
                    value={input.remark}
                    onChange={handleChange}
                    className="rounded-lg sm:py-3 py-2 px-4 block w-full mt-2 border-slate-200  text-sm border focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600 bg-slate-100 uppercase focus:outline-none focus:ring-0 dark:focus:border-blue-500 "
                    placeholder="Enter remark" />
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <div>
                  <button type="submit" className="sm:py-3 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-hidden focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={loading}>Submit</button>
                </div>
                <div>
                  <button
                    type="button"
                    className="sm:py-3 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-slate-500 text-white hover:bg-slate-600 focus:outline-hidden focus:bg-slate-600 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div >
      </div >
      <FirmMidal show={showFirm} setShow={setShowFirm} />
      <SectionModal show={showSeaction} setShow={setShowSeaction} />
      <CategoryModal show={showCategory} setShow={setShowCategory} />
      <LocationModal show={showLocation} setShow={setShowLocation} />
      <BranchModal show={showBranch} setShow={setShowBranch} />
    </>
  )
}

export default Entries;