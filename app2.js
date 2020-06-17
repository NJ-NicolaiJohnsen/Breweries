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
    
    map.setCenter(centerPoint, 7);

    const url = "https://api.openbrewerydb.org/breweries?by_state=california&per_page=50&page=";
    const pages = 19;

    const urls = [];

    for (i=1; i<=pages; i++){
        urls.push(url+i)
    }
    console.log(urls)

    let breweryData = [];
    urls.forEach(async url=>{
        const result = await axios.get(url).then(res=>{
            return res.data;
        })
        breweryData.push(result);
    })
   
    
    Promise.all(breweryData).then(r=>{
        breweryData = r;
    })
    
   


})