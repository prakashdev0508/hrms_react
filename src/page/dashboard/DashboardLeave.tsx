import { useEffect, useState } from "react";
import withDefaultDashBoardLayout from "../../components/shared/WithDefaultDashBoardLayout";
import { leaveAction, leaveList } from "../../helpers/actions";
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

const DashboardLeave = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
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
    sortField = "startDate",
    sortOrder = "desc",
    status = statusFilter
  ) => {
    setLoading(true);
    try {
      const response = await leaveList({
        page,
        limit,
        sortField,
        sortOrder,
        statusFilter: status, // Pass status filter to the API
      });
      setLeaves(response?.leaves || []);
      setTotalRows(response?.totalLeaves || 0);
    } catch (error) {
      console.error(error);
      setLeaves([]);
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
      name: "Start Date",
      selector: (row: any) => row.startDate || "N/A",
      sortable: true,
      width: "20%",
      id: "startDate",
    },
    {
      name: "End Date",
      selector: (row: any) => row.endDate || "N/A",
      sortable: true,
      width: "20%",
      id: "endDate",
    },
    {
      name: "Status",
      selector: (row: any) => row.status || "pending",
      sortable: true,
      width: "10%",
      id: "status",
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-black font-semibold ${
            row.status === "approved"
              ? "bg-green-200"
              : row.status === "rejected"
              ? "bg-red-200"
              : "bg-yellow-200"
          }`}
        >
          {row.status || "pending"}
        </span>
      ),
    },
  ];

  const handleSort = (column: any, sortDirection: "asc" | "desc") => {
    setSortField(column.id || "startDate");
    setSortOrder(sortDirection);
  };

  const handleRowClicked = (row: any) => {
    console.log(row);
    if (row?.status == "pending") {
      setLeaveData(row);
      setLeaveModal(true);
    }
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
      leaveID: String;
      status: String;
    }

    const data: Data = {
      leaveID: (leaveData?._id as String) || "",
      status: actionType || "",
    };

    try {
      const response = await leaveAction(data);

      if (response) {
        toast.success(`Leave ${actionType}`);
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
    <div>
      <div className="mt-5">
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="all" onClick={() => handleTabChange("")}>
              All
            </TabsTrigger>
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

      <div className="mt-2">
        <DataTable
          columns={columns}
          data={leaves}
          progressPending={loading}
          fixedHeader
          fixedHeaderScrollHeight="480px"
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={(newLimit) => {
            setRowsPerPage(newLimit);
            setCurrentPage(1); // Reset to first page when rows per page changes
          }}
          sortServer
          onSort={handleSort}
          className="hover:cursor-pointer"
          onRowClicked={handleRowClicked}
        />
      </div>

      <AlertDialog open={leaveModal} onOpenChange={handlemodalClose}>
        <AlertDialogContent className=" relative">
          <AlertDialogHeader className=" mb-5">
            <AlertDialogTitle>Approve/Reject leave request</AlertDialogTitle>
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
              <p>{moment(leaveData?.appliedDate).format("DD MMM YYYY")}</p>
            </div>
            <div>
              <b>Leave From </b>
              <p>{moment(leaveData?.startDate).format("DD MMM YYYY")}</p>
            </div>
            <div>
              <b>Leave To </b>
              <p>{moment(leaveData?.endDate).format("DD MMM YYYY")}</p>
            </div>

            <div className=" mt-5">
              <b>Leave Reason</b>
              <p> {leaveData?.reason} </p>
            </div>
          </div>

          <hr />
          <AlertDialogFooter className="">
            {submitLoader ? (
              <>
                <button
                  className=" px-6 py-2 rounded-md font-semibold text-white bg-gray-500 text-sm border cursor-not-allowed"
                  disabled={submitLoader}
                >
                  {" "}
                  Submitting....
                </button>
              </>
            ) : (
              <>
                <button
                  className=" px-6 py-2 rounded-md font-semibold hover:bg-red-600 text-white bg-red-500 text-sm border"
                  onClick={() => handleleaveRequest("rejected")}
                >
                  {" "}
                  Reject{" "}
                </button>
                <button
                  className=" px-6 py-2 rounded-md font-semibold hover:bg-green-600 text-white bg-green-500 text-sm border"
                  onClick={() => handleleaveRequest("approved")}
                >
                  {" "}
                  Approve{" "}
                </button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default withDefaultDashBoardLayout(DashboardLeave);
