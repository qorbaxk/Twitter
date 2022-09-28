import React, { useState, useRef } from "react";
import { dbService, storageService } from "fBase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

//트윗 생성 컴포넌트
const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  //작성한 트윗 DB에 저장
  const onSubmit = async (event) => {
    //텍스트 및 사진이 둘다 없으면 트윗 안 됨
    if (tweet === "" && attachment === "") {
      return;
    }

    event.preventDefault();

    try {
      //사진이 없을때는 empty string으로 대체
      let attachmentUrl = "";

      //사진이 있을 때는 url 넣어줌
      if (attachment !== "") {
        const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const response = await uploadString(
          attachmentRef,
          attachment,
          "data_url"
        );
        attachmentUrl = await getDownloadURL(response.ref);
      }

      const tweetObj = {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
        creatorName: userObj.displayName,
        creatorImg: userObj.photoURL,
      };

      await addDoc(collection(dbService, "tweets"), tweetObj);
      setTweet("");
      setAttachment("");
    } catch (error) {
      console.error("Error adding document:", error);
    }
    setTweet("");
  };

  //인풋창 관리
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  //사진 첨부하기
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    //파일을 읽고 끝나면 finishedEvent를 받음
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    //URL실행하여 데이터(텍스트) 얻음
    reader.readAsDataURL(theFile);
  };

  //선택한 사진 지우기
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = ""; //선택한 사진 이름 지우기
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="무슨 일이 일어나고 있나요?"
          maxLength={120}
          className="factoryInput__input"
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>사진 추가하기</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
