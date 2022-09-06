import React, { useEffect, useState, useRef } from "react";
import { dbService } from "fBase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import Tweet from "components/Tweet";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState();

  //작성한 트윗 실시간으로 가져오기
  useEffect(() => {
    const q = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  //작성한 트윗 DB에 저장
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
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
    <div>
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
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
