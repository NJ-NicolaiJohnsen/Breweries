document.addEventListener('DOMContentLoaded', function(){

    const pages = 19;
    const url = "https://api.openbrewerydb.org/breweries?by_state=california&per_page=50&page=";

    map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM())
    let markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    let centerPoint = new OpenLayers.LonLat(-120, 34)
        .transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        )

    map.setCenter(centerPoint, 6);

    const getBrews = async function(url, page){
        const results = await axios.get(url+page)
            .then(res=>{
                return res.data
            })
        return results;
    }

    let breweries = [];
    
    for (i=0; i<pages; i++){
        breweries.push(getBrews(url, i))
    }

    Promise.all(breweries)
        .then(function(r){
         //   console.log(r)
            breweries = r;
        })
        .then(function(){
            breweries.forEach(brewery =>{
                //console.log("Brewery", brewery.length)
                brewery.forEach(brew=>{
                    if (
                        brew.longitude !== null &&
                        brew.latitude !== null
                    ){
                        
                        let point = new OpenLayers.LonLat(
                            brew.longitude,
                            brew.latitude
                        ).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            map.getProjectionObject()
                        )
                        console.log(point)
                        markers.addMarker(new OpenLayers.Marker(point))
                    }
                   
                })

            })

        })
    
})