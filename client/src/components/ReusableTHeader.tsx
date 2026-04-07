/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react"

interface OtherData {
    setSearchTerm: string | any
    name: string;
    createButtonAction: () => void;
}
const ReusableTHeader: FC<OtherData> = ({ setSearchTerm, name, createButtonAction }) => {
    return (

        <div className="sticky top-0 p-4 rounded-lg shadow-sm border border-gray-300 mb-6 bg-white dark:bg-gray-800 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Title Section */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-800 truncate dark:text-white">{name}</h1>
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:flex-initial">
                        <div className="relative w-full">
                            <input
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500  dark:text-white dark:bg-gray-700"
                                placeholder="Search..."
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 text-gray-400"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={createButtonAction}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-sm flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-blue-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReusableTHeader
