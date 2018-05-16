// Weight History

$(function () {
    var myChart = Highcharts.chart('weight', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Wight Change Throughout The Month'
        },
        yAxis: {
            title: {
                text: 'Weight in Kg'
            }
        },
        series: [{
            name: 'Weight in Kg',
            data: [83.3,84,84.4,83.6,83.6,82.9,83.5,83.7,82.7,82.7,82.3,81.9,83,82.1,82.6,82.1,83.1,83.4,83.3,83,82.9,82.4,83.6,83,83.5,84.4,83.3,83.3,82.8,82.6]
        }]
    });
});