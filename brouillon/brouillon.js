const fetch = require("node-fetch");
const axios = require('axios');

let portfolioAssets = [];
let newPortfolioAssets = [];
let listCoins = [];
let newListCoins = [];
let listCoinsID = [];
// let idandportfolio = listCoinsID.concat(newPortfolioAssets);


// we just reduce the original data here
const mapPortfolioAssets = () => {
  portfolioAssets.map((portfolioAsset) => {
    return newPortfolioAssets.push({ amount: portfolioAsset.amount, asset: portfolioAsset.asset.symbol })
  })
  console.log('new portfolio:', newPortfolioAssets);
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

    console.log('coinId', coinId);
  })
  console.log('list coinID', listCoinsID);
};

const addAmouts = () => {
  // newPortfolioAssets.map(element => element.amount).forEach(amount => {
  //   listCoinsID.push({ amount: amount });
  // })
  // console.log('ligne 34', listCoinsID);
  // for (i = 0; i < listCoinsID.length; i++) {
  //   // const mapListCoins = () => {
  //   // newPortfolioAssets.map((item) => {
  //   return listCoinsID[i].amount = newPortfolioAssets.amount;

  // });
  // }
  listCoinsID.map((item, index) => {
    item[amount] = newPortfolioAssets[index].amount
  })


  // newPortfolioAssets.map(element => element.amount).forEach(asset => {
  //   const coin = newListCoins.find(coin => coin.coinsymbol === asset.toLowerCase());
  //   if (!coin) {
  //     throw new Error('coin not found');
  //   }
  //   const coinId = coin.coinid;

  //   //add asset
  //   listCoinsID.push({ id: coinId, asset: asset, performance: [] });

  //   console.log('coinId', coinId);
  // })
  // console.log('list coinID', listCoinsID);

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



  for (i = 0; i < listCoinsID.length; i++) {

    let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${listCoinsID[i].id}/market_chart/range?vs_currency=eur&from=1561370451&to=1624281240`)

    listCoinsID[i].performance = response.data.prices;

    // for (i = 0; i < listCoinsID.length; i++) {
    //   // const mapListCoins = () => {
    //   newPortfolioAssets.map((item) => {
    //     return listCoinsID[i].amount = item.amount;

    //   });
    //   // };

    //   // listCoinsID[i].amount = newPortfolioAssets.amount;
    //   // console.log('104', newPortfolioAssets);
    //   // console.log('92', listCoinsID[i].performance);
    //   // listCoinsID[i].performance = response.data.prices;
    //   console.log('100', listCoinsID);
    // }
    // console.log('118', newPortfolioAssets);
  }
  // console.log('103', listCoinsID);


  console.log('123', listCoinsID);

}

let finalData = listCoinsID;
console.log('finalData', finalData);



17h39 24 juin

listCoinsID.map((oneAssetWithAllData) => {
  firstday = oneAssetWithAllData.performance;
  console.log('just first day', firstday);
  // oneAssetWithAllData.performance.map((OneArrayPerformance) => {
  console.log('price of the asset on the first day', firstday.length);
  priceFirstday.push(firstday[1]);

});










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


