var numStores = 1;
var storeAtDefaultLocation = true;
var stores = []
var hiddenStores = []
var storeColours = ['#8da0cb', '#fc8d62', '#66c2a5', '#a6d854', '#e78ac3']

// var stores is a list of dictionaries of type {"id": 0, "store": marker, "viz": {"panel": geoJson}, "colour"}

//TODO: Add store to map's centre and don't add a store if there's one already there
function addStore() {
    var storeNum = stores.length
    var colour = storeColours[storeNum]
    if (storeNum > 4) {
        alert("Five stores is the maximum allowable number of stores")
        return
    }

    if (hiddenStores.length > 0) {
        var storeObj = hiddenStores.pop()
        storeObj["store"].addTo(map)
        stores.push(storeObj)
        return

    }

    var i;
    for (i = 0; i < stores.length; i++) {
        var latlng = stores[i]["store"].getLatLng()
        console.log(latlng)
        var mapCenter = map.getCenter()
        if (latlng["lat"].toPrecision(5) == mapCenter["lat"].toPrecision(5) && latlng["lng"].toPrecision(5) == mapCenter["lng"].toPrecision(5)) {
            alert("There's already a store in the center of the map. Move that store or pan the map before adding another.")
            return
        }
        // layer.addData(createStoreBuffer(stores[i]["store"], 1))
    }

    var storeId = "store".concat(storeNum.toString())
    var icon = L.divIcon({
        className: 'fa-div-map-icon',
        html: `<i id="${storeId}" class="fas fa-store" style="font-size:36px;color:${colour}"></i>`,
        iconSize: [1, 1],
        iconAnchor: [21, 18],
        draggable: true,
    });

    var store = L.marker(map.getCenter(), {
        icon: icon
    }).addTo(map);

    store.on({
        mousedown: function () {
            map.dragging.disable();
            map.on('mousemove', function (e) {
                clickedButton = e.originalEvent.buttons
                // On left click, drag the store
                if (clickedButton == 1) {
                    store.setLatLng(e.latlng);
                    if (currentTutorialStage == 1) {
                        setTimeout(function () {
                            goToTutorialStage(2)
                        }, 1000)
                    }
                }
                // On right click, resize the store
                else if (clickedButton == 2) {
                    originalY = e.originalEvent.pageY
                    currentY = store._icon._leaflet_pos.y
                    changeInY = currentY - originalY
                    newSize = Math.max(changeInY, 14)

                    if (newSize > 80) {
                        newSize = 80
                    }
                    var icon = store.options.icon;
                    icon.options.html = `<i id=${storeId} class="fas fa-store" style="font-size:${newSize}px;color:${colour};"></i>`
                    icon.options.iconAnchor = [document.getElementById(storeId).offsetWidth / 1.91, Math.max(document.getElementById(storeId).offsetHeight / 1.65, 25)]

                    store.setIcon(icon);
                    // store.radius = changeInY
                    if (currentTutorialStage == 3) {
                        setTimeout(function () {
                            goToTutorialStage(4)
                        }, 1000)
                    }

                }
            });
        }
    });

    var storeObj = {
        "store": store,
        "viz": {
            "buffer": createStoreBuffer(store, 1)
        },
        "id": storeNum,
        "colour": colour
    }
    numStores = stores.push(storeObj)

}


function removeStore() {
    var storeNum = stores.length
    if (storeNum == 1) {
        alert("The last store cannot be removed")
        return
    }
    //TODO: What to do with hidden stores
    // Should the createStore pop, or should they be totally forgotten about?
    // Advantage is caching the drive time
    var storeToRemove = stores.pop()
    map.removeLayer(storeToRemove["store"])
    for (var key in storeToRemove["viz"]) {
        map.removeLayer(storeToRemove["viz"][key])
    }
    hiddenStores.push(storeToRemove)


}