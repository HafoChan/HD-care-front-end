import * as React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import Sidebar from "../../components/doctor/Sidebar";
import DoctorSchedule from "../../components/doctor/DoctorSchedule";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ScheduleManagement() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ backgroundColor: "white", height: "100%" }}>
      <Box sx={{ marginLeft: "230px", backgroundColor: "white" }}>
        <Box maxWidth={200}>
          <Sidebar />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#1976d2", fontWeight: 500, mb: 4, mt: 4 }}
          >
            Quản Lý Lịch Khám
          </Typography>

          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  sx={{
                    textTransform: "none",
                    fontWeight: value === 0 ? "bold" : "normal",
                  }}
                  label="Chưa thiết lập"
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    fontWeight: value === 1 ? "bold" : "normal",
                  }}
                  label="Đã thiết lập"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={1}>
              <DoctorSchedule />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={0}>
              <DoctorSchedule type={"add"} />
            </CustomTabPanel>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ScheduleManagement;
