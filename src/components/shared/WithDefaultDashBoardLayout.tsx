import React from "react";
import Sidebar from "../dashboard/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Sidebar />
      <div id="content" className=" ml-20 ">
        {children}
      </div>
    </div>
  );
};

const withDefaultDashBoardLayout = (Component: any) => {
  return () => (
    <Layout>
      <Component />
    </Layout>
  );
};

export default withDefaultDashBoardLayout;
