var map;

var outlier = [0, 0, 0];

var lineSymbol = {
  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
};

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
  "raceCrimes": getRaceCrimesPoints
};

coloration = {};

function createPolygonWithLabel(map, label, points) {

      // The state outline polygon, drawn by coordinates..
      var col = lerpColor([coloration[label], coloration["Minimum"], coloration["Maximum"]], [153, 0, 0], [0, 153, 0]);
      console.log("rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")");
      var polygon = new google.maps.Polygon({
          fillColor: "rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")",
          fillOpacity: 0.35,
          map: map,
          paths: points,
          strokeColor: "rgb(" + col[0] + ", " + col[1] + ", " + col[2] + ")",
          strokeOpacity: 0.5,
          strokeWeight: 1
      });

      // When the mouse moves within the polygon, display the label and change the BG color.
      google.maps.event.addListener(polygon, "mousemove", function(event) {
        polygon.setOptions({
            fillOpacity: 0.5
        });
    });

    // WHen the mouse moves out of the polygon, hide the label and change the BG color.
    google.maps.event.addListener(polygon, "mouseout", function(event) {
        polygon.setOptions({
            fillOpacity: 0.35
        });
    });

    return polygon;
}

function setupMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: {lat: 39.7334, lng: -98.7481}
  });

  var line = new google.maps.Polyline({
    path: [{lat: 32.806671, lng: -86.79113}, {lat: 61.370716, lng: -152.404419}],
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
    map: map
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
    console.log(val);
    coloration = dataMap[val](coloration);
    setupMap();
  });
});