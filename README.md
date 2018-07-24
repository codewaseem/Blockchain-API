## Introduction

This project is from Udacity's Blockchain Developer Nanodegree Program. The goal of this 
project is to create a public REST API in Node.js to interact with the Private Blockchian
which was implemented in the previous project. 
The REST API lets you
* Query the blockchain to get the block at a given height
* Add a new block to the blockchain

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

* `GET` `/block/:height` (full url `http://localhost:8000/block/:height`)
This will get the block at the given `:height`. The `:height` can be any positive integer starting from `0` which represts the block height/number.

Example:
Hitting `http://localhost:8000/block/11` with `GET` request returns
```
{
    "success": true,
    "data": {
        "height": 11,
        "body": "Test string",
        "time": "1532425867",
        "previousBlockHash": "d05b0c6b5d5b0e1f315ad40a98a528a676f889c33afde0adc837587e3541e671",
        "hash": "78664e5e21b6d6557209b9bbe2f041f7645d5ffeb0b6f877e160f14a3af9cac9"
    }
}
```

* `POST` `/block/` (full url `http://localhost:8000/block/`)
This will add a new block to the blockchain with the provided block data. The block data should be
provided by setting `data` property on the request `body` object. 
Like
```
body = {
    data : "Test block data"
} 
//Or
body = {
    data: {
        name: "Waseem",
        email: "waseem@example.com"
    }
}
```
#### Request Example using cURL
```
curl -X POST \
  http://localhost:8000/block \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	"data" : "Test block string"
}'
```
> Note how I'm setting the `data` property in the request body object, not directly setting it as the value for body.

#### Response Example for above command
```
{
    "success": true,
    "data": {
        "height": 15,
        "body": "Test block string",
        "time": "1532430603",
        "previousBlockHash": "c93145b8a29b6df298df57bf2e650bc4bea963e1c15c8eea4cc6bbe4a8942489",
        "hash": "98969945e98454b3fe7bad4461a9db22d9cbfc087dfd97b60140257fae574410"
    }
}
```

## Testing the REST Endpoints

* Please note that all the responses are returned in JSON format. All responses will always have 
a `success` property with Boolean value(true/false) which can be used to check if the request went well or failed. If `success` property is `true`, then you can access `data` property which will
have actual data inside it. If `success` property is `false`, then you can check `message` property which will tell you why the request failed. So in short here is the format of my JSON response
```
{
    "success": true/false // This property will be always preset in all responses.
    "data": // Actual data expected by the user. It may be preset or not.
    "message": // A message to user. It may be present or not.
}

```

* You can test the REST API with Postman, cURL or other methods you may know of.

* I have also provided a test file inside the test directory `app.test.js`. You can use this 
to play around and check the API. To run the tests type
```
yarn test
```
in your terminal.

### That's all for now