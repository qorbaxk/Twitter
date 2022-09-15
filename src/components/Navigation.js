import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
          <Link
            to="/profile"
            style={{
              marginLeft: 30,
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
            <span style={{ marginTop: 10}}>
              {userObj.displayName ? `${userObj.displayName}` : "Profile"}
            </span>
          </Link>
        </li>
        <li
          style={{ display: "flex", justifyContent: "center", marginTop: -48 }}
        >
          <Link to="/">
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
