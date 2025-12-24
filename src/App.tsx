import { useState } from "react";
import './App.css'
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";

function App() {
  // 로그인 여부를 관리하는 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <div className="App">
      {isLoggedIn ? (
        // 로그인 성공 시 대시보드 표시
        <DashboardPage />
      ) : (
        // 로그인 전에는 로그인 페이지 표시 (성공 시 상태 변경 함수 전달)
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
