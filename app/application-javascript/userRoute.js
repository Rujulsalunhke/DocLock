const express = require("express");
const router = express.Router();
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const SibApiV3Sdk = require('sib-api-v3-sdk'); // Brevo SDK

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const mspOrg1 = 'Org1MSP'; // Ensure this is set to your organization's MSP
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

// Replace with your Brevo API Key
const brevoApiKey = "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";
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = brevoApiKey;

// Temporary OTP store
const otpStore = {};

// Function to connect to the Hyperledger Fabric Gateway
async function connectToGateway() {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    const wallet = await buildWallet(Wallets, walletPath);

    // Enroll admin and register a user
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

// Function to create a new user on the blockchain
async function CreateNewUserBC(reqUser) {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Submit Transaction: CreateUser');
        const result = await contract.submitTransaction('CreateUser',
            reqUser.username,
            reqUser.password,
            reqUser.email
        );
        return { data: `${result.toString()}` };
    } finally {
        gateway.disconnect();
    }
}

// Function to get all users from the blockchain
async function GetAllUsers() {
    const gateway = await connectToGateway();
    try {
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Evaluate Transaction: GetAllUsers');
        const result = await contract.evaluateTransaction('GetAllUsers'); // Ensure this method exists in your chaincode
        const users = JSON.parse(result.toString());

        // Filter users where docType is 'user'
        const filteredUsers = users.filter(user => user.docType === 'user');

        return filteredUsers;
    } finally {
        gateway.disconnect();
    }
}

// Function to send OTP via Brevo
async function sendOtp(email, otp) {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailContent = {
        sender: { email: "atharvamp04@gmail.com" },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`
    };

    await apiInstance.sendTransacEmail(emailContent);
}

// Route to verify OTP
router.post('/verifyOtp', async (req, res) => {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
        return res.status(400).send('Both email and OTP are required.');
    }

    // Verify OTP
    if (!otpStore[email] || otpStore[email] !== otp) {
        return res.status(400).send('Invalid or expired OTP.');
    }

    // Clear OTP after successful verification
    delete otpStore[email];
    res.status(200).send('OTP verified successfully.');
});

// Create user route
router.post('/createUser', async (req, res) => {
    const { username, password, email } = req.body;

    // Validate input
    if (!username || !password || !email) {
        return res.status(400).send('All fields are required: username, password, email.');
    }

    // Directly create the user on the blockchain (OTP is not required now)
    const reqUser = { username, password, email };

    try {
        const result = await CreateNewUserBC(reqUser);
        res.status(200).json({ message: 'User created successfully', data: result.data });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Failed to create user: ' + error.message);
    }
});

// Route to send OTP
router.post('/sendOtp', async (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send('Invalid email address.');
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        otpStore[email] = otp; // Store OTP temporarily
        setTimeout(() => delete otpStore[email], 5 * 60 * 1000); // Expire OTP after 5 minutes

        await sendOtp(email, otp);
        res.status(200).send('OTP sent successfully.');
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Failed to send OTP.');
    }
});

// Route to fetch all users
router.get("/", async (req, res) => {
    try {
        const userData = await GetAllUsers();
        res.status(200).json(userData);
    } catch (error) {
        console.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Export the router to be used in the main app
module.exports = router;