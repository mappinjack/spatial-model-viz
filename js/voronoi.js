function voronoizeStores() {
    var points = []
    var colours = []
    polygons = []
    var i;
    for (i = 0; i < stores.length; i++) {
        latlng = stores[i]["store"].getLatLng();

        points.push(turf.point([latlng["lng"], latlng["lat"]]))
        colours.push(stores[i]["colour"])
    }

    var collection = turf.featureCollection(points)
    var options = {
        bbox: [-85, 43, -77, 45]
    };
    voronoiPolygons = turf.voronoi(collection, options);
    for (i = 0; i < voronoiPolygons["features"].length; i++) {
        voronoiPolygons["features"][i]["properties"]["colour"] = colours[i]
        voronoiPolygons["features"][i]["properties"]["dashOffset"] = i * 5
    }

    hideVoronoi()
    voronois = L.geoJSON(voronoiPolygons, {
        style: function (feature) {
            return {
                color: feature.properties.colour,
                dashArray: '15',
                dashOffset: feature.properties.dashOffset
            }
        }
    }).addTo(map);

}

function hideVoronoi() {
    try {
        map.removeLayer(voronois)
    } catch {
        //pass
    }
}