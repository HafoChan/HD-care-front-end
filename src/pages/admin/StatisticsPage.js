import React from "react";
import { useParams } from "react-router-dom";
import StatisticsManagement from "../../components/admin/StatisticsManagement";

const StatisticsPage = () => {
  const { statType } = useParams();

  return <StatisticsManagement statType={statType || "visits"} />;
};

export default StatisticsPage;
