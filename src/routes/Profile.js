import { authService, dbService, storageService } from "fBase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { v4 } from "uuid";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newProfilePhoto, setNewProfilePhoto] = useState(
    userObj.photoURL
      ? userObj.photoURL
      : "https://pbs.twimg.com/media/CmpIszlVMAAK1MK.jpg:large"
  );

  const navigate = useNavigate();

  //로그아웃
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  //아이디로 db 데이터 필터링
  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  //프로필 수정
  const onSubmit = async (e) => {
    e.preventDefault();
    let profilePhotoUrl = "";

    if(userObj.photoURL !== newProfilePhoto){
      const profilePhotoRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const response = await uploadString(
          profilePhotoRef,
          newProfilePhoto,
          "data_url"
        );
        profilePhotoUrl = await getDownloadURL(response.ref);

      await updateProfile(authService.currentUser, {
        photoURL: profilePhotoUrl,
      });
      refreshUser();
    }
    if (userObj.displayName !== newDisplayName ) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  //이름 바꾸기
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  //프로필 사진 업로드
  const onUploadPhoto = (e) => {
    const {
      target: { files },
    } = e;
    const theProfile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewProfilePhoto(result);
    };
    reader.readAsDataURL(theProfile);
    console.log("링크",reader);
  };
 

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <div className="profileImage">
          <label htmlFor="file-input">
            <img src={newProfilePhoto} alt="Avatar" className="avatar" />
            <FontAwesomeIcon icon={faCamera} size="2x" />
          </label>
          <input
            id="file-input"
            type="file"
            onChange={onUploadPhoto}
            style={{ display: "none" }}
          />
        </div>

        <input
          type="text"
          autoFocus
          placeholder="이름"
          onChange={onChange}
          value={newDisplayName}
          className="formInput"
        />

        <input
          type="submit"
          value="프로필 수정"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        로그아웃
      </span>
    </div>
  );
};

export default Profile;
