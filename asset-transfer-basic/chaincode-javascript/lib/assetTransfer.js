/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: 'asset1',
                Color: 'blue',
                Size: 5,
                Owner: 'Tomoko',
                DocumentURL: 'QmV4ViggPP4kBBSBPhF2CMUyBsGLr8mJ33Txfb9Wj9WGuZ' // Add document URL or IPFS hash field
            },
            {
                ID: 'asset2',
                Color: 'red',
                Size: 5,
                Owner: 'Brad',
                DocumentURL: 'Qmeyy8DjQMtjNfNngG3woDmjRXwhZhvrcfKHWt8Hf9cwbR'
            },
            {
                ID: 'asset3',
                Color: 'green',
                Size: 10,
                Owner: 'Jin Soo',
                DocumentURL: 'QmcpQGsvPhGVVGfEKPi43aN1dbFf8y91MoLdzQaSuNjo94'
            },
            {
                ID: 'asset4',
                Color: 'yellow',
                Size: 10,
                Owner: 'Max',
                DocumentURL: 'QmdBZWVcSbcRtJZCdY59U7cRVh6xCu2Y66ZDQid3JWXyKW'
            },
            {
                ID: 'asset5',
                Color: 'black',
                Size: 15,
                Owner: 'Adriana',
                DocumentURL: 'QmUiRWB3e1ob3MaPD51JMjBALVfEZG1eaVicnJA3PHenU1'
            },
            {
                ID: 'asset6',
                Color: 'white',
                Size: 15,
                Owner: 'Michel',
                DocumentURL: 'QmdSLsY7RQo8mRk5NNMBSxATNQDFLTu8c37Kdn6GUiKSxu'
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    async CreateAsset(ctx, id, color, size, owner, documentURL) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const asset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            DocumentURL: documentURL // Store document URL or IPFS hash
        };
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async UpdateAsset(ctx, id, color, size, owner, documentURL) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            DocumentURL: documentURL // Update document URL or IPFS hash
        };
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    async GetAllAssets(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = AssetTransfer;