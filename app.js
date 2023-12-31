mapboxgl.accessToken = 'pk.eyJ1Ijoidmlubnk4ODgiLCJhIjoiY2xtNWRteTlxMWQwdjNmcDZhcWtlcGxqMiJ9.zudQQYFrNrsQqYbdQAdSdw';

let mapSize = 384;
const tileSizes = [1, 2, 4, 8, 16, 32];
const zoomLevels = [11, 12, 13, 14, 15, 16];
let selectedFeatureID = null;
let ownedNFTs = {};
let mainMap = null;

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

function loadMap(){
    const urlParams = new URLSearchParams(window.location.search);
    const wallet = urlParams.get('wallet')
    if(wallet){
        document.getElementById('wallet').value = wallet;
        let walletArr = wallet.split(',')

        loadWallet(walletArr);
    } else {
        loadWallet(['']);
    }
}

function loadNewWallet(){
    let newWallet = document.getElementById('wallet').value;
    window.location = '/upstreet-map/' + replaceQueryParam('wallet', newWallet, window.location.search)
}

async function loadNFTs(wallets){
    if(!wallets || wallets[0] == ''){

        if(false){
            let start = 0;
            for(let i=start; i<holders_wallets.length; i++){
                let newWallet = holders_wallets[i];
                ownedNFTs[newWallet] = [];
                console.log('wallet: ', newWallet);
                // Holders
                // https://etherscan.io/token/0xcbf4beb93b2eaa4e148d347553a9bd8fed0d7da3#balances

                // Alchemy reset
                // https://eth-mainnet.g.alchemy.com/nft/v2/g3d4-b8b3P8N1puDX_X5HCh5ONljftBB/invalidateContract?contractAddress=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3

                let url = 'https://eth-mainnet.g.alchemy.com/nft/v2/g3d4-b8b3P8N1puDX_X5HCh5ONljftBB/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+newWallet+'&withMetadata=true';
                try{
                    const response = await fetch(url);
                    const tiles = await response.json();
                    // console.log(tiles);
            
                    for(let i=0; i<tiles.ownedNfts.length; i++){
                        let tileMetadata = tiles.ownedNfts[i].metadata;
                        let location = tileMetadata.attributes.find((att)=>att.trait_type == 'Location');
                        if(location && location.value){
                            let loc = location.value.replace('[', '').replace(']', '').split(',')
                            if(loc[0] != null && loc[1] != null){
                                ownedNFTs[newWallet].push({
                                    x: parseInt(loc[0]),
                                    y: parseInt(loc[1]),
                                    id: parseInt(tileMetadata.name.replace('Deed #', ''))
                                })
                            }
                        }
                    }
                    console.log('i='+i, JSON.stringify(ownedNFTs));
                    await new Promise(r => setTimeout(r, (60/60)*1000));
                    let pageKey = tiles.pageKey;
                    while(pageKey){
                        let url2 = 'https://eth-mainnet.g.alchemy.com/nft/v2/g3d4-b8b3P8N1puDX_X5HCh5ONljftBB/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+newWallet+'&withMetadata=true&pageKey='+pageKey;
                        try{
                            const response2 = await fetch(url2);
                            const tiles2 = await response2.json();
                            // console.log(tiles2);
                    
                            for(let i=0; i<tiles2.ownedNfts.length; i++){
                                let tileMetadata = tiles2.ownedNfts[i].metadata;
                                let location = tileMetadata.attributes.find((att)=>att.trait_type == 'Location');
                                if(location && location.value){
                                    let loc = location.value.replace('[', '').replace(']', '').split(',')
                                    if(loc[0] != null && loc[1] != null){
                                        ownedNFTs[newWallet].push({
                                            x: parseInt(loc[0]),
                                            y: parseInt(loc[1]),
                                            id: parseInt(tileMetadata.name.replace('Deed #', ''))
                                        })
                                    }
                                }else{
                                    // console.log('error: ', tiles2.ownedNfts[i])
                                }
                            }
                            console.log('i='+i, JSON.stringify(ownedNFTs));
                            pageKey = tiles2.pageKey;
                        } catch(err){
                            console.log(err);
                        }
                        await new Promise(r => setTimeout(r, (60/60)*1000));
                    }
                } catch(err){
                    console.log(err);
                    i--;
                }
                await new Promise(r => setTimeout(r, (60/60)*1000));
            }
        } else {
            let count = 0;
            let walletArr = Object.keys(all_wallets);
            walletArr.forEach((wallet)=>{
                ownedNFTs[wallet] = [];
                all_wallets[wallet].forEach((tile)=>{
                    if(tile.x != null && tile.y != null){
                        ownedNFTs[wallet].push({
                            x: tile.x,
                            y: tile.y,
                            id: tile.id
                        })
                        count++;
                    }
                })
            })
            // console.log('claimed:', ownedNFTs.length);
            // console.log('unclaimed:', all_wallets.length-ownedNFTs.length);

            document.getElementById('claimed').innerHTML = 'Claimed: ' + count;
            document.getElementById('owners').innerHTML = ' Owners: ' + walletArr.length;
        }
        
    }else {

        ownedNFTs = {}
        let count = 0;
        for(let i=0; i<wallets.length; i++){
            let wallet = wallets[i];
            let url = 'https://eth-mainnet.g.alchemy.com/nft/v2/g3d4-b8b3P8N1puDX_X5HCh5ONljftBB/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+wallet+'&withMetadata=true';
            const response = await fetch(url);
            const tiles = await response.json();
            console.log(tiles);
            ownedNFTs[wallet] = [];
            for(let i=0; i<tiles.ownedNfts.length; i++){
                let tileMetadata = tiles.ownedNfts[i].metadata;
                let location = tileMetadata.attributes.find((att)=>att.trait_type == 'Location');
                let loc = location.value.replace('[', '').replace(']', '').split(',')
                ownedNFTs[wallet].push({
                    x: parseInt(loc[0]),
                    y: parseInt(loc[1]),
                    id: parseInt(tileMetadata.name.replace('Deed #', ''))
                })
                
                count++;
            }
            let pageKey = tiles.pageKey;
            while(pageKey){
                let url2 = 'https://eth-mainnet.g.alchemy.com/nft/v2/g3d4-b8b3P8N1puDX_X5HCh5ONljftBB/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+wallet+'&withMetadata=true&pageKey='+pageKey;
                try{
                    const response2 = await fetch(url2);
                    const tiles2 = await response2.json();
                    // console.log(tiles2);
            
                    for(let i=0; i<tiles2.ownedNfts.length; i++){
                        let tileMetadata = tiles2.ownedNfts[i].metadata;
                        let location = tileMetadata.attributes.find((att)=>att.trait_type == 'Location');
                        if(location && location.value){
                            let loc = location.value.replace('[', '').replace(']', '').split(',')
                            if(loc[0] != null && loc[1] != null){
                                ownedNFTs[wallet].push({
                                    x: parseInt(loc[0]),
                                    y: parseInt(loc[1]),
                                    id: parseInt(tileMetadata.name.replace('Deed #', ''))
                                })
                            }
                        }else{
                            // console.log('error: ', tiles2.ownedNfts[i])
                        }
                    }
                    console.log('i='+i, JSON.stringify(ownedNFTs));
                    pageKey = tiles2.pageKey;
                } catch(err){
                    console.log(err);
                }
                await new Promise(r => setTimeout(r, (60/60)*1000));
            }
            console.log('ownedNFTs:',ownedNFTs);
            // await new Promise(r => setTimeout(r, (60/10)*1000));
        }

    }
}

