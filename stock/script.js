async function fetchStockData(symbol, range) {
    const apiKey = 'VZ789EXDIOI5GGF5';
    const functionType = range === '1d' ? 'TIME_SERIES_INTRADAY' : 'TIME_SERIES_DAILY';
    const interval = range === '1d' ? '&interval=5min' : '';
    const apiUrl = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}${interval}&apikey=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    let timeSeriesKey = '';
    if (range === '1d') {
        timeSeriesKey = 'Time Series (5min)';
    } else {
        timeSeriesKey = 'Time Series (Daily)';
    }

    const timeSeries = data[timeSeriesKey];
    const dates = Object.keys(timeSeries);
    const formattedData = dates.map(date => {
        return {
            x: new Date(date),
            y: parseFloat(timeSeries[date]['4. close'])
        };
    });

    return formattedData;
}

async function renderChart(symbol, range) {
    const stockData = await fetchStockData(symbol, range);

    const options = {
        series: [{
            name: `${symbol} Stock Price`,
            data: stockData
        }],
        chart: {
            type: 'line',
            height: 500,
            foreColor: '#fff',
            background: '#121212',
            toolbar: {
                show: true,
                tools: {
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3,
            colors: ['#4CAF50']
        },
        grid: {
            borderColor: '#444'
        },
        title: {
            text: `${symbol} Stock Price (Last ${range})`,
            align: 'center',
            style: {
                color: '#fff',
                fontSize: '20px'
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#fff',
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#fff',
                }
            }
        }
    };

    const chartElement = document.querySelector("#chart");
    chartElement.innerHTML = ''; // Clear the previous chart
    const chart = new ApexCharts(chartElement, options);
    chart.render();
}

document.getElementById('update').addEventListener('click', () => {
    const symbol = document.getElementById('symbol').value;
    const range = document.getElementById('range').value;
    renderChart(symbol, range);
});

document.getElementById('add-stock').addEventListener('click', () => {
    const stockInput = document.getElementById('stock-search');
    const stockSymbol = stockInput.value.trim().toUpperCase();
    if (stockSymbol) {
        const selectedStocks = document.getElementById('selected-stocks');
        const listItem = document.createElement('li');
        listItem.textContent = stockSymbol;
        selectedStocks.appendChild(listItem);
        stockInput.value = ''; // Clear the input field
    }
});

renderChart('AAPL', '1mo'); // Initial chart
