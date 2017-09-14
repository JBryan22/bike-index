let geocodeArray;

export class BikeManager{
  constructor() {
    this.bikeList = [];
  }

locateUser() {
  this.bikeList = [];

  $('#map').text("");
  // If the browser supports the Geolocation API
  if (navigator.geolocation){
    var positionOptions = {
      enableHighAccuracy: true,
      timeout: 10 * 1000 // 10 seconds
    };
    navigator.geolocation.getCurrentPosition(this.geolocationSuccess, this.geolocationError, positionOptions);

  }
  else {
    alert("Your browser doesn't support the Geolocation API");
  }
}

geolocationSuccess(position) {
  var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
var test;
  var myOptions = {
    zoom : 4,
    center : userLatLng,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };
  console.log(geocodeArray);
  var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);

  for (var i = 0; i < geocodeArray.length; i++) {

    if (geocodeArray[i]){
      let newMarker = new google.maps.LatLng(geocodeArray[i].lat, geocodeArray[i].lng);
      new google.maps.Marker({
        map: mapObject,
        position: newMarker
      });
    }

  }



}

  geocodeStolenLocation(){
    let that = this;
    geocodeArray = [];
    for (var i = 0; i < this.bikeList.length; i++) {
      let address = this.bikeList[i].stolen_location;
      if(this.bikeList[i].stolen_location)
      {
        let latitude;
        let long;
        let promise = new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        let url = `    https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA2_X4oJGXm3QSt_cU2BAcHwkEk_8Nqnk4`;
        request.onload = function() {
          if (this.status === 200) {
            resolve(request.response);
          } else {
            reject(Error(request.statusText));
          }
        }
        request.open("GET", url, true);
        request.send();
      });

      promise.then(function(response) {
        let body = JSON.parse(response);
        latitude = body.results[0].geometry.location.lat;
        long = body.results[0].geometry.location.lng;
        geocodeArray.push({lat: latitude, lng: long});
        console.log(geocodeArray.length);
        //draw map/place markers on last coordinate found
        if (geocodeArray.length === that.bikeList.length){
          that.locateUser();
        }


      //  console.log("lat: " + latitude +" long: " + long);
      }, function(error) {

        $('.output').text(`There was an error! ${error.message}` )
      });
      }
      else{
        geocodeArray.push(null);
      }

    }
    return geocodeArray;
  }

}
