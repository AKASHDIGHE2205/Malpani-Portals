/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState } from "react";
import imageCompression from 'browser-image-compression';

interface QuestionProp {
  id: string;
  question: string;
  Qstatus: any;
  index: number;
  statusQ: any
  onAnswerChange: (
    id: string,
    status: string,
    description: string,
    image?: File | null,
  ) => void;
}
const QuestionsCard: FC<QuestionProp> = ({ id, question, onAnswerChange, index, statusQ }) => {
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(image, statusQ);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    onAnswerChange(id, value, description);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);
    onAnswerChange(id, status, value);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setIsLoading(true);
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      setImage(compressedFile);
      await onAnswerChange(id, status, description, compressedFile);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col dark:hover:border-blue-500 border-2 hover:border-blue-600 transition-all duration-300 ease-in-out bg-white shadow-sm rounded-xl dark:bg-slate-900 dark:border-slate-700 dark:shadow-slate-700/70">
      <div className="bg-slate-100 border-b rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-slate-900 dark:border-slate-700">
        <p className="mt-1 text-sm text-black dark:text-slate-300">
          <span className="inline-flex text-lg">{index}.{question}</span>
        </p>
      </div>
      <div className="p-4 md:p-5">
        <form className="space-y-4">
          <div>
            <label htmlFor={`hs-select-label`} className="block text-sm mb-2 dark:text-white">Status <span className="text-red-600">*</span></label>
            <select defaultValue={status} onChange={handleStatusChange} id={`hs-select-label`} className="bg-slate-100 py-2 px-4 pr-9 block w-full border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600">
              <option selected>Select The Status</option>
              <option>Completed</option>
              <option>InCompleted</option>
              <option>InProgress</option>
            </select>
          </div>

          <div className="w-full">
            <label htmlFor={`input-label-with-helper-text`} className="block text-sm mb-2 dark:text-white">Description <span className="text-red-600">*</span></label>
            <input onChange={handleDescriptionChange} type="text" id={`input-label-with-helper-text`} className="bg-slate-100 py-2 px-4 block w-full border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600" placeholder="Enter Description" required />
          </div>

          {status === "Completed" && (<div className="w-full">
            <label htmlFor={`input-label-with-file`} className="block text-sm font-medium mb-2 dark:text-white">Upload File <span className="text-red-600">*</span></label>
            <input onChange={handleImageChange} type="file" id={`input-label-with-file`} accept="image/*"
              capture="environment" className="bg-slate-100 py-2 px-4 block w-full border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:ring-slate-600" required />
            {isLoading && <div>Loading...</div>}
          </div>)}
        </form>
      </div>
    </div>
  )
}
export default QuestionsCard;