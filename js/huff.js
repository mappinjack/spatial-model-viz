

function calcHuff() {
    var points = []
    var colours = []
    var storeSizes = []
    var cts = []
    var attractivenessExponent = 2
    polygons = []
    var i;
    for (i = 0; i < stores.length; i++) {
        latlng = stores[i]["store"].getLatLng();

        points.push(turf.point([latlng["lng"], latlng["lat"]]))
        colours.push(stores[i]["colour"])
        // TODO update with store size
        storesSizes.push(48)
    }
    


}