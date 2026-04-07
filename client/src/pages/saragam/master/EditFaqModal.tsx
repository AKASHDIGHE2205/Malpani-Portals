/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { EditFaq } from "../../../services/saragam/MasterApis";

const EditFaqModal = ({ showModal, setShowModal, selectedFaq, onSave }: any) => {
  const [Inputs, setInputs] = useState({
    name: '',
    status: '',
  });
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setInputs({
      name: selectedFaq.question,
      status: selectedFaq.status,
    })
  }, [selectedFaq])

  //handling user inputs
  const handleInputs = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setloading(true);

    const body = {
      id: selectedFaq.id,
      question: Inputs.name,
      status: Inputs.status
    };

    try {
      const response = await EditFaq(body);
      if (response) {
        setShowModal(false);
        onSave()
        setInputs({
          name: "",
          status: ""
        })
      }
    } catch (error) {
      console.error("Failed to update member:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-slate-600">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                Edit FAQ
              </h3>
              <button
                onClick={() => setShowModal(false)}
                type="button"
                className="text-slate-400 bg-transparent hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-slate-600 dark:hover:text-white"
              >
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Question Field */}
                <div>
                  <label htmlFor="question" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                    Question <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={Inputs.name}
                    onChange={handleInputs}
                    name="name"
                    id="name"
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your question"
                    required
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label htmlFor="status" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                    Status <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={Inputs.status}
                    onChange={handleInputs}
                    name="status"
                    id="status"
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="A">Active</option>
                    <option value="I">InActive</option>
                  </select>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end pt-4 space-x-3 border-t border-slate-200 dark:border-slate-600">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="py-2.5 px-5 text-sm font-medium text-slate-900 focus:outline-none bg-white rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:text-white dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default EditFaqModal;
