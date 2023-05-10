const ctx1 = document.getElementById('canvas1');
const ctx2 = document.getElementById('canvas2');
var req = new XMLHttpRequest();
var url = "http://localhost:8080/admin/product-stat-json";
req.open("GET", url);
req.send();
req.onreadystatechange = () => {
    if (req.status == 200 && req.readyState == 4) {
        var d = JSON.parse(req.responseText);
        product = d.map((item) => {
            return item.name;
        });
        total = d.map((item) => {
            return item.total;
        });
        amount = d.map((item) => {
            return item.amount;
        });

        const data1 = {
            labels: product,
            datasets: [{
                label: 'Doanh thu',
                data: total,
                borderColor: 'rgba(145, 205, 86)',
                backgroundColor: 'rgba(145, 205, 86, 0.2)',
                borderWidth: 1
            }]
        };
        const c1 = new Chart(ctx1, {
            type: 'bar',
            data: data1,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const data2 = {
            labels: product,
            datasets: [{
                label: 'Số lượng',
                data: amount,
                borderColor: 'rgba(54, 162, 235)',
                backgroundColor: 'rgb(54, 162, 235, 0.2)',
                borderWidth: 1
            }]
        };
        const c2 = new Chart(ctx2, {
            type: 'bar',
            data: data2,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

