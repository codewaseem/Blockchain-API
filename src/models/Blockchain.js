import Block from "./Block";
import { SHA256 } from "crypto-js";

const level = require("level");

const chainDB = level("./chaindata");
const CHAIN_DB_NAME = "blockchain";

/**
 * Blockchain class responsible for creating and adding blocks to the blockchain.
 * This class can also validate the individual block or entire blockchain.
 */
class Blockchain {

    constructor() {
        this.createAndAddBlock("Genesis block");
    }

    /**
     * Returns a promise of array of blocks (blockchain) from the levelDB, if
     * there is no data in the levelDB then promise of empty array is returned.
     */
    async getChain() {
        return (await chainDB.get(CHAIN_DB_NAME).then(JSON.parse).catch(() => []));
    }

    async getStarsRegistryByAddress(address) {
        let chain = await this.getChain();
        return chain.filter((block => {
            return block.body.address === address;
        }));
    }

    async getBlockByHash(hash) {
        let chain = await this.getChain();
        let blockFound = null;
        for (let block of chain) {
            if (block.hash === hash) {
                blockFound = block;
            }
        }
        return blockFound;
    }
    /**
     * This helper method returns hash of last block in the provided blockchain, if there is no block in the
     * blockchain then it will return an empty string.
     * @param chain the current blockchain
     */
    getLastBlockHash(chain) {
        const lastBlock = chain.length > 0 ? chain[chain.length - 1] : false;
        if (lastBlock) {
            return lastBlock.hash;
        }
        return "";
    }

    /**
     * This is a helper method which will add the given block to 
     * the provided blockchain. I have made it private to prevent adding 
     * invalid block to the blockchain. This method also add/updates the 
     * blockchain in the levelDB.
     * @param chain The blockchain to which new block will be added.
     * @param block The new block that will be added to the provided chain.
     */
    async __addBlock(chain, block) {
        chain.push(block);
        await chainDB.put(CHAIN_DB_NAME, JSON.stringify(chain));
    }

    /**
     * This creates a new block with the given `data` and add it to
     * the blockchain.
     * @param data The data which will be attached to the body of new block
     */
    async createAndAddBlock(data) {
        const chain = await this.getChain();
        const newBlock = new Block(chain.length, data, this.getLastBlockHash(chain));
        await this.__addBlock(chain, newBlock);
        return newBlock;
    }

    /**
     * Returns the promise with current height of blockchain.
     */
    async getBlockHeight() {
        return (await this.getChain()).length - 1;
    }

    /**
     * Returns the promise with the block at given blockNumber in the blockchain.
     * If blockNumber is invalid then Promise of undefined is returned.
     * @param blockNumber block number to retreive from the blockchain.
     */
    async getBlock(blockNumber) {
        const chain = await this.getChain();
        if (blockNumber >= 0 && blockNumber < chain.length) {
            return chain[blockNumber];
        }
        return undefined;
    }

    /**
     * Validates the block at the given number and returns the promise with the 
     * boolean result.
     * @param blockHeight The block to validate.
     */
    async validateBlock(blockHeight) {
        const block = await this.getBlock(blockHeight);
        if (block) {
            const blockHash = block.hash;
            delete block.hash;
            const validBlockHash = SHA256(JSON.stringify(block)).toString();
            block.hash = validBlockHash;
            if (blockHash === validBlockHash) {
                return true;
            } else {
                console.log("Block #" + blockHeight + " invalid hash:\n" + blockHash + "<>" + validBlockHash);
                return false;
            }
        }
        return false;
    }

    /**
     * Validates the full blockchain and prints the appropriate message.
     */
    async validateChain() {
        const chain = await this.getChain();
        const errorLog = [];
        for (let i = 0; i < chain.length - 1; i++) {
            // validate block
            if (!this.validateBlock(i)) errorLog.push(i);
            // compare blocks hash link
            const blockHash = chain[i].hash;
            const previousHash = chain[i + 1].previousBlockHash;
            if (blockHash !== previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length > 0) {
            console.log("Block errors = " + errorLog.length);
            console.log("Blocks: " + errorLog);
        } else {
            console.log("No errors detected");
        }
    }
}
const blockChain = new Blockchain();

export default blockChain;
