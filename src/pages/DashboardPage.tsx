import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type StockData } from "@/types/stock";

const myStocks = [
  { name: "삼성전자", ticker: "005930", amount: 10, dividend: "3.5%", status: "배당완료" },
  { name: "애플", ticker: "AAPL", amount: 5, dividend: "0.6%", status: "배당예정" },
  { name: "리얼티인컴", ticker: "O", amount: 20, dividend: "5.8%", status: "배당예정" },
];

interface DashboardProps {
  stocks: StockData[];
  onAddClick: () => void;
}

export default function DashboardPage({ stocks, onAddClick }: DashboardProps) {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">내 배당금 대시보드</h1>
        {/* 배당금 입력 화면으로 이동하는 버튼 */}
          <Button onClick={onAddClick} className="flex gap-2">
            <PlusCircle size={18} />
            배당금 입력
          </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">총 자산</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">₩12,450,000</p></CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-sm">연간 배당금</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-600">₩450,000</p></CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-sm">보유 종목수</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">3개</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>주식 보유 목록</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>종목명</TableHead>
                  <TableHead>티커</TableHead>
                  <TableHead>보유수량</TableHead>
                  <TableHead>배당률</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myStocks.map((stock) => (
                  <TableRow key={stock.ticker}>
                    <TableCell className="font-medium">{stock.name}</TableCell>
                    <TableCell>{stock.ticker}</TableCell>
                    <TableCell>{stock.amount}주</TableCell>
                    <TableCell>{stock.dividend}</TableCell>
                    <TableCell>
                      <Badge variant={stock.status === "배당완료" ? "default" : "outline"}>
                        {stock.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>종목명</TableHead>
              <TableHead>티커</TableHead>
              <TableHead>수량</TableHead>
              <TableHead>배당률</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock, index) => (
              <TableRow key={index}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.dividend}</TableCell>
                <TableCell>{stock.date}</TableCell>
                <TableCell>
                  <Badge variant={stock.status === "배당완료" ? "default" : "outline"}>
                    {stock.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}