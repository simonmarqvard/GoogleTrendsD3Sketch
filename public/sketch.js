var googleDataValues = [];
var googleDataDates = [];


function initialize() {
  searchWord();
  searchWorldWord()
}


//Take searchword and date from searchcontainer (chessBoardButton) and use in getdata
function searchWord() {
  $('#chessBoardButton').click(function() {
    var inputTerm = $('#inputBox').val();
    $(".selectedSearchWord").empty();
    $(".selectedSearchWord").append(inputTerm);
    $(".info").css("display", "none")

    startDate = $('#startDate').val();
    console.log(startDate)
    console.log(selectedCountry)
    console.log(inputTerm)
    getData(inputTerm);
  })
}

//Take word from global search and use in getworldData
function searchWorldWord() {
  $('#worldbutton').click(function() {
    var worldinputTerm = $('#worldbox').val();
    console.log("YOU CLICKED WORLDSEARCHWORD")
    getWorldData(worldinputTerm);
    console.log(worldinputTerm);
  })
}

//make ajax call to get data from google trends
function getData(inputTerm) {
  console.log(selectedCountry);
  $.ajax({
    //makes request to localhost:2000/trends
    url: "/trends/" + inputTerm + "/" + selectedCountry + "/" + startDate,
    type: 'GET',
    dataType: "json",
    error: function(err) {
      console.log("yikes there's an error" + err);
    },
    success: function(data) {
      console.log("GETTING DATA");
      //    console.log(data.default.timelineData.length)
      for (var i = 0; i < data.default.timelineData.length; i++) {
        googleDataValues[i] = data.default.timelineData[i].value[0];
        // console.log(googleValues[i]);
        googleDataDates[i] = data.default.timelineData[i].formattedAxisTime;
        // console.log(googleDates[i]);
      }
      //use returning values to createChart using chart.js (x: time, y:value)
      createChart(googleDataDates, googleDataValues)
      console.log(selectedCountry)
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
        dataToReturn[i] = {
          val: data.default.geoMapData[i].formattedValue,
          geo: data.default.geoMapData[i].geoCode
        }
      }
      console.log(dataToReturn)
      console.log(countries);
      dataToReturn = dataToReturn.filter(function(d) {
        //d.val[0] because it is in an array
        return d.val[0].length > 0;
      })
      let max = d3.max(dataToReturn, function(d) {
        return Number(d.val[0]);
      });
      console.log(max);
      // let redScale = d3.scaleLinear

      //assign graded color based value
      var color = d3.scale.linear()
        .domain([0, max])
        .range(["white", "orange"]);


      // let country = svg.selectAll("path")
      countries
        .attr("fill", function(d) {
          // dataToReturn.forEach(function(freshD) {
          for (let i = 0; i < dataToReturn.length; i++) {
            let freshD = dataToReturn[i];
            // console.log(d.countryCode)
            // console.log(freshD.geo)
            // console.log(d.countryCode == freshD.geo)
            // console.log("---")
            if (d.countryCode == freshD.geo) {
              // console.log(color(freshD.val[0]));
              return color(Number(freshD.val[0]));
            }
          }

        })
      //     dataToReturn.forEach(function(freshD) {
      //       console.log(freshD)
      //       // if (d.countryCode == freshD.geo) {
      //       //   //   console.log(freshD.val[0]);
      //       //   //   return "red";
      //       //   // }
      //       //
      //       // })
      //
      //
      //     });
      //   });
    }


  })
}


//Create Chart using values from google API
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