function toggleMaType(){
    let map_switcher = document.getElementById('map_switcher');
    if(map_switcher.innerHTML == 'Long Map'){
        map_switcher.innerHTML = 'Square Map';
        mapSize = 1024+512;
        loadMap();
    } else {
        map_switcher.innerHTML = 'Long Map';
        mapSize = 350;
        loadMap();
    }
}

function loadWallet(walletArr){
    document.getElementById('map').innerHTML = '<div id="infoBox" style="display:none;"></div>';

    mainMap = new mapboxgl.Map({
        container: 'map', 
        style: {version: 8,sources: {},layers: []},
        center: [0, 0], 
        zoom: 16, // Start at the highest zoom level
    });

    mainMap.on('load', async () => {

        await loadNFTs(walletArr);
    
        const grid1 = generateGrid([0, 0], mapSize/1, 1); // This creates a 1024x1024 grid with each tile being 1x1 units
        // const grid2 = generateGrid([0, 0], mapSize/2, 2);
        // const grid4 = generateGrid([0, 0], mapSize/4, 4);
        // const grid8 = generateGrid([0, 0], mapSize/8, 8);
        // const grid16 = generateGrid([0, 0], mapSize/16, 16.5);
        const grid16 = generateGrid([0, 0], mapSize/16, 16, 0.5);
        const grid32 = generateGrid([0, 0], mapSize/32-1, 32, 0.5);
/*
        const latChange = 64 / 111000 * mapSize; // approximately 0.000576
        const lonChange = latChange; // approximation

        const start = [
            0,
            0,
        ];

        mainMap.addSource("lineSource1", generateLines([0, 0], 16));

        mainMap.addLayer({
            "id": "line1",
            "type": "line",
            "source": "lineSource1",
            "layout": {},
            "paint": {
                "line-color": "green",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

        mainMap.addSource("lineSource2", generateLines([0, 0], 32));

        mainMap.addLayer({
            "id": "line2",
            "type": "line",
            "source": "lineSource2",
            "layout": {},
            "paint": {
                "line-color": "#FFEA00",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

        mainMap.addSource("lineSource3", generateLines([0, 0], 48));

        mainMap.addLayer({
            "id": "line3",
            "type": "line",
            "source": "lineSource3",
            "layout": {},
            "paint": {
                "line-color": "orange",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

        mainMap.addSource("lineSource4", generateLines([0, 0], 64));

        mainMap.addLayer({
            "id": "line4",
            "type": "line",
            "source": "lineSource4",
            "layout": {},
            "paint": {
                "line-color": "red",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

        mainMap.addSource("circleSource1", createGeoJSONCircle([0, 0], (32*32)/1000));

        mainMap.addLayer({
            "id": "circle1",
            "type": "line",
            "source": "circleSource1",
            "layout": {},
            "paint": {
                "line-color": "green",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

        mainMap.addSource("circleSource2", createGeoJSONCircle([0, 0], (64*32)/1000));

        mainMap.addLayer({
            "id": "circle2",
            "type": "line",
            "source": "circleSource2",
            "layout": {},
            "paint": {
                "line-color": "#FFEA00",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

        mainMap.addSource("circleSource3", createGeoJSONCircle([0, 0], (96*32)/1000));

        mainMap.addLayer({
            "id": "circle3",
            "type": "line",
            "source": "circleSource3",
            "layout": {},
            "paint": {
                "line-color": "orange",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

        mainMap.addSource("circleSource4", createGeoJSONCircle([0, 0], (128*32)/1000));

        mainMap.addLayer({
            "id": "circle4",
            "type": "line",
            "source": "circleSource4",
            "layout": {},
            "paint": {
                "line-color": "red",
                "line-width": 2
                // "fill-opacity": 0.25
            }
        });

*/
        const overlay = generateOverlay([0, 0], mapSize, 1/54.75, 0.5)

        mainMap.addSource("myImageSource", {
            "type": "image",
            "url": "./map/0_0.png",
            "coordinates": overlay
        });

        mainMap.addLayer({
            "id": "overlay",
            "source": "myImageSource",
            "type": "raster",
            "paint": {
            "raster-opacity": 1.0
            }
        });
    
        mainMap.addSource('grid1', {
            type: 'geojson',
            data: grid1,
            generateId: true
        });

        mainMap.addSource('grid16', {
            type: 'geojson',
            data: grid16,
            generateId: true
        });

        mainMap.addSource('grid32', {
            type: 'geojson',
            data: grid32,
            generateId: true
        });
    
        mainMap.addLayer({
            id: 'grid-1',
            type: 'fill',
            source: 'grid1',
            layout: {},
            paint: {
                'fill-color': [
                    'case',
                    ['boolean',['feature-state', 'clicked'], false],  // Check if isXZero property is true
                    '#00f',   // Color for tiles where x=0
                    // ['==', ['get', 'isXYZero'], true],  // Check if isXZero property is true
                    // '#fff',   // Color for tiles where x=0
                    // ['==', ['get', 'isXZero'], true],  // Check if isXZero property is true
                    // '#000',   // Color for tiles where x=0
                    // ['get', 'isOwned'],  // Check if isXZero property is true
                    ['get', 'district_type'],
                    // Otherwise
                    // '#088',    // Default color for other tiles
                    
                ],
                'fill-opacity': 0.9,
                // 'fill-outline-color': '#888',
                // 'fill-outline-opacity': 0
            },
        });

        mainMap.addLayer({
            id: 'grid-16',
            type: 'line',
            source: 'grid16',
            layout: {},
            paint: {
                'line-color': '#AAA',
                'line-opacity': 0.5
            },
        });

        mainMap.addLayer({
            id: 'grid-32',
            type: 'line',
            source: 'grid32',
            layout: {},
            paint: {
                'line-color': '#000',
                'line-opacity': 0.75,
                'line-width': 1.5
            },
        });
        
    
        mainMap.setLayoutProperty(`grid-1`, 'visibility', 'visible');
        mainMap.setLayoutProperty(`grid-16`, 'visibility', 'visible');
        mainMap.setLayoutProperty(`grid-32`, 'visibility', 'visible');
        mainMap.setLayoutProperty(`overlay`, 'visibility', 'none');

        mainMap.moveLayer('grid-32', 'grid-16');

        /*
        mainMap.moveLayer('circle4', 'grid-16');
        mainMap.moveLayer('circle3', 'circle4');
        mainMap.moveLayer('circle2', 'circle3');
        mainMap.moveLayer('circle1', 'circle2');


        mainMap.moveLayer('line4', 'grid-16');
        mainMap.moveLayer('line3', 'line4');
        mainMap.moveLayer('line2', 'line3');
        mainMap.moveLayer('line1', 'line2');
        */
        
        // Fit the map to the grid's bounds
        mainMap.fitBounds(grid1.bounds, {
            padding: 20,  // adding a little padding for better visuals
            linear: true,  // ensures the movement to fit bounds is smooth
        });
    });
    
    mainMap.on('click', function (e) {
        const features = mainMap.queryRenderedFeatures(e.point, { layers: ['grid-1'] }); // 'grid' is the ID of the layer
    
        if (!features.length) {
            return;
        }
    
        const clickedFeature = features[0];
        const x = clickedFeature.properties.x-(mapSize/2);
        const y = (clickedFeature.properties.y-(mapSize/2)) * -1;
        const token_id = (clickedFeature.properties.token_id);
        
    
        if(typeof selectedFeatureID === 'number') { // Need to change this
            mainMap.removeFeatureState({
                source: "grid1",
                id: selectedFeatureID
            });
        }
    
        selectedFeatureID = clickedFeature.id; // Get generated ID
    
        mainMap.setFeatureState({
            source: 'grid1',
            id: selectedFeatureID,
        }, {
            clicked: true
        });
    
        // Update the info box content
        document.getElementById('coords').textContent = `Coordinates: ${x}, ${y}`;
        const linkElem = document.getElementById('link');
        linkElem.target = '_blank';
        linkElem.href = `https://upstreet.ai/adventure/#${x*64},${y*64}`;

        let deedElm = document.getElementById('deed');
        const linkElemOpensea = document.getElementById('opensea');
        if(token_id != -1){
            deedElm.style.display = 'block';
            linkElemOpensea.style.display = 'block';
            deedElm.textContent = `Deed #: ${token_id}`;
            linkElemOpensea.target = '_blank';
            linkElemOpensea.href = `https://opensea.io/assets/ethereum/0xcbf4beb93b2eaa4e148d347553a9bd8fed0d7da3/${token_id}`;
        } else {
            deedElm.style.display = 'none';
            linkElemOpensea.style.display = 'none';
        }
    
        // Display the info box
        document.getElementById('info-box').style.display = 'block';
    });
    
}




