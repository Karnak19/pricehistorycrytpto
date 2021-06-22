const fetch = require("node-fetch");

let portfolioAssets = [];
let newPortfolioAssets = [];
let listCoins = [];
let newListCoins = [];

const mapPortfolioAssets = () => {
  portfolioAssets.map((portfolioAsset) => {
    return newPortfolioAssets.push({ amount: portfolioAsset.amount, asset: portfolioAsset.asset.symbol })
  })
  console.log('nouveauuuuu:', newPortfolioAssets);
};

const mapListCoins = () => {
  listCoins.map((coin) => {
    return newListCoins.push({ coinid: coin.id, coinname: coin.name })
  });
  console.log('new list coins:', newListCoins);
  // console.log('dans coinList:', newPortfolioAssets);
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
    // console.log('portfolioAssets', resultAPIportfolio.data.fund.portfolio.holdings);
    // console.log('listCoins', resultAPIlistCoins);
    portfolioAssets = resultAPIportfolio.data.fund.portfolio.holdings;
    listCoins = resultAPIlistCoins;
    mapPortfolioAssets();
    mapListCoins();
  })
  .catch(error => {
    console.log(error);
  });

// const fetch = require("node-fetch");

// let portfolioName = [];
// let portfolioAssets = [];
// let newPortfolioAssets = [];



// const mapPortfolioAssets = () => {
//   // portfolioAssets.map(function (item) {
//   // console.log('mes items', item);
//   // console.log('amount by asset', item.amount);
//   // console.log('symbol by asset', item.asset.symbol);

//   // });
//   // console.log('all assets of portfolio :', portfolioAssets);
//   // console.log('new portfolio with only symbol :', newPortfolioAssets);
//   portfolioAssets.map((portfolioAsset) => {
//     return newPortfolioAssets.push({ amount: portfolioAsset.amount, asset: portfolioAsset.asset.symbol })
//   })
//   console.log('nouveauuuuu:', newPortfolioAssets);
// };

// fetch('https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme', {
//   method: 'POST',
//   headers: { "Content-type": "application/json" },
//   body: JSON.stringify({
//     query: `
//   query 
//   {
//     fund(id: "0xded69068a94776a23f5bdafc6b4c6894bc88e82c") {
//   name
//       portfolio{
//         holdings{
//           asset{
//             name
//             symbol
//           }
//         amount
//         }
//       }
//       }
//     }
//   `
//   })
// })
//   .then((res) => res.json())
//   .then(function (result) {
//     // handle result
//     // console.log('log result: ', result.data.fund.portfolio.holdings);
//     portfolioName = result.data.fund.name;
//     portfolioAssets = result.data.fund.portfolio.holdings;
//     // console.log('les assets du portfolio :', portfolioAssets);
//     // console.log('le nom du portfolio :', portfolioName);
//     mapPortfolioAssets();

//   })


// const axios = require('axios');

// let listCoins = [];
// let newListCoins = [];

// const mapListCoins = () => {
//   listCoins.map((coin) => {
//     return newListCoins.push({ coinid: coin.id, coinname: coin.name })
//   });
//   console.log('new list coins:', newListCoins);
//   console.log('dans coinList:', newPortfolioAssets);
// };

// // Get all coins of crypto market 
// const api_url = 'https://api.coingecko.com/api/v3/coins/list?include_platform=false'

// axios.get(`${api_url}`)
//   .then(function (response) {
//     // handle success
//     listCoins = response.data;
//     mapListCoins();
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   });






// const axios = require('axios');

// console.log('nouveauuuuu ligne 62:', newPortfolioAssets);

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

// axios.get(`${api_url}${coinId}/market_chart/range?vs_currency=${currency}&from=1621602840&to=1624281240`)
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

//  https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=1621602840&to=1624281240


