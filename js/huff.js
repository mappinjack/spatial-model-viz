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
    var attractivenessExponent = $('#huff-att-exponent')[0].valueAsNumber
    var distanceExponent = $('#huff-dist-exponent')[0].valueAsNumber
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
        to_cts["features"][i].properties.storeprobs = []
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
                to_cts["features"][i].properties.probability = p.toFixed(4)
                to_cts["features"][i].properties.colour = storePoints[j].properties.colour
            }
            to_cts["features"][i].properties.storeprobs.push([p, storePoints[j].properties.colour])
        }
        to_cts["features"][i].properties.storeprobs = to_cts["features"][i].properties.storeprobs.sort(function(a, b) {
            return b[0] - a[0];
          });

    }
    
    map.removeLayer(ct_layer)
    ct_layer = L.geoJSON(to_cts, {style: huffStyle, onEachFeature: onEachFeature}).addTo(map)
    
    
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
    else if (probability <= 0.1) {
        return 0.1
    }
    return probability

}

function highlightCT(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    huffInfo.update(layer.feature.properties);
}

function resetHighlight(e) {
    ct_layer.resetStyle(e.target);
    huffInfo.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightCT,
        mouseout: resetHighlight
    });
}

var huffInfo = L.control();

huffInfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'huffInfo'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
huffInfo.update = function (props) {
    this._div.innerHTML = '<h4>Huff model probabilities</h4>' +  (props ?
        '<b>Census tract ' + props.CTNAME + '</b><br />' +
        props.storeprobs.map(i => (i[0] * 100).toFixed(2).toString() + '% chance to use the <span style="color: ' + i[1] + '">store</span>').join('<br>')
        : 'Hover over a census tract');
};