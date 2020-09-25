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

function getBufferMultiplier(storeObj) {
    var store = document.getElementById("store".concat(storeObj["id"].toString()))
    var fontSize = parseInt(store.style.fontSize.replace("px", ""))
    return fontSize / 36.0
}

function addStoreBuffer(storeObj, distance) {
    var store = storeObj["store"]
    var style = {
        color: storeObj["colour"]
    }

    multiplier = getBufferMultiplier(storeObj)
    bufferGeoJson = createStoreBuffer(store, distance * multiplier)
    map.removeLayer(storeObj["viz"]["buffer"])
    storeBuffer = L.geoJson(bufferGeoJson, {
        style: style
    }).addTo(map)
    stores[storeObj["id"]]["viz"]["buffer"] = storeBuffer


    store.on({
        mousedown: function () {
            map.dragging.disable();
            map.on('mousemove', function (e) {
                clickedButton = e.originalEvent.buttons
                // On left click, drag the store
                if (clickedButton == 1) {
                    map.removeLayer(storeObj["viz"]["buffer"])
                    multiplier = getBufferMultiplier(storeObj)
                    bufferGeoJson = createStoreBuffer(store, distance * multiplier)
                    storeBuffer = L.geoJson(bufferGeoJson, {
                        style: style
                    }).addTo(map)
                    stores[storeObj["id"]]["viz"]["buffer"] = storeBuffer

                }
                // On right click, resize the store
                else if (clickedButton == 2) {
                    map.removeLayer(storeObj["viz"]["buffer"])
                    multiplier = getBufferMultiplier(storeObj)
                    bufferGeoJson = createStoreBuffer(store, distance * multiplier)
                    storeBuffer = L.geoJson(bufferGeoJson, {
                        style: style
                    }).addTo(map)
                    stores[storeObj["id"]]["viz"]["buffer"] = storeBuffer
                }
            });
        }
    });
}

function bufferAllStores() {
    distance = document.getElementById("buffer-distance-range").value
    var i;
    for (i = 0; i < stores.length; i++) {
        addStoreBuffer(stores[i], distance)
        // layer.addData(createStoreBuffer(stores[i]["store"], 1))
    }
}