import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import Logo from '../assets/malpani3.png';
import CryptoJS from "crypto-js";
import { FaRegUser } from "react-icons/fa";

const Header = () => {
  const secretKey = `Malpani@2025`;

  const dcryptdata = (encryptedData: string, secretkey: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretkey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) {
        throw new Error("Decryption failed. Data is empty or corrupted.");
      }
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Error during decryption:", error);
      return null;
    }
  }

  const getUserData = () => {
    const encryptedData = sessionStorage.getItem("user");
    if (encryptedData) {
      return dcryptdata(encryptedData, secretKey)
    }
    return null
  }

  const user = getUserData();

  return (
    <>
      {/* <!-- ========== HEADER ========== --> */}
      <header className="sticky top-0 left-0 right-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-[48] w-full
                       bg-white border-b text-sm py-2.5 lg:ps-[260px] dark:bg-slate-900 dark:border-slate-700">
        <nav className="px-2 sm:px- flex basis-full items-center w-full mx-auto">
          <div className="me-5 lg:me-0 lg:hidden">
            {/* <!-- Logo --> */}
            <Link

              className="hidden flex-none text-black rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
              to="/"
            >
              <div className="flex -mt-1 items-center gap-x-1">
                <img src={Logo} alt="logo" className="w-32 h-16" />
              </div>
            </Link>
            {/* <!-- End Logo --> */}
            <button
              type="button"
              //md:hidden
              className="size-10 flex justify-center items-center rounded-lg border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:border-slate-700 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-600 dark:focus:ring-offset-slate-900"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="stopreapp-sidebar"
              aria-label="Toggle navigation"
              data-hs-overlay="#stopreapp-sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3 ">
            <div className="hidden md:block">
              {/* <!-- Search Input --> */}
              <div className="relative hidden">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                  <svg
                    className="shrink-0 size-4 text-slate-400 dark:text-white/60"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  readOnly
                  className="py-2 ps-10 pe-16 block w-full bg-slate-100 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:placeholder:text-slate-400 dark:focus:ring-slate-600"
                  placeholder="Search"
                />
                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-slate-400">
                  <svg
                    className="shrink-0 size-3 text-slate-400 dark:text-white/60"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                  <span className="mx-1">
                    <svg
                      className="shrink-0 size-3 text-slate-400 dark:text-white/60"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                  <span className="text-xs">/</span>
                </div>
              </div>
              {/* <!-- End Search Input --> */}
            </div>

            <div className="flex flex-row items-center justify-end gap-1">

              <button
                type="button"
                className="hidden size-[38px] relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-slate-800 hover:bg-slate-100 focus:outline-none focus:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="sr-only">Notifications</span>
              </button>

              <button
                type="button"
                className="hidden size-[38px] relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-slate-800 hover:bg-slate-100 focus:outline-none focus:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-slate-700 dark:focus:bg-slate-700"
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span className="sr-only">Activity</span>
              </button>

              <button type="button" className="hs-dark-mode-active:hidden block hs-dark-mode font-medium text-slate-800 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none focus:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-900 dark:focus:bg-slate-900" data-hs-theme-click-value="dark">
                <span className="group inline-flex shrink-0 justify-center items-center size-9">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </svg>
                </span>
              </button>
              <button type="button" className="hs-dark-mode-active:block hidden hs-dark-mode font-medium text-slate-800 rounded-full hover:bg-slate-200 focus:outline-none focus:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:bg-slate-900" data-hs-theme-click-value="light">
                <span className="group inline-flex shrink-0 justify-center items-center size-9">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="m17.66 17.66 1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="m6.34 17.66-1.41 1.41"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                  </svg>
                </span>
              </button>

              {/* <!-- Dropdown --> */}
              <div className="hs-dropdown [--placement:bottom-right] relative inline-flex rounded-full shrink-0  size-[38px]">
                <button
                  id="hs-dropdown-account"
                  type="button"
                  className="inline-flex justify-center items-center size-9 rounded-full border border-transparent text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:ring-slate-700 transition-colors"
                  aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                  <div className="shrink-0 flex justify-center items-center size-9 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-full transition-all">
                    {user ? (
                      <span className="font-medium text-sm">
                        {user?.user?.f_name?.charAt(0).toUpperCase()}{user?.user?.l_name?.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <FaRegUser className="size-4" />
                    )}
                  </div>
                </button>

                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-lg rounded-lg mt-2 dark:bg-slate-800 dark:border dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 before:absolute before:-top-2 before:end-4 before:w-4 before:h-4 before:bg-white before:border before:border-slate-200 before:transform before:rotate-45 before:z-0 dark:before:bg-slate-800 dark:before:border-slate-700"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="hs-dropdown-account"
                >
                  <div className="py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg dark:from-blue-600 dark:to-blue-700">
                    <p className="text-sm text-white/90">
                      Signed in as
                    </p>
                    <p className="text-lg font-medium text-white truncate">
                      {user?.user?.email || "Guest"}
                    </p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    {/* logout */}
                    <Link
                      to="/log-out"
                      className="flex items-center gap-x-3.5 py-2 px-3 font-semibold rounded-lg text-red-800 hover:bg-slate-100 focus:outline-none focus:bg-slate-100 dark:text-red-400 dark:hover:bg-slate-800 dark:hover:text-red-500 dark:focus:bg-slate-700 dark:focus:text-slate-300">
                      <FiLogOut className="text-lg" />Logout
                    </Link>
                  </div>
                </div>
              </div>
              {/* <!-- End Dropdown --> */}
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header