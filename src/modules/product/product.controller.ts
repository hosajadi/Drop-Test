import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    NotFoundException,
    Query,
    Post,
    Body,
} from "@nestjs/common";
import {IProduct, ProductPaginated, ProductResp} from "./product.model";
import {errorsTypes} from "../../common/errors";
import {ProductService} from "./product.service";
import {productRespMapper} from "../../common/productResp";
import {CacheTTL, CacheKey, CacheInterceptor } from "@nestjs/cache-manager";
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
    @CacheTTL(5)
    @UseInterceptors(CacheInterceptor)
    @Get(":id")
    async getProductById(@Param("id") id: string): Promise<ProductResp> {
        const product = await this.productService.getById(id);
        if (!product) {
            throw new NotFoundException(errorsTypes.product.PRODUCT_NOT_FOUND);
        }

        return productRespMapper(product);
    }

    @CacheTTL(5)
    @UseInterceptors(CacheInterceptor)
    @Get()
    async getAllProduct(@Query("page") page: number ,@Query("per_page") perPage: number = 6): Promise<ProductPaginated> {
        return this.productService.getAllPagination(page, perPage);
    }

    @Post("/register")
    async registerNewProduct(@Body() payload: RegisterProductPayload): Promise<IProduct> {
        return this.productService.create(payload);
    }
}
