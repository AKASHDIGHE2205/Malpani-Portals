import CryptoJS from "crypto-js";
import { useEffect } from "react";
import { BiSolidReport } from "react-icons/bi";
import { BsBuildings, BsCalendar2Week } from "react-icons/bs";
import { FaFileAlt, FaQuestionCircle } from "react-icons/fa";
import { FaBuildingCircleArrowRight, FaChartLine, FaCodeBranch, FaStore, FaUsers, FaUserShield, FaUserTie } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { HiClipboardList, HiLocationMarker, HiOfficeBuilding, HiTag } from "react-icons/hi";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuFileText, LuInbox, LuMapPinCheck, LuMapPinned, LuSend } from "react-icons/lu";
import { MdLeaderboard } from "react-icons/md";
import { RiBuilding2Fill } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { TbCalculator, TbFileSymlink } from "react-icons/tb";
import { VscFileSubmodule, VscGraph } from "react-icons/vsc";
import { Link, NavLink } from "react-router-dom";
import Logo from '../assets/malpani3.png';

// Types
interface User {
  user: {
    user_type: string;
    role: string;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: NavItem[];
  permission?: (user: User | null) => boolean;
  hidden?: boolean; // Add hidden property
}

// Helper function to check permission with proper return type
const checkPermission = (permissionFn: ((user: User | null) => boolean) | undefined, user: User | null): boolean => {
  if (!permissionFn) return true;
  const result = permissionFn(user);
  return result === true; // Ensure boolean return
};

// Navigation Configuration
const navigationConfig: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    path: "/",
    permission: () => true,
  },
  {
    id: "store",
    label: "Store",
    icon: <VscFileSubmodule className="w-5 h-5" />,
    permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Store') &&
      (user.user.role === 'Master' || user.user.role === 'User')),
    children: [
      {
        id: "store-master",
        label: "Master",
        icon: <MdLeaderboard className="w-4 h-4" />,
        children: [
          { id: "company", label: "Company", path: "/master/campany", icon: <HiOfficeBuilding className="w-3.5 h-3.5" /> },
          { id: "location", label: "Location", path: "/master/location", icon: <HiLocationMarker className="w-3.5 h-3.5" /> },
          { id: "section", label: "Section", path: "/master/section", icon: <HiClipboardList className="w-3.5 h-3.5" /> },
          { id: "category", label: "Category", path: "/master/category", icon: <HiTag className="w-3.5 h-3.5" /> },
          { id: "branch", label: "Branch", path: "/master/branch", icon: <FaBuildingCircleArrowRight className="w-3.5 h-3.5" /> },
        ],
      },
      {
        id: "store-transactions",
        label: "Transactions",
        icon: <GrTransaction className="w-4 h-4" />,
        children: [
          { id: "record-entries", label: "Record Entries", path: "/transaction/view", icon: <TbFileSymlink className="w-3.5 h-3.5" /> },
          { id: "disposed-files", label: "Disposed Files", path: "/transaction/despose", icon: <FaFileAlt className="w-3.5 h-3.5" /> },
        ],
      },
      {
        id: "store-report",
        label: "Report",
        icon: <BiSolidReport className="w-4 h-4" />,
        children: [
          { id: "firm-branch-wise", label: "Firm/Branch Wise Report", path: "/report/branch-report", icon: <FaCodeBranch className="w-3.5 h-3.5" /> },
          { id: "all-report", label: "All Report", path: "/report/firm-report", icon: <RiBuilding2Fill className="w-3.5 h-3.5" /> },
          { id: "year-wise", label: "Year Wise Report", path: "/report/yearly-report", icon: <SlCalender className="w-3.5 h-3.5" />, hidden: true },
          { id: "entry-status", label: "Entry Status Report", path: "/report/entry-status-report", icon: <TbCalculator className="w-3.5 h-3.5" /> },
        ],
      },
    ],
  },
  {
    id: "property",
    label: "Property",
    icon: <BsBuildings className="w-5 h-5" />,
    permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Store') &&
      (user.user.role === 'Master' || user.user.role === 'User')),
    children: [
      {
        id: "property-master",
        label: "Master",
        icon: <MdLeaderboard className="w-4 h-4" />,
        children: [
          { id: "consigner", label: "Consignor", path: "/property/master/consigner", icon: <LuSend className="w-3.5 h-3.5" /> },
          { id: "consignee", label: "Consignee", path: "/property/master/consignee", icon: <LuInbox className="w-3.5 h-3.5" /> },
          { id: "document", label: "Document", path: "/property/master/document", icon: <LuFileText className="w-3.5 h-3.5" /> },
          { id: "property-location", label: "Location", path: "/property/master/location", icon: <LuMapPinned className="w-3.5 h-3.5" /> },
        ],
      },
      {
        id: "property-transactions",
        label: "Transactions",
        icon: <GrTransaction className="w-4 h-4" />,
        children: [
          { id: "purchase-entry", label: "Purchase Entry", path: "/property/transaction/tran-view", icon: <IoAddCircleOutline className="w-3.5 h-3.5" /> },
          { id: "sale-entry", label: "Sale Entry", path: "/property/sale-view", icon: <IoAddCircleOutline className="w-3.5 h-3.5" /> },
        ],
      },
      {
        id: "property-report",
        label: "Report",
        icon: <BiSolidReport className="w-4 h-4" />,
        children: [
          { id: "property-register", label: "Property Register", path: "/property/report/property-register", icon: <FaBuildingCircleArrowRight className="w-3.5 h-3.5" /> },
          { id: "property-location-wise", label: "Property Register (Locationwise)", path: "/property/report/property-location", icon: <LuMapPinCheck className="w-3.5 h-3.5" />, hidden: true },
          { id: "property-location-serv", label: "Property Register (Loc./Sur. No)", path: "/property/report/property-location-serv", icon: <BsCalendar2Week className="w-3.5 h-3.5" />, hidden: true },
        ],
      },
    ],
  },
  {
    id: "plot",
    label: "Plot",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3v18" /><path d="M3 12h18" /><path d="M9 3v18" /><rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
    permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Store') &&
      (user.user.role === 'Master' || user.user.role === 'User')),
    children: [
      { id: "plot-dashboard", label: "Dashboard", path: "/plot/dashboard", icon: <VscGraph className="w-3.5 h-3.5" /> },
      {
        id: "plot-master", label: "Plot Master", path: "/plot/master/plot-view", icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" />
          </svg>
        )
      },
      // { id: "view-layout", label: "View Layout", path: "/plot/master/consignee", icon: <LuInbox className="w-3.5 h-3.5" /> },
    ],
  },
  {
    id: "post",
    label: "POST",
    icon: <FaFileAlt className="w-5 h-5" />,
    permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Post') &&
      (user.user.role === 'Master' || user.user.role === 'User')),
    children: [
      {
        id: "post-master",
        label: "Master",
        icon: <MdLeaderboard className="w-4 h-4" />,
        children: [
          { id: "code-master", label: "Code Master", path: "/post/master/view", icon: <FaCodeBranch className="w-3.5 h-3.5" /> },
        ],
      },
      {
        id: "post-transactions",
        label: "Transactions",
        icon: <GrTransaction className="w-4 h-4" />,
        children: [
          { id: "inward-entry", label: "Inward Entry", path: "/post/Transaction/inward-view", icon: <LuInbox className="w-3.5 h-3.5" /> },
          { id: "outward-entry", label: "Outward Entry", path: "/post/Transaction/outward-view", icon: <LuSend className="w-3.5 h-3.5" /> },
          { id: "outward-details", label: "Outward Details Entry", path: "/post/Transaction/outdetails-view", icon: <LuMapPinCheck className="w-3.5 h-3.5" /> },
        ],
      },
      {
        id: "post-report",
        label: "Report",
        icon: <BiSolidReport className="w-4 h-4" />,
        children: [
          { id: "inward-outward-register", label: "Inward/Outward Register", path: "/post/report/in-out", icon: <FaBuildingCircleArrowRight className="w-3.5 h-3.5" /> },
        ],
      },
    ],
  },
  {
    id: "super-shoppe",
    label: "Super Shoppe",
    icon: <FaStore className="w-5 h-5" />,
    permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Saragam') &&
      (user.user.role === 'Master' || user.user.role === 'Admin' || user.user.role === 'Manager')),
    children: [
      {
        id: "shoppe-master",
        label: "Master",
        icon: <MdLeaderboard className="w-4 h-4" />,
        permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Saragam') &&
          (user.user.role === 'Master' || user.user.role === 'Admin')),
        children: [
          { id: "faq", label: "FAQ", path: "/sargam/master/faq-view", icon: <FaQuestionCircle className="w-3.5 h-3.5" /> },
          { id: "members", label: "Members", path: "/sargam/master/mem-view", icon: <FaUsers className="w-3.5 h-3.5" /> },
          { id: "view-progress", label: "View Progress", path: "/sargam/master/progress-view", icon: <FaChartLine className="w-3.5 h-3.5" /> },
        ],
      },
      {
        id: "shoppe-transactions",
        label: "Transactions",
        icon: <GrTransaction className="w-4 h-4" />,
        children: [
          {
            id: "admin-faq",
            label: "Admin FAQ",
            path: "/saragam/master/admin-faq",
            icon: <FaUserShield className="w-3.5 h-3.5" />,
            permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Saragam') &&
              (user.user.role === 'Master' || user.user.role === 'Admin'))
          },
          {
            id: "manager-faq",
            label: "Manager FAQ",
            path: "/saragam/master/manager-faq",
            icon: <FaUserTie className="w-3.5 h-3.5" />,
            permission: (user) => !!(user && (user.user.user_type === 'Master' || user.user.user_type === 'Saragam') &&
              (user.user.role === 'Master' || user.user.role === 'Admin' || user.user.role === 'Manager'))
          },
        ],
      },
    ],
  },
];

