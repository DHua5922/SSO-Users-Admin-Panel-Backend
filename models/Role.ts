import mongoose from "../config/database.ts";

const Role = mongoose.createModel("role", {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

export default Role;
