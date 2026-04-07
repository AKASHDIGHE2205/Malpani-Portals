/* eslint-disable @typescript-eslint/no-explicit-any */
interface ImageViewProp {
  imageSrc: string;
  showModal: boolean;
  setShowModal: any;
}
const ImageViewModal = ({ showModal, setShowModal, imageSrc }: ImageViewProp) => {
  if (!showModal) return null;

  return (

    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-md shadow-lg w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col justify-between">

          <img
            src={imageSrc}
            alt="Large view"
            loading="lazy"
            className="h-[300px] w-full sm:h-[400px] md:h-[500px] lg:h-[500px] xl:h-[500px] rounded-xl object-cover mb-4"
          />

          <button
            onClick={() => setShowModal(false)}
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-slate-800 text-slate-900 hover:border-slate-500 hover:text-slate-500 focus:outline-none focus:border-slate-500 focus:text-slate-500 disabled:opacity-50 disabled:pointer-events-none dark:border-white dark:text-white dark:hover:text-white dark:hover:border-slate-300 self-center"
          >
            Close
          </button>
        </div>
      </div>

    </>)
}

export default ImageViewModal
