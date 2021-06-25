interface Hold {
  amount: string;
  asset: {
    name: string;
    symbol: string;
  };
}

interface LighterHold {
  amount: string;
  asset: Hold["asset"]["symbol"];
}

interface FundQueryResponse {
  data: {
    fund: {
      name: string;
      portfolio: {
        holdings: Hold[];
      };
    };
  };
}

interface CoinListResponse {
  id: string;
  symbol: string;
  name: string;
}
