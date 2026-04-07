import { FC, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";

interface Props {
  showImageModal: boolean;
  setShowImageModal: (value: boolean) => void;
  selectedImage: string;
}

const DEFAULT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";

const ShowImage: FC<Props> = ({ showImageModal, setShowImageModal, selectedImage }) => {
  const [loading, setLoading] = useState(true);

  const isPDF = selectedImage?.toLowerCase().endsWith(".pdf");
  const fileToShow = selectedImage || DEFAULT_IMAGE;

  return (
    <>
      {showImageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative shadow-lg">
            <button
              className="absolute top-2 right-2 text-slate-600 hover:text-red-600"
              onClick={() => setShowImageModal(false)}
            >
              <IoMdClose size={24} />
            </button>

            {loading && (
              <div className="flex items-center justify-center h-[80vh]">
                <ImSpinner2 className="animate-spin text-slate-500" size={40} />
              </div>
            )}

            {isPDF ? (
              <iframe
                src={fileToShow}
                title="PDF Viewer"
                className={`w-full h-[80vh] rounded-md border ${loading ? "hidden" : "block"}`}
                onLoad={() => setLoading(false)}
              />
            ) : (
              <img
                src={fileToShow}
                alt="Uploaded document"
                className={`max-h-[80vh] w-full object-contain rounded-md ${loading ? "hidden" : "block"}`}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShowImage;