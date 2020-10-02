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
    var attractivenessExponent = 2
    var i;
    for (i = 0; i < stores.length; i++) {
        var latlng = stores[i]["store"].getLatLng();
        var props = {"colour": stores[i]["colour"], "size": 48} // TODO update with store size
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
            vals.push(size / Math.pow(dist, 2))
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
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}