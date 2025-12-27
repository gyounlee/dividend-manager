import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type StockData } from "@/types/stock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/*const myStocks = [
  { name: "삼성전자", ticker: "005930", amount: 10, dividend: "3.5%", status: "배당완료" },
  { name: "애플", ticker: "AAPL", amount: 5, dividend: "0.6%", status: "배당예정" },
  { name: "리얼티인컴", ticker: "O", amount: 20, dividend: "5.8%", status: "배당예정" },
];*/

const formatCurrency = (value: string | number) => {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(amount);
};

interface DashboardProps {
  stocks: StockData[];
  onAddClick: () => void;
  onLogout: () => void;
  onDeleteStock: (index: number) => void;
}

export default function DashboardPage({
  stocks,
  onAddClick,
  onLogout,
  onDeleteStock,
}: DashboardProps) {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">
          내 배당금 대시보드
        </h1>
        <div className="flex gab-2">
          <Button variant="outline" onClick={onLogout}>
            로그아웃
          </Button>
        </div>
        {/* 배당금 입력 화면으로 이동하는 버튼 */}
        <Button onClick={onAddClick} className="flex gap-2">
          <PlusCircle size={18} />
          배당금 입력
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">총 자산</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₩12,450,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">연간 배당금</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">₩450,000</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">보유 종목수</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3개</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>주식 배당금 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>종목명</TableHead>
                  <TableHead>배당금 수령일</TableHead>
                  <TableHead>배당금</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="w-[50px]"></TableHead>{" "}
                  {/* [추가] 작업 열 */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.date}</TableCell>
                    <TableCell className="font-mono text-right">
                      {formatCurrency(stock.dividend)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          stock.status === "배당완료" ? "default" : "outline"
                        }
                      >
                        {stock.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* [추가] 삭제 버튼을 포함한 드롭다운 메뉴 */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem
                            onClick={() => onDeleteStock(index)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>삭제하기</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