function generateGrid(center, gridSize, width, offset, owner) {

    const features = [];

    const latChange = 64 / 111000 * width; // approximately 0.000576
    const lonChange = latChange; // approximation

    const start = [
        center[0] - (gridSize * lonChange) / 2 + ((offset ? offset : 0) * lonChange/width),
        center[1] - (gridSize * latChange) / 2 + ((offset ? offset : 0) * lonChange/width),
    ];

    let offsetX = 0;
    let inset = 0;
    let map_switcher = document.getElementById('map_switcher');
    if(map_switcher.innerHTML == 'Square Map'){
        offsetX = 64;
        inset = (mapSize/2);
    }
    for (let x = inset-offsetX; x < gridSize - inset + offsetX; x++) {
        for (let y = 0; y < gridSize; y++) {
            const baseX = start[0] + x * lonChange;
            const baseY = start[1] + y * latChange;
            const district = getOwner(x-(mapSize/2),(y-(mapSize/2))*-1);
            const owned = isOwned(x-(mapSize/2),(y-(mapSize/2))*-1);
            const cube = {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [baseX, baseY],
                            [baseX + lonChange, baseY],
                            [baseX + lonChange, baseY + latChange],
                            [baseX, baseY + latChange],
                            [baseX, baseY],
                        ],
                    ],
                },
                properties: {
                    x, y,
                    token_id: district[1],
                    // isXZero: x === gridSize/2 ? true : false,
                    // isXYZero: x === gridSize/2 && y === gridSize/2 ? true : false,
                    isOwned: owned,
                    district_type: district[0]
                },
            };

            features.push(cube);
        }
    }

    const zoom_start = [
        center[0] - (gridSize * lonChange) / 2,
        center[1] - (gridSize * latChange) / 2,
    ];

    const bounds = [
        [zoom_start[0], zoom_start[1]],
        [zoom_start[0] + gridSize * lonChange, zoom_start[1] + gridSize * latChange]
    ];

    return {
        type: 'FeatureCollection',
        features: features,
        bounds: bounds
    };
}

