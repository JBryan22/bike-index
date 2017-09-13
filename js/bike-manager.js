export class BikeManager{
  constructor() {
    this.bikeList = [];

  }

  myUselessFunction() {
    let total = 0;
    for (var i = 0; i < this.bikeList.length; i++) {
      total += this.bikeList[i].year;
    }
    return total;
  }

  geocodeStolenLocation(){
    const geocodeArray = [];
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
      //  console.log("lat: " + latitude +" long: " + long);
      }, function(error) {
        $('.output').text(`There was an error! ${error.message}` )
      });
      }

    }
    return geocodeArray;
  }

}
