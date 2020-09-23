var numStores = 1;
var storeAtDefaultLocation = true;
var stores = []
var hiddenStores = []
var storeColours = ['#8da0cb', '#fc8d62', '#66c2a5', '#a6d854', '#e78ac3']

//TODO: Add store to map's centre and don't add a store if there's one already there
function addStore() {
    var storeNum = stores.length
    var colour = storeColours[storeNum]
    if (storeNum > 4) {
        alert("Five stores is the maximum allowable number of stores")
        return
    }
    storeId = "store".concat(storeNum.toString())
    icon = L.divIcon({
        className: 'fa-div-map-icon',
        html: `<i id="${storeId}" class="fas fa-store" style="font-size:36px;color:${colour}"></i>`,
        iconSize: [1, 1],
        iconAnchor: [21, 18],
        draggable: true,
    });

    var store = L.marker([43.7138687, -79.7818961], { icon: icon }).addTo(map);
    
    store.on({
        mousedown: function () {
            map.dragging.disable();
            map.on('mousemove', function (e) {
                clickedButton = e.originalEvent.buttons
                // On left click, drag the store
                if (clickedButton == 1) {
                    store.setLatLng(e.latlng);
                    if (currentTutorialStage == 1) {
                        setTimeout(function () { goToTutorialStage(2) }, 1000)
                    }
                }
                // On right click, resize the store
                else if (clickedButton == 2) {
                    // console.log("movementY")
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
                        setTimeout(function () { goToTutorialStage(4) }, 1000)
                    }

                }
            });
        }
    });
    console.log(storeId)
    numStores = stores.push(store)
    console.log(numStores)
    

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
    map.removeLayer(storeToRemove)
    hiddenStores.unshift(storeToRemove)


}