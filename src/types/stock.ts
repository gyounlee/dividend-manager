export interface StockData {
  name: string;
  dividend: string;
  date: string;
  status?: string; // 선택 사항 (상태는 나중에 추가될 수 있으므로)
}