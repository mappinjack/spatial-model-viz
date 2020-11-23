var ct_centroids = []

function loadCtCentroids() {
    var i;
    for (i = 0; i < to_cts["features"].length; i++) {
        var feature = to_cts["features"][i];
        ct_centroids.push(turf.centroid(feature["geometry"], feature["properties"]))
    }
}

loadCtCentroids()

function calcHuff() {
    var storePoints = []
    var colours = []
    var storeSizes = []
    var cts = []
    var attractivenessExponent = $('#huff-att-exponent')[0].valueAsNumber
    var distanceExponent = $('#huff-dist-exponent')[0].valueAsNumber
    var distanceMaximum = $('#huff-max-dist')[0].valueAsNumber
    var i;
    for (i = 0; i < stores.length; i++) {
        var latlng = stores[i]["store"].getLatLng();
        var store = document.getElementById("store".concat(i.toString()))
        var fontSize = parseInt(store.style.fontSize.replace("px", ""))
        var props = {
            "colour": stores[i]["colour"],
            "name": stores[i]["name"],
            "size": fontSize
        } // TODO update with store size
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
            attractionVal = Math.pow(size, attractivenessExponent) / Math.pow(dist, distanceExponent)
            if (dist > distanceMaximum) {
                attractionVal = 0
            }
            vals.push(attractionVal)
        }

        var j;
        for (j = 0; j < vals.length; j++) {

            storeVal = vals[j]
            sumVals = vals.reduce((a, b) => a + b, 0)
            p = storeVal / sumVals

            if (p > to_cts["features"][i].properties.probability) {
                to_cts["features"][i].properties.probability = p.toFixed(4)
                to_cts["features"][i].properties.colour = storePoints[j].properties.colour
                // "num_households":1274,"median_after_tax_hh_income":"48683", #region
            }
            spending = to_cts["features"][i].properties.num_households * to_cts["features"][i].properties.median_after_tax_hh_income * p * 0.005
            to_cts["features"][i].properties.storeprobs.push([p, storePoints[j].properties.colour, spending, storePoints[j].properties.name])
        }
        to_cts["features"][i].properties.storeprobs = to_cts["features"][i].properties.storeprobs.sort(function (a, b) {
            return b[0] - a[0];
        });

    }

    map.removeLayer(ct_layer)
    ct_layer = L.geoJSON(to_cts, {
        style: huffStyle,
        onEachFeature: onEachFeature
    }).addTo(map)
    loadHuffTable()


}


var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});


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
    } else if (probability <= 0.001) {
        return 0
    } else if (probability <= 0.1) {
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
    this._div.innerHTML = '<h4>Huff Model sales forecasting</h4>' + (props ?
        '<b>' + props.region + ' census tract ' + props.CTNAME + '</b><br />' +
        props.storeprobs.map(i => (i[0] * 100).toFixed(0).toString().replace("NaN", "0") +
            "% "  +
            'chance to use the <span style="color: ' + i[1] + '">' + i[3].toLowerCase() + ' store</span> (' + 
            formatter.format(i[2]).replace("NaN", "0")+ " forecasted sales) ").join('<br>') :
        'Hover over a census tract');
};


function loadHuffTable() {
    var rows = 'Projected yearly sales:<br>';
    $.each(loadHuffStats(), function (index, item) {
        row = `<span style="color:${item[0]};">${item[1][1]}: ` + formatter.format(item[1][0]) + '</span><br>';
        rows += row;
    });
    rows += '<p style="font-size:10px;"><br>Calculated assuming each household spends 0.5% of their average after-tax income on products sold at the stores on the map</p>'
    $('#huff-table').html(rows);
}

function loadHuffStats() {
    var _stores = {};
    $.each(to_cts["features"][0]["properties"]["storeprobs"], function (index, storeprob) {
        _stores[storeprob[1]] = [0, storeprob[3]]
    })

    $.each(to_cts["features"], function (index, feature) {
        $.each(feature.properties["storeprobs"], function (index, _store) {
            _stores[_store[1]][0] += +_store[2] || 0
        })
    })
    var sortedStores = [];
    for (var store in _stores) {
        sortedStores.push([store, _stores[store]]);
    }

    sortedStores.sort(function (a, b) {
        return b[1][0] - a[1][0]
    })
    return sortedStores
}