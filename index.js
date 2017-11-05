var map, heatmap;
var radius = 75;

initMap = function() {

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: {lat: 39.7334, lng: -98.7481}
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getCostOfLivingPoints(),
    radius: radius
  });
  heatmap.setMap(map);
};

dataMap = {
  "costOfLiving": getCostOfLivingPoints/*,
  "religion": getReligionPoints,
  "unemployment": getUnemploymentPoints,
  "income": getIncomePoints,
  "gradRate": getGradRatePoints,
  "minWage": getMinWagePoints,
  "salesTax": getSalesTaxPoints,
  "stemRate": getStemRatePoints,
  "lgbtCrimes": getLgbtCrimesPoints,
  "raceCrimes": getRaceCrimesPoints,*/
};

$(document).ready(function() {

  initMap();
  $("#data-options").change(function(data) {
    var val = $(this).val();
    heatmap.setMap(null);
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: dataMap[val],
      radius: radius
    });
    heatmap.setMap(map);
  });
})


function createPolygonWithLabel(map, label, points) {

      // The state outline polygon, drawn by coordinates..
      var polygon = new google.maps.Polygon({
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          paths: points   ,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3
      });

      // The label that pops up when the mouse moves within each polygon.
      /*var marker = new MarkerWithLabel({
          labelContent: label,
          labelClass: 'label',
          labelStyle: {
              opacity: 1.0
          },
          position: new google.maps.LatLng(0, 0),  // a LatLng is required
          draggable: false,
          raiseOnDrag: false,
          map: map,
          icon: 'http://placehold.it/1x1',  // disable marker pin icon
          visible: false
      });*/

      // When the mouse moves within the polygon, display the label and change the BG color.
      google.maps.event.addListener(polygon, "mousemove", function(event) {
        //marker.setPosition(event.latLng);
        //marker.setVisible(true);
        polygon.setOptions({
            fillColor: "#00FF00"
        });
    });

    // WHen the mouse moves out of the polygon, hide the label and change the BG color.
    google.maps.event.addListener(polygon, "mouseout", function(event) {
        //marker.setVisible(false);
        polygon.setOptions({
            fillColor: "#FF0000"
        });
    });

    return polygon;
}

function initialize() {
    var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(23, -101),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        },
        map = new google.maps.Map(document.getElementById('map'),  mapOptions),
        j;

    for (var i = 0; i < stateCoords.length; i++) {

        var coords = [],
            label = stateCoords[i][0],
            points = stateCoords[i][1];

        for (j = 0; j < points.length; j++) {
            coords.push(
                new google.maps.LatLng(points[j][0], points[j][1])
            )
        }
        createPolygonWithLabel(map, label, coords);
    }
}

google.maps.event.addDomListener(window, 'load', initialize);
