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
    default: new Date(),
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  imageBackUp: {
    type: String,
  },
});

const Crypto = model("Crypto", cryptoSchema, "crypto");

export default Crypto;
