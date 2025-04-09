import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Divider,
  Skeleton,
} from "@mui/material";
import { FaUserMd, FaUsers, FaCalendarCheck } from "react-icons/fa";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { doctor } from "../../api/doctor";
import { styled } from "@mui/system";

const StyledCard = styled(Paper)(() => ({
  height: "100%",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(149, 157, 165, 0.1)",
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 30px rgba(149, 157, 165, 0.15)",
  },
}));

const IconBox = styled(Box)(({ bgcolor }) => ({
  width: 60,
  height: 60,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor || "#1976d215",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StatCard = ({ icon, title, value, color }) => (
  <StyledCard>
    <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
      <IconBox bgcolor={`${color}15`}>{icon}</IconBox>
      <Box>
        <Typography variant="body2" color="#666666" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 600 }}>
          {value !== undefined ? value : <Skeleton width={50} />}
        </Typography>
      </Box>
    </CardContent>
  </StyledCard>
);

const TopDoctorCard = styled(Card)(({ rank }) => ({
  height: "100%",
  borderRadius: 16,
  overflow: "hidden",
  position: "relative",
  transition: "transform 0.3s, box-shadow 0.3s",
  boxShadow: "0 8px 24px rgba(149, 157, 165, 0.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 16px 40px rgba(149, 157, 165, 0.15)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : "#CD7F32",
  },
}));

const RankBadge = styled(Box)(({ bgcolor }) => ({
  position: "absolute",
  top: 20,
  right: 20,
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: bgcolor || "#1976d2",
  color: "white",
  fontWeight: "bold",
  fontSize: 18,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
}));

const DoctorCardContent = ({ doctor, rank }) => (
  <Box sx={{ p: 3, textAlign: "center", position: "relative" }}>
    <RankBadge
      bgcolor={rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : "#CD7F32"}
    >
      {rank + 1}
    </RankBadge>

    <Avatar
      src={doctor.img}
      alt={doctor.name}
      sx={{
        width: 120,
        height: 120,
        margin: "0 auto 16px",
        border: 3,
        borderColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    />
    <Typography variant="h6" fontWeight={600}>
      {doctor.name}
    </Typography>

    <Box
      sx={{
        mt: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <FaCalendarCheck color="#1976d2" />
      <Typography color="#666666" fontWeight={500}>
        {doctor.count} lượt khám
      </Typography>
    </Box>

    <Divider sx={{ my: 2 }} />

    <Box
      sx={{
        mt: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <EmojiEventsIcon
        sx={{
          fontSize: 20,
          color: rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : "#CD7F32",
        }}
      />
      <Typography
        fontWeight={600}
        color={rank === 0 ? "#FFD700" : rank === 1 ? "#9e9e9e" : "#CD7F32"}
      >
        Top {rank + 1} Bác sĩ
      </Typography>
    </Box>
  </Box>
);

const PageTitle = styled(Typography)(() => ({
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 24,
  position: "relative",
  paddingBottom: 12,
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1976d2",
  },
}));

const SectionTitle = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 24,
}));

const DashboardOverview = ({ totalDoctor, totalPatient }) => {
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctor.getStatistic();
        setTopDoctors(response.result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch doctor statistics:", error);
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  return (
    <Box>
      <PageTitle variant="h4">Bảng điều khiển</PageTitle>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <StatCard
            icon={<FaUserMd size={28} color="#1976d2" />}
            title="Tổng số bác sĩ"
            value={totalDoctor}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            icon={<FaUsers size={28} color="#2e7d32" />}
            title="Tổng số khách hàng"
            value={totalPatient}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <SectionTitle>Bác sĩ nổi bật</SectionTitle>

        <Grid container spacing={3}>
          {loading
            ? // Skeleton loading state
              Array.from(new Array(3)).map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <StyledCard>
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Skeleton
                        variant="circular"
                        width={120}
                        height={120}
                        sx={{ mx: "auto" }}
                      />
                      <Skeleton
                        variant="text"
                        width="60%"
                        height={30}
                        sx={{ mx: "auto", mt: 2 }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        sx={{ mx: "auto", mt: 1 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={1}
                        sx={{ my: 2 }}
                      />
                      <Skeleton
                        variant="text"
                        width="40%"
                        height={24}
                        sx={{ mx: "auto", mt: 1 }}
                      />
                    </Box>
                  </StyledCard>
                </Grid>
              ))
            : topDoctors.map((doctor, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <TopDoctorCard rank={index}>
                    <DoctorCardContent doctor={doctor} rank={index} />
                  </TopDoctorCard>
                </Grid>
              ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardOverview;
