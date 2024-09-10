"use client";
import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {toast} from "sonner"
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL

const OrganizationForm = ({ pricingId }: any) => {
  const validationSchema = Yup.object({
    checkinTime: Yup.string().required("Required"),
    checkoutTime: Yup.string().required("Required"),
    weakHoliday: Yup.string().required("Required"),
  });

  const initialValues = {
    location: {
      latitude: "",
      longitude: "",
    },
    checkoutTime: "",
    checkinTime: "",
    weakHoliday: "",
  };

  const getLocation = (setFieldValue : any) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFieldValue("location.latitude", position.coords.latitude);
          setFieldValue("location.longitude", position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const navigation = useNavigate()
  const organizationId = secureLocalStorage.getItem("organizationDetails");

  const fetchOrganisationDetails = async()=>{

  }

  const handleSubmit = async (values: any) => {
    values.onBoardingStatus = "panding_payment";
    try {
      const response = await axios.put(
        `${BASE_URL}/organization/update/${organizationId}`,
        values
      );

      if (response && response.data) {
        secureLocalStorage.setItem("OrganizationStatus", "panding_payment");
        toast("Organization data successfully submitted ");
        navigation("/login")
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Something went wrong please try again"
      );
      console.error("Error initiating payment:", error);
    }
  };

  const newOrganization = () => {
    secureLocalStorage.removeItem("userTokenhrms");
    secureLocalStorage.removeItem("organizationDetails");
    secureLocalStorage.removeItem("OrganizationStatus");
    navigation("/")
    
  };

  useEffect(() => {
    if (!organizationId) {
      return navigation(`/onboarding-details/${pricingId}`);
    }else{
      fetchOrganisationDetails()
    }
  }, [pricingId, navigation]);

  return (
    <div className="bg-gray-100 mx-10 my-5 ">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full px-8 py-4 md:w-1/2">
          <h2 className="text-2xl font-bold mb-8">
            Complete onboarding journey{" "}
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => {
              getLocation(setFieldValue);
              return (
                <Form>
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-2">
                    <div className="mb-2">
                      <label
                        htmlFor="weakHoliday"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Week Holiday
                      </label>
                      <Field
                        id="weakHoliday"
                        name="weakHoliday"
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
                        name="weakHoliday"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="latitude"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Latitude
                      </label>
                      <Field
                        id="latitude"
                        name="location.latitude"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                        readOnly
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="longitude"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Longitude
                      </label>
                      <Field
                        id="longitude"
                        name="location.longitude"
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                        readOnly
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="checkinTime"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Check-In Time
                      </label>
                      <Field
                        id="checkinTime"
                        name="checkinTime"
                        type="time"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                      <ErrorMessage
                        name="checkinTime"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="checkoutTime"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Check-Out Time
                      </label>
                      <Field
                        id="checkoutTime"
                        name="checkoutTime"
                        type="time"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                      />
                      <ErrorMessage
                        name="checkoutTime"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <div
                    className=" text-right underline mb-4 text-blue-600 cursor-pointer"
                    onClick={newOrganization}
                  >
                    <b>Create New Organization</b>
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
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-600 to-purple-400 text-white flex-col items-center justify-center p-8">
          <h2 className="text-3xl font-semibold mb-2">
            Quick and Free Sign-Up
          </h2>
          <p className="mb-6">Enter your email address to create an account.</p>
          <h2 className="text-3xl font-semibold mb-2">
            Cross-Platform Solution
          </h2>
          <p className="mb-6">
            Preview your newsletters on any device before sending them out.
          </p>
          <h2 className="text-3xl font-semibold mb-2">Start Sending Emails</h2>
          <p>Use our API or pick our pre-built templates.</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationForm;
