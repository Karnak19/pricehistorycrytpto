const fetch = require("node-fetch");
const axios = require('axios');

let portfolioAssets = [];
let newPortfolioAssets = [];
let listCoins = [];
let newListCoins = [];
let listCoinsID = [];
let pastPerformancestwo = [];
let firstday = [];
let priceFirstday = [];

// we just reduce the original data here
const mapPortfolioAssets = () => {
  portfolioAssets.map((portfolioAsset) => {
    return newPortfolioAssets.push({ amount: portfolioAsset.amount, asset: portfolioAsset.asset.symbol })
  })
  // console.log('new portfolio:', newPortfolioAssets);
};

// we just reduce the original data here
const mapListCoins = () => {
  listCoins.map((coin) => {
    return newListCoins.push({ coinid: coin.id, coinsymbol: coin.symbol })
  });
};

const shearchCoinId = () => {

  newPortfolioAssets.map(element => element.asset).forEach(asset => {
    const coin = newListCoins.find(coin => coin.coinsymbol === asset.toLowerCase());
    if (!coin) {
      throw new Error('coin not found');
    }
    const coinId = coin.coinid;
    //add asset
    listCoinsID.push({ id: coinId, asset: asset, performance: [] });

    // console.log('coinId', coinId);
  })
  // console.log('list coinID', listCoinsID);
};

const addAmouts = () => {
  listCoinsID.map((item, index) => {
    item["amount"] = newPortfolioAssets[index].amount
  })
}

Promise.all([
  fetch('https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme', {
    method: 'POST',
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      query: `
  query 
  {
    fund(id: "0xded69068a94776a23f5bdafc6b4c6894bc88e82c") {
  name
      portfolio{
        holdings{
          asset{
            name
            symbol
          }
        amount
        }
      }
      }
    }
  `
    })
  }),
  fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false')
])
  .then(async ([res1, res2]) => {
    resultAPIportfolio = await res1.json();
    resultAPIlistCoins = await res2.json();
    portfolioAssets = resultAPIportfolio.data.fund.portfolio.holdings;
    listCoins = resultAPIlistCoins;
    mapListCoins();
    mapPortfolioAssets();
    shearchCoinId();
  })
  .then(async () => {
    loopApiCall();
  })
  .then(async () => {
    addAmouts();
  })
  .catch(error => {
    console.log(error);
  });

async function loopApiCall() {

  const res = await Promise.all(
    listCoinsID.map((coin) => {
      // for each id of coin we get the data
      return axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart/range?vs_currency=eur&from=1615507200&to=1624492800`
      );
    })
  );


  const prices = res.map((r) =>
    // we change the shape of the data for  {timestamp, value }
    r.data.prices.map(([timestamp, value]) => ({
      timestamp,
      value,
    }))
  );

  console.log("Prices ligne 107", prices); // output all pastperformance of all coin in array 

  const cumuledValuePerDay = {};

  prices.forEach((coinPrices) => {
    console.log('coinPrices', coinPrices); // output just one pastperformance of one coin 
    coinPrices.forEach(({ timestamp, value }, i) => {
      if (!cumuledValuePerDay.hasOwnProperty(timestamp)) {
        cumuledValuePerDay[timestamp] = value;
      } else {
        cumuledValuePerDay[timestamp] += value;
      }
    });
  });

  console.log(cumuledValuePerDay);
  Object.entries(cumuledValuePerDay).forEach(([ts, val]) => {
    console.log(`${new Date(+ts).toLocaleString("fr")} => ${val}`);
  });
}


// prices.forEach((coinPrices, i) => {
//   const { amount } = listCoinsID[i];
//   coinPrices.forEach(({ timestamp, value }) => {
//     if (!cumuledValuePerDay.hasOwnProperty(timestamp)) {
//       cumuledValuePerDay[timestamp] = value * amount;
//     } else {
//       cumuledValuePerDay[timestamp] += value * amount;
//     }
//   });
// });