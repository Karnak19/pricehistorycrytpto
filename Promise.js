const fetch = require("node-fetch");


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
  portfolioAssets = await res1.json();
  listCoins = await res2.data.json();
  console.log(portfolioAssets.data);
  console.log(listCoins);
 })
 .catch(error => {
  console.log(error);
 });