import React from "react";
import { Route, Routes } from "react-router-dom";

import { DashBoardPaths } from "./Paths";

import Profile from "../pages/dashboard/Profile";
import CurrentWaste from "../pages/dashboard/manager/CurrentWaste";
import Schedule from "../pages/dashboard/manager/Schedule";
import Schedules from "../pages/dashboard/collector/Schedules";
import ShowRoute from "../pages/dashboard/collector/ShowRoute";
import QRScan from "../pages/dashboard/collector/QRScan"; 
import WasteLevel from "../pages/dashboard/user/WasteLevel";
import Trucks from "../pages/dashboard/admin/Trucks";
import Collectors from "../pages/dashboard/admin/Collectors";
import SpecialCollection from "../pages/dashboard/user/SpecialCollection";
import Collecting from "../pages/dashboard/collector/Collecting";
import RequestTrackingDevice from "../pages/dashboard/user/Request_device";
import OrderProcess from "../pages/dashboard/user/order_process";
import AdminRequestsPage from "../pages/dashboard/admin/Device_Requests";
import AddSchedule from "../pages/dashboard/manager/AddSchedule";
import FilteredRequests from "../pages/dashboard/user/Request_history"
import EditSchedule from "../pages/dashboard/manager/EditSchedule";
import Manager from "../pages/dashboard/admin/Manager";
import ApproveRequest from "../pages/dashboard/manager/ApproveRequest";
import Device_payment from "../pages/dashboard/admin/Device_payment";
import SpecialCollectionHistory from "../pages/dashboard/user/SpecialCollectionHistory";
const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path={DashBoardPaths.SCHEDULE} element={<Schedule />} />
      <Route path={DashBoardPaths.CURRENT_WASTE} element={<CurrentWaste />} />
      <Route path={DashBoardPaths.COLLECTOR_ASSIGNED_SCHEDULE} element={<Schedules />} />
      <Route path={DashBoardPaths.SHEDULE_EDIT} element={<EditSchedule />} />
      <Route path={DashBoardPaths.ADDSCHEDULE} element={<AddSchedule />} />
      <Route path={DashBoardPaths.COLLECTION_ROUTE} element={<ShowRoute />} />
      <Route path={DashBoardPaths.COLLECTION_VERIFY} element={<QRScan />} />
      <Route path={DashBoardPaths.COLLECTING} element={<Collecting />} />
      <Route path={DashBoardPaths.USER_WASTE_LEVEL} element={<WasteLevel />} />
      <Route path={DashBoardPaths.TRUCKS} element={<Trucks />} />
      <Route path={DashBoardPaths.COLLECTORS} element={<Collectors />} />
      <Route path={DashBoardPaths.SPECIAL_COLLECTION} element={<SpecialCollection />} />
      <Route path={DashBoardPaths.REQUEST_WASTE_DEVICE} element={<RequestTrackingDevice />} />
      <Route path={DashBoardPaths.ORDER_PROCESS} element={<OrderProcess />} />
      <Route path={DashBoardPaths.ALL_REQUESTS} element={<AdminRequestsPage />} />
      <Route path={DashBoardPaths.REQUEST_HISTORY} element={<FilteredRequests />} />
      <Route path={DashBoardPaths.MANAGER} element={<Manager />} />
      <Route path={DashBoardPaths.PROFILE} element={<Profile />} />
      <Route path={DashBoardPaths.APPROVE_REQUEST} element={<ApproveRequest />} />
      <Route path={DashBoardPaths.DEVICE_PAYMENT} element={<Device_payment />} />
      <Route path={DashBoardPaths.SPECIAL_COLLECTION_HISTORY} element={<SpecialCollectionHistory />} />

    </Routes>
  );
};

export default DashboardRoutes;
