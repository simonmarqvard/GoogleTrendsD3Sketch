var googleDataValues = [];
var googleDataDates = [];


function initialize() {
  searchWord();
  searchWorldWord()
}

function searchWord() {
  $('#chessBoardButton').click(function() {
    var inputTerm = $('#inputBox').val();
    $(".selectedSearchWord").empty();
    $(".selectedSearchWord").append(inputTerm);
    $(".info").css("display", "none")

    startDate = $('#startDate').val();
    console.log(startDate)

    getData(inputTerm);
  })
}


function searchWorldWord() {
  $('#worldbutton').click(function() {
    var worldinputTerm = $('#worldbox').val();
    console.log("YOU CLICKED WORLDSEARCHWORD")
    getWorldData(worldinputTerm);
    console.log(worldinputTerm);
  })
}


function getData(inputTerm) {
  console.log(selectedCountry);
  $.ajax({
    //makes request to localhost;2000/trends
    url: "/trends/" + inputTerm + "/" + selectedCountry + "/" + startDate,
    type: 'GET',
    dataType: "json",
    error: function(err) {
      console.log("yikes there's an error" + err);
    },
    success: function(data) {
      console.log(data);
      console.log(data.default.timelineData.length)
      for (var i = 0; i < data.default.timelineData.length; i++) {
        googleDataValues[i] = data.default.timelineData[i].value[0];
        // console.log(googleValues[i]);
        googleDataDates[i] = data.default.timelineData[i].formattedAxisTime;
        // console.log(googleDates[i]);
      }
      // let googleDates = googleDates.toString();
      // let googleValuesSplit = googleValues.split(",");
      console.log(googleDataDates);
      console.log(googleDataValues);
      createChart(googleDataDates, googleDataValues)
    }
  })
}

let dataToReturn = []

function getWorldData(worldinputTerm) {
  $.ajax({
    //makes request to localhost;2000/trends
    url: "/trends/" + worldinputTerm,
    type: 'GET',
    dataType: "json",
    async: false,
    error: function(err) {
      console.log("yikes there's an error" + err);
    },
    success: function(data) {
      //  console.log(data)
      for (var i = 0; i < data.default.geoMapData.length; i++) {
        dataToReturn[i] = [{
          val: data.default.geoMapData[i].formattedValue,
          geo: data.default.geoMapData[i].geoCode
        }]
      }
      let country = svg.selectAll("path")
        .attr("fill", "green")
    }
  });
}



function createChart(xData, yData) {

  $(".chart").empty();
  $(".chart").append('<canvas id="myChart"></canvas>')
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xData,
      datasets: [{
        label: '# of Votes',
        data: yData,
        backgroundColor: [
          'rgba(255, 255, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 165, 0,1)',
        ],
        borderWidth: 3
      }]
    },
    options: {
      elements: {
        point: {
          radius: 0
        }
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            display: false,
            beginAtZero: true
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            display: true,
            beginAtZero: true
          }
        }]
      }
    }
  });
}
