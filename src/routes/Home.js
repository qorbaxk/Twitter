import React, { useEffect, useState } from "react";
import { dbService } from "fBase";
import { addDoc, collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

  //작성한 트윗 DB에서 가져오기
  const getTweets = async () => {
    const dbTweets = await getDocs(collection(dbService, "tweets"));
    dbTweets.forEach((document) => {
      const tweetObject = {
        ...document.data(),
        id: document.id,
      };
      setTweets((prev) => [tweetObject, ...prev]);
      //가장 최근 doc을 앞에 붙이고 그 뒤로 이전 doc을 붙임
    });
  };

  useEffect(() => {
    getTweets();
  }, []);

  //작성한 트윗 DB에 저장
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), {
        tweet,
        createdAt: Date.now(),
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

  console.log(tweets);
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
        {tweets.map(tweet => <div key={tweet.id}>
          <h4>{tweet.tweet}</h4>
        </div>)}
      </div>
    </div>
  );
};

export default Home;
