import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DividendInputPage from "@/pages/DividendInputPage";
import { type StockData } from "@/types/stock";

function App() {
  // 로그인 여부를 관리하는 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // 로그인 성공 시 호출: 상태를 바꾸고 로컬스토리지에도 기록합니다.
  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  // 로그아웃 시 호출: 상태를 바꾸고 로컬스토리지 기록을 지웁니다.
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  // Current View
  const [currentView, setCurrentView] = useState<"list" | "input">("list");

  // 1. 주식 목록 상태 (초기값은 로컬스토리지에서 가져옴)
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem("my-stocks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            name: "삼성전자",
            ticker: "005930",
            dividend: 10,
            date: "2025-01-01",
            status: "배당예정",
          },
        ];
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 2. 데이터가 바뀔 때마다 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("my-stocks", JSON.stringify(stocks));
  }, [stocks]);

  // 3. 새로운 주식을 추가하는 함수
  const addStock = (newStock: StockData) => {
    setStocks([...stocks, { ...newStock, status: "배당예정" }]);
    setCurrentView("list"); // 추가 후 목록으로 이동
  };

  const deleteStock = (index: number) => {
    const updatedStocks = stocks.filter(
      (_: StockData, i: number) => i !== index
    );
    setStocks(updatedStocks);
    localStorage.setItem("my-stocks", JSON.stringify(updatedStocks));
  };

  // [추가] 데이터 수정 함수
  const updateStock = (updatedStock: StockData) => {
    if (editingIndex !== null) {
      const newStocks = [...stocks];
      newStocks[editingIndex] = updatedStock;
      setStocks(newStocks);
      localStorage.setItem("my-stocks", JSON.stringify(newStocks));
      setEditingIndex(null); // 수정 완료 후 인덱스 초기화**
      setCurrentView("list");
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => handleLoginSuccess()} />;
  }

  return (
    <div className="App">
      {currentView === "list" ? (
        <DashboardPage
          stocks={stocks}
          onAddClick={() => setCurrentView("input")}
          onLogout={handleLogout}
          onDeleteStock={deleteStock}
          onEdit={(index: number) => {
            setEditingIndex(index);
            setCurrentView("input");
          }}
        />
      ) : (
        <DividendInputPage
          onSave={editingIndex !== null ? updateStock : addStock}
          //onBack={() => setCurrentView("list")}
          onBack={() => {
            setEditingIndex(null);
            setCurrentView("list");
          }}
          initialData={editingIndex !== null ? stocks[editingIndex] : undefined} // 기존 데이터 전달
        />
      )}
    </div>
  );
}

export default App;
