/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { createNewGroup } from "../../../services/post/Configuration/ConfigurationApi";
import { Link, useNavigate } from "react-router-dom";

const CreateNewGroup = () => {
    const [selectedGroup, setselectedGroup] = useState("");
    const [group, setGroup] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedGroup || !group) {
            toast.error("Please Select a Group and Enter a Name");
            return;
        }
        const body = {
            Group: selectedGroup,
            name: group,
            status: "A"
        }
        try {
            const response = await createNewGroup(body);
            if (response.status === 200) {
                navigate("/post/master/view");
            }
        } catch (error: any) {
            toast.error(error);
        }
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-slate-900 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">Create New Group</h1>
                    <p className="text-center text-slate-600 dark:text-slate-400 mt-1">Add a new group to the system</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Group Type Selection */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="type">
                                    Group Type<span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:text-white dark:bg-slate-700"
                                    name="type"
                                    id="type"
                                    required
                                    onChange={(e) => setselectedGroup(e.target.value)}
                                >
                                    <option value="">Select Group Type</option>
                                    <option value="F">Firm</option>
                                    <option value="D">Department</option>
                                    <option value="T">Type</option>
                                </select>
                            </div>

                            {/* Group Name Input */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="newgroup">
                                    Group Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    onChange={(e) => setGroup(e.target.value)}
                                    type="text"
                                    placeholder="Enter new group name"
                                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:text-white dark:bg-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                                type="submit"
                            >
                                <IoAddSharp size={20} />
                                Create Group
                            </button>
                            <Link
                                to="/post/master/view"
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateNewGroup;