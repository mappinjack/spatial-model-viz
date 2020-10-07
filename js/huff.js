var ct_centroids = []

function loadCtCentroids() {
    var i;
    for (i = 0; i < to_cts["features"].length; i++) {
        var feature = to_cts["features"][i];
        ct_centroids.push(turf.centroid(feature["geometry"], feature["properties"]))
    }}

loadCtCentroids()

function calcHuff() {
    var storePoints = []
    var colours = []
    var storeSizes = []
    var cts = []
    var attractivenessExponent = document.getElementById('huff-att-exponent').valueAsNumber
    var distanceExponent = document.getElementById('huff-dist-exponent').valueAsNumber
    var i;
    for (i = 0; i < stores.length; i++) {
        var latlng = stores[i]["store"].getLatLng();
        var store = document.getElementById("store".concat(i.toString()))
        var fontSize = parseInt(store.style.fontSize.replace("px", ""))
        var props = {"colour": stores[i]["colour"], "size": fontSize} // TODO update with store size
        var storePoint = turf.point([latlng["lng"], latlng["lat"]], props)
        storePoints.push(storePoint)
        colours.push(stores[i]["colour"])
    }
    var i;
    for (i = 0; i < ct_centroids.length; i++) {
        var j;
        var vals = []
        to_cts["features"][i].properties.probability = 0
        for (j = 0; j < storePoints.length; j++) {
            dist = turf.distance(ct_centroids[i], storePoints[j])
            size = storePoints[j].properties.size
            vals.push(Math.pow(size, attractivenessExponent) / Math.pow(dist, distanceExponent))
        }

        var j;
        for (j = 0; j < vals.length; j++) {
            
            storeVal = vals[j]
            sumVals = vals.reduce((a, b) => a + b, 0)
            p = storeVal / sumVals

            if (p > to_cts["features"][i].properties.probability) {
                to_cts["features"][i].properties.probability = p
                to_cts["features"][i].properties.colour = storePoints[j].properties.colour
            }
        }

    }
    
    map.removeLayer(ct_layer)
    ct_layer = L.geoJSON(to_cts, {style: huffStyle}).addTo(map)
    
}

function huffStyle(feature) {
    return {
        fillColor: feature.properties.colour,
        weight: 0.8,
        opacity: 0.9,
        color: 'white',
        dashArray: '1',
        fillOpacity: styleOpacity(feature.properties.probability)
    };
}

function styleOpacity(probability) {
    if (probability >= 0.7) {
        return 0.85
    }
    else if (probability <= 0.2) {
        return probability
    }
    return probability

}