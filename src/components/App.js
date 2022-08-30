import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import {authService} from "fBase";
import {getAuth, onAuthStateChanged} from "firebase/auth";

function App() {

  
  //유저의 로그인 여부
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  },[])

  return (
    <div>
      {init? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
    </div>
  );
}

export default App;
