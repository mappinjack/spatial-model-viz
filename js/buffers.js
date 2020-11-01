function createStoreBuffer(store, distance) {
    var latlng = store._latlng;
    var lat = latlng["lat"];
    var lon = latlng["lng"];
    var point = turf.point([lon, lat]);
    var buffered = turf.buffer(point, distance, {
        units: 'kilometers'
    });
    return buffered
}


//TODO: Resize drivetime doesn't trigger

function getBufferMultiplier(storeObj) {
    console.log("Here")
    console.log($("#buffer-distance-buttons label.active input").val())
    if ($("#buffer-distance-buttons label.active input").val() === "fixed") {
        return 2
    }
    var store = document.getElementById("store".concat(storeObj["id"].toString()))
    var fontSize = parseInt(store.style.fontSize.replace("px", ""))
    return Math.ceil(fontSize / 36.0 * 2)
}



function addStoreBuffer(storeObj, distance) {
    var store = storeObj["store"]
    var style = {
        color: storeObj["colour"]
    }

    multiplier = getBufferMultiplier(storeObj)
    bufferGeoJson = createStoreBuffer(store, distance * multiplier)
    tryRemoveBuffers(storeObj)
    storeBuffer = L.geoJson(bufferGeoJson, {
        style: style
    }).addTo(map)
    stores[storeObj["id"]]["viz"]["buffer"] = storeBuffer
}

function addStoreDrivetime(storeObj, distance) {
    var store = storeObj["store"]
    var style = {
        color: storeObj["colour"]
    }

    minutes = Math.max(getBufferMultiplier(storeObj) * distance * 2, 10)
    var latlng = store._latlng;
    var lat = latlng["lat"];
    var lon = latlng["lng"];
    var queryString = `https://api.mapbox.com/isochrone/v1/mapbox/driving/${lon},${lat}`;
    $.get(
        queryString, {
            "contours_minutes": minutes,
            "polygons": true,
            "access_token": "pk.eyJ1Ijoicmlrb3c5NSIsImEiOiJjajJtYnZhbmswMHV1MzN0ajM3NHNzOHh5In0.q6-T946dwyUkr1ml9-qRbw"
        },
        function (data) {
            tryRemoveBuffers(storeObj)
            storeDrivetime = L.geoJson(data, {
                style: style
            }).addTo(map)
            stores[storeObj["id"]]["viz"]["drivetime"] = storeDrivetime
        }
    )
}

function bufferAllStores() {
    distance = document.getElementById("buffer-distance-range").value
    var i;
    for (i = 0; i < stores.length; i++) {
        if (getCurrentBufferType() === "euc") {
            addStoreBuffer(stores[i], distance)
        } else {
            addStoreDrivetime(stores[i], distance)
        }
    }
}

function hideAllBuffers() {
    var i;
    for (i = 0; i < stores.length; i++) {
        tryRemoveBuffers(stores[i])
    }
}

function getCurrentBufferType() {
    return $("#buffer-type-buttons label.active input").val()
}

function tryRemoveBuffers(storeObj) {
    try {
        map.removeLayer(storeObj["viz"]["buffer"])
    } catch {
        // pass
    }
    try {
        map.removeLayer(storeObj["viz"]["drivetime"])
    } catch {
        // pass
    }
}