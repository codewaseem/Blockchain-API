const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
/* requestValidation endpoint

curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
}'

{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "requestTimeStamp": "1532296090",
  "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
  "validationWindow": 300
}
*/

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
        res.json({
            success: true,
            data: {
                address: address,
                requestTimeStamp: requestTimeStamp,
                message: `${address}:${requestTimeStamp}:starRegistry`,
                validationWindow: VALIIDATION_WINDOW_SECONDS
            }
        });
    } else {
        res.statusCode = 400;
        res.json({
            success: false,
            message: "Address not provided."
        });
    }
}

export function messageSignatureValidate(req, res) {
    let { address, signature } = req.body;
    if (address && signature) {
        if (requestTimer.isRequestExpired(address)) {
            res.statusCode = 400;
            res.json({
                success: false,
                message: "Signature expired."
            });
        } else {
            const requestTimeStamp = requestTimer.getTimeStampFor(address);
            const message = `${address}:${requestTimeStamp}:starRegistry`;
            if (bitcoinMessage.verify(message, address, signature)) {
                res.json({
                    success: true,
                    data: {
                        "registerStar": true,
                        "status": {
                            address,
                            requestTimeStamp,
                            message,
                            validationWindow: getTimeStampInSeconds() - requestTimeStamp,
                            messageSignature: "valid"
                        }
                    }
                })
            } else {
                res.statusCode = 400;
                res.json({
                    success: false,
                    message: "Signature expired/invalid."
                });
            }
        }
    } else {
        res.statusCode = 400;
        res.json({
            success: false,
            message: "Address/Signature not provided."
        });
    }
}