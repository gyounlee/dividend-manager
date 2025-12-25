import { useState, useEffect } from "react";
import './App.css'
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DividendInputPage from "@/pages/DividendInputPage";
import { type StockData } from "@/types/stock";

function App() {
  // 로그인 여부를 관리하는 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Current View
  const [currentView, setCurrentView] = useState("list");
  
  // 1. 주식 목록 상태 (초기값은 로컬스토리지에서 가져옴)
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem("my-stocks");
    return saved ? JSON.parse(saved) : [
      { name: "삼성전자", ticker: "005930", dividend: 10, date: "2025-01-01", status: "배당예정" }
    ];
  });

  // 2. 데이터가 바뀔 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("my-stocks", JSON.stringify(stocks));
  }, [stocks]);

  // 3. 새로운 주식을 추가하는 함수
  const addStock = (newStock: StockData) => {
    setStocks([...stocks, { ...newStock, status: "배당예정" }]);
    setCurrentView("list"); // 추가 후 목록으로 이동
  };


  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="App">
      {currentView === "list" ? (
        <DashboardPage 
          stocks={stocks}  
          onAddClick={() => setCurrentView("input")} />
      ) : (
        <DividendInputPage 
          onSave={addStock}
          onBack={() => setCurrentView("list")} />
      )}
    </div>
  );
}

export default App;
