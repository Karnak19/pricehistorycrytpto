const fetch = require("node-fetch");

let portfolioName = [];
let portfolioAssets = [];
const mapPortfolioAssets = () => {
 portfolioAssets.map(function (item) {
  // console.log('mes items', item);
  console.log('amount by asset', item.amount);
  console.log('symbol by asset', item.asset.symbol);

 });
 console.log('all assets of portfolio :', portfolioAssets);
};

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
})
 .then((res) => res.json())
 .then(function (result) {
  // handle result
  // console.log('log result: ', result.data.fund.portfolio.holdings);
  portfolioName = result.data.fund.name;
  portfolioAssets = result.data.fund.portfolio.holdings;
  // console.log('les assets du portfolio :', portfolioAssets);
  // console.log('le nom du portfolio :', portfolioName);
  mapPortfolioAssets();

 })


// const axios = require('axios');

// let historydata = [];
// const mapDataHistory = () => {
//  historydata.map(function (item) {
//   console.log('mes items', item);
//   console.log('une seule date', item[0]);
//   console.log('un seul prix', item[1]);
//  });
// }

// // Get historical market data include price, market cap, and 24h volume (granularity auto)
// const api_url = 'https://api.coingecko.com/api/v3/coins/'
// const coinId = 'bitcoin'
// const currency = 'eur'
// const fromDate = ''
// const toDate = ''

// axios.get(`${api_url}${coinId}/market_chart/range?vs_currency=${currency}&from=1621602840&to=1624281240`)
//  .then(function (response) {
//   // handle success
//   console.log(response.data);
//   historydata = response.data.prices;
//   // console.log('mon tableau de data :', historydata);
//   mapDataHistory();

//  })
//  .catch(function (error) {
//   // handle error
//   console.log(error);
//  });

 // https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=1621602840&to=1624281240