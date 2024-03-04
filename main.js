// Initialize the map centered on Madrid
var map = L.map('map').setView([40.418, -3.704], 16); // Madrid coordinates (latitude, longitude) and zoom level

// Add a tile layer
L.tileLayer('https://tile.jawg.io/d8548ead-a5fa-44e4-a37d-06b2d8e85a5a/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	accessToken: 'Cb2BtuigdhHx4pBPWnZgOKgDKxttfBhCJXU1uW2ti7K3qGBfVLzxowk88cHq3tv3'
}).addTo(map);

// Function to determine style based on feature properties
function getBuildingStyle(feature,zoom) {
  var properties = feature.properties;
  var fill;
  var border;
  var weight = 1;
  var opacity = 1;

  var id_list = ['4726588','4328975','2614014','16322055','4661214','868885682','1609614','75658','549109296','1006252510']
  if (id_list.includes(properties.osm_id) || id_list.includes(properties.osm_way_id)) {
    fill = '#f17170';
    border = 'red';
  }
   else if (properties.place) {
    fill = '#60ca8c';
    border = 'green';

  } else if (properties.leisure) {
    fill = 'none';
    border = 'none';
    weight = 0;
    opacity = 0;
  } else if (properties.historic) {
    fill = '#f17170';
    border = 'red'; 
  } else if (properties.tourism) {
    switch (properties.tourism) {
      case 'museum':
        fill = '#a889c2';
        border = 'purple';
        break;
      case 'attraction':
      case 'artwork':
        fill = '#f17170';
        border = 'red';
        break;
      case 'hotel':
      case 'apartment':
        fill = '#ffdbc5';
        break;
      default:
        fill = '#ededed';
        break;
    }
  } else if (properties.amenity) {
    switch (properties.amenity) {
      case 'monastery':
      case 'theatre':
        fill = '#f17170';
        border = 'red';
        break;
      case 'fountain':
        fill = '#4ac3ff';
        border = 'blue';
        break;
      case 'place_of_worship':
        fill = '#f2d172';
        border = 'orange';
        break;
      case 'community_centre':
      case 'restaurant':
      case 'pub':
      case 'bar':
      case 'nightclub':
      case 'cafe':
      case 'fast_food':
      case 'ice_cream':
        fill = '#fa9b5c';
        break;
      default:
        fill = 'none';
        border = 'none';
        weight = 0;
        opacity = 0;
        break;
      
    }
  } else if (properties.building == 'retail' || properties.building == 'yes' || properties.building == 'hotel' || properties.building == 'commercial' || properties.shop) {
    fill = '#ffdbc5';
  } else if (properties.shop == 'bakery' || properties.building == 'apartments') {
    fill = '#fa9b5c';
  } else if (properties.landuse == 'grass') {
    fill = '#c2e4cb';
  } 
  else if (properties.natural) {
    fill = '#4ac3ff';
  }
  else {
    fill = 'none';
    border = 'none';
    weight = 0;
    opacity = 0;
  }

  if (fill == '#fa9b5c' || fill == '#ffdbc5') {
    if (zoom < 15) {
      fill = 'none';
      border = 'none';
      weight = 0;
      opacity = 0;
    }
  }

  return { fillColor: fill, color: border, weight: weight, fillOpacity: opacity };
}

var currentZoom = map.getZoom();
console.log(currentZoom)

// Define a custom icon with the desired color
// Define a custom icon with the desired color (blue)
// var greenIcon = L.icon({
//     iconUrl: 'palacio.png',

//     iconSize:     [41, 51], // size of the icon
    
// });

// // Create a marker using the custom icon
// L.marker([40.418, -3.7142], {icon: greenIcon}).addTo(map);

// Define a custom icon with text
var palacioIcon = L.icon({iconUrl: 'icons/palacio.png',iconSize: [129,82],iconAnchor: [64.5,82]});

var catedralIcon = L.icon({iconUrl: 'icons/catedral.png',iconSize: [96,100],iconAnchor: [48,100]});
var plazaEspanaIcon = L.icon({iconUrl: 'icons/plaza_de_espana.png',iconSize: [100,85],iconAnchor: [50,85]});
var temploDebodIcon = L.icon({iconUrl: 'icons/templo_de_debod.png',iconSize: [114,82],iconAnchor: [57,82]});
var puertaSolIcon = L.icon({iconUrl: 'icons/puerta_de_sol.png',iconSize: [88,78],iconAnchor: [44,78]});
var plazaMayorIcon = L.icon({iconUrl: 'icons/plaza_mayor.png',iconSize: [80,78],iconAnchor: [40,78]});


L.marker([40.418, -3.7142], {icon: palacioIcon}).addTo(map);
L.marker([40.4157, -3.7144], {icon: catedralIcon}).addTo(map);
L.marker([40.4234, -3.7122], {icon: plazaEspanaIcon}).addTo(map);
L.marker([40.4240, -3.7177], {icon: temploDebodIcon}).addTo(map);
L.marker([40.4170, -3.7034], {icon: puertaSolIcon}).addTo(map);
L.marker([40.4154, -3.7073], {icon: plazaMayorIcon}).addTo(map);



// Load GeoJSON data for buildings
fetch('a.geojson')
    .then(response => response.json())
    .then(data => {
        // Create a layer for buildings
        var buildingsLayer = L.geoJSON(data, {
            style: function (feature) {
              // Call getBuildingStyle with feature and current zoom level
              return getBuildingStyle(feature, currentZoom);
          },
            onEachFeature: function (feature, layer) {
                if (feature.properties && (feature.properties.osm_way_id || feature.properties.osm_id)) {
                    layer.bindPopup("ID: " + (feature.properties.osm_way_id || feature.properties.osm_id));
                }
            }
        }).addTo(map);

        // Event listener for zoom level change
        map.on('zoom', function () {
            var currentZoom = map.getZoom();
            console.log(currentZoom);
            // Check if zoom level is greater than or equal to the desired level
            buildingsLayer.setStyle(function (feature) {
              return getBuildingStyle(feature, currentZoom);
            });
        });
    });
