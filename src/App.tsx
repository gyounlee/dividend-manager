import { useState } from "react";
import './App.css'
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DividendInputPage from "@/pages/DividendInputPage";

function App() {
  // 로그인 여부를 관리하는 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Current View
  const [currentView, setCurrentView] = useState("list");
  
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="App">
      {currentView === "list" ? (
        <DashboardPage onAddClick={() => setCurrentView("input")} />
      ) : (
        <DividendInputPage onBack={() => setCurrentView("list")} />
      )}
    </div>
  );
}

export default App;
