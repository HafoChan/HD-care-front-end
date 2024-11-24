import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Checkbox,
  Chip,
  Pagination,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import appointApi from '../../api/appointApi';
import { doctor } from '../../api/doctor';


const ManageAppointmentHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selected, setSelected] = useState([]);
  const [medicalRecords,setMedicalRecords] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMax, setPageMax] = useState(1);


  const getData = async (id,currentPage) =>{
        const list = await appointApi.getAppointmentById(id,currentPage)
        setMedicalRecords(list.result?.content)
        setPageMax(list.result?.totalPages)
    }
    
  const getInfoDoctor = (currentPage) =>{
    console.log("getInfoDoctor called"); // Thêm dòng này để kiểm tra

      doctor.getInfo()
      .then((response) =>{
        getData(response.result.id,currentPage)
      });
    }
  
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
    
  useEffect(() => {
      getInfoDoctor(currentPage)
    }, [currentPage]);

  const handleSelect = (id) => {
    // Nếu id đã được chọn thì bỏ chọn
    if (selected.includes(id)) {
      setSelected([]);
    } else {
      // Nếu id chưa được chọn thì chọn nó và bỏ chọn các id khác
      setSelected([id]);
    }
  };

  const handlePrescription = () => {
    if (selected.length === 1) {
      const record = medicalRecords.find(r => r.id === selected[0]);
      navigate('/doctor/prescription-management', { state: { appointment: record } });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning'; // Orange
      case 'CONFIRMED':
        return 'primary'; // Blue
      case 'COMPLETED':
        return 'success'; // Green
      case 'CANCELLED':
        return 'error'; // Red
      default:
        return 'default';
    }
  };

  const getNextStatus = (currentStatus) => {
    const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  const handleStatusChange = (id, newStatus) => {
    setMedicalRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, status: newStatus } : record
      )
    );
  };

  const handleDateFilter = async (e) => {
    setDateFilter(e.target.value)
    const today = new Date().toISOString().split('T')[0];
    if(e.target.value === 'today'){
      const newMedicalRecords = await appointApi.filterAppointment(today)
      console.log(today)
      setMedicalRecords(newMedicalRecords.result)
    }
    else if(e.target.value === 'week'){
      const newMedicalRecords = await appointApi.filterAppointmentByTime(today,null)
      console.log(today)
      setMedicalRecords(newMedicalRecords.result)
    }
    else if(e.target.value === 'month'){
      const newMedicalRecords = await appointApi.filterAppointmentByTime(null,today)
      console.log(today)
      setMedicalRecords(newMedicalRecords.result)
    }
    else{
      const list = await appointApi.findAppointmentByDoctor()
      console.log(list.result)
      setMedicalRecords(list.result)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 500 }}>
        Lịch Sử Khám
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Tìm kiếm theo tên..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        
        <Select
          size="small"
          value={dateFilter}
          onChange={(e) => handleDateFilter(e)}
          sx={{ width: 150 }}
        >
          <MenuItem value="all">Tất cả ngày</MenuItem>
          <MenuItem value="today">Hôm nay</MenuItem>
          <MenuItem value="week">Tuần này</MenuItem>
          <MenuItem value="month">Tháng này</MenuItem>
        </Select>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Kê đơn thuốc">
          <Button
            variant="contained"
            startIcon={<MedicalServicesIcon />}
            onClick={handlePrescription}
          >
            Kê đơn thuốc
          </Button>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Ngày khám</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Email LH</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicalRecords && medicalRecords.length > 0 && medicalRecords.map((record) => (
              <TableRow 
                key={record.id}
                hover
                selected={selected.indexOf(record.id) !== -1}
                onClick={() => handleSelect(record.id)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.dob}</TableCell>
                <TableCell>{record.start.split(" ")[0]} {record.start.split(" ")[1].split(":")[0]}:00 - {record.end.split(" ")[1].split(":")[0]}:00</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn sự kiện click lan ra TableRow
                      handleStatusChange(record.id, getNextStatus(record.status));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" marginTop={3}>
          <Pagination
            count={pageMax}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
    </Box>
  );
};

export default ManageAppointmentHistory;
