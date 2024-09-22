import { sideBarApi } from "@/helpers/actions";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextType {
  sidebarData: any;
  setSidebarData: any;
  fetchSideBarData: Function;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sidebarData, setSidebarData] = useState<any>(null);

  const fetchSideBarData = async () => {
    if (!sidebarData) {
      try {
        const response = await sideBarApi();
        setSidebarData(response?.data);
      } catch (error) {
        console.log(error);
        setSidebarData(null);
      }
    }
  };

  const value: GlobalContextType = {
    sidebarData,
    setSidebarData,
    fetchSideBarData,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
