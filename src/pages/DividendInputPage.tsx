import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface InputPageProps {
  onBack: () => void;
}

export default function DividendInputPage({ onBack }: InputPageProps) {
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
            <Input id="stockName" placeholder="예: 삼성전자" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">배당금액</Label>
            <Input id="amount" type="number" placeholder="0" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">수령일</Label>
            <Input id="date" type="date" />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>취소</Button>
          <Button className="flex-1 bg-blue-600" onClick={() => {
            alert("저장되었습니다!");
            onBack();
          }}>저장하기</Button>
        </CardFooter>
      </Card>
    </div>
  );
}