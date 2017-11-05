var NEIGHBORS = 6;

latlng = {
    'Alabama': {lat:32.806671, lng:-86.79113},
    'Alaska': {lat:61.370716, lng:-152.404419},
    'Arizona': {lat:33.729759, lng:-111.431221},
    'Arkansas': {lat:34.969704, lng:-92.373123},
    'California': {lat:36.116203, lng:-119.681564},
    'Colorado': {lat:39.059811, lng:-105.311104},
    'Connecticut': {lat:41.597782, lng:-72.755371},
    'Delaware': {lat:39.318523, lng:-75.507141},
    'Florida': {lat:27.766279, lng:-81.686783},
    'Georgia': {lat:33.040619, lng:-83.643074},
    'Hawaii': {lat:21.094318, lng:-157.498337},
    'Idaho': {lat:44.240459, lng:-114.478828},
    'Illinois': {lat:40.349457, lng:-88.986137},
    'Indiana': {lat:39.849426, lng:-86.258278},
    'Iowa': {lat:42.011539, lng:-93.210526},
    'Kansas': {lat:38.5266, lng:-96.726486},
    'Kentucky': {lat:37.66814, lng:-84.670067},
    'Louisiana': {lat:31.169546, lng:-91.867805},
    'Maine': {lat:44.693947, lng:-69.381927},
    'Maryland': {lat:39.063946, lng:-76.802101},
    'Massachusetts': {lat:42.230171, lng:-71.530106},
    'Michigan': {lat:43.326618, lng:-84.536095},
    'Minnesota': {lat:45.694454, lng:-93.900192},
    'Mississippi': {lat:32.741646, lng:-89.678696},
    'Missouri': {lat:38.456085, lng:-92.288368},
    'Montana': {lat:46.921925, lng:-110.454353},
    'Nebraska': {lat:41.12537, lng:-98.268082},
    'Nevada': {lat:38.313515, lng:-117.055374},
    'New Hampshire': {lat:43.452492, lng:-71.563896},
    'New Jersey': {lat:40.298904, lng:-74.521011},
    'New Mexico': {lat:34.840515, lng:-106.248482},
    'New York': {lat:42.165726, lng:-74.948051},
    'North Carolina': {lat:35.630066, lng:-79.806419},
    'North Dakota': {lat:47.528912, lng:-99.784012},
    'Ohio': {lat:40.388783, lng:-82.764915},
    'Oklahoma': {lat:35.565342, lng:-96.928917},
    'Oregon': {lat:44.572021, lng:-122.070938},
    'Pennsylvania': {lat:40.590752, lng:-77.209755},
    'Rhode Island': {lat:41.680893, lng:-71.51178},
    'South Carolina': {lat:33.856892, lng:-80.945007},
    'South Dakota': {lat:44.299782, lng:-99.438828},
    'Tennessee': {lat:35.747845, lng:-86.692345},
    'Texas': {lat:31.054487, lng:-97.563461},
    'Utah': {lat:40.150032, lng:-111.862434},
    'Vermont': {lat:44.045876, lng:-72.710686},
    'Virginia': {lat:37.769337, lng:-78.169968},
    'Washington': {lat:47.400902, lng:-121.490494},
    'West Virginia': {lat:38.491226, lng:-80.954453},
    'Wisconsin': {lat:44.268543, lng:-89.616508},
    'Wyoming': {lat:42.755966, lng:-107.30249}
};

coeffs = [
    -1,
    -0.2,
    -2,
    0.6,
    1.5,
    0.6,
    -0.5,
    0.2,
    -0.2,
    -0.2,
    2.5
];

function getStates(state) {

    var lat = latlng[state].lat;
    var lng = latlng[state].lng;
    var retVal = {};
    //var lat_delta = Math.sqrt(getArea({})[state]) / LAT_DELTA;
    //var lng_delta = Math.sqrt(getArea({})[state]) / LNG_DELTA;
    var dists = {};
    for (var key in latlng) {
        dists[key] = Math.sqrt(
            Math.pow(latlng[key].lat - lat, 2) +
            Math.pow(latlng[key].lng - lng, 2)
        );
        /*if (latlng[key].lat > lat - lat_delta && latlng[key].lat < lat + lat_delta) {
            if (latlng[key].lng > lng - lng_delta && latlng[key].lng < lng + lng_delta) {
                retVal[key] = latlng[key];
            }
        }*/
    }
    var distVals = Object.keys(dists).map(function(key){
        return [dists[key], key];
    });
    distVals.sort(function(a, b) { return a[0] - b[0]; });
    for (var i = 0; i < NEIGHBORS; i++) {
        retVal[distVals[i][1]] = latlng[distVals[i][1]];
    }
    return retVal;
}

function runAlg(state) {

    states = getStates(state);
    var retVal = {};
    for (var y in states) {
        retVal[y] = states[y];
        retVal[y].magnitude = getMagnitude(state, y);
    }
    return retVal;
}

function getMagnitude(x, y) {

    var rates = [];
    rates[0] = calculateRate(getCostOfLivingPoints({})[x], getCostOfLivingPoints({})[y]);
    rates[1] = calculateRate(getReligionPoints({})[x], getReligionPoints({})[y]);
    rates[2] = calculateRate(getUnemploymentPoints({})[x], getUnemploymentPoints({})[y]);
    rates[3] = calculateRate(getIncomePoints({})[x], getIncomePoints({})[y]);
    rates[4] = calculateRate(getGradRatePoints({})[x], getGradRatePoints({})[y]);
    rates[5] = calculateRate(getMinWagePoints({})[x], getMinWagePoints({})[y]);
    rates[6] = calculateRate(getSalesTaxPoints({})[x], getSalesTaxPoints({})[y]);
    rates[7] = calculateRate(getStemRatePoints({})[x], getStemRatePoints({})[y]);
    rates[8] = calculateRate(getLgbtCrimesPoints({})[x], getLgbtCrimesPoints({})[y]);
    rates[9] = calculateRate(getRaceCrimesPoints({})[x], getRaceCrimesPoints({})[y]);
    rates[10] = calculateRate(getJobsPoints({})[x], getJobsPoints({})[y]);
    var m = linearComb(rates);
    return m;
}

// rates - array
function linearComb(rates) {

    var retVal = 0;
    for (var n = 0; n < rates.length; n++) {
        retVal += rates[n] * coeffs[n];
    }
    return retVal;
}

function calculateRate(k, h) {

    return (k - h) / ((k + h) / 2.0);
}