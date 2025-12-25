import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { type StockData } from "@/types/stock";

interface InputPageProps {
    onSave: (stock: StockData) => void;
    onBack: () => void;
}

export default function DividendInputPage({ onSave, onBack }: InputPageProps) {
    // 입력 필드 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    dividend: "",
    date: ""
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.dividend) {
      alert("종목명과 티커를 입력해주세요.");
      return;
    }
    // 부모의 addStock 함수 실행
    onSave(formData);
  };
  return (
    <div className="p-8 bg-slate-50 min-h-screen flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <CardTitle>배당금 정보 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="stockName">종목명</Label>
            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="예: 삼성전자" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">배당금액</Label>
            <Input value={formData.dividend} onChange={e => setFormData({...formData, dividend: e.target.value})} placeholder="0" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">수령일</Label>
            <Input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="0" />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>취소</Button>
          <Button className="flex-1 bg-blue-600" onClick={handleSubmit}>저장하기</Button>
        </CardFooter>
      </Card>
    </div>
  );
}