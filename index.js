var map;

var outlier = [0, 0, 0];

dataMap = {
  "costOfLiving": getCostOfLivingPoints,
  "religion": getReligionPoints,
  "unemployment": getUnemploymentPoints,
  "income": getIncomePoints,
  "gradRate": getGradRatePoints,
  "minWage": getMinWagePoints,
  "salesTax": getSalesTaxPoints,
  "stemRate": getStemRatePoints,
  "lgbtCrimes": getLgbtCrimesPoints,
  "raceCrimes": getRaceCrimesPoints,
  "jobs": getJobsPoints
};

coloration = {};

function createPolygonWithLabel(map, label, points) {

      // The state outline polygon, drawn by coordinates..
      var col = lerpColor([coloration[label], coloration["Minimum"], coloration["Maximum"]], [255, 128, 255], [51, 153, 255]);
      var polygon = new google.maps.Polygon({
          fillColor: "rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")",
          fillOpacity: 0.4,
          map: map,
          paths: points,
          strokeColor: "rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")",
          strokeOpacity: 0.6,
          strokeWeight: 1
      });

      // When the mouse moves within the polygon, display the label and change the BG color.
      google.maps.event.addListener(polygon, "mousemove", function(event) {
        polygon.setOptions({
            fillOpacity: 0.6
        });
    });

    // WHen the mouse moves out of the polygon, hide the label and change the BG color.
    google.maps.event.addListener(polygon, "mouseout", function(event) {
        polygon.setOptions({
            fillOpacity: 0.4
        });
    });

    return polygon;
}

function setupMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: {lat: 39.7334, lng: -98.7481}
  });

  for (var i = 0; i < stateCoords.length; i++) {

    var coords = [],
    label = stateCoords[i][0],
    points = stateCoords[i][1];

    for (j = 0; j < points.length; j++) {
      coords.push(new google.maps.LatLng(points[j][0], points[j][1]));
    }
    createPolygonWithLabel(map, label, coords);
  }
}

function initialize() {

  coloration = {
    "Alabama": "#FF0000",
    "Alaska": "#FF0000",
    "Arizona": "#FF0000",
    "Arkansas": "#FF0000",
    "California": "#FF0000",
    "Colorado": "#FF0000",
    "Connecticut": "#FF0000",
    "Delaware": "#FF0000",
    "District of Columbia": "#FF0000",
    "Florida": "#FF0000",
    "Georgia": "#FF0000",
    "Hawaii": "#FF0000",
    "Idaho": "#FF0000",
    "Illinois": "#FF0000",
    "Indiana": "#FF0000",
    "Iowa": "#FF0000",
    "Kansas": "#FF0000",
    "Kentucky": "#FF0000",
    "Louisiana": "#FF0000",
    "Maine": "#FF0000",
    "Maryland": "#FF0000",
    "Massachusetts": "#FF0000",
    "Michigan": "#FF0000",
    "Minnesota": "#FF0000",
    "Mississippi": "#FF0000",
    "Missouri": "#FF0000",
    "Montana": "#FF0000",
    "Nebraska": "#FF0000",
    "Nevada": "#FF0000",
    "New Hampshire": "#FF0000",
    "New Jersey": "#FF0000",
    "New Mexico": "#FF0000",
    "New York": "#FF0000",
    "North Carolina": "#FF0000",
    "North Dakota": "#FF0000",
    "Ohio": "#FF0000",
    "Oklahoma": "#FF0000",
    "Oregon": "#FF0000",
    "Pennsylvania": "#FF0000",
    "Rhode Island": "#FF0000",
    "South Carolina": "#FF0000",
    "South Dakota": "#FF0000",
    "Tennessee": "#FF0000",
    "Texas": "#FF0000",
    "Utah": "#FF0000",
    "Vermont": "#FF0000",
    "Virginia": "#FF0000",
    "Washington": "#FF0000",
    "West Virginia": "#FF0000",
    "Wisconsin": "#FF0000",
    "Wyoming": "#FF0000",
    "Minimum": 0,
    "Maximum": 1
  };

  coloration = getCostOfLivingPoints(coloration);

  setupMap();
}

// val: (val, min, max) tuple
// rgbmin: (r, g, b) tuple
// rgbmax: (r, g, b) tuple
lerpColor = function(val, rgbmin, rgbmax) {

  if (val[0] < val[1] || val[0] > val[2]) {
    return outlier;
  }
  retval = [0, 0, 0];
  retval[0] = parseInt((((val[0] - val[1]) / (val[2] - val[1])) * (rgbmax[0] - rgbmin[0])) + rgbmin[0]);
  retval[1] = parseInt((((val[0] - val[1]) / (val[2] - val[1])) * (rgbmax[1] - rgbmin[1])) + rgbmin[1]);
  retval[2] = parseInt((((val[0] - val[1]) / (val[2] - val[1])) * (rgbmax[2] - rgbmin[2])) + rgbmin[2]);
  return retval;
};

$(document).ready(function() {
  
  initialize();
  $("#data-options").change(function(data) {
    var val = $(this).val();
    coloration = dataMap[val](coloration);
    setupMap();
  });
  $("#states").change(function() {
    var state = $(this).val();
    // TODO: Get values from slider to put them in here
    var c = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
    data = runAlg(state, c);
    setupMap();

    var posMax = 0;
    var negMax = 0;
    for (var key in data) {
      if (data[key].magnitude > 0 && data[key].magnitude > posMax) {
        posMax = data[key].magnitude;
      }
      if (data[key].magnitude < 0 && data[key].magnitude < negMax) {
        negMax = data[key].magnitude;
      }
    }

    for (var key in data) {

      if (data[key].magnitude > 0) {
        var col = lerpColor([data[key].magnitude, 0, posMax], [127.5, 127.5, 0], [255, 0, 0]);
        var lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          geodesic: true,
          strokeColor: "rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")",
          strokeOpacity: 1.0,
          strokeWeight: 3
        };
        var line = new google.maps.Polyline({
          path: [{lat: data[key].lat, lng: data[key].lng}, {lat: data[state].lat, lng: data[state].lng}],
          icons: [{
            icon: lineSymbol,
            offset: '50%'
          }],
          map: map
        });
      }

      if (data[key].magnitude < 0) {
        var col = lerpColor([data[key].magnitude, negMax, 0], [0, 255, 0], [127.5, 127.5, 0]);
        var lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          geodesic: true,
          strokeColor: "rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")",
          strokeOpacity: 1.0,
          strokeWeight: 3
        };
        var line = new google.maps.Polyline({
          path: [{lat: data[state].lat, lng: data[state].lng}, {lat: data[key].lat, lng: data[key].lng}],
          icons: [{
            icon: lineSymbol,
            offset: '50%'
          }],
          map: map
        });
      }
    }

  });
});