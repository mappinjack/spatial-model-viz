var currentTutorialStage = 0
var tutorialIsActive = true
var tutorialFunctionLookup = {
    1: tutorial1,
    2: tutorial2,
    3: tutorial3,
    4: tutorial4,
    5: tutorial5,
    6: tutorial6,
    7: tutorial7,
    8: tutorial8
}


function goToTutorialStage(stage) {
    currentTutorialStage = stage
    if (stage == 9) {
        endTutorial()
    }
    tutorialFunctionLookup[currentTutorialStage]()
}


function tutorial1() {
    setNextButtonAsDisabled(false)
    addAndStyleCustomers()
    text = "Who shops at which store? When retail analysts are locating new stores, they try to include as many potential customers in the store's <b>trade area</b> as possible."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial2() {
    text = "Since the <b style='color:#8da0cb'>purple</b> and <b style='color:#fc8d62'>orange</b> stores are still in the planning phase, their exact locations are not decided yet."
    document.getElementById("tutorial-text").innerHTML = text;
    setNextButtonAsDisabled(false)
}

function tutorial3() {
    text = "Customers tend to prefer to shop at stores near them. By left-clicking and dragging the <b style='color:#8da0cb'>purple</b> store, can you relocate it so that its trade area includes two customers?"
    bufferAllStores()
    addAndStyleCustomers()
    document.getElementById("tutorial-text").innerHTML = text;
    setNextButtonAsDisabled(true)
}


function tutorial4() {
    text = "Nice! Now these customers will be loyal shoppers to the <b style='color:#8da0cb'>purple</b> store and the store will have higher revenue."
    document.getElementById("tutorial-text").innerHTML = text;
    setNextButtonAsDisabled(false)

}

function tutorial5() {
    text = "Generally, people are willing to travel farther to shop at bigger stores that have more items."
    document.getElementById("tutorial-text").innerHTML = text;
    setNextButtonAsDisabled(false)

}

function tutorial6() {
    setNextButtonAsDisabled(true)
    text = "By right-clicking the <b style='color:#fc8d62'>orange</b> store and dragging upward, can you re-size the store's proposed square footage to include another customer in its trade area?"
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial7() {
    setNextButtonAsDisabled(false)
    text = "Beautiful. More customers = more profit! At any time, you can move a store (left-click and drag) or re-size its square footage (right-click and drag up/down)."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial8() {
    setNextButtonAsDisabled(false)
    text = "In the real world, retail analysts use many different models to determine store <b>trade areas</b> and forecast sales. Click <b>Next</b> to explore these models in the real world."
    document.getElementById("tutorial-text").innerHTML = text;
}


function setNextButtonAsDisabled(disable) {
    if (disable == true) {
        document.getElementById("tutorial-next-button").classList.remove("pulse")
        document.getElementById("tutorial-next-button").disabled = true
    } else {
        document.getElementById("tutorial-next-button").classList.add("pulse")
        document.getElementById("tutorial-next-button").disabled = false
    }
}
// Exit tutorial mode
//   Dispay map, set zoom levels, allow map to be moved
function endTutorial() {
    map.addLayer(mapboxTiles)
    // map.height = 100 vh
    map.invalidateSize()
    $('.leaflet-control-attribution').show()
    tutorialIsActive = false
    try {
        customerGroup.removeFrom(map)
    } catch {
        // pass
    }
    toggleMapMovement(true)
    map.setMinZoom(9)
    map.setMaxZoom(16)
    transitionMapHeight(true)
    bufferAllStores()
    invalidateMapSize()
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);



}

function transitionMapHeight(fullHeight) {
    if (fullHeight == true) {

        // maintainCenter(1200, map.getCenter())
        document.getElementById("tutorial-row").style.display = "none"
        document.getElementById("map").style.height = "Calc(100vh - 60px)"
        // document.getElementById("tutorial-row").style.height = "0px"
        document.getElementById("map").classList.remove("col-md-12")
        document.getElementById("map").classList.add("col-md-9")
        document.getElementById("model-control-bar").classList.remove("col-md-0")
        document.getElementById("model-control-bar").classList.add("col-md-3")

        setTimeout(function () {
            document.getElementById("model-control-bar").style.display = "block"
        }, 1000)
        document.getElementById("top-nav").style.display = "block"
    }
}

function maintainCenter(delay, center) {
    for (i = 0; i < delay; i += 10)
        setTimeout(function () {
            map.panTo(center)
        }, 10);

}


function invalidateMapSize() {
    for (let i = 0; i < 150; i++) {
        task(i);
    }

    function task(i) {
        setTimeout(function () {
            map.invalidateSize()
        }, 10 * i);
    }
}

var customers;
var customerGroup

function addAndStyleCustomers() {
    try {
        customerGroup.removeFrom(map)
    } catch {
        // pass
    }
    c1LatLng = [43.7055242, -79.6887977]
    c2LatLng = [43.6655242, -79.55107977]
    c3LatLng = [43.6215242, -79.3807977]
    c4LatLng = [43.7304494, -79.2446757]
    c1 = L.marker(c1LatLng, {
        icon: getCustomerIcon(c1LatLng)
    })

    c2 = L.marker(c2LatLng, {
        icon: getCustomerIcon(c2LatLng)
    })

    var c3 = L.marker(c3LatLng, {
        icon: getCustomerIcon(c3LatLng)
    })

    var c4 = L.marker(c4LatLng, {
        icon: getCustomerIcon(c4LatLng)
    })
    customers = [c1, c2, c3, c4]
    customerGroup = L.layerGroup(customers);
    customerGroup.addTo(map)
}


function getCustomerIcon(latlng) {
    colour = getCustomerColor(latlng)
    return L.divIcon({
        className: 'fa-div-map-icon',
        html: `<i class="fas fa-user" style="font-size:32px;${colour}"></i>`,
    });
}


function getCustomerColor(latlng) {
    var store1Buffer = stores[0]["viz"]["buffer"]
    var store2Buffer = stores[1]["viz"]["buffer"]
    if ('_layers' in store1Buffer) {
        var store1Layers = stores[0]["viz"]["buffer"]._layers
        var store1Buffer = store1Layers[Object.keys(store1Layers)[0]].feature
    }
    if ('_layers' in store2Buffer) {
        var store2Layers = stores[1]["viz"]["buffer"]._layers
        var store2Buffer = store2Layers[Object.keys(store2Layers)[0]].feature
    }

    inStore1Buffer = turf.booleanPointInPolygon(turf.point([latlng[1], latlng[0]]), store1Buffer);
    inStore2Buffer = turf.booleanPointInPolygon(turf.point([latlng[1], latlng[0]]), store2Buffer);

    store1Colour = stores[0]["colour"]
    store2Colour = stores[1]["colour"]
    if (inStore1Buffer === true && inStore2Buffer === false) {
        return `color:${store1Colour}`
    } else if (inStore2Buffer === true && inStore1Buffer === false) {
        return `color:${store2Colour}`
    } else if (inStore1Buffer === true && inStore2Buffer === true) {
        return `background: -webkit-linear-gradient(top right, ${store2Colour}, ${store1Colour});-webkit-background-clip: text;-webkit-text-fill-color: transparent;`
    }
    return `color:darkgrey`
}


function customerInStoreCriteriaMet(storeNumber, expectedNumberOfCustomers = 2) {
    var numberOfCustomers = 0
    var storeNumber = storeNumber - 1
    var storeBuffer = stores[storeNumber]["viz"]["buffer"]
    if ('_layers' in storeBuffer) {
        var storeLayers = stores[storeNumber]["viz"]["buffer"]._layers
        var storeBuffer = storeLayers[Object.keys(storeLayers)[0]].feature
    }

    for (i = 0; i < customers.length; i += 1) {
        customerLatLng = customers[i].getLatLng()
        customerLatLng = [customerLatLng["lng"], customerLatLng["lat"]]
        customerAtStore = turf.booleanPointInPolygon(turf.point(customerLatLng), storeBuffer);
        if (customerAtStore) {
            numberOfCustomers += 1
        }
    }
    if (numberOfCustomers == expectedNumberOfCustomers) {
        return true
    }
    return false
}