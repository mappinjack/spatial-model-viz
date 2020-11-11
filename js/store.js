var numStores = 1;
var storeAtDefaultLocation = true;
var stores = []
var hiddenStores = []
var storeColours = ['#8da0cb', '#fc8d62', '#66c2a5', '#a6d854', '#e78ac3']
var storeNames = ['Purple', 'Orange', 'Teal', 'Green', 'Pink']

// var stores is a list of dictionaries of type {"id": 0, "store": marker, "viz": {"panel": geoJson}, "colour": "#hex"}

function addStore(latitude = null, longitude = null) {
    var storeNum = stores.length
    var colour = storeColours[storeNum]
    var name = storeNames[storeNum]
    if (storeNum > 4) {
        alert("Five stores is the maximum allowable number of stores")
        return
    }

    if (hiddenStores.length > 0) {
        var storeObj = hiddenStores.pop()
        storeObj["store"].addTo(map)
        stores.push(storeObj)
        updateActiveLayer()
        return

    }

    var i;
    for (i = 0; i < stores.length; i++) {
        var latlng = stores[i]["store"].getLatLng()
        var mapCenter = map.getCenter()
        console.log(latlng)
        console.log(mapCenter)
        console.log("==")
        if (latitude === null & longitude === null) {
            if (latlng["lat"].toPrecision(5) == mapCenter["lat"].toPrecision(5) && latlng["lng"].toPrecision(5) == mapCenter["lng"].toPrecision(5)) {
                alert("There's already a store in the center of the map. Move that store or pan the map before adding another.")
                return
            }
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
    if (latitude === null & longitude === null) {
        var latlng = map.getCenter()
    } else {
        var latlng = {
            "lat": latitude,
            "lng": longitude
        }
    }
    var store = L.marker(latlng, {
        icon: icon
    }).addTo(map);

    store.on({
        mousedown: function () {
            map.dragging.disable();
            map.on('mousemove', function (e) {
                clickedButton = e.originalEvent.buttons
                // In tutorial stage, check
                if (clickedButton == 1) {
                    if (tutorialIsActive && currentTutorialStage < 3) {
                        return
                    }
                    store.setLatLng(e.latlng);
                    if (getCurrentBufferType() == "drivetime" & getActiveTab() == "buffer-link") {
                        return
                    }
                    updateActiveLayer()
                    if (tutorialIsActive && currentTutorialStage > 0) {
                        addAndStyleCustomers()
                        if (currentTutorialStage == 3 && customerInStoreCriteriaMet(1, 2)) {
                            setTimeout(function () {
                                goToTutorialStage(4)
                            }, 1000)
                        }
                    }


                }

                // On right click, resize the store
                else if (clickedButton == 2) {
                    if (tutorialIsActive && currentTutorialStage < 6) {
                        return
                    }
                    currentY = e.originalEvent.pageY
                    originalStoreSize = parseInt(store._icon.childNodes[0].style.fontSize.replace("px", ""))
                    originalY = document.getElementById(store._icon.childNodes[0].id).getBoundingClientRect()['top']
                    changeInY = originalY - currentY
                    newSize = originalStoreSize + changeInY / 6 // Arbitrary division to make re-sizing feel "right"

                    if (newSize > 80) {
                        newSize = 80
                    } else if (newSize < 14) {
                        newSize = 14
                    }
                    var icon = store.options.icon;
                    icon.options.html = `<i id=${storeId} class="fas fa-store" style="font-size:${newSize}px;color:${colour};"></i>`
                    icon.options.iconAnchor = [document.getElementById(storeId).offsetWidth / 1.91, Math.max((document.getElementById(storeId).offsetHeight / 1.65), 25)]

                    store.setIcon(icon);
                    if (tutorialIsActive && currentTutorialStage > 0) {
                        addAndStyleCustomers()
                        if (currentTutorialStage == 6 && customerInStoreCriteriaMet(2, 2)) {
                            setTimeout(function () {
                                goToTutorialStage(7)
                            }, 1000)
                        }
                    }
                    map.dragging.enable();
                    if (getCurrentBufferType() == "drivetime" & getActiveTab() == "buffer-link") {
                        return
                    }
                    updateActiveLayer()
                    map.dragging.enable();
                }
            });
        },
        mouseup: function () {
            if (!tutorialIsActive) {
                map.dragging.enable();
            }
            if (getCurrentBufferType() == "drivetime" & getActiveTab() == "buffer-link") {
                updateActiveLayer()
            }
        }
    });

    var storeObj = {
        "store": store,
        "viz": {
            "buffer": createStoreBuffer(store, 2)
        },
        "id": storeNum,
        "colour": colour,
        "name": name
    }
    numStores = stores.push(storeObj)

}

window.addEventListener('mouseup', function (event) {
    // If re-sizing of drive times happens, don't update until mouseup
    console.log(event.button)
    if (event.button == 2 & getCurrentBufferType() == "drivetime" & getActiveTab() == "buffer-link") {
        updateActiveLayer()
    }
})

function removeStore() {
    var storeNum = stores.length
    if (storeNum == 1) {
        alert("The last store cannot be removed")
        return
    }

    var storeToRemove = stores.pop()
    map.removeLayer(storeToRemove["store"])
    for (var key in storeToRemove["viz"]) {
        map.removeLayer(storeToRemove["viz"][key])
    }
    hiddenStores.push(storeToRemove)


}

function hideHuff() {
    map.removeLayer(ct_layer)
}

function clearVizLayers() {
    hideAllBuffers()
    hideVoronoi()
    hideHuff()
}


function getActiveTab() {
    var tabs = ["voronoi-link", "buffer-link", "huff-link"]
    for (tab of tabs) {
        if ($('#'.concat(tab)).hasClass("active")) {
            return tab
        }
    }
}

function updateActiveLayer() {
    var activeTab = getActiveTab()
    if (activeTab == "buffer-link") {
        bufferAllStores()
    } else if (activeTab == "voronoi-link") {
        voronoizeStores()
    } else if (activeTab == "huff-link") {
        calcHuff()
    }
}