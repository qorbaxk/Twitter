import { Route, Routes } from "react-router-dom";
import React from "react";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "routes/Profile";

const AppRouter = ({refreshUser, isLoggedIn, userObj }) => {
  return (
    <div>
      {isLoggedIn && <Navigation userObj={userObj}/>}
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Home userObj={userObj}/>} />
        ) : (
          <Route path="/" element={<Auth />} />
        )}
        <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser}/>} />
      </Routes>
    </div>
  );
};

export default AppRouter;
