const fmpApiKey =  `790c2982fd01273e3a03a32d42eb3273`
initializePage();

function getNews (tickers, items) {
    fetch(`https://stocknewsapi.com/api/v1?tickers=${tickers.join()}&items=${items}&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)
        .then(response => response.json())
        .then(data => displayNewsList(data.data));
};

function getTickerImages(tickers) {
    let items = 50;
    fetch(`https://stocknewsapi.com/api/v1?tickers=${tickers.join()}&items=${items}&token=tvqftcxiwedbpjfxkixyqylbrjwvx3cjeoqmuvj8`)
        // .then(function(response) {
        //     return response.json();
        // })
        .then(response => response.json())
        .then(data => displayTickerImages(tickers, data.data));
};

function displayTickerImages(tickers, newsList) {
    for (let ticker of tickers) {
        let imageUrl = getTickerImageUrl(ticker, newsList);
        displayTickerImage(ticker, imageUrl);
    }
}

function getTickerImageUrl(ticker, newsList) {
    const matchingStory = newsList.find(function (newsStory) {
        return newsStory.tickers.includes(ticker);
    });
    if(matchingStory) {
        return matchingStory.image_url;
    
    } else {
        return getTickerImages([ticker]);
    
    }
};

function displayTickerImage(ticker, imageUrl) {
    if(imageUrl === "") return;
    $(`#${ticker} img`).attr("src", imageUrl)
};

function getTrending() {
    fetch(`https://financialmodelingprep.com/api/v3/stock/actives?apikey=${fmpApiKey}`)
        .then(response => response.json())
        .then(data => displayActiveStockList(data.mostActiveStock));
};

function displayActiveStockList(activeStockList) {
    let tickers = activeStockList.map(stock => stock.ticker);
    activeStockList.sort((stockA, stockB) => {
        const stockAChanges = percentChangeToDecimal(stockA.changesPercentage)               
        const stockBChanges = percentChangeToDecimal(stockB.changesPercentage)
        if(stockAChanges > stockBChanges) {
            return -1;
        }   else {
            return 1;
        }            
    })
    activeStockList.forEach(stock => displayStock(stock));
    getTickerImages(tickers);
    // console.log(activeStockList);
};

function displayStock(stock) {
    let card = $(`<div id="${stock.ticker}"></div>`);
    card.addClass("card stock-card");
    card.click(() => handleStockClick(stock.ticker));

    const divider = $(`<div class="card-divider card-header"></div>`);
    const companyName = $(`<a class="company-name" href="./single-stock.html?name=${stock.companyName}&symbol=${stock.ticker}"> <span>${stock.companyName}</span> </br> <span class="stock-symbol"> ${stock.ticker}</span> </a>`);
    const stockDetails = $(`<div class="stock-details"></div>`);
    const stockPrice = $(`<span class="stock-price"> ${stock.price}</span>`);
    let stockChangesPercentage; 
    let percentChange = percentChangeToDecimal(stock.changesPercentage);
    if(percentChange > 0) {
        stockChangesPercentage = $(`<span class="stock-changes-percentage positive-change"> ${stock.changesPercentage}</span>`);
    } else {
        stockChangesPercentage = $(`<span class="stock-changes-percentage negative-change"> ${stock.changesPercentage}</span>`);
    };
    const stockImage = $(`<img class="stock-image"></img>`);
    divider.append(companyName);
    stockDetails.append(stockPrice);
    stockDetails.append(stockChangesPercentage);
    divider.append(stockDetails);
    card.append(divider);
    card.append(stockImage);
    $("#results-list").append(card);
}

function percentChangeToDecimal(percentChange) {
    percentChange = percentChange.replace("%", "")
    percentChange = percentChange.replace("(", "")
    percentChange = percentChange.replace(")", "")
    return +percentChange;
}

function handleStockClick(ticker) {
    // getNews(["gme", "tsla", "aapl"], 4);
    getNews([ticker], 5);
}

function displayNewsList(newsList) {
    clearNewsList();
    newsList.forEach(newsStory => displayStory(newsStory));
}

function displayStory(newsStory) {
    let listItem = $("<li></li>");
    listItem.html(`<a target="_blank" href="${newsStory.news_url}">${newsStory.title}</a>`);
    $("#news-list").append(listItem);
}

function handleFetchNewsSubmit(e) {
    e.preventDefault();
    let tickerInput = document.querySelector('#symbol');
    getNews([tickerInput.value], 10);
    tickerInput.value = "";

}

function clearNewsList() {
    $("#news-list").empty();
}

function initializePage() {
    $("#news-form").submit(handleFetchNewsSubmit);
    $(document).foundation();
    getTrending();
}