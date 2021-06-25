import axios from "axios";
import { CoinListResponse, FundQueryResponse, LighterHold } from "./interfaces";

const fundQueryPromise = axios.post<FundQueryResponse>(
  "https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme",
  JSON.stringify({
    query: `
query {
  fund(id: "0xded69068a94776a23f5bdafc6b4c6894bc88e82c") {
    name
    portfolio {
      holdings {
        asset {
          name
          symbol
        }
      amount
      }
    }
  }
}
`,
  }),
  {
    headers: { "Content-type": "application/json" },
  }
);

const coinListPromise = axios.get<CoinListResponse[]>(
  "https://api.coingecko.com/api/v3/coins/list?include_platform=false"
);

async function main() {
  // states
  const portfolioAssets: LighterHold[] = [];

  // getting initial states datas
  const [{ data: portfolio }, { data: coinsList }] = await Promise.all([
    fundQueryPromise,
    coinListPromise,
  ]);

  portfolio.data.fund.portfolio.holdings.forEach((hold) => {
    portfolioAssets.push({
      amount: hold.amount,
      asset: hold.asset.symbol,
    });
  });

  console.log(portfolioAssets);
}

main();
