import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import Tweet from "components/Tweet";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

  //작성한 트윗 DB에서 가져오기
  // const getTweets = async () => {
  //   const dbTweets = await getDocs(collection(dbService, "tweets"));
  //   dbTweets.forEach((document) => {
  //     const tweetObject = {
  //       ...document.data(),
  //       id: document.id,

  //     };
  //     setTweets((prev) => [tweetObject, ...prev]);
  //     //가장 최근 doc을 앞에 붙이고 그 뒤로 이전 doc을 붙임
  //   });
  // };

  useEffect(() => {
    // getTweets();
    // 겟으로 가져오게 되면 매번 새 트윗을 쓸때 새로고침을 해야 보여짐
    //겟방식 말고 실시간으로 데이터를 db에서 가져오기
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
        <input type="submit" value="Tweet" />
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
