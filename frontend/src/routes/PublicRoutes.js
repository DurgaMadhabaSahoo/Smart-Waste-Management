import React from 'react';
import { Route, Routes } from "react-router-dom";

import { PublicPaths } from "./Paths";

import Home from "../pages/public/Home";


const PublicRoutes = () => {
  return (
    <Routes>
        <Route path={PublicPaths.HOME} element={<Home/>}/>
    </Routes>
  )
}

export default PublicRoutes;