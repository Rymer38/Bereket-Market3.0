let products = JSON.parse(localStorage.getItem('products')) || {};
let salesSummary = JSON.parse(localStorage.getItem('salesSummary')) || {
    nakit: 0,
    kart: 0,
    veresiye: 0
};
let currentSaleType = '';
let currentTotalPrice = 0;
let currentTotalProfit = 0;

document.getElementById('nakitSales').textContent = salesSummary.nakit;
document.getElementById('kartSales').textContent = salesSummary.kart;
document.getElementById('veresiyeSales').textContent = salesSummary.veresiye;

function addOrUpdateProduct() {
    const barcode = document.getElementById('barcode').value;
    const price = parseFloat(document.getElementById('price').value);
    const profit = parseFloat(document.getElementById('profit').value);

    if (barcode && !isNaN(price) && !isNaN(profit)) {
        products[barcode] = { price, profit };
        localStorage.setItem('products', JSON.stringify(products));
        alert('Ürün başarıyla eklendi/güncellendi.');
    } else {
        alert('Lütfen tüm alanları doğru doldurun.');
    }
}

function openSalePage(saleType) {
    currentSaleType = saleType.toLowerCase();
    document.getElementById('saleType').textContent = saleType + ' Satışı';
    document.getElementById('salePage').style.display = 'block';
}

function scanProduct() {
    const saleBarcode = document.getElementById('saleBarcode').value;

    if (products[saleBarcode]) {
        currentTotalPrice += products[saleBarcode].price;
        currentTotalProfit += products[saleBarcode].profit;

        document.getElementById('totalPrice').textContent = currentTotalPrice;
        document.getElementById('totalProfit').textContent = currentTotalProfit;
    }
}

function completeSale() {
    if (currentSaleType) {
        salesSummary[currentSaleType] += currentTotalPrice;
        localStorage.setItem('salesSummary', JSON.stringify(salesSummary));

        document.getElementById(currentSaleType + 'Sales').textContent = salesSummary[currentSaleType];

        closeSalePage();
    }
}

function closeSalePage() {
    currentSaleType = '';
    currentTotalPrice = 0;
    currentTotalProfit = 0;
    document.getElementById('totalPrice').textContent = '0';
    document.getElementById('totalProfit').textContent = '0';
    document.getElementById('saleBarcode').value = '';
    document.getElementById('salePage').style.display = 'none';
}

function saveDailyData() {
    salesSummary = { nakit: 0, kart: 0, veresiye: 0 };
    localStorage.setItem('salesSummary', JSON.stringify(salesSummary));

    document.getElementById('nakitSales').textContent = '0';
    document.getElementById('kartSales').textContent = '0';
    document.getElementById('veresiyeSales').textContent = '0';

    alert('Günlük satış verileri kaydedildi ve sıfırlandı.');
}

function startBarcodeScanner() {
    Quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream",
            target: document.querySelector('#interactive')    // Video akışını burada gösterecek
        },
        decoder : {
            readers : ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "i2of5_reader", "2of5_reader", "code_93_reader"]
        }
    }, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Quagga is ready.");
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        let code = result.codeResult.code;
        document.getElementById('barcode').value = code;
        document.getElementById('saleBarcode').value = code;
        alert('Barkod Okundu: ' + code);
        Quagga.stop(); // Tarayıcıyı durdur
    });
}


