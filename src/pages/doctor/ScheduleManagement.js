import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Container,
  Card,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  Pagination,
} from "@mui/material";
import Sidebar from "../../components/doctor/Sidebar";
import DoctorSchedule from "../../components/doctor/DoctorSchedule";
import { Fade } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.background.default, 0.98),
        minHeight: "100vh",
        display: "flex",
        pb: 10,
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0 },
          transition: "margin 0.2s ease",
          py: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Fade in timeout={800}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 4,
              }}
            >
              Quản Lý Lịch Khám
            </Typography>

            <Box sx={{ width: "100%" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="schedule tabs"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  mb: 3,
                }}
              >
                <Tab
                  label="Chưa thiết lập"
                  sx={{
                    textTransform: "none",
                    fontWeight: value === 0 ? "bold" : "normal",
                  }}
                />
                <Tab
                  label="Đã thiết lập"
                  sx={{
                    textTransform: "none",
                    fontWeight: value === 1 ? "bold" : "normal",
                  }}
                />
              </Tabs>

              <CustomTabPanel value={value} index={1}>
                <DoctorSchedule />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={0}>
                <DoctorSchedule type={"add"} />
              </CustomTabPanel>
            </Box>
          </Container>
        </Fade>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "calc(100% - 280px)",
          bgcolor: "background.paper",
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} HD-Care. Bảo lưu mọi quyền.
        </Typography>
      </Box>
    </Box>
  );
}

export default ScheduleManagement;