// Recursive component to render nav items
const NavItemRenderer = ({
  item,
  user,
  onNavigate,
  depth = 0
}: {
  item: NavItem;
  user: User | null;
  onNavigate: () => void;
  depth?: number;
}) => {
  // Check if item is hidden
  if (item.hidden) return null;

  // Check permission
  const hasPermission = checkPermission(item.permission, user);
  if (!hasPermission) return null;

  const paddingLeft = depth > 0 ? `${depth * 0.75}rem` : undefined;

  // If it's a leaf node (has path)
  if (item.path) {
    return (
      <li>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-x-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${isActive
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100"
              : "text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700/50"
            }`
          }
          to={item.path}
          onClick={onNavigate}
          style={{ paddingLeft }}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  }

  // If it's a parent node (has children)
  return (
    <li className="hs-accordion" id={`accordion-${item.id}`}>
      <button
        type="button"
        className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2.5 px-4 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none focus:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:bg-slate-700 transition-colors"
        aria-expanded="false"
        aria-controls={`accordion-child-${item.id}`}
        style={{ paddingLeft }}
      >
        {item.icon}
        <span>{item.label}</span>
        <svg
          className="hs-accordion-active:block ms-auto hidden w-4 h-4 text-slate-600 dark:text-slate-400"
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
          <path d="m18 15-6-6-6 6" />
        </svg>
        <svg
          className="hs-accordion-active:hidden ms-auto block w-4 h-4 text-slate-600 dark:text-slate-400"
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        id={`accordion-child-${item.id}`}
        className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
        role="region"
        aria-labelledby={`accordion-${item.id}`}
      >
        <ul className="pt-2 ps-2 space-y-1">
          {item.children?.map((child) => (
            <NavItemRenderer
              key={child.id}
              item={child}
              user={user}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

const Sidebar = () => {
  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

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
  };

  const getUserData = () => {
    const encryptedData = sessionStorage.getItem("user");
    if (encryptedData) {
      return dcryptdata(encryptedData, secretKey);
    }
    return null;
  };

  const user = getUserData();

  // Close sidebar on navigation (for mobile)
  const handleNavigate = () => {
    const sidebar = document.getElementById("stopreapp-sidebar");
    if (sidebar && window.innerWidth < 1024) {
      // Close sidebar on mobile after navigation
      const closeButton = document.querySelector('[data-hs-overlay="#stopreapp-sidebar"]');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    }
  };

  // Filter navigation items based on user permissions
  const visibleNavItems = navigationConfig.filter(item =>
    !item.hidden && checkPermission(item.permission, user)
  );

  return (
    <>
      {/* Sidebar */}
      <div
        id="stopreapp-sidebar"
        className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform
                   w-[280px] h-full hidden fixed inset-y-0 start-0 z-[60] bg-gradient-to-b from-slate-50 to-slate-100 border-e border-slate-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700"
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Logo Section */}
          <div className="px-6 pt-6 pb-4 bg-white/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <Link
              to="/"
              className="flex-none text-black rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80 hover:opacity-90 transition-opacity"
              onClick={handleNavigate}
            >
              <div className="flex items-center space-x-2">
                <img src={Logo} alt="logo" className="w-10 h-10" />
                <span className="text-xl font-bold text-[#e20f0f] hover:text-[#cc0000] dark:text-white flex flex-col">
                  Malpani <br /> Group
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Content */}
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
            <nav className="hs-accordion-group px-4 py-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
              <ul className="flex flex-col space-y-2">
                {visibleNavItems.map((item) => (
                  <NavItemRenderer
                    key={item.id}
                    item={item}
                    user={user}
                    onNavigate={handleNavigate}
                  />
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;