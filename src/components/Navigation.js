import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
  //이메일로 로그인 했을 시 기본 닉네임 지정
  if (userObj.displayName === null) {
    const name = userObj.email.split("@")[0];
    userObj.displayName = name;
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}의 Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