function generateLines(center, width) {

    const latChange = 64 / 111000 * width; // approximately 0.000576
    const lonChange = latChange; // approximation


    return {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: 
                    [
                        [center[0]+latChange, center[1]-(latChange*1024)],
                        [center[0]+latChange, center[1]+(latChange*1024)],
                        [center[0]-latChange, center[1]-(latChange*1024)],
                        [center[0]-latChange, center[1]+(latChange*1024)],
                    ],
            },
            properties: {},
        }
    };
}

function generateOverlay(center, gridSize, width, offset) {

    const latChange = 64 / 111000 * width; // approximately 0.000576
    const lonChange = latChange; // approximation

    const start = [
        center[0] - (gridSize * lonChange) / 2 + ((offset ? offset : 0) * lonChange/width),
        center[1] - (gridSize * latChange) / 2 + ((offset ? offset : 0) * lonChange/width),
    ];

    const baseX1 = start[0];
    const baseX2 = start[0] + mapSize * lonChange;
    const baseY1 = start[1];
    const baseY2 = start[1] + mapSize * latChange;

    return [
        [baseX1, baseY1],
        [baseX1, baseY2],
        [baseX2, baseY2],
        [baseX2, baseY1],
    ];
}

function isOwned(x,y){
    let owned = false;
    let owners = Object.keys(ownedNFTs)
    owners.forEach((owner)=>{
        ownedNFTs[owner].forEach((tile)=>{
            if(tile.x == x && tile.y == y){
                owned = true;
            }
        })
    });
    return owned;
}

