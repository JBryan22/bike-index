import { Bike } from './../js/bike-index.js';
import { BikeManager } from './../js/bike-manager.js';

let bikeManager = new BikeManager();
let geocodeArray = [];


$(document).ready(function() {

  $('#bike-search').submit(function(event) {

function geolocationError(positionError) {
  alert(positionError);
}

    event.preventDefault();
    let location = $('#location').val();
    $('#location').val("");
    let distance = $('#distance').val();
    $('#distance').val("");
    let serial = $('#serial').val();
    $('#serial').val("");
    let manufacturer = $('#manufacturer').val();
    $('#manufacturer').val("");
    let resultsPerPage= $('#results-per-page').val();
    let page = 1;

    let bikePromise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://bikeindex.org/api/v3/search?page=${page}&per_page=${resultsPerPage}&location=${location}&distance=${distance}&stolenness=stolen&manufacturer=${manufacturer}&serial=${serial}`;

      console.log(url);

      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      };
      request.open("GET", url, true);
      request.send();
    });

    bikePromise.then(function(response) {

      let body = JSON.parse(response);


    for (var i = 0; i < body.bikes.length; i++) {

      if (body.bikes[i].date_stolen){
        let date_stolen = new Date(Date.now() - body.bikes[0].date_stolen);
      }
      else {
        date_stolen = Date.now();
      }

      let newBike = new Bike(body.bikes[i].title, body.bikes[i].stolen_location, body.bikes[i].serial, body.bikes[i].frame_model, body.bikes[i].year, body.bikes[i].thumb);
      bikeManager.bikeList.push(newBike);
    }
    console.log("geocode stolen location");
    bikeManager.geocodeStolenLocation();
  //  console.log(bikeManager.geocodeStolenLocation());

    // geocodeArray = bikeManager.geocodeStolenLocation();
      // for (var i = 0; i < body.bikes.length; i++) {
      //   $('.output').append(`<div class = 'panel panel-default'>
      //   <div class = 'panel-heading'>${body.bikes[i].title}</div>
      //   <div class = 'panel-body'>
      //   <p>Stolen Location: ${body.bikes[i].stolen_location}</p>
      //   <p>Serial: ${body.bikes[i].serial}</p>
      //   <p>Frame Model: ${body.bikes[i].frame_model}</p>
      //   <p>Year: ${body.bikes[i].year}</p>
      //   <p><img src = '${body.bikes[i].thumb}'></p>
      //   </div>
      //    </div>`);
      // }
    }, function(error) {
      $('.output').text(`There was an error! ${error.message}` );
    });




  });
});
