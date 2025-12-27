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

import { format } from "date-fns";
import { ko } from "date-fns/locale";
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
import { cn } from "@/lib/utils";

const STOCKS = [
  { label: "JPEQ.TO", value: "JPEQ.TO" },
  { label: "XEI.TO", value: "XEI.TO" },
  { label: "DFN.TO", value: "DFN.TO" },
  { label: "VFV.TO", value: "VFV.TO" },
];

interface InputPageProps {
  onSave: (stock: StockData) => void;
  onBack: () => void;
}

export default function DividendInputPage({ onSave, onBack }: InputPageProps) {
  // 입력 필드 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    dividend: "",
    date: "",
  });
  const [open, setOpen] = useState(false);

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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {formData.name
                    ? STOCKS.find((stock) => stock.label === formData.name)
                        ?.label
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
                      {STOCKS.map((stock) => (
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
            <Label htmlFor="amount">배당금액</Label>
            <Input
              value={formData.dividend}
              onChange={(e) =>
                setFormData({ ...formData, dividend: e.target.value })
              }
              placeholder="0"
            />
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
                    format(new Date(formData.date), "PPP", { locale: ko })
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
