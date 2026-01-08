import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { type StockData } from "@/types/stock";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface InputPageProps {
  onSave: (stock: StockData) => void;
  onBack: () => void;
  initialData?: StockData;
  stockOptions: { label: string; value: string }[];
}

export default function DividendInputPage({
  onSave,
  onBack,
  initialData,
  stockOptions,
}: InputPageProps) {
  // 입력 필드 상태 관리
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    dividend: initialData?.dividend || "",
    date: initialData?.date || "",
    quantity: initialData?.quantity || "",
    accountType: initialData?.accountType || "TFSA",
    accountOwner: initialData?.accountOwner || "",
  });

  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.dividend) {
      alert("종목명과 배당금을 입력해주세요.");
      return;
    }
    // 부모의 addStock 함수 실행
    await onSave(formData as StockData);
  };
  return (
    <div className="p-8 bg-slate-50 min-h-screen flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <CardTitle>
            {" "}
            {initialData ? "배당금 정보 수정" : "배당금 정보 입력"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {formData.name
                    ? stockOptions.find(
                        (stock) => stock.label === formData.name
                      )?.label
                    : "종목을 검색하거나 선택하세요..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white">
                <Command>
                  <CommandInput placeholder="종목 코드나 이름 입력 (예: JP)..." />
                  <CommandList>
                    <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {stockOptions.map((stock) => (
                        <CommandItem
                          key={stock.value}
                          value={stock.label}
                          onSelect={(currentValue) => {
                            setFormData({ ...formData, name: currentValue });
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.name === stock.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {stock.label} ({stock.value})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">주식 수량</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">배당금액</Label>
            <Input
              value={formData.dividend}
              onChange={(e) =>
                setFormData({ ...formData, dividend: e.target.value })
              }
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 계좌 소유자 */}
            <div className="grid gap-2">
              <Label htmlFor="accountOwner">계좌 소유자</Label>
              <Select
                value={formData.accountOwner}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, accountOwner: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent className="w-auto p-0 bg-white">
                  <SelectItem value="GYOUN">GYOUN</SelectItem>
                  <SelectItem value="SUNYOUNG">SUNYOUNG</SelectItem>
                  <SelectItem value="JENNIE">JENNIE</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 계좌 종류 선택 */}
            <div className="grid gap-2">
              <Label>계좌 종류</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, accountType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent className="w-auto p-0 bg-white">
                  <SelectItem value="TFSA">TFSA</SelectItem>
                  <SelectItem value="RRSP">RRSP</SelectItem>
                  <SelectItem value="FHSA">FHSA</SelectItem>
                  <SelectItem value="ETC">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 flex flex-col">
            <Label>배당 수령일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    formData.date
                  ) : (
                    <span>날짜를 선택하세요</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={
                    formData.date ? new Date(formData.date) : new Date()
                  }
                  onSelect={(selectedDate) =>
                    setFormData({
                      ...formData,
                      date: selectedDate
                        ? selectedDate.toISOString().split("T")[0]
                        : "",
                    })
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            취소
          </Button>
          <Button className="flex-1 bg-blue-600" onClick={handleSubmit}>
            저장하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
