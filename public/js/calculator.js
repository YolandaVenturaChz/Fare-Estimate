/* Declaramos variables */
let originInput,
  destinationInput,
  calculateFareButton,
  passengerDropdown,
  fareEl,
  options,
  originAutocomplete,
  destinationAutocomplete,
  originLatLng,
  destinationLatLng,
  mapEl,
  map,
  breakdownButton,
  breakdownContainer;

/* Función principal al cargar la página */
function initialize() {
  /* Obtenemos elementos del DOM */
  originInput = document.querySelector("#inputOriginAddress");
  destinationInput = document.querySelector("#inputDestinationAddress");
  calculateFareButton = document.querySelector("#buttonCalculateFare");
  passengerDropdown = document.querySelector("#selectPassengersNum");
  fareEl = document.querySelector("#fareEstimate");

  /* Variable que contiene propiedad de Google Maps API para que solo nos devuelva direcciones específicas */
  options = {
    type: ["address"]
  };

  /* Autocompletado de inputs de origen y destino */
  originAutocomplete = new google.maps.places.Autocomplete(
    originInput,
    options
  );
  destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput,
    options
  );
  
  /* Verificamos si input es válido */
  originAutocomplete.addListener("place_changed", () => handleInput(true));
  destinationAutocomplete.addListener("place_changed", () =>
    handleInput(false, true)
  );

  function handleInput(origin = false, dest = false) {
    if (origin) originLatLng = originAutocomplete.getPlace().geometry.location;
    if (dest)
      destinationLatLng = destinationAutocomplete.getPlace().geometry.location;
  }

  /* Agregamos evento click a botón de cálculo */
  calculateFareButton.addEventListener("click", handleFareCalculation);

  originLatLng, destinationLatLng;
  mapEl = document.querySelector("#map");
}

/* Función para calcular tarifa según distancia */
function handleFareCalculation() {
  if (!originLatLng || !destinationLatLng) {
    fareEl.innerText = `Debes llenar todos los campos`;
    return;
  }
  let directionsService = new google.maps.DirectionsService();
  let bounds = new google.maps.LatLngBounds(originLatLng, destinationLatLng);
  let passengers = parseFloat(passengerDropdown.value);

  map = new google.maps.Map(document.getElementById("map"), {
    center: bounds.getCenter(),
    zoom: 14
  });

  let directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  let request = {
    origin: originLatLng,
    destination: destinationLatLng,
    travelMode: "DRIVING"
  };

  let polyline = new google.maps.Polyline({
    path: [originLatLng, destinationLatLng],
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      let miles = response.routes[0].legs[0].distance.value / 1609.344;

      let baseValue = miles > 0.125 ? 5.25 : 2;
      let passengerFee = passengers > 1 ? 1 : 0;
      let adjMiles = baseValue > 2 ? miles - 0.125 : miles;

      let feeEstimate = (baseValue + passengerFee + adjMiles * 2.00)
        .toFixed(2)
        .toLocaleString("en");
      fareEl.innerHTML = `La tarifa aproximada es S/.${feeEstimate}!`;
      let data = {
        estimatedMiles: response.routes[0].legs[0].distance.text,
        estimatedTime: response.routes[0].legs[0].duration.text,
        dispatchFee: baseValue,
        passengerFee,
        airportFee: 'N/A',
        estimatedFare: {
          noTraffic: feeEstimate,
          lightTraffic: (feeEstimate * 1.55).toFixed(2).toLocaleString("en"),
          heavyTraffic: (feeEstimate * 3).toFixed(2).toLocaleString("en")
        }
      };
    }
  });
}