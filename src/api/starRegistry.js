const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
import blockChain from "../models/Blockchain";

const VALIIDATION_WINDOW_SECONDS = 300;

function getTimeStampInSeconds() {
    return Math.floor(Date.now() / 1000);
}

class RequestValidationTimer {


    constructor() {
        this.requests = {};
        this.timerID = this.start();
    }

    start() {
        setInterval(() => {
            const currentTime = getTimeStampInSeconds();
            Object.keys(this.requests).map(address => {
                if ((currentTime - this.requests[address]) > VALIIDATION_WINDOW_SECONDS) {
                    delete this.requests[address];
                }
            });
        }, 1000);

    }

    stop() {
        clearInterval(this.timerID);
    }

    addNewRequest(address, requestTimeStamp) {
        this.requests[address] = requestTimeStamp;
    }

    removeRequest(address) {
        delete this.requests[address];
    }

    isRequestExpired(address) {
        return !(this.requests[address]);
    }

    getTimeStampFor(address) {
        return this.requests[address];
    }
}

const requestTimer = new RequestValidationTimer();

export function requestValidation(req, res) {
    let { address } = req.body;
    if (address) {
        const requestTimeStamp = getTimeStampInSeconds();
        requestTimer.addNewRequest(address, requestTimeStamp);
        sendSuccessJsonResponse(res, {
            address: address,
            requestTimeStamp: requestTimeStamp,
            message: `${address}:${requestTimeStamp}:starRegistry`,
            validationWindow: VALIIDATION_WINDOW_SECONDS
        });
    } else {
        sendFailureJsonResponse(res, 400, "Address not provided.");
    }
}

export function messageSignatureValidate(req, res) {
    let { address, signature } = req.body;
    if (address && signature) {
        if (requestTimer.isRequestExpired(address)) {
            sendFailureJsonResponse(res, 400, "Signature expired.");
        } else {
            const requestTimeStamp = requestTimer.getTimeStampFor(address);
            const message = `${address}:${requestTimeStamp}:starRegistry`;
            if (bitcoinMessage.verify(message, address, signature)) {
                sendSuccessJsonResponse(res, {
                    "registerStar": true,
                    "status": {
                        address,
                        requestTimeStamp,
                        message,
                        validationWindow: getTimeStampInSeconds() - requestTimeStamp,
                        messageSignature: "valid"
                    }
                });
            } else {
                sendFailureJsonResponse(res, 400, "Signature expired/invalid.");
            }
        }
    } else {
        sendFailureJsonResponse(res, 400, "Address/Signature not provided.");
    }
}

export function registerStar(req, res) {
    let { address, star } = req.body;
    if (address && isStarDataValid(star)) {
        if (requestTimer.isRequestExpired(address)) {
            sendFailureJsonResponse(res, 400, "Request expired/used.");
        } else {
            const blockData = { address, star };
            blockChain.createAndAddBlock(blockData)
                .then(block => {
                    sendSuccessJsonResponse(res, block);
                });
            requestTimer.removeRequest(address);
        }
    } else {
        sendFailureJsonResponse(res, 400, "Address/star object is invalid.");
    }
}

export async function getStarByBlockHeight(req, res) {
    try {
        const block = await blockChain.getBlock(req.params.height);
        if (block)
            sendSuccessJsonResponse(res, block);
        else {
            sendFailureJsonResponse(res, 404, "block " + req.params.height + " does not exist.");
        }
    } catch (e) {
        sendFailureJsonResponse(res, 500, "Something went wrong while getting block " + req.params.height);
    }
}

export async function getStarsByAddresses(req, res) {
    try {
        const blocks = await blockChain.getStarsRegistryByAddress(req.params.address);
        sendSuccessJsonResponse(res, blocks);
    } catch (e) {
        sendFailureJsonResponse(res, 500, "Something went wrong!");
    }
}

export async function getBlockByHash(req, res) {
    try {
        let block = await blockChain.getBlockByHash(req.params.hash);
        if (block) {
            sendSuccessJsonResponse(res, block);
        } else {
            sendFailureJsonResponse(res, 404, "No block found by hash " + req.params.hash);
        }
    } catch (e) {
        sendFailureJsonResponse(res, 500, "Something went wrong!");
    }
}

function sendSuccessJsonResponse(res, data = "", message = "") {
    let response = {
        success: true
    };
    if (data) response.data = data;

    if (message) response.message = message;

    res.json(response);
}

function sendFailureJsonResponse(res, statusCode, message = "") {
    let response = {
        success: false,
    }

    if (message) response.message = message;

    res.statusCode = statusCode;

    res.json(response);
}

function isStarDataValid(star) {
    return (star && star.ra && star.dec && star.story && star.story.split(" ").length <= 250);
}