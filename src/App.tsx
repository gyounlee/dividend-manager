import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DividendInputPage from "@/pages/DividendInputPage";
import { type StockData } from "@/types/stock";
import { supabase } from "./lib/supabase";
import { RotateCcw } from "lucide-react";

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
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("dividends")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;
        setStocks(data || []);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  // 데이타 추가 함수
  const addStock = async (newStock: Omit<StockData, "id">) => {
    try {
      const { data, error } = await supabase
        .from("dividends")
        .insert([newStock])
        .select();

      if (error) throw error;
      if (data) {
        setStocks([data[0], ...stocks]);
        setCurrentView("list"); // 추가 후 목록으로 이동
      }
    } catch (error) {
      alert("데이터 저장에 실패했습니다. " + error);
    }
  };

  // 데이터 삭제 함수
  const deleteStock = async (id: number) => {
    try {
      const { error } = await supabase.from("dividends").delete().eq("id", id);

      if (error) throw error;
      setStocks(stocks.filter((s: StockData) => s.id !== id));
    } catch (error) {
      alert("삭제에 실패했습니다. " + error);
    }
  };

  // 데이터 수정 함수
  const updateStock = async (updatedStock: StockData) => {
    try {
      if (editingId === null) return;
      const { error } = await supabase
        .from("dividends")
        .update(updatedStock)
        .eq("id", editingId); // id를 기준으로 업데이트

      if (error) throw error;

      setStocks(
        stocks.map((s: StockData) =>
          s.id === editingId ? { ...updatedStock, id: editingId } : s
        )
      );
      setEditingId(null);
      setCurrentView("list"); // 수정 후 목록으로 이동
    } catch (error) {
      alert("수정에 실패했습니다. " + error);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => handleLoginSuccess()} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        {/* Lucide의 Loader2 아이콘에 애니메이션을 넣으면 좋습니다 */}
        <div className="animate-spin text-blue-600 mb-4">
          <RotateCcw size={40} />
        </div>
        <p className="text-slate-600 font-medium">
          배당 데이터를 불러오는 중...
        </p>
      </div>
    );
  }
  return (
    <div className="App">
      {currentView === "list" ? (
        <DashboardPage
          stocks={stocks}
          onAddClick={() => setCurrentView("input")}
          onLogout={handleLogout}
          onDeleteStock={deleteStock}
          onEdit={(id: number) => {
            setEditingId(id);
            setCurrentView("input");
          }}
        />
      ) : (
        <DividendInputPage
          onSave={editingId !== null ? updateStock : addStock}
          onBack={() => {
            setEditingId(null);
            setCurrentView("list");
          }}
          initialData={
            editingId !== null
              ? stocks.find((s) => s.id === editingId)
              : undefined
          } // 기존 데이터 전달
        />
      )}
    </div>
  );
}

export default App;
