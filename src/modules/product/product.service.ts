import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import {ConfigService} from "../config/config.service";
import { IProduct, ProductPaginated } from "./product.model";
import {productRespMapper} from "../../common/productResp";
import {RegisterProductPayload} from "./payload/register.payload";


/**
 * Product Service
 */
@Injectable()
export class ProductService {
    /**
     * Constructor
     * @param {Model<IProduct>} productModel
     */
    constructor(
        @InjectModel("Product") private readonly productModel: Model<IProduct>,
        private readonly configService: ConfigService,
    ) {}

    getById(id: string): Promise<IProduct> {
        return this.productModel.findById(id).exec();
    }

    async getAllPagination(page: number, limit: number): Promise<ProductPaginated> {
        const total = await this.productModel.countDocuments();
        const totalPages = Math.ceil(total / limit);
        const allProducts = await this.productModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec()
        const allRespProduct = allProducts.map((product)=>{
            return productRespMapper(product);
        });
        const userPaginate = new ProductPaginated();
        userPaginate.page = page;
        userPaginate.data = allRespProduct;
        userPaginate.total = total;
        userPaginate.total_page = totalPages;
        userPaginate.per_page = limit;

        return userPaginate;
    }

    async create(payload: RegisterProductPayload): Promise<IProduct> {
        const newProduct = await this.productModel.create({
            ...payload,
            date: Date.now()
        });
        return newProduct;
    }
}
