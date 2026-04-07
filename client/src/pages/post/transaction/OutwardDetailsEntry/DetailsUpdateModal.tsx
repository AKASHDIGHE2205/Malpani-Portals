/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { updateOutwardDetails } from "../../../../services/post/Transaction/TransactionsAPI";
interface Outward {
    row: any;
}
const DetailsUpdateModal: FC<Outward> = ({ row }) => {
    const [Inputs, setInputs] = useState({
        amount: "",
        return: '',
        recno: "",
        recdate: "",
    });

    const handleInputs = (e: any) => {
        const { name, value } = e.target;
        setInputs({ ...Inputs, [name]: value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!Inputs.amount && !Inputs.return && !Inputs.recno && !Inputs.recdate) {
            toast.error("All fields must be filled.");
            return;
        }

        const body = {
            entry_id: row.entry_id || "0",
            charges: Inputs.amount || "",
            ret: Inputs.return || "",
            rec_no: Inputs.recno || "",
            rec_date: Inputs.recdate || "",
        };
        try {
            await updateOutwardDetails(body);
            setInputs({
                amount: "",
                return: '',
                recno: "",
                recdate: "",
            });
            toast.success("Details updated successfully.");
        } catch (error: any) {
            toast.error(error.message || "An error occurred.");
        }

        (document.getElementById("detailsModal") as HTMLDialogElement).close();
    };

    return (
        <dialog id="detailsModal" className="modal">

            <div className="modal-box bg-white dark:bg-gray-800 w-11/12 max-w-4xl dark:shadow-gray-900">
                <button
                    onClick={() => (document.getElementById("detailsModal") as HTMLDialogElement)?.close()}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    ✕
                </button>
                <form onSubmit={handleSubmit} className="form-control space-y-5">
                    <h1 className="flex justify-center font-bold mb-3 text-lg text-gray-800 dark:text-white"><span>Outward Details Update....</span></h1>

                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-3">
                        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:w-1/2">
                            <label className="sm:w-[47%] bold text-gray-700 dark:text-gray-300" htmlFor="period">Amount<span className="text-error">*</span></label>
                            <input value={Inputs.amount} onChange={handleInputs} name="amount" type="number" placeholder="Type here" className="input input-bordered h-9 w-full sm:w-2/3 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:w-1/2">
                            <label className="sm:w-1/5 semi-bold text-gray-700 dark:text-gray-300" htmlFor="interestRate">Return<span className="text-error">*</span></label>
                            <input value={Inputs.return} onChange={handleInputs} name="return" type="text" className="input input-bordered h-10 w-full sm:w-[61%] dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-3">
                        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:w-1/2">
                            <label className="sm:w-[47%] bold text-gray-700 dark:text-gray-300" htmlFor="period">Rec.No<span className="text-error">*</span></label>
                            <input value={Inputs.recno} onChange={handleInputs} name="recno" type="text" placeholder="Type here" className="input input-bordered h-9 w-full sm:w-2/3 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-3 sm:w-1/2">
                            <label className="sm:w-1/5 semi-bold text-gray-700 dark:text-gray-300" htmlFor="interestRate">Rec.Date<span className="text-error">*</span></label>
                            <input value={Inputs.recdate} onChange={handleInputs} name="recdate" type="date" className="input input-bordered h-10 w-full sm:w-[61%] dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                    </div>


                    <div className="flex justify-center gap-5">
                        <button className="btn btn-sm btn-outline btn-success dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/30" type="submit">Update</button>
                        <button
                            type="button"
                            onClick={() => (document.getElementById("detailsModal") as HTMLDialogElement)?.close()}
                            className="btn float-end btn-sm btn-outline dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"   >
                            Close
                        </button>

                    </div>
                </form>


            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}

export default DetailsUpdateModal;