function getOwner(x,y){
    let ownerIndex = -1;
    let ownerWallet = '';
    let owners = Object.keys(ownedNFTs)
    let tokenId = -1;
    owners.forEach((owner, index)=>{
        ownedNFTs[owner].forEach((tile)=>{
            if(tile.x == x && tile.y == y){
                ownerIndex = index;
                ownerWallet = owner;
                tokenId = tile.id;
            }
        })
    });

    if(x == 0 && y == 0){
        return ['#FF00FF', tokenId];
    } else if(x == 0){
        return ['#746855', tokenId];
    } else {
        return [ownerIndex != -1 ? stringToColor(ownerWallet) : '#fff', tokenId];
    }
}

function stringToColor(str) {
    // Generate a hash of the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert the hash to a 6-digit hexadecimal color
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 12)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    
    return color;
}

function toggleMap() {
    const clickedLayer = 'overlay';
     
    const visibility = mainMap.getLayoutProperty(
        clickedLayer,
        'visibility'
    );
     
    // Toggle layer visibility by changing the layout object's visibility property.
    if (visibility === 'visible') {
        mainMap.setLayoutProperty(clickedLayer, 'visibility', 'none');
        mainMap.setPaintProperty('grid-1', 'fill-opacity', 0.9);
        mainMap.setPaintProperty('grid-1', 'fill-outline-color', undefined);
    } else {
        mainMap.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        mainMap.setPaintProperty('grid-1', 'fill-opacity', 0.25);
        mainMap.setPaintProperty('grid-1', 'fill-outline-color', '#888888');
    }
}

var createGeoJSONCircle = function(center, radiusInKm, points) {
    if(!points) points = 64;

    var coords = {
        latitude: center[1],
        longitude: center[0]
    };

    var km = radiusInKm;

    var ret = [];
    var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
    var distanceY = km/110.574;

    var theta, x, y;
    for(var i=0; i<points; i++) {
        theta = (i/points)*(2*Math.PI);
        x = distanceX*Math.cos(theta);
        y = distanceY*Math.sin(theta);

        ret.push([coords.longitude+x, coords.latitude+y]);
    }
    ret.push(ret[0]);

    return {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [ret]
                }
            }]
        }
    };
};

loadMap();