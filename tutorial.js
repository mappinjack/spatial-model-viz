var currentTutorialStage = 0
var tutorialFunctionLookup = {1: tutorial1, 2: tutorial2, 3: tutorial3, 4: tutorial4, 5: tutorial5}


function goToTutorialStage(stage) {
    currentTutorialStage = stage
    console.log('Current tutorial stage is ' + stage.toString())
    tutorialFunctionLookup[currentTutorialStage]()
}


function tutorial1(){
    text = "This store can be moved. Left click and drag the store to re-locate it."
    document.getElementById("tutorial-text").innerHTML=text;
}

function tutorial2(){
    text = "Nice! The size of the circle represents the store's square footage."
    document.getElementById("tutorial-text").innerHTML=text;
}

function tutorial3(){
    text = "Right click on the circle and drag your mouse upwards or downwards to increase or decrease the store's square footage."
    document.getElementById("tutorial-text").innerHTML=text;
}

function tutorial4(){
    text = "Now you know how to move and re-size a store. Click Next to explore this in the real world."
    document.getElementById("tutorial-text").innerHTML=text;
}

function tutorial5(){
    endTutorial()
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
    
}

function transitionMapHeight(fullHeight) {
    if (fullHeight == true) {
        document.getElementById("tutorial-row").style.display = "none"
        document.getElementById("map").style.height = "100vh"
        // document.getElementById("tutorial-row").style.height = "0px"
        document.getElementById("map").classList.remove("col-md-12")
        document.getElementById("map").classList.add("col-md-10")
        document.getElementById("model-control-bar").classList.remove("col-md-0")
        document.getElementById("model-control-bar").classList.add("col-md-2")
        // 
        setTimeout(function() {
            document.getElementById("model-control-bar").style.display = "block"
        }, 1000)
        
        
        map.invalidateSize();  
        
    }
}