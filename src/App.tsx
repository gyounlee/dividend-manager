import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DividendInputPage from "@/pages/DividendInputPage";
import { type StockData } from "@/types/stock";
import { supabase } from "./lib/supabase";
import { RotateCcw } from "lucide-react";

function App() {
  // Current View
  const [currentView, setCurrentView] = useState<"list" | "input">("list");
  // 로그인 여부를 관리하는 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [stockOptions, setStockOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    // 1. 현재 로그인된 세션이 있는지 확인
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setLoading(false);
    };

    checkSession();

    // 2. 로그인/로그아웃 상태 변화를 실시간으로 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  // 로그인 성공 시 호출: 상태를 바꿈
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // 데이터 불러오기
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 배당 데이터와 종목 리스트를 동시에 가져오기
        const [dividendsRes, stocksRes] = await Promise.all([
          supabase
            .from("dividends")
            .select("*")
            .order("date", { ascending: false }),
          supabase.from("stock_list").select("label, value").order("label"),
        ]);

        if (dividendsRes.data) setStocks(dividendsRes.data);
        if (stocksRes.data) setStockOptions(stocksRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (isLoggedIn) fetchInitialData();
  }, [isLoggedIn]);

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
          stockOptions={stockOptions}
        />
      )}
    </div>
  );
}

export default App;
