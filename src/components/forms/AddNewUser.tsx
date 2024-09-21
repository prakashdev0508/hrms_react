import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import secureLocalStorage from "react-secure-storage";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
  allotedLeave: Yup.number()
    .required("Allotted leave is required")
    .min(0, "Allotted leave must be zero or more"),
  weekLeave: Yup.string().required("Week leave is required"),
});

const initialValues = {
  name: "",
  email: "",
  username: "",
  password: "",
  role: "",
  allotedLeave: "",
  weekLeave: "",
  reportingManager: "" || null,
  joinDate : " " || null,
  salary : "" || null
};

// AddNewUser Component
const AddNewUser = ({
  handlemodalChange,
  fetchData,
  reportingManagerList
}: {
  handlemodalChange: any;
  fetchData: Function;
  reportingManagerList  : any
}) => {
  const handleSubmit = async (values: any) => {
    const organizationId = secureLocalStorage.getItem("organizationDetails");
    values.organizationId = organizationId || "";

    try {
      const response = await axios.post(`${BASE_URL}/user/create`, values);
      toast.success("User added successfully!");
      fetchData();
      handlemodalChange();
    } catch (error: any) {
      console.log("Err", error.response?.data?.message);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="p-2">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  placeholder ="Enter Name"
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder ="Enter Email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  placeholder ="Enter username"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder ="Create Password"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <Field
                  id="role"
                  name="role"
                  as="select"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                  <option value="">Select a role</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="reporting_manager">Manager</option>
                  <option value="employee">Employee</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="allotedLeave"
                  className="block text-sm font-medium text-gray-700"
                >
                  Allotted Leave
                </label>
                <Field
                  id="allotedLeave"
                  name="allotedLeave"
                  type="number"
                  placeholder ="Leave days"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                <ErrorMessage
                  name="allotedLeave"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary (monthly)
                </label>
                <Field
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder ="User salary per month"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="joinDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Join Date
                </label>
                <Field
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="weekLeave"
                  className="block text-sm font-medium text-gray-700"
                >
                  Week Leave
                </label>
                <Field
                  id="weekLeave"
                  name="weekLeave"
                  as="select"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                  <option value="">Select a day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </Field>
                <ErrorMessage
                  name="weekLeave"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="reportingManager"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reporting Manager
                </label>
                <Field
                  id="reportingManager"
                  name="reportingManager"
                  as="select"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                >
                  <option value="">Select a reporting manager</option>
                  {reportingManagerList &&
                    reportingManagerList?.map((user: any) => (
                      <option value={user?._id}> {user?.name} </option>
                    ))}
                </Field>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : " bg-purple-700"
                } text-white py-2 px-4 rounded-md`}
              >
                {isSubmitting ? "Submitting..." : "Add User"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddNewUser;
