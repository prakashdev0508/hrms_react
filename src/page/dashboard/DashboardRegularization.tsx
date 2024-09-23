import { useEffect, useState } from "react";
import withDefaultDashBoardLayout from "../../components/shared/WithDefaultDashBoardLayout";
import { regularizationList ,regularizationAction } from "../../helpers/actions";
import DataTable from "react-data-table-component";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import moment from "moment";
import { useGlobalContext } from "@/context/GlobalContext";

const DashboardRegularization = () => {
  const { fetchSideBarData } = useGlobalContext()
  const [regularizedAttendances, setRegularizedAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [leaveModal, setLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState<any>(null);
  const [submitLoader, setSubmitLoader] = useState(false);

  const fetchData = async (
    page = currentPage,
    limit = rowsPerPage,
    sortField = "date",
    sortOrder = "desc",
    status = statusFilter
  ) => {
    setLoading(true);
    try {
      const response = await regularizationList({
        page,
        limit,
        sortField,
        sortOrder,
        statusFilter: status, // Pass status filter to the API
      });
      setRegularizedAttendances(response?.regularizedAttendances || []);
      setTotalRows(response?.totalRegularizedAttendances || 0);
    } catch (error) {
      console.error(error);
      setRegularizedAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, sortField, sortOrder, statusFilter);
  }, [currentPage, rowsPerPage, sortField, sortOrder, statusFilter]);

  const columns = [
    {
      name: "Employee Name",
      selector: (row: any) => row.userId?.name || "N/A",
      sortable: true,
      width: "25%",
      id: "name",
    },
    {
      name: "Email",
      selector: (row: any) => row.userId?.email || "N/A",
      sortable: true,
      width: "25%",
      id: "email",
    },
    {
      name: "Check-in Time",
      selector: (row: any) =>
        moment(row.checkInTime).format("DD MMM YYYY, HH:mm") || "N/A",
      sortable: true,
      width: "20%",
      id: "checkInTime",
    },
    {
      name: "Check-out Time",
      selector: (row: any) =>
        moment(row.checkOutTime).format("DD MMM YYYY, HH:mm") || "N/A",
      sortable: true,
      width: "20%",
      id: "checkOutTime",
    },
    {
      name: "Status",
      selector: (row: any) => row.regularizeRequest || "pending",
      sortable: true,
      width: "10%",
      id: "regularizeRequest",
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-black font-semibold ${
            row.regularizeRequest === "approved"
              ? "bg-green-200"
              : row.regularizeRequest === "rejected"
              ? "bg-red-200"
              : "bg-yellow-200"
          }`}
        >
          {row.regularizeRequest || "pending"}
        </span>
      ),
    },
  ];

  const handleSort = (column: any, sortDirection: "asc" | "desc") => {
    setSortField(column.id || "date");
    setSortOrder(sortDirection);
  };

  const handleRowClicked = (row: any) => {
    setLeaveData(row);
    setLeaveModal(true);
  };

  const handlemodalClose = () => {
    setLeaveData(null);
    setLeaveModal(false);
  };

  const handleTabChange = (status: string) => {
    setStatusFilter(status); // Update the status filter when a tab is clicked
    setCurrentPage(1); // Reset to the first page when switching status
  };

  const handleleaveRequest = async (actionType: String) => {
    setSubmitLoader(true);
    interface Data {
        attendanceId: String;
      status: String;
    }

    const data: Data = {
    attendanceId: (leaveData?._id as String) || "",
      status: actionType || "",
    };

    try {
      const response = await regularizationAction(data)

      if (response) {
        toast.success(`Regularization ${actionType}`);
        fetchSideBarData()
        handlemodalClose();
        fetchData(currentPage, rowsPerPage, sortField, sortOrder, statusFilter);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <>

<AlertDialog open={leaveModal} onOpenChange={handlemodalClose}>
        <AlertDialogContent className=" relative">
          <AlertDialogHeader className=" mb-5">
            <AlertDialogTitle>Approve/Reject regularization request</AlertDialogTitle>
            <div
              className=" absolute top-2 right-3 cursor-pointer"
              onClick={handlemodalClose}
            >
              <Cross1Icon />
            </div>
          </AlertDialogHeader>
          <div className=" grid grid-cols-3 text-sm">
            <div>
              <b>Applied Date </b>
              <p>{moment(leaveData?.date).format("DD MMM YYYY")}</p>
            </div>
            <div>
              <b>Check-in Time </b>
              <p>{moment(leaveData?.checkInTime).format("DD MMM YYYY, HH:mm")}</p>
            </div>
            <div>
              <b>Check-out Time </b>
              <p>{moment(leaveData?.checkOutTime).format("DD MMM YYYY, HH:mm")}</p>
            </div>

            <div className=" mt-5">
              <b>Regularization Reason</b>
              <p> {leaveData?.regularizationReason} </p>
            </div>
          </div>

          {leaveData?.regularizeRequest === "pending" && (
            <>
              <hr />
              <AlertDialogFooter className="">
                {submitLoader ? (
                  <button
                    className=" px-6 py-2 rounded-md font-semibold text-white bg-gray-500 text-sm border cursor-not-allowed"
                    disabled={submitLoader}
                  >
                    Submitting....
                  </button>
                ) : (
                  <>
                    <button
                      className=" px-6 py-2 rounded-md font-semibold hover:bg-red-600 text-white bg-red-500 text-sm border"
                      onClick={() => handleleaveRequest("reject_regularise")}
                    >
                      Reject
                    </button>
                    <button
                      className=" px-6 py-2 rounded-md font-semibold hover:bg-green-600 text-white bg-green-500 text-sm border"
                      onClick={() => handleleaveRequest("approved_regularise")}
                    >
                      Approve
                    </button>
                  </>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-5">
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger
              value="pending"
              onClick={() => handleTabChange("pending")}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              onClick={() => handleTabChange("approved")}
            >
              Approved
            </TabsTrigger>

            <TabsTrigger
              value="rejected"
              onClick={() => handleTabChange("rejected")}
            >
              Rejected
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="my-4">
        <DataTable
          columns={columns}
          data={regularizedAttendances}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={(perPage) => setRowsPerPage(perPage)}
          progressPending={loading}
          sortServer
          onSort={handleSort}
          highlightOnHover
          pointerOnHover
          onRowClicked={handleRowClicked}
          noDataComponent={
            <div className="p-5">
              <p>No {statusFilter} regularization Requests found.</p>
            </div>
          }
        />
      </div>
    </>
  );
};

export default withDefaultDashBoardLayout(DashboardRegularization);
