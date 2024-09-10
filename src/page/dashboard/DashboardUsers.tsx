import { useEffect, useState } from "react";
import withDefaultDashBoardLayout from "../../components/shared/WithDefaultDashBoardLayout";
import { crmDashboardUsers } from "../../helpers/actions";
import DataTable from "react-data-table-component";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { PlusIcon } from "lucide-react";
import AddNewUser from "../../components/forms/AddNewUser";
import { useNavigate } from "react-router-dom";

const DashboardUsers = () => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [openDialog, setopenDialog] = useState(false);
  const [reportingManagerList , setreportingManagerList] = useState<any>([])

  const navigate = useNavigate()

  const fetchData = async (
    page = currentPage,
    limit = rowsPerPage,
    sortField = "createdAt",
    sortOrder = "desc"
  ) => {
    setLoading(true);
    try {
      const response = await crmDashboardUsers({
        page,
        limit,
        sortField,
        sortOrder,
      });
      setUsers(response?.users);
      setreportingManagerList(response?.reportingManagerList)
      setTotalRows(response?.totalUsers);
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = () => {
    setopenDialog(!openDialog);
  };

  useEffect(() => {
    fetchData(currentPage, rowsPerPage, sortField, sortOrder);
  }, [currentPage, rowsPerPage, sortField, sortOrder]);

  const columns = [
    {
      name: "Name",
      selector: (row: any) => row.name || "N/A",
      sortable: true,
      width: "25%",
      id: "name",
    },
    {
      name: "Email",
      selector: (row: any) => row.email || "N/A",
      sortable: true,
      width: "25%",
      id: "email",
    },
    {
      name: "Username",
      selector: (row: any) => row.username || "N/A",
      sortable: true,
      width: "25%",
      id: "username",
    },
    {
      name: "Role",
      selector: (row: any) => row.role,
      sortable: true,
      width: "15%",
      id: "role",
    },
    {
      name: "Is Active",
      selector: (row: any) => (row.is_active ? "True" : "False"),
      sortable: true,
      width: "10%",
      id: "is_active",
    },
  ];

  const handleSort = (column: any, sortDirection: "asc" | "desc") => {
    setSortField(column.id || "name"); // Use the column id to set the sort field
    setSortOrder(sortDirection);
  };

  const handleRowClicked = (data : any) => {
    navigate(`/crm/dashboard/users/${data?._id}`)
  };

  return (
    <div>
      <div className=" flex justify-between">
        <div> <b>User Details</b> </div>
        <div className=" mr-2">
          <Dialog onOpenChange={handleOpenChange} open={openDialog}>
            <div
              className=" bg-gray-950 text-white py-2 px-3 flex rounded-md shadow-md cursor-pointer  "
              onClick={() => setopenDialog(!openDialog)}
            >
              <PlusIcon size={18} className="mr-2 mt-1" /> Add New User{" "}
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <b> Add new user </b>
                </DialogTitle>
                <DialogDescription>
                  <AddNewUser
                    handlemodalChange={handleOpenChange}
                    fetchData={fetchData}
                    reportingManagerList={reportingManagerList}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className=" mt-10">
        <DataTable
          columns={columns}
          data={users}
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
          // highlightOnHover={true}
          className=" hover:cursor-pointer"
          onRowClicked={handleRowClicked}
        />
      </div>
    </div>
  );
};

export default withDefaultDashBoardLayout(DashboardUsers);
