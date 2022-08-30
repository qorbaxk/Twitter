import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  //이메일 및 비밀번호 입력받기
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  //전송
  const onSubmit = async(event) => {
    event.preventDefault();
    try{
      let data;
      const auth = getAuth();
      if(newAccount){
        //가입
        data = await createUserWithEmailAndPassword(auth, email, password);
      }else{
        //로그인
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    }catch(error){
      setError(error.message);
    }
    
  };

  const toggleAccount = () => setNewAccount(prev => !prev);
  
  //소셜로그인
  const onSocialClick = async(event) =>{
    const {target:{name}} = event;
    let provider;
    const auth = getAuth();
    if(name === "google"){ //구글로그인
      provider = new GoogleAuthProvider();
    }else if(name === "github"){ //깃허브로그인
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(auth, provider);
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>{newAccount ? "Sign In":"Create Account"}</span>
      <div>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
        <button onClick={onSocialClick} name="github">Continue with Github</button>
      </div>
    </div>
  );
};

export default Auth;
