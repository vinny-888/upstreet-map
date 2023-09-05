mapboxgl.accessToken = 'pk.eyJ1Ijoidmlubnk4ODgiLCJhIjoiY2xtNWRteTlxMWQwdjNmcDZhcWtlcGxqMiJ9.zudQQYFrNrsQqYbdQAdSdw';

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
                let url = 'https://eth-mainnet.g.alchemy.com/nft/v2/g3d4-b8b3P8N1puDX_X5HCh5ONljftBB/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+newWallet+'&withMetadata=true';
                try{
                    const response = await fetch(url);
                    const tiles = await response.json();
                    console.log(tiles);
            
                    for(let i=0; i<tiles.ownedNfts.length; i++){
                        let tileMetadata = tiles.ownedNfts[i].metadata;
                        let location = tileMetadata.attributes.find((att)=>att.trait_type == 'Location');
                        let loc = location.value.replace('[', '').replace(']', '').split(',')
                        if(loc[0] != null && loc[1] != null){
                            ownedNFTs[newWallet].push({
                                x: parseInt(loc[0]),
                                y: parseInt(loc[1])
                            })
                        }
                    }
                    console.log('i='+i, JSON.stringify(ownedNFTs));
                    await new Promise(r => setTimeout(r, (60/20)*1000));
                    let pageKey = tiles.pageKey;
                    while(pageKey){
                        let url2 = 'https://eth-mainnet.g.alchemy.com/nft/v2/g3d4-b8b3P8N1puDX_X5HCh5ONljftBB/getNFTs?contractAddresses[]=0xcbF4BEB93B2eAA4E148D347553A9bd8fEd0D7Da3&owner='+newWallet+'&withMetadata=true&pageKey='+pageKey;
                        try{
                            const response2 = await fetch(url2);
                            const tiles2 = await response2.json();
                            console.log(tiles);
                    
                            for(let i=0; i<tiles2.ownedNfts.length; i++){
                                let tileMetadata = tiles2.ownedNfts[i].metadata;
                                let location = tileMetadata.attributes.find((att)=>att.trait_type == 'Location');
                                let loc = location.value.replace('[', '').replace(']', '').split(',')
                                if(loc[0] != null && loc[1] != null){
                                    ownedNFTs[newWallet].push({
                                        x: parseInt(loc[0]),
                                        y: parseInt(loc[1])
                                    })
                                }
                            }
                            console.log('i='+i, JSON.stringify(ownedNFTs));
                            pageKey = tiles2.pageKey;
                        } catch(err){
                            console.log(err);
                        }
                        await new Promise(r => setTimeout(r, (60/20)*1000));
                    }
                } catch(err){
                    console.log(err);
                    i--;
                }
                await new Promise(r => setTimeout(r, (60/20)*1000));
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
        const y = (clickedFeature.properties.y-128) * -1;
        
    
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
    let ownerWallet = '';
    let owners = Object.keys(ownedNFTs)
    owners.forEach((owner, index)=>{
        ownedNFTs[owner].forEach((tile)=>{
            if(tile.x == x && tile.y == y){
                ownerIndex = index;
                ownerWallet = owner;
            }
        })
    });

    if(x == 0 && y == 0){
        return '#fff';
    }else if(x == 0){
        return '#000';
    } else {
        return ownerIndex != -1 ? stringToColor(ownerWallet) : '#088';
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