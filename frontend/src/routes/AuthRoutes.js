import React from 'react';
import { Route, Routes } from "react-router-dom";

import { AuthPaths } from "./Paths";

import Signin from "../pages/auth/Signin";
import Signup from "../pages/auth/Signup";



const AuthRoutes = () => {
  return (
    <Routes>
        <Route path={AuthPaths.SIGNIN} element={<Signin/>}/>
        <Route path={AuthPaths.SIGNUP} element={<Signup/>}/>
    </Routes>
  )
}

export default AuthRoutes