import { useState, useEffect } from "react";
import { websiteHome } from "../../helpers/actions";
import Pricing from "../../components/home/Pricing";

const HomePage = () => {
  const [homePageData, setHomePageData] = useState<any>([]);

  const fetchData = async () => {
    try {
      const response = await websiteHome();
      console.log(response);
      setHomePageData(response);
    } catch (error) {
      setHomePageData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="">
      {homePageData && <Pricing data={homePageData?.data?.pricingData} />}
    </div>
  );
};

export default HomePage;
