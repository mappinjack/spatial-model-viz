var currentTutorialStage = 0
var tutorialFunctionLookup = {
    1: tutorial1,
    2: tutorial2,
    3: tutorial3,
    4: tutorial4,
    5: tutorial5
}


function goToTutorialStage(stage) {
    currentTutorialStage = stage
    console.log('Current tutorial stage is ' + stage.toString())
    tutorialFunctionLookup[currentTutorialStage]()
}


function tutorial1() {
    setNextButtonAsDisabled(true)
    text = "This store can be moved. Left click and drag the store to re-locate it."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial2() {
    setNextButtonAsDisabled(false)
    text = "Nice! The size of the circle represents the store's square footage."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial3() {
    setNextButtonAsDisabled(true)
    text = "Right click on the store and drag your mouse upwards or downwards to increase or decrease the store's square footage."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial4() {
    setNextButtonAsDisabled(false)
    text = "Now you know how to move and re-size a store. Click Next to explore this in the real world."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial5() {
    setNextButtonAsDisabled(false)
    endTutorial()
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
    toggleMapMovement(true)
    // var p1 = L.point(43.5121909,-79.9547867),
    // p2 = L.point(43.751967,-79.7626525),
    // bounds = L.bounds(p1, p2);
    // map.setMaxBounds(bounds);
    map.setMinZoom(11)
    map.setMaxZoom(16)
    transitionMapHeight(true)
    bufferAllStores()

}

function transitionMapHeight(fullHeight) {
    if (fullHeight == true) {

        maintainCenter(1200, map.getCenter())
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

        // invalidateMapSize(1000)

    }
}

function maintainCenter(delay, center) {
    for (i = 0; i < delay; i += 10)
        setTimeout(function () {
            map.panTo(center)
        }, 10);

}

function invalidateMapSize(delay) {
    for (i = 0; i < delay; i += 50)
        setTimeout(function () {
            map.invalidateSize()
        }, 50);

}