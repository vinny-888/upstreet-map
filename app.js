mapboxgl.accessToken = 'pk.eyJ1Ijoidmlubnk4ODgiLCJhIjoiY2xtNWRteTlxMWQwdjNmcDZhcWtlcGxqMiJ9.zudQQYFrNrsQqYbdQAdSdw';

const tileSizes = [1, 2, 4, 8, 16, 32];
const zoomLevels = [11, 12, 13, 14, 15, 16];
let selectedFeatureID = null;
let ownedNFTs = {};
let mainMap = null;

const colors = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF8000", "#FF0080", "#80FF00", "#00FF80", 
    "#8000FF", "#0080FF", "#80FF80", "#FF8080", "#8080FF", "#800080", "#448044", "#808000", "#C0C0C0", "#400000",
    "#004000", "#000040", "#404000", "#400040", "#004040", "#800040", "#408000", "#004080", "#408040", "#404080", 
    "#804040", "#40FF40", "#804080", "#4080FF", "#FF4080", "#40FFFF", "#FF4040", "#40FF80", "#808040", "#404040", 
    "#808080", "#FF8040", "#80FF40", "#FF4080", "#40FF00", "#8000C0", "#80C080", "#4480C0", "#8080C0", "#800040", 
    "#408000", "#400080", "#C040C0", "#C04040", "#40C0C0", "#4040C0", "#C0C040", "#40C040", "#C04080", "#80C040", 
    "#4080C0", "#C08080", "#8080C0", "#C0C0FF", "#FFFFC0", "#FFC0FF", "#C0FFFF", "#80C0C0", "#C0FF80", "#80FFC0", 
    "#FFC080", "#80C0FF", "#C080C0", "#C08040", "#FF80C0", "#C0FF40", "#40C080", "#C0FFC0", "#FFC0C0", "#80FF80", 
    "#FF8080", "#80C080", "#8080FF", "#C080FF", "#80FFC0", "#80C0FF", "#C08080", "#FFC080", "#FF80FF", "#C0FF80", 
    "#80C0C0", "#80FF80", "#FFD700", "#ADFF2F", "#FA8072", "#F4A460", "#2E8B57", "#DAA520", "#DC143C", "#5F9EA0", 
    "#A0522D", "#7B68EE", "#00CED1", "#9ACD32", "#9400D3", "#FF69B4", "#696969", "#228B22", "#A9A9A9", "#556B2F", 
    "#BDB76B", "#9370DB", "#3CB371", "#B0E0E6", "#32CD32", "#66CDAA", "#BA55D3", "#4169E1", "#708090", "#6B8E23", 
    "#FFA07A", "#20B2AA", "#191970", "#E9967A", "#48D1CC", "#8B0000", "#2F4F4F", "#FF4500", "#6495ED", "#90EE90", 
    "#7FFF00", "#87CEFA", "#FFDAB9", "#B8860B", "#4682B4", "#EE82EE", "#8A2BE2", "#FF6347", "#00FA9A", "#40E0D0", 
    "#8B008B"];


function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

const urlParams = new URLSearchParams(window.location.search);
const wallet = urlParams.get('wallet')
if(wallet){
    document.getElementById('wallet').value = wallet;
    let walletArr = wallet.split(',')

    loadWallet(walletArr);
} else {
    loadWallet(['']);
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
                let url = 'https://eth-mainnet.g.alchemy.com/nft/v2/demo/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+newWallet+'&withMetadata=true';
                try{
                    const response = await fetch(url);
                    const tiles = await response.json();
                    console.log(tiles);
            
                    for(let i=0; i<tiles.ownedNfts.length; i++){
                        let tileMetadata = tiles.ownedNfts[i].metadata;
                        let location = tileMetadata.attributes.find((att)=>att.trait_type == 'Location');
                        let loc = location.value.replace('[', '').replace(']', '').split(',')
                        ownedNFTs[newWallet].push({
                            x: parseInt(loc[0]),
                            y: parseInt(loc[1])
                        })
                    }
                    console.log('i='+i, JSON.stringify(ownedNFTs));
                } catch(err){
                    console.log(err);
                    i--;
                }
                await new Promise(r => setTimeout(r, (60/2)*1000));
            }
        } else {
            Object.keys(all_wallets).forEach((wallet)=>{
                ownedNFTs[wallet] = [];
                all_wallets[wallet].forEach((tile)=>{
                    if(tile.x != null && tile.y != null){
                        ownedNFTs[wallet].push({
                            x: tile.x,
                            y: tile.y 
                        })
                    }
                })
            })
            console.log('claimed:', ownedNFTs.length);
            console.log('unclaimed:', all_wallets.length-ownedNFTs.length);
        }
        
    }else {

        ownedNFTs = {}
        for(let i=0; i<wallets.length; i++){
            let wallet = wallets[i];
            let url = 'https://eth-mainnet.g.alchemy.com/nft/v2/demo/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+wallet+'&withMetadata=true';
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
                    y: parseInt(loc[1])
                })
            }
            console.log('ownedNFTs:',ownedNFTs);
            // await new Promise(r => setTimeout(r, (60/10)*1000));
        }
    }
}

function loadWallet(walletArr){

    mainMap = new mapboxgl.Map({
        container: 'map', 
        style: {version: 8,sources: {},layers: []},
        center: [0, 0], 
        zoom: 16, // Start at the highest zoom level
    });

    mainMap.on('load', async () => {

        await loadNFTs(walletArr);
    
        const grid1 = generateGrid([0, 0], 256/1, 1); // This creates a 1024x1024 grid with each tile being 1x1 units
        const grid2 = generateGrid([0, 0], 256/2, 2);
        const grid4 = generateGrid([0, 0], 256/4, 4);
        const grid8 = generateGrid([0, 0], 256/8, 8);
        const grid16 = generateGrid([0, 0], 256/16, 16.5);
        const grid32 = generateGrid([0, 0], 256/32, 32, 16.5);
    
        mainMap.addSource('grid1', {
            type: 'geojson',
            data: grid1,
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
                'fill-opacity': 0.8,
                // 'fill-outline-color': '#888'
            },
        });

        mainMap.addLayer({
            id: 'grid-32',
            type: 'line',
            source: 'grid32',
            layout: {},
            paint: {
                'line-color': '#0f0',
                'line-opacity': 0.5,
            },
        });
    
        mainMap.setLayoutProperty(`grid-1`, 'visibility', 'visible');
        mainMap.setLayoutProperty(`grid-32`, 'visibility', 'visible');
        
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
        const x = clickedFeature.properties.x-128;
        const y = clickedFeature.properties.y-128;
        
    
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

    for (let x = -1; x < gridSize; x++) {
        for (let y = -1; y < gridSize; y++) {
            const baseX = start[0] + x * lonChange;
            const baseY = start[1] + y * latChange;
            const district = getOwner(x-128,(y-128)*-1);
            const owned = isOwned(x-128,(y-128)*-1);
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
                    // isXZero: x === gridSize/2 ? true : false,
                    // isXYZero: x === gridSize/2 && y === gridSize/2 ? true : false,
                    isOwned: owned,
                    district_type: district
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
    let owners = Object.keys(ownedNFTs)
    owners.forEach((owner, index)=>{
        ownedNFTs[owner].forEach((tile)=>{
            if(tile.x == x && tile.y == y){
                ownerIndex = index;
            }
        })
    });

    if(x == 0 && y == 0){
        return '#fff';
    }else if(x == 0){
        return '#000';
    } else {
        return ownerIndex != -1 ? colors[ownerIndex] : '#088';
    }
}