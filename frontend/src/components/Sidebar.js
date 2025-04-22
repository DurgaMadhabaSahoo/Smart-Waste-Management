import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';    
import ProfileIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteSweepSharpIcon from '@mui/icons-material/DeleteSweepSharp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SensorsIcon from '@mui/icons-material/Sensors';
import HistoryIcon from '@mui/icons-material/History';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Array for Sidebar Items
const sidebarItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    role: 'admin',
  },
  {
    label: 'Trucks',
    path: '/dashboard/trucks',
    icon: <LocalShippingIcon />,
    role: 'admin',
  },
  {
    label: 'Collectors',
    path: '/dashboard/collectors',
    icon: <GroupAddIcon />,
    role: 'admin',
  },
  {
    label: 'Managers',
    path: '/dashboard/managers',
    icon: <ManageAccountsIcon />,
    role: 'admin',
  },
  {
    label: 'Waste Level',
    path: '/dashboard/waste-level',
    icon: <DeleteSweepSharpIcon />,
    role: 'user',
  },
  {
    label: 'Special Collection',
    path: '/dashboard/special-collection',
    icon: <LibraryAddIcon />,
    role: 'user',
  },
  {
    label: 'Schedule',
    path: '/dashboard/schedule',
    icon: <CalendarTodayIcon />,
    role: 'manager',
  },
  {
    label: 'Current Waste',
    path: '/dashboard/current-waste',
    icon: <DeleteSweepSharpIcon />,
    role: 'admin',
  },
  {
    label: 'Special Collection',
    path: '/dashboard/approve-special-request',
    icon: <StarsIcon />,
    role: 'manager',
  },
  {
    label: 'Assigned Schedule',
    path: '/dashboard/assigned-schedule',
    icon: <CalendarTodayIcon />,
    role: 'collector',
  },
  {
    label: 'Waste Tracking Device',
    path: '/dashboard/request-device',
    icon: <SensorsIcon />,
    role: 'user',
  },
  {
    label: 'All Requests ',
    path: '/dashboard/request-list',
    icon: <SensorsIcon />,
    role: 'admin',
  },
  {
    label: 'Profile',
    path: '/dashboard/profile',
    icon: <ProfileIcon />,
  },
  {
    label: 'Collection History',
    path: '/dashboard/special-collection-history',
    icon: <HistoryIcon/>,
    role: 'user',
  },

  {
    label: 'Requests History',
    path: '/dashboard/request-history',
    icon: <HistoryIcon/>,
    role: 'user',
  },

  {
    label: 'Payments',
    path: '/dashboard/device-payment',
    icon: <HistoryIcon/>,
    role: 'admin',
  },






];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user); // Extracting the current user's role

  // Handle navigation and close the sidebar
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  // Active path highlighting
  const isActive = (path) => location.pathname === path || (path === '/dashboard' && location.pathname === '/');

  // Filter the sidebar items based on the current user's role
  const filteredSidebarItems = sidebarItems.filter(item => {
    // Show the item if there's no specific role restriction, or if it matches the user's role
    return !item.role || item.role === currentUser.role;
  });

  return (
    <List style={{ marginTop: '70px' }}>
      {filteredSidebarItems.map((item) => (
        <ListItem
          key={item.path}
          button
          onClick={() => handleNavigation(item.path)}
          sx={{
            color: isActive(item.path) ? 'white' : 'text.primary',
            backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: isActive(item.path) ? 'primary.dark' : 'grey.200',
            },
          }}
        >
          <ListItemIcon
            sx={{ color: isActive(item.path) ? 'white' : 'text.primary' }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
