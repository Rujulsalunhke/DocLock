## Overview
DocLock is an innovative document storage platform designed to provide a secure and efficient solution for storing, managing, and verifying important documents using blockchain technology. In today’s digital age, data security and privacy are paramount, especially when dealing with sensitive information. DocLock addresses these concerns by employing a decentralized ledger system, which ensures that documents are not only securely stored but also immutable and verifiable.

### Key Features:
- **Decentralized Storage**: Unlike traditional document storage solutions, which rely on centralized servers, DocLock leverages blockchain technology to distribute document storage across a network of nodes. This decentralization enhances security by eliminating single points of failure and making unauthorized access virtually impossible.
  
- **Document Verification**: Each document stored in DocLock is hashed and recorded on the blockchain, creating a unique digital fingerprint. This allows users to verify the authenticity of documents easily, providing peace of mind that their information has not been altered or tampered with.

- **User-Centric Control**: Users retain full control over their documents. With the ability to grant or revoke access permissions, DocLock ensures that sensitive information is only available to authorized individuals. This user-centric approach promotes trust and confidentiality.

- **Enhanced Privacy**: Built with privacy in mind, DocLock employs advanced encryption techniques to protect user data. Even in a decentralized environment, users can be confident that their documents are safe from unauthorized access and breaches.

- **Robust Document Management**: The platform is designed to streamline the process of document management. Users can easily upload, store, and retrieve documents while maintaining an organized and user-friendly interface.

DocLock aims to revolutionize the way individuals and organizations manage sensitive documents by providing a reliable, secure, and user-friendly solution that adapts to the evolving needs of today's digital landscape.


## The asset transfer basic sample demonstrates:

- Connecting a client application to a Fabric blockchain network.
- Submitting smart contract transactions to update ledger state.
- Evaluating smart contract transactions to query ledger state.
- Handling errors in transaction invocation.

## About the sample

This sample includes smart contract and application code in multiple languages. This sample shows create, read, update, transfer and delete of an asset.

For a more detailed walk-through of the application code and client API usage, refer to the [Running a Fabric Application tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html) in the main Hyperledger Fabric documentation.

### Application

Follow the execution flow in the client application code, and corresponding output on running the application. Pay attention to the sequence of:

- Transaction invocations (console output like "**--> Submit Transaction**" and "**--> Evaluate Transaction**").
- Results returned by transactions (console output like "**\*\*\* Result**").

### Smart Contract

The smart contract (in folder `chaincode-xyz`) implements the following functions to support the application:

- CreateAsset
- ReadAsset
- UpdateAsset
- DeleteAsset
- TransferAsset

Note that the asset transfer implemented by the smart contract is a simplified scenario, without ownership validation, meant only to demonstrate how to invoke transactions.

## Running the sample

The Fabric test network is used to deploy and run this sample. Follow these steps in order:

1. Create the test network and a channel (from the `test-network` folder).
   ```
   ./network.sh up createChannel -c mychannel -ca
   ```

1. Deploy one of the smart contract implementations (from the `test-network` folder).
   ```
   # To deploy the  chaincode implementation
   ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
   ```

1. Run the application (from the `asset-transfer-basic` folder).
   ```
   # To run the Typescript sample application
   cd application-gateway-typescript
   npm install
   npm start

   # To run the Go sample application
   cd application-gateway-go
   go run .

   # To run the Java sample application
   cd application-gateway-java
   ./gradlew run
   ```

## Clean up

When you are finished, you can bring down the test network (from the `test-network` folder). The command will remove all the nodes of the test network, and delete any ledger data that you created.

```
./network.sh down
```


## Prerequisites

To get the most out of this guide, you should have:
- **Basic understanding of blockchain technology**
- Familiarity with **Docker** and **Kubernetes** for container management
- **Command-line interface** knowledge
- Experience with **Node.js** and/or **Go** programming (for chaincode development)

---

## Learning Path

1. **Blockchain Fundamentals** - Review the basics of blockchain and permissioned networks.
2. **Hyperledger Fabric Architecture** - Study the components, such as peers, orderers, channels, and MSPs.
3. **Development Setup** - Install required tools and set up the Fabric samples.
4. **Smart Contract Development** - Write, deploy, and manage chaincode.
5. **Building DApps** - Connect a decentralized application to interact with Hyperledger Fabric.
6. **Advanced Topics** - Explore multi-organization networks, security, and consensus mechanisms.

---
