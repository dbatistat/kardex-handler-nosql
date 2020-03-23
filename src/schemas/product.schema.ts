import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    productCode: String,
    quantity: Number,
    price: Number,
  });
