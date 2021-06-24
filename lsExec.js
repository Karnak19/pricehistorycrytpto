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
  // .then(async () => {
  //   loopForFindFirstPrice();
  // })
  .catch(error => {
    console.log(error);
  });

async function loopApiCall() {

  for (i = 0; i < listCoinsID.length; i++) {
    let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${listCoinsID[i].id}/market_chart/range?vs_currency=eur&from=1593129600&to=1624665600`)
    listCoinsID[i].performance = response.data.prices; // output of response.data.prices is [ 1621604475335, 0.8309792774569776 ],
  }


  // pastPerformancestwo = listCoinsID;
  // console.log('123', listCoinsID.performance);
  listCoinsID.map((oneAssetWithAllData) => {
    firstday = oneAssetWithAllData.performance[1]; // here if we target index 0 we have the first day
    // if we target index 1 we have the second day etc ... so we need to do a for loop like we do in line 100 
    console.log('just first day', firstday);
    // oneAssetWithAllData.performance.map((OneArrayPerformance) => {
    console.log('price of the asset on the first day', firstday[1]);
    priceFirstday.push(firstday[1]);

  });

  let sum = priceFirstday.reduce((a, b) => {
    return a + b;
  }, 0);

  console.log('Total Asset price on Firstday', sum);
}

// async function loopForFindFirstPrice() {


//   });
// }


