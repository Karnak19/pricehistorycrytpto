// const fetch = require("node-fetch");

// fetch('https://api.thegraph.com/subgraphs/name/enzymefinance/enzyme', {
//  method: 'POST',
//  headers: { "Content-type": "application/json" },
//  body: JSON.stringify({
//   query: `
//   query 
//    {
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
//  })
// })
//  .then(response => response.json())
//  .then(data => {
//   console.log(data.data);
//  })






const axios = require('axios');

const historydata = [];
// const hello = () => {
//  let myArray = historydata.prices.map(function (price) {

//   console.log(myArray);
//   console.log(price[2]);
//   return town[2];
//  });
// }

// Get historical market data include price, market cap, and 24h volume (granularity auto)
const api_url = 'https://api.coingecko.com/api/v3/coins/'
const coinId = 'bitcoin'
const currency = 'eur'
const fromDate = ''
const toDate = ''

axios.get(`${api_url}${coinId}/market_chart/range?vs_currency=${currency}&from=1621602840&to=1624281240`)
 .then(function (response) {
  // handle success
  console.log(response.data);
  historydata.push(response.data.prices);
  console.log('mon tableau de data :', historydata);

 })
 .catch(function (error) {
  // handle error
  console.log(error);
 });



 // https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=1621602840&to=1624281240