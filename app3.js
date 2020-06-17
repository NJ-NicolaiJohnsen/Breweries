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

    const url = "https://api.openbrewerydb.org/breweries?by_state=new_york&per_page=50&page=";
    const pages = 19;

    const urls = [];

    for (i=1; i<=pages; i++){
        urls.push(url+i)
    }
    
    let brewData = [];

    for (i=0; i<pages; i++){
        async function getBrewData(){
            return await axios.get(urls[i]).then(res=>{
                return res.data
            })
            
        }
        brewData.push(getBrewData())
    }
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