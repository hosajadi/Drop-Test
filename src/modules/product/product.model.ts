import { Schema, Document } from "mongoose";
import {BasicPaginatedModel} from "../../common/pagination.mapper";
import {number} from "@hapi/joi";


/**
 * Mongoose Product Schema
 */
export const Product = new Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    pantone_value: { type: String, required: true },
    date: {type: Date, default: Date.now},
});

/**
 * Mongoose Product Document
 */
export interface IProduct extends Document {
    /**
     * Id
     */
    readonly  id: Schema.Types.ObjectId;

    /**
     * Name
     */
    readonly  name: string;

    /**
     * Year
     */
    readonly year: number,

    /**
     * Color
     */
    readonly color: string,

    /**
     * Pantone_value
     */
    readonly pantone_value: string;

    /**
     * Date
     */
    readonly date: Date;
}

export class ProductResp {
    readonly  id: string;

    readonly name: string;

    readonly year: number;

    readonly color: string;

    readonly pantone_value: string;
}

export class ProductPaginated extends BasicPaginatedModel(ProductResp) {}
