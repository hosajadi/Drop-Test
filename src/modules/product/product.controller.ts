import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    CacheInterceptor,
    CacheKey,
    CacheTTL, NotFoundException, Query, Post, Body,
} from "@nestjs/common";
import {IProduct, ProductPaginated, ProductResp} from "./product.model";
import {errorsTypes} from "../../common/errors";
import {ProductService} from "./product.service";
import {productRespMapper} from "../../common/productResp";
import {PatchUserPayload} from "../user/payload/patch.user.payload";
import {RegisterProductPayload} from "./payload/register.payload";

/**
 * Product Controller
 */
@Controller("api/product")
export class ProductController {
    constructor(
        private readonly productService: ProductService) {}

    /**
     * Retrieves a particular product
     * @param id the product given id to fetch
     * @returns {Promise<ProductResp>} queried product data
     */
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("getById")
    @Get(":id")
    async getProductById(@Param("id") id: string): Promise<ProductResp> {
        const product = await this.productService.getById(id);
        if (!product) {
            throw new NotFoundException(errorsTypes.product.PRODUCT_NOT_FOUND);
        }

        return productRespMapper(product);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @CacheKey("getAllProducts")
    @Get()
    async getAllProduct(@Query("page") page: number ,@Query("per_page") perPage: number = 6): Promise<ProductPaginated> {
        return this.productService.getAllPagination(page, perPage);
    }

    @Post("/register")
    async registerNewProduct(@Body() payload: RegisterProductPayload): Promise<IProduct> {
        return this.productService.create(payload);
    }
}
