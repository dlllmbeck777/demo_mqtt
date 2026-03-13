function colorSvg(values, status, suffix){
  for (let [key, value] of Object.entries(values)){
    try{
      document.getElementById(`svg-${key}${suffix}`).getElementsByClassName('svg-content')[0].getElementsByClassName('PUMP')[0].getElementsByClassName('content')[0].setAttribute("fill", value['PUMP'][0]['color'])
      document.getElementById(`svg-${key}${suffix}`).getElementsByClassName('svg-content')[0].getElementsByClassName('BEARING_x5F_UNIT')[0].getElementsByClassName('content')[0].setAttribute("fill", value['BEARING_x5F_UNIT'][0]['color'])
      document.getElementById(`svg-${key}${suffix}`).getElementsByClassName('svg-content')[0].getElementsByClassName('ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_1')[0].getElementsByClassName('content')[0].setAttribute("fill", value['ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_1'][0]['color'])
      document.getElementById(`svg-${key}${suffix}`).getElementsByClassName('svg-content')[0].getElementsByClassName('ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_2')[0].getElementsByClassName('content')[0].setAttribute("fill", value['ELECTRIC_x5F_MOTOR_x5F_BEARING_x5F_2'][0]['color'])
      document.getElementById(`svg-${key}${suffix}`).getElementsByClassName('svg-content')[0].getElementsByClassName('ROTOR')[0].getElementsByClassName('content')[0].setAttribute("fill", value['ROTOR'][0]['color'])
      if (status){
        for (let [part, recommend] of Object.entries(value)){
          document.getElementById(`recommend-${part}${suffix}`).innerHTML = recommend[0]['operationalRecommendations'][0]
          document.getElementById(`status-${part}${suffix}`).innerHTML = recommend[0]['possibleStatuses'][0]
          
        }
      }
    }
    catch{
    }
  }
}



function charts(values, suffix){
  console.log(values)
  for (let [key, value] of Object.entries(values)){
    try{
      displayChart(key+suffix, false, value[0], value[1],suffix)
    }
    catch{
    }
  }

}

function updateChart(key, values){
  try{
    document.getElementById("current-"+key).innerHTML = values[0][0].toFixed(2)
    displayChart(key, true, values[0][0], values[1][0])
  }catch{

  }
  
}


function displayChart(prefix, update, value, time, suffix){
  if (update){
    var dispChart
    Chart.helpers.each(Chart.instances, function(instance){
      if (instance.chart.canvas.id === "chart-"+prefix) {
        dispChart = instance.chart
      }
    })
    dispChart.data.labels.shift()
    dispChart.data.labels.push(time)
    dispChart.data.datasets.forEach((dataset) =>{
      dataset.data.shift()
      dataset.data.push(value)
      
    })
    dispChart.update()
  }
  else{
    var speedCanvas = document.getElementById("chart-"+prefix);
    if (suffix=="-fft"){
      var raduis = 0
      var color = "#ef8157"
    }
    else if (suffix=="-prediction"){
      var raduis = 1
      var color = "#fbc658"
    }
    else{
      var raduis = 1
      var color = "#6bd098"
    }
    var data = {
      data: value,
      fill: false,
      borderColor: color,
      backgroundColor: 'transparent',
      pointBorderColor: color,
      pointRadius: raduis,
      pointHoverRadius: 1,
      pointBorderWidth: 8,
    };
    var speedData = {
      labels: time,
      datasets:[data],
      
    };

    var chartOptions = {
      legend: {
        display: false,
        position: 'top',
        },
    };
    
    dispChart = new Chart(speedCanvas, {
      type: 'line',
      hover: true,
      data: speedData,
      options: chartOptions
    });
    
  }
}







