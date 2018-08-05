import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import Blockchain from "./models/Blockchain";
import { requestValidation, messageSignatureValidate } from "./api/starRegistry";

const DOT_ENV_PATH = ".env";
dotenv.config({ path: DOT_ENV_PATH });

const app = express();

app.set("port", process.env.PORT || 8000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const blockChain = new Blockchain();

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Server is working"
  });
});

/**
 * POST /block
 * This will create and add new block to the blockchain
 * The block data should be set on data property inside 
 * the body object e.g body.data = "Test Data",
 * otherwise it will respond with an error.
 */
app.post("/block/", (req, res) => {
  const blockData = req.body.data;
  if (blockData) {
    blockChain.createAndAddBlock(blockData)
      .then(block => {
        res.json({
          success: true,
          data: block
        });
      });
  } else {
    res.statusCode = 400;
    res.json({
      success: false,
      message: "Please provide the block data by setting the data property of the request's body object"
    });
  }
});

/**
 * GET /block/:height,
 * gets the block at the given height
 */
app.get("/block/:height", async (req, res) => {
  try {
    const block = await blockChain.getBlock(req.params.height);
    if (block)
      res.json({
        success: true,
        data: block
      });
    else {
      res.statusCode = 404;
      res.json({
        success: false,
        message: "block " + req.params.height + " does not exist."
      });
    }
  } catch (e) {
    res.statusCode = 500;
    res.json({
      success: false,
      message: "Something went wrong while getting block " + req.params.height
    });
  }

});

//Endpoint to get the entire block chain
app.get("/blockchain/", async (req, res) => {
  try {
    const entireChain = await blockChain.getChain();
    res.json({
      success: true,
      data: entireChain
    });
  } catch (e) {
    res.statusCode = 500;
    res.json({
      success: false,
      message: "Something went wrong while getting entire blockchain"
    });
  }
});

app.post("/requestValidation", requestValidation);

app.post("/message-signature/validate", messageSignatureValidate);

export default app;