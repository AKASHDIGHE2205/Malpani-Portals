/* eslint-disable @typescript-eslint/no-explicit-any */
import { GiShoppingCart } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const LocationCard = ({ item }: any) => {
  const navigate = useNavigate();
  return (
    <>
      <div onClick={() => navigate(`/saragam/master/filledchecklist/${item.id}`)} className=" border-2 h-16 dark:hover:border-blue-500 hover:border-blue-600 transition-all duration-300 ease-in-out flex flex-col bg-white  shadow-xl rounded-xl dark:bg-slate-800 dark:border-slate-700 ">
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-x-2 justify-center">
            <p><GiShoppingCart size={22} /></p>
            <p className="text-xs uppercase tracking-wide text-black dark:text-white ">
              {item.name}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LocationCard;
