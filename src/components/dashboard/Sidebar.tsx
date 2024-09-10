import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  Users2,
  ListCheck,
  University,
  GraduationCap,
  ShoppingCart,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import SmallLogo from "/images/image.png";

const Sidebar = () => {
  const [openLogoutAlert, setOpenLogoutAlert] = useState(false);
  const [locationUrl, setLocationUrl] = useState("");

  useEffect(() => {
    const currentUrl = window.location.pathname;
    setLocationUrl(currentUrl);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    secureLocalStorage.removeItem("accessTokenHRMS");
    secureLocalStorage.removeItem("role");
    secureLocalStorage.removeItem("organizationDetails");
    navigate("/login");
    toast.success("Logged out");
  };

  const isActive = (url: string) => locationUrl.startsWith(url);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link to={"/"} className="mb-5">
            <img src={SmallLogo} alt="" />
          </Link>

          <TooltipProvider>
            {/* Dashboard */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/crm/dashboard/home"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/crm/dashboard/home")
                      ? "bg-purple-800 text-primary-foreground hover:text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>

            {/* Users */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/crm/dashboard/users"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/crm/dashboard/users")
                      ? "bg-purple-800 text-primary-foreground hover:text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Users</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Users</TooltipContent>
            </Tooltip>

            {/* Students */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/students"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/students")
                      ? "bg-purple-800 text-primary-foreground hover:text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span className="sr-only">Students</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Students</TooltipContent>
            </Tooltip>

            {/* Class */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/class"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/class")
                      ? "bg-purple-800 text-primary-foreground hover:text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  <University className="h-5 w-5" />
                  <span className="sr-only">Class</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Class</TooltipContent>
            </Tooltip>

            {/* Attendance */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/attendence"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/attendence")
                      ? "bg-purple-800 text-primary-foreground hover:text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  <ListCheck className="h-5 w-5" />
                  <span className="sr-only">Attendence</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Attendence</TooltipContent>
            </Tooltip>

            {/* Products */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Products</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">Products</TooltipContent>
            </Tooltip>

            {/* Customers */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Customers</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>

            {/* Analytics */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </a>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-10">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpenLogoutAlert(true)}
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 md:ml-14 sm:ml-14 sm:mt-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <a
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <LineChart className="h-5 w-5" />
                Reports
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Alert for Logout */}
      <AlertDialog
        open={openLogoutAlert}
        onOpenChange={() => setOpenLogoutAlert(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setOpenLogoutAlert(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
