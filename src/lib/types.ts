export type TrendingSearch = {
  query: string;
  start_timestamp: number;
  active: boolean;
  search_volume: number;
  increase_percentage: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trend_breakdown: any[];
  serpapi_google_trends_link: string;
};
