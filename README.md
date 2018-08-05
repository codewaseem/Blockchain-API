## Introduction

This project is from Udacity's Blockchain Developer Nanodegree Program. The goal of this 
project is to implement stary registry notarization service. 
*   The star registry service will notarize star ownership utilizing your blockchain identity.
*   The service will provide a message to verify wallet address utilizing message signature as proof. Verification process contains a validation window of five minutes.
*   Once a wallet address is verified, the owner has the right to register the star.
*   Each star has the ability to share a story. The story will support Ascii text which is encoded in hexadecimal format within our private blockchain.
*   The web API will provide functionality to look up the star by the star hash, star block height, or wallet address (blockchain ID).

##  Prerequisites

* Make sure you have Node.js installed.
* Then install `yarn`, by following the instructions from their website https://yarnpkg.com/lang/en/docs/install/

> Note: If you don't want to install `yarn` then you can use `npm` which comes
> with Node.js. Just make sure you replace `yarn` with `npm` in `package.json` and
> other places where I'm using `yarn` in the `README` file below.

## Running the project
* Downlaod/Clone this repo. If you have downlaoded the zip file then unzip it first and browse to
the project directory from your terminal.

* Once in the root directory of the project type the following and hit enter in your terminal
```
yarn install
```
to download all the dependencies.

* Then start the server by typing 
```
yarn start
```
in your terminal. This will start the server at `http://localhost:8000/`

* Now you are ready to test the REST API.

## About the REST Endpoints

## Blockchain ID registration request with five minute validation window

#### Endpoint: `POST` `/requestValidation` 

#### Example Request using curl
```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN"
}'
```
#### Example response
```
{
    "success": true,
    "data": {
        "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
        "requestTimeStamp": 1533472149,
        "message": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN:1533472149:starRegistry",
        "validationWindow": 300
    }
}
```

## Blockchain ID verification

#### Endpoint: `POST` `/message-signature/validate`

#### Example Request using cURL
```
curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"address" : "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
	"signature" : "HHCIa01XUlAbfqdFFAKO8P1BADSaeXYcvm/L76iyJQOitqU58Di5LgSzpUJqmuMUXSAUlDgHZi9WUlsuI8TCHEw="
}'
```
#### Example Response
```
{
    "success": true,
    "data": {
        "registerStar": true,
        "status": {
            "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
            "requestTimeStamp": 1533472149,
            "message": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN:1533472149:starRegistry",
            "validationWindow": 46,
            "messageSignature": "valid"
        }
    }
}
```

## Registering star

#### Endpoint: `POST` `/block`

#### Example Request using cURL
```
curl -X POST \
  http://localhost:8000/block \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"address" : "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
	"star" : {
		"dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
	}
}'
```
#### Example response
```
{
    "success": true,
    "data": {
        "height": 26,
        "body": {
            "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
            }
        },
        "time": "1533472200",
        "previousBlockHash": "2585019fd97dbd75bb4f428f0e5fda8b8567ef7beabafac288f7b212f4a2862d",
        "hash": "9639334e7cdf14fa410ac2d0e87dfa5cf29a2ad1f55ed3c03af32f4652b2985a"
    }
}
```

## Stars look-up by wallet address

#### Endpoint: `GET` `/stars/address:[your-wallet-address]`

#### Example Request using cURL
```
curl -X GET \
  http://localhost:8000/stars/address:1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN \
  -H 'Cache-Control: no-cache'
```
#### Example Response
```
{
    "success":true,
    "data":
    [
        {
            "height": 25,
            "body": {
                "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
                "star": {
                    "dec": "-26° 29' 24.9",
                    "ra": "16h 29m 1.0s",
                    "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
                }
            },
            "time": "1533471997",
            "previousBlockHash": "97c7b3b0471ebccbd7809a16d630a250b1cf255f2e5e336e204854a8d8299718",
            "hash": "2585019fd97dbd75bb4f428f0e5fda8b8567ef7beabafac288f7b212f4a2862d"
        },
        {
            "height": 26,
            "body": {
                "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
                "star": {
                    "dec": "-26° 29' 24.9",
                    "ra": "16h 29m 1.0s",
                    "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
                }
            },
            "time": "1533472200",
            "previousBlockHash": "2585019fd97dbd75bb4f428f0e5fda8b8567ef7beabafac288f7b212f4a2862d",
            "hash": "9639334e7cdf14fa410ac2d0e87dfa5cf29a2ad1f55ed3c03af32f4652b2985a"
        }
    ]
}

```

## Star look-up by block hash

#### Endpoint: `GET` `/stars/hash:[block-hash-here]`

#### Example Request using cURL
```
curl -X GET \
  http://localhost:8000/stars/hash:a78f1bcf16c6909080d7088da9d55cb1b1e3d589d015fd1339846421d89f8783 \
  -H 'Cache-Control: no-cache'

```
#### Example Response
```
{
    "success": true,
    "data": {
        "height": 18,
        "body": {
            "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1533460023",
        "previousBlockHash": "b56b6dc5c793711c63293e00bc797220e8b66ca251fa5e163fea6096eb814a7d",
        "hash": "a78f1bcf16c6909080d7088da9d55cb1b1e3d589d015fd1339846421d89f8783"
    }
}
```

## Star look-up by block height

#### Endpoint: `GET` `/block/[block-height]`

#### Example Request using cURL
```
curl -X GET \
  http://localhost:8000/block/26 \
  -H 'Cache-Control: no-cache'
```
#### Example Response
```
{
    "success": true,
    "data": {
        "height": 26,
        "body": {
            "address": "1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
            }
        },
        "time": "1533472200",
        "previousBlockHash": "2585019fd97dbd75bb4f428f0e5fda8b8567ef7beabafac288f7b212f4a2862d",
        "hash": "9639334e7cdf14fa410ac2d0e87dfa5cf29a2ad1f55ed3c03af32f4652b2985a"
    }
}
```


## Testing the REST Endpoints

* Please note that all the responses are returned in JSON format. All responses will always have 
a `success` property with Boolean value(true/false) which can be used to check if the request went well or failed. If `success` property is `true`, then you can access `data` property which will
have actual data inside it. If `success` property is `false`, then you can check `message` property which will tell you why the request failed. So in short here is the format of my JSON response
```
{
    "success": true/false // This property will be always present in all responses.
    "data": // Actual data expected by the user. It may be present or not.
    "message": // A message to user. It may be present or not.
}

```

* You can test the REST API with Postman, cURL or other methods you may know of.

### That's all for now