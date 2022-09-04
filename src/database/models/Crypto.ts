import { model, Schema } from "mongoose";

const cryptoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  team: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  ICO: {
    type: Date,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Crypto = model("Crypto", cryptoSchema, "cryptos");

export default Crypto;
