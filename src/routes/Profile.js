import { authService } from "fBase";
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  //로그아웃
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
};

export default Profile;
