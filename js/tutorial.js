var currentTutorialStage = 0
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
    if (stage == 8) {
        endTutorial()
    }
    tutorialFunctionLookup[currentTutorialStage]()
}


function tutorial1() {
    setNextButtonAsDisabled(false)
    text = "Who shops at which store? When retail analysts are locating new stores, they try to locate near their customers"
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial2() {
    text = "Since the <b>pink</b> and <b>purple</b> stores are still in the planning phase, their locations are not decided yet."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial3() {
    text = "Customers tend to like to shop at stores near them. By left-clicking and dragging the purple store, can you move it to include the green customer?"
    setNextButtonAsDisabled(false)

}


function tutorial4() {
    text = "Nice! Now the green customer will be a loyal shopper to the purple store."
    setNextButtonAsDisabled(false)

} 
function tutorial5() {
    text = "Generally, people are willing to travel farther to shop at a bigger store that has more items."
    setNextButtonAsDisabled(false)

}

function tutorial6() {
    setNextButtonAsDisabled(false)
    text = "By right-clicking and dragging upward, can you re-size the pink store's square footage to include the red customer?"
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial7() {
    setNextButtonAsDisabled(false)
    text = "Beautiful. More customers = more profit! At any time, you can move (left click) or re-size (right click) a store's square footage."
    document.getElementById("tutorial-text").innerHTML = text;
}

function tutorial8() {
    setNextButtonAsDisabled(false)
    text = "In the real world, retail analysts use many different models to calculate their <i>trade areas</i> and forecast sales. Click Next to explore these models in the real world!"
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
    toggleMapMovement(true)
    // var p1 = L.point(43.5121909,-79.9547867),
    // p2 = L.point(43.751967,-79.7626525),
    // bounds = L.bounds(p1, p2);
    // map.setMaxBounds(bounds);
    map.setMinZoom(9)
    map.setMaxZoom(16)
    transitionMapHeight(true)
    bufferAllStores()
    invalidateMapSize()



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

        // invalidateMapSize(1000)

    }
}

function maintainCenter(delay, center) {
    for (i = 0; i < delay; i += 10)
        setTimeout(function () {
            map.panTo(center)
        }, 10);

}


function invalidateMapSize() {
    for (let i=0; i<150; i++) { 
        task(i); 
     } 
       
     function task(i) { 
       setTimeout(function() { 
           map.invalidateSize()
       }, 10 * i); 
     } 
}


