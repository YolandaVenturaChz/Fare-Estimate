
let latitude = void 0,
  longitude = void 0;
function initMap() {
  let directionsService = new google.maps.DirectionsService;
  let directionsDisplay = new google.maps.DirectionsRenderer;
  let location = {lat: -12.0431800,lng: -77.0282400 }
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: location
  });

  const marker = new google.maps.Marker({
    position:location,
    map: map,
    animation: google.maps.Animation.DROP,
    draggable: true,
    icon: "assets/images/carr.png"

  });

  let departure = document.getElementById('departure');
  let finalize = document.getElementById('finalize');

  new google.maps.places.Autocomplete(departure);
  new google.maps.places.Autocomplete(finalize);


 const calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
    directionsService.route({
      origin: departure.value,
      destination: finalize.value,
      travelMode: 'DRIVING'
    }, function (response, status) {(status === 'OK') ?directionsDisplay.setDirections(response): window.alert('Ingrese direcciones validas');
    });

  }
  directionsDisplay.setMap(map);

  const onChangeHandler = () => {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('search').addEventListener('click', onChangeHandler);
  document.getElementById('search').addEventListener('click', function () {
   onChangeHandler ?( departure.value = '' , finalize.value = '') :alert('hola');
  });

}
const error = (_error) => {
  alert('Tenemos problemas para encontrar tu ubicación.');
};