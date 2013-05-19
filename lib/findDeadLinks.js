#!/usr/bin/env node

var AssetGraph = require('assetgraph');

AssetGraph({root: './public'})
    .loadAssets('*.html')
    .populate({
        followRelations: {to: {url: /^file:/}},
        onError: function (err, assetGraph, asset) {
            console.error(asset.url + ': ' + err.message);
        }
    })
    .run();
