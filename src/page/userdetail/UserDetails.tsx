import { Link, useParams } from "react-router-dom";
import withDefaultDashBoardLayout from "../../components/shared/WithDefaultDashBoardLayout";
import { useEffect, useState } from "react";
import {
  downloadAttendance,
  updateUserDetailById,
  userAttendanceById,
  userDetailById,
} from "../../helpers/actions";
import moment from "moment";
import { Pencil, User2Icon } from "lucide-react";
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
import { DownloadIcon } from "lucide-react";
import UpdateUser from "@/components/forms/UpdateUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const UserDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [openToggelModal, setOpenToggelModal] = useState(false);
  const [toggelLoader, setToggelLoader] = useState(false);
  const [attandanceData, setAttandanceData] = useState<any>([]);
  const [attananceLoading, setAttandanceLoading] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

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

  const fetchAttendanceData = async (month: number, year: number) => {
    setAttandanceLoading(true);
    try {
      const response = await userAttendanceById(id as String, month + 1, year);
      console.log(response.data);
      setAttandanceData(response.data.attendance);
    } catch (error) {
      setAttandanceData(null);
    } finally {
      setAttandanceLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [id]);

  useEffect(() => {
    fetchAttendanceData(selectedMonth, selectedYear);
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
        return "bg-red-400";
      case "late":
        return "bg-yellow-300";
      case "half_day":
        return "bg-red-200";
      case "checked_in":
        return "bg-green-200";
      case "on_leave":
        return "bg-blue-300";
      case "not available":
        return "bg-gray-200";
      case "before_join":
        return "bg-gray-300";
      case "approved_regularise":
        return "bg-green-300";
      case "pending_regularize":
        return "bg-yellow-200";
      case "reject_regularise":
        return "bg-red-300";
      case "holiday":
        return "bg-pink-300";
      case "weak_leave":
        return "bg-blue-200";
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

  const generateCalendarDays = () => {
    const daysInMonth = moment({
      year: selectedYear,
      month: selectedMonth,
    }).daysInMonth();
    const firstDayOfMonth = moment({ year: selectedYear, month: selectedMonth })
      .startOf("month")
      .day();

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
      const attendance = attandanceData?.find((att: any) =>
        moment(att.date).isSame(currentDate, "day")
      );
      days.push({
        date: currentDate,
        status: attendance?.status || "not available",
      });
    }

    return days;
  };

  const downloadAttan = async () => {
    try {
      const data = {
        month: selectedMonth + 1,
        year: selectedYear,
      };

      const response = await downloadAttendance(id, data);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      link.download = `attendance_${userData?.name}_${
        selectedMonth + 1
      }_${selectedYear}.xlsx`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      toast.success("Attendance downloaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to download attendance");
    }
  };

  const handleOpenChange = () => {
    setUpdateModal(!updateModal);
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
            <div>
              {" "}
              <Dialog onOpenChange={handleOpenChange} open={updateModal}>
                <div
                  className=" bg-gray-950 text-white py-2 px-3 flex rounded-md shadow-md cursor-pointer  "
                  onClick={handleOpenChange}
                >
                  <Pencil size={18} className="mr-2 mt-1" /> Update User{" "}
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <b> Update user </b>
                    </DialogTitle>
                    <DialogDescription>
                      <UpdateUser
                        reportingManagerList={userData?.reportingManagerList}
                        userData={userData}
                        setUpdateModal={setUpdateModal}
                        openUpdateModal={updateModal}
                        fetchData={fetchData}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
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
                    <b>Mobile number : </b> {userData?.mobileNumber || "Not available"}
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
                <div
                  title="Download attandance"
                  className=" cursor-pointer ml-3"
                  onClick={downloadAttan}
                >
                  <DownloadIcon color="gray " size={20} />
                </div>
              </div>
            </div>
          </div>
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
