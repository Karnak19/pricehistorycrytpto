const fetch = require("node-fetch");
const axios = require('axios');

let portfolioAssets = [];
let newPortfolioAssets = [];
let listCoins = [];
let newListCoins = [];
let listCoinsID = [];

const shearchCoinId = () => {

 newPortfolioAssets.map(element => element.asset).forEach(asset => {
  const coin = newListCoins.find(coin => coin.coinsymbol === asset.toLowerCase());
  if (!coin) {
   throw new Error('coin not found');
  }
  const coinId = coin.coinid;
  listCoinsID.push({ id: coinId });

  console.log('coinId', coinId);
 })
 console.log('list coinID', listCoinsID);
};

const mapPortfolioAssets = () => {
 portfolioAssets.map((portfolioAsset) => {
  return newPortfolioAssets.push({ amount: portfolioAsset.amount, asset: portfolioAsset.asset.symbol })
 })
 console.log('new portfolio:', newPortfolioAssets);
};

const mapListCoins = () => {
 listCoins.map((coin) => {
  return newListCoins.push({ coinid: coin.id, coinsymbol: coin.symbol })
 });
};

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

 .catch(error => {
  console.log(error);
 });


// // const array = [{ id: 'asdf'}, { id: 'foo' }, { id: 'bar' }]; // changed the input array a bit so that the `array[i].id` would actually work - obviously the asker's true array is more than some contrived strings
const loopApiCall = () => {
 let pastPerformanceByCoin = [];
 let promises = [];
 for (i = 0; i < listCoinsID.length; i++) {
  promises.push(
   axios.get(`https://api.coingecko.com/api/v3/coins/${listCoinsID[i].id}/market_chart/range?vs_currency=eur&from=1621602840&to=1624281240`).then(response => {
    // push response in a new array
    pastPerformanceByCoin.push(response.data.prices);
    // pastPerformanceByCoin = response.data.prices;
   })
  )
 }

 Promise.all(promises).then(() => console.log('API responses:', pastPerformanceByCoin));
}



// const axios = require('axios');

// // console.log('nouveauuuuu ligne 62:', newPortfolioAssets);

// let historydata = [];
// const mapDataHistory = () => {
//   historydata.map(function (item) {
//     console.log('mes items', item);
//     // console.log('une seule date', item[0]);
//     // console.log('un seul prix', item[1]);
//   });
// }

// // Get historical market data include price, market cap, and 24h volume (granularity auto)
// const api_url = 'https://api.coingecko.com/api/v3/coins/'
// const coinId = 'bitcoin'
// const currency = 'eur'
// const fromDate = '10.01.2020'
// const toDate = ''

// fetch(`${api_url}${coinId}/market_chart/range?vs_currency=${currency}&from=1621602840&to=1624281240`)
//   .then(function (response) {
//     // handle success
//     // console.log(response.data);
//     historydata = response.data.prices;
//     // console.log('mon tableau de data :', historydata);
//     mapDataHistory();

//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   });


