import { Link, useParams } from "react-router-dom";
import withDefaultDashBoardLayout from "../../components/shared/WithDefaultDashBoardLayout";
import { useEffect, useState } from "react";
import { updateUserDetailById, userDetailById } from "../../helpers/actions";
import moment from "moment";
import { User2Icon } from "lucide-react";
import { Switch } from "@headlessui/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import secureLocalStorage from "react-secure-storage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";

const UserDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [openToggelModal, setOpenToggelModal] = useState(false);
  const [toggelLoader, setToggelLoader] = useState(false);

  const role = secureLocalStorage.getItem("role");

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const fetchData = async (month: number, year: number) => {
    setLoading(true);
    try {
      const response = await userDetailById(id as String, month + 1, year);
      setUserData(response.data);
    } catch (error) {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [id, selectedMonth, selectedYear]);

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-300";
      case "absent":
        return "bg-red-600";
      case "late":
        return "bg-yellow-300";
      case "early":
        return "bg-red-200";
      case "checked_in":
        return "bg-green-200";
      case "on_leave":
        return "bg-blue-300";
      case "not available":
        return "bg-gray-200";
      default:
        return "bg-gray-100";
    }
  };

  const toggleUserStatus = () => {
    setOpenToggelModal(!openToggelModal);
  };

  const handleChangeStatus = async () => {
    setToggelLoader(true);
    try {
      const data = {
        is_active: !userData?.is_active,
      };

      const response = await updateUserDetailById(id as String, data);
      if (response?.status == "success") {
        toast.success("User updated");
        setOpenToggelModal(false);
        fetchData(selectedMonth, selectedYear);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setToggelLoader(false);
    }
  };

  // Generate an array of days in the selected month, accounting for the first day of the month
  const generateCalendarDays = () => {
    const daysInMonth = moment({
      year: selectedYear,
      month: selectedMonth,
    }).daysInMonth();
    const firstDayOfMonth = moment({ year: selectedYear, month: selectedMonth })
      .startOf("month")
      .day(); // 0 = Sunday, 1 = Monday, etc.

    const days = [];

    // Add empty slots for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        date: null, // No date, just an empty cell
        status: null,
      });
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = moment({
        year: selectedYear,
        month: selectedMonth,
        day,
      }).format("YYYY-MM-DD");
      const attendance = userData?.attendance?.find((att: any) =>
        moment(att.date).isSame(currentDate, "day")
      );
      days.push({
        date: currentDate,
        status: attendance?.status || "not available",
      });
    }

    return days;
  };

  return (
    <div className="px-4">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* User Details */}

          <div className=" flex justify-between mb-4">
            <div>
            <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/crm/dashboard/users">Users</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage> {userData?.name} </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
            </div>
            <div> <Button>Update User</Button> </div>
          </div>

          {userData && (
            <div className="mb-8  border rounded-md p-4 ">
              {/* <div className="flex justify-between mb-10">
                <h1 className="text-xl font-bold ">
                  <b>{userData?.name?.toUpperCase()}</b>
                </h1>
                {role == "super_admin" && userData?.role != "super_admin" && (
                  <div className="">
                    <Switch
                      checked={userData?.is_active}
                      onChange={toggleUserStatus}
                      className={`${
                        userData?.is_active ? "bg-green-500" : "bg-gray-300"
                      } relative inline-flex h-4 w-8 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          userData?.is_active
                            ? "translate-x-5"
                            : "translate-x-1"
                        } inline-block h-2 w-2 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                )}
              </div> */}

              <div className="md:flex">
                <div className=" mr-3">
                  <div className=" md:block hidden border bg-purple-300 p-2 rounded-md ">
                    <User2Icon size={64} color="white" />{" "}
                  </div>
                </div>
                <div className=" mr-20 ">
                  {" "}
                  <p className=" mb-1">
                    <b>Email:</b> {userData?.email}
                  </p>
                  <p className=" mb-1">
                    <b>Username:</b> {userData?.username}
                  </p>
                  <p className=" mb-1">
                    <b>Role:</b> {userData?.role}
                  </p>
                </div>
                <div className=" md:block hidden h-[82px] w-[2px] mr-8 bg-gray-200"></div>

                <div className=" mr-20">
                  {" "}
                  <p className=" mb-1">
                    <b>Salary:</b> {userData?.salary || 0}
                  </p>
                  <p className=" mb-1">
                    <b>Week Leave:</b> {userData?.weekLeave}
                  </p>
                  <p className=" mb-1">
                    <b>Joined On:</b>{" "}
                    {moment(userData?.joinDate).format("DD MMM YYYY")}
                  </p>
                </div>
                <div className=" md:block hidden h-[82px] w-[2px] mr-8 bg-gray-200"></div>
                <div className="mr-10">
                  <p className=" mb-1">
                    <b>Working Days : </b> 10{" "}
                  </p>
                  <p className=" mb-1">
                    <b>Working Days : </b> 10{" "}
                  </p>
                  <p className=" mb-1">
                    <b>Working Days : </b> 10{" "}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className=" flex justify-between mb-2">
            <div>
              {" "}
              <h2 className="text-xl font-semibold mb-2">
                {moment({ year: selectedYear, month: selectedMonth }).format(
                  "MMMM YYYY"
                )}
              </h2>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="px-2 pb-1 bg-gray-300 rounded-full"
                >
                  ←
                </button>
                <button
                  onClick={goToNextMonth}
                  className="px-2 pb-1 bg-gray-300 rounded-full mx-3"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Calendar */}

          {/* Navigation Buttons */}

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-bold text-center">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {generateCalendarDays()?.map((day, index) => (
              <div
                key={index}
                className={`p-2 text-center ${
                  day.date ? getStatusColor(day?.status) : "bg-white"
                } rounded-lg`}
              >
                {day.date ? (
                  <>
                    <p>{moment(day.date).format("DD")}</p>
                    <p className="text-xs">{day?.status}</p>
                  </>
                ) : (
                  // Empty cell for padding
                  <p>&nbsp;</p>
                )}
              </div>
            ))}
          </div>

          <AlertDialog
            open={openToggelModal}
            onOpenChange={() => setOpenToggelModal(false)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to{" "}
                  {userData?.is_active ? "deactivate" : "activate"} user ?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenToggelModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleChangeStatus}
                  disabled={toggelLoader}
                >
                  {userData?.is_active ? "Deactivate" : "Activate"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default withDefaultDashBoardLayout(UserDetails);
