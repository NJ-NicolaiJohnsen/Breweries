
function getStuff() {

    
    const baseUrl = "https://api.openbrewerydb.org/breweries?by_state=california&per_page=50&page=";
    const pages = 19;

    const getBrews = async function(url, page){
        const results = await axios.get(url + page)
            .then( res => {
                return res.data;
            })
        return results;
    }
    let breweries = [];
    for (i = 0; i < pages; i++){
        breweries.push(getBrews(baseUrl, i))
    }

    Promise.all(breweries)
        .then (r =>{
           breweries = r;
           console.log(r)
            console.log(breweries)
        })
        .then( () =>{
            console.log(breweries)
            let point = [];
            for (let i =0; i< breweries.length; i++){
                
                const listOfFifty = breweries[i];
                
                for (let j=0; j<listOfFifty.length; j++){
                    if (listOfFifty[j].longitude !== null &&
                        listOfFifty[j].latitude !== null    
                    ){
                        
                        const eachPoint = {
                            longitude: listOfFifty[j].longitude,
                            latitude: listOfFifty[j].latitude
                        };

                        point.push(eachPoint);
                        
                    
                    }
                    
                } 
            }

            
            map = new OpenLayers.Map("mapdiv");
            map.addLayer(new OpenLayers.Layer.OSM());
            

            
            let markers = new OpenLayers.Layer.Markers("Markers");
            map.addLayer(markers);
            var lonLat = new OpenLayers.LonLat( -121 ,35.5077286 )
            .transform(
              new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
              map.getProjectionObject() // to Spherical Mercator Projection
            );
           map.setCenter(lonLat, 6)

            let longitudeLatitude=[];
            for (i = 0; i<point.length; i++) {
                
                longitudeLatitude.push( [point[i].longitude, point[i].latitude])

            }
            for (i=0; i<longitudeLatitude.length; i++) {
               // console.log("lonLat:",longitudeLatitude[i][0],longitudeLatitude[i][1])
            
            var myLonLat = new OpenLayers.LonLat( longitudeLatitude[i][0], longitudeLatitude[i][1] )
                .transform(
                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                map.getProjectionObject() // to Spherical Mercator Projection
                );
                markers.addMarker(new OpenLayers.Marker(myLonLat));
            }
           
        })
   

   


}

getStuff();
