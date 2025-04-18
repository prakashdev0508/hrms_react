import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import api_client from "../constants/index";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = (secureLocalStorage.getItem("accessTokenHRMS") as String) || "";

export const websiteHome = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${api_client.websiteHomePage}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${api_client.loginApi}`,
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/${api_client.userDetails}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crmDashboardHome = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/${api_client.crmHome}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crmDashboardUsers = async ({
  page = 1,
  limit = 10,
  sortField = "name",
  sortOrder = "asc",
}: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/${api_client.crmUsers}`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        page,
        limit,
        sortField,
        sortOrder,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userDetailById = async (
  id: String,
  month: number,
  year: number
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${api_client.userDetailById}/${id}`,
      {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          month, // Pass the month as a query parameter
          year, // Pass the year as a query parameter
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userAttendanceById = async (
  id: String,
  month: number,
  year: number
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${api_client.userDetailById}/${api_client.attandenceDetails}/${id}`,
      {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          month, // Pass the month as a query parameter
          year, // Pass the year as a query parameter
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserDetailById = async (id: String, data: any) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${api_client.userDetailById}/${id}`,
      data,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Leaves
export const leaveList = async ({
  page = 1,
  limit = 10,
  sortField = "startDate",
  sortOrder = "desc",
  statusFilter = "",
}) => {
  try {
    const response = await axios.get(`${BASE_URL}/${api_client.leaveList}`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        page,
        limit,
        sortField,
        sortOrder,
        status: statusFilter, // Add status filter if needed
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


// Regularization
export const regularizationList = async ({
  page = 1,
  limit = 10,
  sortField = "startDate",
  sortOrder = "desc",
  statusFilter = "",
}) => {
  try {
    const response = await axios.get(`${BASE_URL}/${api_client.regularizaionList}`, {
      headers: {
        Authorization: `${token}`,
      },
      params: {
        page,
        limit,
        sortField,
        sortOrder,
        status: statusFilter, // Add status filter if needed
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const leaveAction = async (data: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${api_client.leaveAction}`,
      data,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const regularizationAction = async (data: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${api_client.regularizationAction}`,
      data,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sideBarApi = async ()=>{
  try {
    const response = await axios.get(
      `${BASE_URL}/${api_client.pendingCounts}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const downloadAttendance = async (id: any , data :any) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${api_client.downloadattandaceAPI}/${id}?month=${data?.month}&year=${data?.year}`,
      {
        headers: {
          Authorization: `${token}`,
        },
        responseType: 'blob',
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};