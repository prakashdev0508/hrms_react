import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./page/login/Login";
import DashboardHome from "./page/dashboard/DashboardHome";
import HomePage from "./page/home/HomePage";
import PrivateRoute from "./routes/PrivateRoute";
import NotFound from "./page/not-found/NotFound";
import { Toaster } from "sonner";
import OrganisationDetails from "./page/onbarding/OrganisationDetails";
import OnboardingDetails from "./page/onbarding/OnboardingDetails";
import DashboardUsers from "./page/dashboard/DashboardUsers";
import UserDetails from "./page/userdetail/UserDetails";
import DashboardLeave from "./page/dashboard/DashboardLeave";
import DashboardRegularization from "./page/dashboard/DashboardRegularization";
import { GlobalProvider } from "./context/GlobalContext";

function App() {
  return (
    <>
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/crm/dashboard/home" element={<DashboardHome />} />
              <Route path="/crm/dashboard/users" element={<DashboardUsers />} />
              <Route
                path="/crm/dashboard/users/:id"
                element={<UserDetails />}
              />
              <Route path="/crm/dashboard/leave" element={<DashboardLeave />} />
              <Route
                path="/crm/dashboard/regularization"
                element={<DashboardRegularization />}
              />
            </Route>
            <Route
              path="/organization-details/:id"
              element={<OrganisationDetails />}
            />
            <Route
              path="/onboarding-details/:id"
              element={<OnboardingDetails />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <Toaster className="" />
        </BrowserRouter>
      </GlobalProvider>
    </>
  );
}

export default App;
