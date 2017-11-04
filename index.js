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