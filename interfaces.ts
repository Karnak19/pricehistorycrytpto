export interface Hold {
  amount: string;
  asset: {
    name: string;
    symbol: string;
  };
}

export interface LighterHold {
  amount: string;
  asset: Hold["asset"]["symbol"];
}

export interface FundQueryResponse {
  data: {
    fund: {
      name: string;
      portfolio: {
        holdings: Hold[];
      };
    };
  };
}

export interface CoinListResponse {
  id: string;
  symbol: string;
  name: string;
}

export interface CoinID {
  id: string;
  asset: string;
}
