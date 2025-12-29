export interface StockData {
  name: string;      // 종목명
  dividend: string;  // 배당금액 (금액/주 또는 총액)
  date: string;      // 수령일
  quantity: string;  // 주식 수량
  accountType: string; // 계좌 종류 (예: TFSA, RRSP)
  accountOwner: string; // 계좌 소유자
}