import Aos from 'aos';
import 'aos/dist/aos.css';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Loadings from "./components/Loadings";
import DefaultLayout from './layout/DefaultLayout';
import { RootState } from './store/store';

import ForgotPassword from "./pages/authentication/ForgotPassword";
import UserView from './pages/User/UserView';
import PlotRepoprt1 from './pages/plot/reports/PlotRepoprt1';

const PlotDashboard = lazy(() => import('./pages/plot/Dashboard/PlotDashboard'));
const AddProp = lazy(() => import('./pages/plot/master/AddProp'));
const EditProp = lazy(() => import('./pages/plot/master/EditProp'));
const ViewProp = lazy(() => import('./pages/plot/master/ViewProp'));
const Home = lazy(() => import('./pages/home/Home'));
const Entries = lazy(() => import('./pages/Stores/transaction/Entries/Entries'));
const CompanyView = lazy(() => import('./pages/Stores/master/Company/CompanyView'));
const LocationView = lazy(() => import('./pages/Stores/master/Location/LocationView'));
const SectionView = lazy(() => import('./pages/Stores/master/Section/SectionView'));
const CategoryView = lazy(() => import('./pages/Stores/master/Category/CategoryView'));
const EntryView = lazy(() => import('./pages/Stores/transaction/Entries/EntryView'));
const SignIn = lazy(() => import('./pages/authentication/SignIn'));
const SignUp = lazy(() => import('./pages/authentication/SignUp'));
const SignOut = lazy(() => import('./pages/authentication/SignOut'));
const DesposedView = lazy(() => import('./pages/Stores/transaction/Despose file/DesposedView'));
const Deposite = lazy(() => import('./pages/Stores/transaction/Despose file/Deposite'));
const BranchView = lazy(() => import('./pages/Stores/master/Branch/BranchView'));
const EntryForm = lazy(() => import('./pages/Stores/report/Entry status report/EntryForm'));
const FirmWiseReport = lazy(() => import('./pages/Stores/report/FirmWiseReports/FirmWiseReport'));
const BranchWiseReport = lazy(() => import('./pages/Stores/report/BranchWiseReport/BranchWiseReport'));
const YearWiseReport = lazy(() => import('./pages/Stores/report/YearWiseReport/YearWiseReport'));
const ConsigneeView = lazy(() => import("./pages/Property/master/consignee/ConsigneeView"))
const ConsignerView = lazy(() => import("./pages/Property/master/consigner/ConsignerView"));
const PLocationView = lazy(() => import("./pages/Property/master/location/PLocationView"));
const DocumentView = lazy(() => import("./pages/Property/master/document/DocumentView"));
const TranNewEntry = lazy(() => import("./pages/Property/transaction/TranNewEntry"));
const ProRegLocServ = lazy(() => import("./pages/Property/report/property-registerLoc-srv/ProRegLocServ"));
const LocationwiseReport = lazy(() => import("./pages/Property/report/property-locationwise/LocationwiseReport"));
const ProForm = lazy(() => import("./pages/Property/report/property-register/ProForm"));
const TranView = lazy(() => import("./pages/Property/transaction/TranView"));
const SaleProView = lazy(() => import("./pages/Property/transaction/Sale-prop/SaleProView"));
const SaleNewEntry = lazy(() => import("./pages/Property/transaction/Sale-prop/SaleNewEntry"));
const CodeMasterView = lazy(() => import("./pages/post/master/CodeMasterView"));
const CreateNewGroup = lazy(() => import("./pages/post/master/CreateNewGroup"));
const InwardEntryView = lazy(() => import("./pages/post/transaction/InwardEntry/InwardEntryView"));
const InwardEntry = lazy(() => import("./pages/post/transaction/InwardEntry/InwardEntry"));
const OutwardEntryView = lazy(() => import("./pages/post/transaction/OutwardEntry/OutwardEntryView"));
const OutwardEntry = lazy(() => import("./pages/post/transaction/OutwardEntry/OutwardEntry"));
const OutwardDetailsEntry = lazy(() => import("./pages/post/transaction/OutwardDetailsEntry/OutwardDetailsEntry"));
const InOutRegister = lazy(() => import("./pages/post/report/InOutRegister/InOutRegister"));
const MemberView = lazy(() => import("./pages/saragam/master/MemberView"));
const ViewFAQ = lazy(() => import("./pages/saragam/master/ViewFAQ"));
const ViewProgress = lazy(() => import("./pages/saragam/master/ViewProgress"));
const FilledChecklist = lazy(() => import("./pages/saragam/master/FilledChecklist"));
const AdminFAQ = lazy(() => import("./pages/saragam/transaction/AdminFAQ/AdminFAQ"));
const ManagerFAQ = lazy(() => import("./pages/saragam/transaction/ManagerFAQ/ManagerFAQ"));

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  //const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    Aos.init({ duration: 2500 });
  }, []);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (window.HSStaticMethods) {
  //       window.HSStaticMethods.autoInit();
  //     }
  //   }, 0);
  //   return () => clearTimeout(timeout);
  // }, [location.pathname]);

  return (
    isAuthenticated ? (
      <Suspense fallback={<Loadings />}>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path='user-master' element={<UserView />} />

            {/*Store Transaction Routes */}
            <Route path="transaction/view" element={<EntryView />} />
            <Route path="transaction/entries" element={<Entries />} />
            <Route path="transaction/desposed-file" element={<DesposedView />} />
            <Route path="transaction/despose" element={<Deposite />} />

            {/*Store  Master Routes */}
            <Route path="master/campany" element={<CompanyView />} />
            <Route path="master/location" element={<LocationView />} />
            <Route path="master/section" element={<SectionView />} />
            <Route path="master/category" element={<CategoryView />} />
            <Route path="master/branch" element={<BranchView />} />

            {/*Store  Report Routes */}
            <Route path="report/entry-status-report" element={<EntryForm />} />
            <Route path="report/firm-report" element={<FirmWiseReport />} />
            <Route path="report/branch-report" element={<BranchWiseReport />} />
            <Route path="report/yearly-report" element={<YearWiseReport />} />

            {/*Property Master Routes */}
            <Route path="property/master/consignee" element={<ConsigneeView />} />
            <Route path="property/master/consigner" element={<ConsignerView />} />
            <Route path="property/master/location" element={<PLocationView />} />
            <Route path="property/master/document" element={<DocumentView />} />

            {/*Property Transaction Routes */}
            <Route path="property/transaction/tran-view" element={<TranView />} />
            <Route path="property/transaction/create" element={<TranNewEntry />} />
            <Route path="property/sale-view" element={<SaleProView />} />
            <Route path="property/sale-entry" element={<SaleNewEntry />} />       


            {/*Property Report  Routes */}
            <Route path="property/report/property-register" element={<ProForm />} />
            <Route path="property/report/property-location" element={<LocationwiseReport />} />
            <Route path="property/report/property-location-serv" element={<ProRegLocServ />} />

            {/*Post Routes */}
            <Route path="post/master/view" element={<CodeMasterView />} />
            <Route path="post/master/create" element={<CreateNewGroup />} />
            <Route path="post/Transaction/inward-view" element={<InwardEntryView />} />
            <Route path="post/Transaction/inward-new" element={<InwardEntry />} />
            <Route path="post/Transaction/outward-view" element={<OutwardEntryView />} />
            <Route path="post/Transaction/outward-new" element={<OutwardEntry />} />
            <Route path="post/Transaction/outdetails-view" element={<OutwardDetailsEntry />} />
            <Route path="post/report/in-out" element={<InOutRegister />} />


            {/*Checklist Routes */}
            <Route path="sargam/master/mem-view" element={<MemberView />} />
            <Route path="sargam/master/faq-view" element={<ViewFAQ />} />
            <Route path="sargam/master/progress-view" element={<ViewProgress />} />
            <Route path="saragam/master/filledchecklist/:loc_id" element={<FilledChecklist />} />
            <Route path="saragam/master/admin-faq" element={<AdminFAQ />} />
            <Route path="saragam/master/manager-faq" element={<ManagerFAQ />} />

            {/*Plot Routes */}
            <Route path="plot/master/plot-view" element={<ViewProp />} />
            <Route path="plot/master/plot-edit" element={<EditProp />} />
            <Route path="plot/master/add-plot" element={<AddProp />} />
            <Route path="plot/dashboard" element={<PlotDashboard />} />
            <Route path="plot/report" element={<PlotRepoprt1/>}/>

          </Route>

          <Route path="/log-out" element={<SignOut />} />
        </Routes>
      </Suspense>
    ) : (
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/sign-in" />} />
      </Routes>
    )
  );
}

export default App;