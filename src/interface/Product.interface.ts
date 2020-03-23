import { Document } from 'mongoose';

export interface Product extends Document {
    id: number;
    productCode: string;
    quantity: number;
    price: number;
  }
