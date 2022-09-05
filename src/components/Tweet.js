import React, { useState } from "react";
import { dbService } from "fBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); //수정모드인지 아닌지
  const [newTweet, setNewTweet] = useState(tweetObj.text); //입력된 text로 업데이트

  //컬렉션 안에 도큐먼트의 아이디 경로
  const TweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);

  //삭제하기
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    console.log(ok);
    if (ok) {
      //확인 후 삭제
      await deleteDoc(TweetTextRef);
    }
  };

  //수정하기
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(TweetTextRef, {
      text: newTweet, //텍스트를 입력한 텍스트로 수정
    });
    setEditing(false); //수정모드에서 나오기
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Tweet</button>
              <button onClick={toggleEditing}>Edit Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
