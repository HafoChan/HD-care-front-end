import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: '60px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default Layout;
