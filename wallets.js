let holders_wallets = [
'0x70c6ed368545d454b8c8eaca4067e107e0c9445f',
'0xbc4bfa3119b488ce3d5516c3857fb59cf8549d5d',
'0x4ae0490ef5a18a4abeb1ceab7e5e7b8d437563ad',
'0x430c553f57e0906c0486173a14e324ca97adca8c',
'0x1cc1983396e55e925b777a0d70dfe8b56edee942',
'0x159c168d02bf0944ca55607f7d7180d884c1a345',
'0x3e7afe797451f55bd5dd4b00271d6ac3cf52a6ad',
'0xa4ac923590ee11bdd7336fedc0797e38841a48a7',
'0x25f1a1efdce3d72cb7b13f49e68502bc91636f74',
'0xb8aa541850bc792ce2675c958cafc100125c2b90',
'0x3d92c1bab6d936f7421b34c22fa76a721d6bda64',
'0x2a3f7e5170ea8ca967f85f091ef84591f639e031',
'0xdc65016d18f920948ee71add14ae095bad4c9575',
'0x8592c855f55e9c233581ac7411a1db4efa08ad03',
'0x614a61a3b7f2fd8750acaad63b2a0cfe8b8524f1',
// '0x4df14bce10a5ec2e051df9088a88f8d69d67d5f4',
'0xb789221616c7be137f33d545758f5510591d725e',
'0x8760e565273b47195f76a22455ce0b68a11af5b5',
'0x61409130b19b6abece717959cfc213935311385a',
'0x9ee5e3ff06425cf972e77c195f70ecb18ac23d7f',
'0x03a5086b1265f441e7c805097ab7a1fe782b3e94',
'0x4c25f69478878aeff5b3573aa9fcbd5a8b1d9695',
'0xade13e44f36ca76c1af0b95d5121c704f1060796',
'0xcecce5a3da042e8ad4d1e2019b1551d4c898dd6e',
'0xdbeef0b9a24688de61a4e7c416580410db83c3aa',
'0xf503289ad06424adfe07b998cf775cad69c462a2',
'0x96706eb471f875a9a41442f358d3b34ba02f868b',
'0xa8b4c7f8b3d91b324f815252da74884e68fb4c4c',
'0x7e13ea42cf985f9dbd5dd16868e47bdf9c1b2dc7',
'0xe64e58ed16979ae7de24e1161a0aa97fd508ade5',
'0xb3ffd0f321abde1740f6e13be273348baad24291',
'0x5a256de3021ba48b8aaf3fb279c80d15a32f79d9',
'0x1dffae2d7375ec101cef07af2079212a95b2dadb',
'0xf29a0b06bb927f6a58c6f3bba40c88cf305aacc7',
'0x68736380594f2768e89bd5ce5d9c7951214ba313',
'0x3e6c820f6f876605b107075c912cd4095a37b1c7',
'0x8a2f43e41f0c30e173861c39223cbcc828612b66',
'0xe4386e93bff9be5d4768a1f92d22c75129851c48',
'0x45e2c1b07cce6c0c361bb420c13fa0c6154981e9',
'0x0aaef7bbc21c627f14cad904e283e199ca2b72cc',
'0x1fbb99bf7e6e8920fac8ab371ceb5a90e0801656',
'0xfec381f0c8bff0188a20768f3d053bffb94d9975',
'0x67b98fa27f40028e9caaf5a02535cf112db833aa',
'0xf7256ed518fa3a8b1ddb2bbb0cd0071617df7bf4',
'0x14fa2497185c23290f999733ae6427eee5bc19fe',
'0x4595ff64328faf80a8cf0d52355639984b6af23c',
'0xe8cf545c5a0774174dd9d6a4e7c5b4d92f0e6c76',
'0xfd7c29397447aa64c47aa042713b206d8986821a',
'0x68cfac789db424b2fdf5abd6ccd9c33eb59a6578',
'0x8f942eced007bd3976927b7958b50df126feecb5',
'0xb72f37f5bc3efea93904883cd609b14fb13196b3',
'0xb516cdfb6a51412a4f2d9e4088f6f1503561f1ed',
'0x092cff73c77a9de794d25b0088ded0e430733dbb',
'0xb8b7dc5b439f72154dafc2c13376d861e0c19513',
'0x096234723ed2ba030a26814b46397e684278aff3',
'0x5379090f44666a0491f9e9a7f4261ef32023ea91',
'0xc4e4022edf895aed5dd9398cecbd80d9fd13185a',
'0x41ae0d3d648d6538d3221822b4f622c6f817e08a',
'0x956655642ba17a542c99b9ff0f7c1cb528a2bfd4',
'0xb94fb3cc45c11b3e1dffbc12490537a78306f1fe',
'0x5215d4ed62431862c0cbefc2a791acdf35dce87e',
'0x8950dfc38f167edbc085ecddf7dded3ed4a4edc3',
'0xca2386124855ec5a11752f59e5670c251a3d9ed9',
'0xfec33a90737254dcf9aa33188a11f32797197f93',
'0x87f3838742e5ff8958d7ce92aff4ecf07a1edcc8',
'0xb25b3cd94d4be28da703455fe1eee53eb1e1ba86',
'0x8b257b97c0e07e527b073b6513ba8ea659279b61',
'0x0fa074262d6af761fb57751d610dc92bac82aef9',
'0xf1c40e8c7c7770e5bd8d8638feebc80f9d3ba40d',
'0xf77259f9584d6c1eecaa4c77afbaccea63d7e226',
'0x303c36e5c473bf36bf643debeb61c68f780641aa',
'0x0a4561f7cfc8c5ef7502a8e611ddb0c731fac0f4',
'0x8096da6ced12b75684054ef16e1bf7e376353c29',
'0x5617797ef91378b5a3055dd447be4c972f404550',
'0xbf1a984d641c0718a1ca48c8a5d76d569c79af17',
'0xec54e4e7a040ddb9cc46924f702fe04769019264',
'0x08e242bb06d85073e69222af8273af419d19e4f6',
'0x90f440e449c47f4caf78c62c131dfc38ab491d4a',
'0xf78f37e2e6ffcd59b8b20f300871795835876dbb',
'0x6073eeb1b728ca634063893ce7dddd2ba4628587',
'0x115907de34da3d03a7ca8410b7b16fafeca9c966',
'0x0d5fea7fb04ca674f2db4eb4cd324257d59279a6',
'0x4525ac41ae8ee37892589b213ebf6b23bb99c661',
'0x2fec5d8835b39f314187dc1da933b273f32f18c3',
'0xed0517406c1d026a5a603e39c3d7cc981fd03666',
'0x2be4aaa52893219ec124c8afc8168b7a6103811a',
'0xca763fba83f1c68810297f5415972489606cb00f',
'0xc1d3f7aa4c9b909f3fba98e726deb86668116df1',
'0x45dd98db161d6972672645a64958a8924f33b22a',
'0x3863c8199b660f6bb1e0b9b40c58edce5999b17f',
'0x461ae8c33224aceb7f1259095dd2a334ad20f322',
'0x18513d49edf268127b6b616af1a98bc29d10f1f5',
'0xc69c9012c4acf6ba870b3c3d5cb7ddc001d53700',
'0x6d7eb9e77f5e92d37916664cc4515371c38357e0',
'0xbda72749428f3531f5973add1349e86e65a9a8de',
'0x097cf6c60650ea25a3443b9fac9ab4b60cdda24c',
'0x01a719a37c75f63968c0e597318914fb3210608f',
'0xb498043ee5c089a3fa19a81b3fd28fbba58c900d',
// '0xc2da1c8e893c017e4d55b4d8b69a52ef032eb76a',
'0x8ac3ecf6973e020cc0e6e8989fb71b4a77d65987',
'0x0d0d433e3d782694113d9852f65974f96a83ccc4',
'0x9458a17870cb070e8b82098484243012e2bce3ef',
'0xc4ee33c00900dd22f34fa361e2d679a28d513284',
'0xae0771f09141a60ec5de81164b1bfad054ce1be9',
'0x986e92868a27548a31e88f7692e746cd7e86f39a',
'0x524506de26b5d706feaaf97a34552cdac6645c34',
'0x854d7b77b762b2ca07b1ccc21e2a19eb1ccc34c7',
'0x66bdc08a0db3a83d374670a57aa8ecd5b51b55e5',
'0x2091ec62ef4f423dee1224101664bb9fc125886c',
'0x40c7625f6058e9cd7b4980af873f961daf850165',
'0xcc87ab42fc4ace2a68bfc1e28d7ddd578273035a',
'0x5e639619406fce83eae8b87d2e2a58c53a7f4bf4',
'0xde59a493e7dd7b0a3fe962299780fd956c8595cd',
'0xba02425d0674d69a74e50eb84bf7dc7d36236cde',
'0x14a8a0944897128d455a8d884ebcb708ae965a5d',
'0x54bf374c1a0eb4c52017cc52cf1633327ee3e985',
'0xba6c11bba5c811685598c1bb8fbec7d7ef2c12b7',
'0x7c7d093b4fb96c89fcc29cd4c24c15db0ed669df',
'0x81e5cd19323ce7f6b36c9511fbc98d477a188b13',
'0x92fab452e2f14c7730f79031906e06326c916946',
'0x2a1b7d53a87c2fd27d0cccb0d0a11fb76a688942',
'0x6b6512abf3d357d64048e92fee9b1267d11ffb65',
'0xc38a13404ba995c4521fe8c9349e5d9fa17ae8b4',
'0x5aca2e07fa37791c149b303427e1a1376450d36b',
'0x5bd01215c610ff2f3fcd38f895ee7111357e1931',
'0x1138cdc8e85330c428562aa7849e252de63c089f',
'0x20ad5ae1a93f20e3310c50af54f4e9208e1c2869',
'0xfacef700458d4fc9746f7f3e0d37b462711ff09e',
'0xb56cdccfc00e949d37b06592eff031003196802d',
'0x33debb5ee65549ffa71116957da6db17a9d8fe57',
'0x203b8aea5ec4047554709f22a3f0b216ace95e16',
'0xbba019f555ecae70a36cb1d45bb332c9d88df416',
'0x4670448c41a93c972bfa45b78a75e1c0cdc83ffe',
'0xb8f50e00356e8aa2a968ad043347e652e8a218ea',
'0xe33d9bd8220309191fce74d3e038ea87c6997f08',
'0x670a6eb62f5146d4b3b40c7b58aa31d175e3d6fb',
'0x4f074f7f08c8efc5d3d7c056d0dcb443ac17934f',
'0xc5c6b0f277928d39307231b2c26be3ee4ba6912c'];