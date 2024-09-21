import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import Onboarding from "../../../public/images/onboarding.png";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const OnboardingDetailsForm = ({ pricingId }: any) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    contactEmail: Yup.string()
      .email("Invalid email address")
      .required("Required"),
    contactPhone: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const initialValues = {
    name: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    username: "",
    password: "",
  };

  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    values.selectedPlan = pricingId;
    try {
      const response = await axios.post(
        `${BASE_URL}/organization/create`,
        values
      );

      if (response && response.data) {
        secureLocalStorage.setItem(
          "organizationDetails",
          response.data.data.organization
        );
        toast.success("Organization created ");
        navigate(`/organization-details/${pricingId}`);
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Something went wrong please try again"
      );
      console.error("Error initiating payment:", error);
    }
  };

  useEffect(() => {
    const organizationId = secureLocalStorage.getItem("organizationDetails");
    if (organizationId) {
      navigate(`/organization-details/${pricingId}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-600 to-purple-400 text-white flex-col items-center justify-center p-8">
          <div>
            <img src={Onboarding} alt="onboarding image" />
          </div>
        </div>
        <div className="w-full px-8 py-4 md:w-1/2">
          <h2 className="text-2xl font-bold mb-8">Create your account</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-2">
                    <div className="mb-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Organization Name
                      </label>
                      <Field
                        id="name"
                        name="name"
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
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Email
                      </label>
                      <Field
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                      <ErrorMessage
                        name="contactEmail"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="contactPhone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Phone
                      </label>
                      <Field
                        id="contactPhone"
                        name="contactPhone"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                      <ErrorMessage
                        name="contactPhone"
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <Field
                      id="address"
                      name="address"
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full ${
                        isSubmitting
                          ? "bg-purple-300 cursor-wait"
                          : "bg-purple-600"
                      } text-white py-2 px-4 rounded-md shadow-sm`}
                    >
                      Get a call Back
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDetailsForm;
