const fetch = require("node-fetch");
const axios = require('axios');

let portfolioAssets = [];
let newPortfolioAssets = [];
let listCoins = [];
let newListCoins = [];
let listCoinsID = [];


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
    listCoinsID.push({ id: coinId, asset: asset });

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
    addAmouts();
  })
  .then(async () => {
    loopApiCall();
  })
  .catch(error => {
    console.log(error);
  });

async function loopApiCall() {

  const fromThisTimeStamp = '1560988800';
  const ToThisTimeStamp = '1624492800';

  const res = await Promise.all(
    listCoinsID.map((coin) => {
      // for each id of coin we get the pastperformance of the coin
      return axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart/range?vs_currency=eur&from=${fromThisTimeStamp}&to=${ToThisTimeStamp}`
      );
    })
  );





  const prices = res.map((r) => // output of res : all respons of API include header, status etc ... and data  data: { prices: [Array], market_caps: [Array], total_volumes: [Array] }
    // we change the shape of the data for prices {timestamp, value }
    // output of r = all detail of data.prices 
    r.data.prices.map(([timestamp, value]) =>
    // we gona loop on each ( output : r.data.prices [ 1560988800000, 0.8792311317135113 ] ) array of day and price and add timestamp and value as properties of this new objet
    // console.log("r.data.prices", [timestamp, value])

    ({
      timestamp,
      value,
    }))
  );


  listCoinsID.map((item, index) => {
    item["performance"] = prices[index]
  })
  console.log('1300000', listCoinsID[3].performance)

  /**** find the coins without all past performance ****/
  const findCoinsWithoutAllPastPerformance = listCoinsID.map((oneCoinPastperformance) => {
    console.log('oneCoinPastperformance', oneCoinPastperformance);
    if (oneCoinPastperformance[0] != (`${fromThisTimeStamp}000`)) {
      console.log('i don\t have all the history');
    }

    else {
      console.log('ok geep going');
    }

  })


  // console.log("Prices ligne 107", prices); // output all pastperformance of all coin in array 

  const cumuledValuePerDay = {};

  prices.forEach((coinPrices) => {
    // console.log('coinPrices', coinPrices); // output just one pastperformance of one coin 
    coinPrices.forEach(({ timestamp, value }, index) => {
      if (!cumuledValuePerDay.hasOwnProperty(timestamp)) {
        cumuledValuePerDay[timestamp] = value;
      } else {
        cumuledValuePerDay[timestamp] += value;
      }
    });
  });

  // console.log(cumuledValuePerDay);
  // Object.entries(cumuledValuePerDay).forEach(([ts, val]) => {
  //   console.log(`${new Date(+ts).toLocaleString("fr")} => ${val}`);
  // });
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

// on passe en une part donc jour 0 = 1part 

// le montant du portfolio on s'en fou 

// si tu vois pas dans ta loop le 11/03 tu vas chercher dans usdc 

// faut pousser le console log sur firestore / firebase 

// npm i firebase / mettre des credentials , / pousser les resultat dans une collection firestore ( le seul produit où il faut pousser c'est firestore ) /

// prendre un contrat au hasard sur enzime pour tester 

// revenir sur next js et API CALL de firebase FETCH DATA.firestore en front : https://firebase.google.com/docs/firestore/query-data/get-data#web-v9