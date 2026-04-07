/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import Pagination from "react-js-pagination";

interface Page {
  currentPage: number;
  itemPerPage: number;
  data: any[];
  handlePageChange: (pageNumber: number) => void;
}

const Paginations: FC<Page> = ({ currentPage, itemPerPage, data, handlePageChange }) => {
  const totalItems = data?.length || 0;
  const firstItem = totalItems > 0 ? (currentPage - 1) * itemPerPage + 1 : 0;
  const lastItem = Math.min(currentPage * itemPerPage, totalItems);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end">
        <div className="text-xs text-slate-950 dark:text-slate-200 flex items-center justify-center md:justify-start">
          Showing{" "}
          <span className="mx-1">{firstItem}</span> to{" "}
          <span className="mx-1">{lastItem}</span> of{" "}
          <span className="mx-1">{totalItems}</span>{" "} {totalItems === 1 ? "item" : "items"}
        </div>
      </div>

      <div className="cursor-pointer">
        <Pagination activePage={currentPage}
          itemsCountPerPage={itemPerPage}
          totalItemsCount={totalItems}
          pageRangeDisplayed={3}
          onChange={handlePageChange}
          itemClass="px-3 py-2 border border-slate-200 dark:border-slate-700 sm:text-md text-sm rounded-md mr-1"
          linkClass=""
          activeClass="bg-blue-600 text-white"
          activeLinkClass=""
          prevPageText="<"
          nextPageText=">"
          innerClass="flex" />
      </div>
    </div>
  );
};

export default Paginations;