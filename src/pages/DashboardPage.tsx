import { useState, useMemo } from "react";
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
import {
  Filter,
  PlusCircle,
  MoreHorizontal,
  Trash2,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { type StockData } from "@/types/stock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DashboardProps {
  stocks: StockData[];
  onAddClick: () => void;
  onLogout: () => void;
  onDeleteStock: (index: number) => void;
  onEdit: (index: number) => void;
}

const formatCurrency = (value: string | number) => {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(amount)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function DashboardPage({
  stocks,
  onAddClick,
  onLogout,
  onDeleteStock,
  onEdit,
}: DashboardProps) {
  // 1. 필터 상태 관리
  const [filter, setFilter] = useState({
    accountType: "all",
    accountOwner: "all",
    stockName: "all",
    year: "all",
    month: "all",
  });

  // 2. 필터링 로직 (useMemo로 성능 최적화)
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const stockDate = new Date(stock.date);
      const stockYear = stockDate.getFullYear().toString();
      const stockMonth = (stockDate.getMonth() + 1).toString();

      return (
        (filter.accountType === "all" ||
          stock.accountType === filter.accountType) &&
        (filter.accountOwner === "all" ||
          stock.accountOwner === filter.accountOwner) &&
        (filter.stockName === "all" || stock.name === filter.stockName) &&
        (filter.year === "all" || stockYear === filter.year) &&
        (filter.month === "all" || stockMonth === filter.month)
      );
    });
  }, [stocks, filter]);

  // 3. 필터 목록 추출 (현재 데이터에 있는 값들만 중복 제거해서 추출)
  const owners = Array.from(new Set(stocks.map((s) => s.accountOwner)));
  const stockNames = Array.from(new Set(stocks.map((s) => s.name)));
  const years = Array.from(
    new Set(stocks.map((s) => new Date(s.date).getFullYear().toString()))
  );

  // 필터링된 목록의 배당금 합계 계산
  const totalFilteredDividend = filteredStocks.reduce((sum, stock) => {
    // 숫자가 아닌 값이 들어올 경우를 대비해 안전하게 파싱
    const amount = parseFloat(stock.dividend) || 0;
    return sum + amount;
  }, 0);

  // 필터링된 목록의 총 건수
  const totalCount = filteredStocks.length;

  // 필터링된 목록의 총 주식 수량 합계 (선택 사항)
  const totalQuantity = filteredStocks.reduce((sum, stock) => {
    const qty = parseFloat(stock.quantity) || 0;
    return sum + qty;
  }, 0);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">
                {Object.values(filter).some((v) => v !== "all")
                  ? "필터링된 배당 합계"
                  : "전체 배당 합계"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(totalFilteredDividend)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                해당 내역 수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {totalCount}{" "}
                <span className="text-lg font-normal text-slate-500">건</span>
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          {/* 필터 버튼 및 패널 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter size={18} /> 필터
                {Object.values(filter).some((v) => v !== "all") && (
                  <Badge variant="secondary" className="ml-1">
                    Active
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white">
              <SheetHeader>
                <SheetTitle>데이터 필터링</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                {/* 계좌 종류 필터 */}
                <div className="space-y-2">
                  <Label>계좌 종류</Label>
                  <Select
                    value={filter.accountType}
                    onValueChange={(v) =>
                      setFilter({ ...filter, accountType: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="TFSA">TFSA</SelectItem>
                      <SelectItem value="RRSP">RRSP</SelectItem>
                      <SelectItem value="ETC">OTHER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 계좌 소유주 필터 */}
                <div className="space-y-2">
                  <Label>계좌 소유주</Label>
                  <Select
                    value={filter.accountOwner}
                    onValueChange={(v) =>
                      setFilter({ ...filter, accountOwner: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">전체</SelectItem>
                      {owners.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 종목명 필터 [추가] */}
                <div className="space-y-2">
                  <Label>종목명</Label>
                  <Select
                    value={filter.stockName}
                    onValueChange={(v) =>
                      setFilter({ ...filter, stockName: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="종목 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">전체</SelectItem>
                      {stockNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 년도 필터 */}
                <div className="space-y-2">
                  <Label>연도</Label>
                  <Select
                    value={filter.year}
                    onValueChange={(v) => setFilter({ ...filter, year: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">전체</SelectItem>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>월</Label>
                  <Select
                    value={filter.month}
                    onValueChange={(v) => setFilter({ ...filter, month: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="월 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">전체</SelectItem>
                      {/* 1월부터 12월까지 생성 */}
                      {Array.from({ length: 12 }, (_, i) =>
                        (i + 1).toString()
                      ).map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-4 flex gap-2 text-slate-500"
                  onClick={() =>
                    setFilter({
                      accountType: "all",
                      accountOwner: "all",
                      stockName: "all",
                      year: "all",
                      month: "all",
                    })
                  }
                >
                  <RotateCcw size={16} /> 필터 초기화
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>주식 배당금 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>계좌(소유자)</TableHead>
                  <TableHead>계좌종류</TableHead>
                  <TableHead>종목명</TableHead>
                  <TableHead>수량</TableHead>
                  <TableHead>배당금 수령일</TableHead>
                  <TableHead>배당금</TableHead>
                  <TableHead className="w-[50px]"></TableHead>{" "}
                  {/* [추가] 작업 열 */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>{stock.accountOwner}</TableCell>
                    <TableCell>{stock.accountType}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>{stock.date}</TableCell>
                    <TableCell className="font-mono text-right">
                      {formatCurrency(stock.dividend)}
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
                            onClick={() => onEdit(index)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>수정하기</span>
                          </DropdownMenuItem>
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
