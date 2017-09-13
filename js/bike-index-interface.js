import { Bike } from './../js/bike-index.js';
import { BikeManager } from './../js/bike-manager.js';



  let bikeManager = new BikeManager();

$(document).ready(function() {
  $('#bike-search').submit(function(event) {

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

    // function initMap() {
    // var seattle = {lat: 47.6062, lng: -122.3321};
    // var map = new google.maps.Map(document.getElementById('map'), {
    //   zoom: 2,
    //   center: seattle
    // });

    let bikePromise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://bikeindex.org/api/v3/search?page=${page}&per_page=${resultsPerPage}&location=${location}&distance=${distance}&stolenness=stolen&manufacturer=${manufacturer}&serial=${serial}`;

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

     let date_stolen = new Date(Date.now() - body.bikes[0].date_stolen);

    for (var i = 0; i < body.bikes.length; i++) {
      let newBike = new Bike(body.bikes[i].title, body.bikes[i].stolen_location, body.bikes[i].serial, body.bikes[i].frame_model, body.bikes[i].year, body.bikes[i].thumb);
      bikeManager.bikeList.push(newBike);
    }
    console.log(bikeManager.geocodeStolenLocation());

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

    let geocodeArray = bikeManager.geocodeStolenLocation();


    let mapPromise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDuwgqvulGnPbB7kk6HnQs_6opp4psA5Bc&callback=initMap`;
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

    mapPromise.then(function(response) {

      function initMap() {

        var seattle = {lat: 47.6062, lng: -122.3321};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: seattle
        });

        console.log("bike manager" + bikeManager);
         geocodeArray = bikeManager.geocodeStolenLocation();
        for (var i = 0; i < geocodeArray; i++) {
          var marker = new google.maps.Marker({
          position: geocodeArray[i],
          map: map
          });
        }
      }

      $(".tempScripts").text("");
     $("body").append(`<script class="tempScripts"id="mapScript" async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuwgqvulGnPbB7kk6HnQs_6opp4psA5Bc&callback=initMap">
  </script>`);
  $("body").append(`<script class="tempScripts">${initMap}</script>`
  );
  //eval($("#mapScript").text());
    // eval(response);
    }, function(error) {
      $('.output').text(`There was an error! ${error.message}` );
    });

  });
});
