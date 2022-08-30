import React, { useState } from "react";
import AppRouter from "components/Router";
import {authService} from "fBase";

function App() {

  
  //유저의 로그인 여부
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser); 

  return (
    <div>
      <AppRouter isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default App;
