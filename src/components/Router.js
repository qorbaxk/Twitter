import React from "react";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = ({ isLoggedIn }) => {
  return isLoggedIn ? <Home /> : <Auth />;
};

export default AppRouter;
