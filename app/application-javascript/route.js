const express = require("express");
const router = express.Router();
const app = express();
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

async function connectToGateway() {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }
    });
    return gateway;
}

async function cllBc() {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Evaluate Transaction: GetAllAssets');
        const result = await contract.evaluateTransaction('GetAllAssets');
        return { data: `${result.toString()}` };
    } finally {
        gateway.disconnect();
    }
}

async function CreateNewAssetBC(reqAsset) {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Submit Transaction: CreateAsset');
        const result = await contract.submitTransaction('CreateAsset',
            reqAsset.ID,
            reqAsset.DocumentFormat,
            reqAsset.DocumentType,
            reqAsset.Owner,
            reqAsset.DocumentURL
        );
        return { data: `${result.toString()}` };
    } finally {
        gateway.disconnect();
    }
}

async function GetAssetDetails(AssetID) {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Evaluate Transaction: ReadAsset');
        const result = await contract.evaluateTransaction('ReadAsset', AssetID);
        return { data: `${result.toString()}` };
    } finally {
        gateway.disconnect();
    }
}

async function UpdateAssetBC(AssetDetails) {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Submit Transaction: UpdateAsset');
        console.log('Asset Details:', AssetDetails);

        const result = await contract.submitTransaction('UpdateAsset',
            AssetDetails.ID,
            AssetDetails.DocumentFormat,
            AssetDetails.DocumentType,
            AssetDetails.Owner,
            AssetDetails.DocumentURL
        );

        console.log('*** Result: committed');
        return result && result.length > 0 ? { data: `${result.toString()}` } : { msg: 'Asset updated, no result returned' };
    } catch (error) {
        console.error(`******** FAILED to update the asset: ${error.message}`);
        throw new Error(`Update failed: ${error.message}`);
    } finally {
        gateway.disconnect();
    }
}


async function TransferAssetBC(assetID, newOwner) {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Submit Transaction: TransferAsset');
        // Call the chaincode's TransferAsset function with the assetID and newOwner
        await contract.submitTransaction('TransferAsset', assetID, newOwner);
        console.log(`*** Ownership of asset ${assetID} successfully transferred to ${newOwner}`);
    } catch (error) {
        console.error(`******** FAILED to transfer the asset: ${error}`);
        throw new Error(`Transfer failed: ${error.message}`);
    } finally {
        gateway.disconnect();
    }
}








async function DeleteAssetBC(assetID) {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Submit Transaction: DeleteAsset');
        await contract.submitTransaction('DeleteAsset', assetID);
        console.log('*** Asset Deleted');
    } catch (error) {
        console.error(`******** FAILED to delete the asset: ${error}`);
        throw new Error(`Delete failed: ${error.message}`);
    } finally {
        gateway.disconnect();
    }
}

async function GetAllUsers() {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Evaluate Transaction: GetAllUsers');
        const result = await contract.evaluateTransaction('getAllUsers');
        return { data: `${result.toString()}` };
    } finally {
        gateway.disconnect();
    }
}

// CREATE Asset
router.route("/create-asset").post(async (req, res) => {
    try {
        const result = await CreateNewAssetBC(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(`Create asset error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// READ Assets
router.route("/").get(async (req, res) => {
    try {
        const newdata = await cllBc();
        res.json(newdata);
    } catch (error) {
        console.error(`Read assets error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Get Single Asset
router.route("/edit-asset/:id").get(async (req, res) => {
    try {
        const newdata = await GetAssetDetails(req.params.id);
        res.json(newdata);
    } catch (error) {
        console.error(`Get asset details error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Update Asset
router.route("/update-asset/:id").put(async (req, res) => {
    try {
        const assetDetails = { ...req.body, ID: req.params.id };
        const result = await UpdateAssetBC(assetDetails);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Update asset error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});



// Transfer Asset
router.route("/transfer-asset/:id").put(async (req, res) => {
    try {
        const { newOwner } = req.body; // Expect `newOwner` in the request body
        if (!newOwner) {
            return res.status(400).json({ error: 'New owner is required' });
        }

        // Pass the asset ID and the new owner to the blockchain function
        await TransferAssetBC(req.params.id, newOwner);

        res.status(200).json({ msg: `Ownership of asset ${req.params.id} transferred to ${newOwner}` });
    } catch (error) {
        console.error(`Transfer asset error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});








// Delete Asset
router.route("/delete-asset/:id").delete(async (req, res) => {
    try {
        await DeleteAssetBC(req.params.id);
        res.status(200).json({ msg: 'Successfully Deleted' });
    } catch (error) {
        console.error(`Delete asset error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Get All Users
router.route("/users").get(async (req, res) => {
    try {
        const userData = await getAllUsers();
        res.json(userData);
    } catch (error) {
        console.error(`Get all users error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;