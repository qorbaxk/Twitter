import React, { useState, useRef } from "react";
import { dbService, storageService } from "fBase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 } from "uuid";

//트윗 생성 컴포넌트
const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  //작성한 트윗 DB에 저장
  const onSubmit = async (event) => {
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
    setAttachment(null);
    fileInput.current.value = ""; //선택한 사진 이름 지우기
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={tweet}
        onChange={onChange}
        type="text"
        placeholder="what's on your mind?"
        maxLength={120}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
      />
      <input type="submit" value="Tweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;