document.addEventListener('DOMContentLoaded', function(){

    map = new OpenLayers.Map('mapdiv');
    map.addLayer(new OpenLayers.Layer.OSM());

    let markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    let centerPoint = new OpenLayers.LonLat(-119.893921848592 , 34.5543987)
        .transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        )
    
    map.setCenter(centerPoint, 4);

    const urlNewYork = "https://api.openbrewerydb.org/breweries?by_state=new_york&per_page=50&page=";
    const urlTexas = "https://api.openbrewerydb.org/breweries?by_state=texas&per_page=50&page=";
    const urlCA = "https://api.openbrewerydb.org/breweries?by_state=california&per_page=50&page=";
    const urlWyoming = "https://api.openbrewerydb.org/breweries?by_state=wyoming&per_page=50&page=";

    const pages = 19;

    const urls = [];

    let getBrewData = async function(url, page){
        let result = await axios.get(url + page).then(res=>{
            return res.data;
        })
        return result;
    }

    let brewData = [];
    for (i=1; i<=pages; i++){
        brewData.push(getBrewData(urlNewYork, i))
        brewData.push(getBrewData(urlCA, i))
        brewData.push(getBrewData(urlWyoming, i))
        brewData.push(getBrewData(urlTexas, i))
    }
    console.log(brewData)

    let number = 1;
    Promise.all(brewData).then(r=>{
        
        r.forEach(breweries=>{
            breweries.forEach(brewery=>{
                if(
                    brewery.longitude !== null &&
                    brewery.latitude !== null
                ){
                    let coordinate = new OpenLayers.LonLat(
                        brewery.longitude,
                        brewery.latitude
                    ).transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        map.getProjectionObject()
                    )
                    console.log(number++, coordinate)
                    markers.addMarker(new OpenLayers.Marker(coordinate))
                }
            })
        })

    })
    
})