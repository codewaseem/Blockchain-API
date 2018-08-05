import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import {
  requestValidation,
  messageSignatureValidate,
  registerStar,
  getStarByBlockHeight,
  getStarsByAddresses,
  getBlockByHash
} from "./api/starRegistry";

const DOT_ENV_PATH = ".env";
dotenv.config({ path: DOT_ENV_PATH });

const app = express();

app.set("port", process.env.PORT || 8000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Server is working"
  });
});

app.post("/block/", registerStar);

app.get("/block/:height", getStarByBlockHeight);

app.get("/stars/address::address", getStarsByAddresses);

app.get("/stars/hash::hash", getBlockByHash);

app.post("/requestValidation", requestValidation);

app.post("/message-signature/validate", messageSignatureValidate);

export default app;