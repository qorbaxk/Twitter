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
            {userObj.photoURL ? (
              <img
                src={userObj.photoURL}
                width={30}
                height={30}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <img
                src="https://pbs.twimg.com/media/CmpIszlVMAAK1MK.jpg:large"
                width={30}
                height={30}
                style={{ borderRadius: "50%" }}
              />
            )}

            <span style={{ marginTop: 10 }}>
              {userObj.displayName ? `${userObj.displayName}` : "Profile"}
            </span>
          </Link>
        </li>
        <li
          style={{ display: "flex", justifyContent: "center", marginTop: -55 }}
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
