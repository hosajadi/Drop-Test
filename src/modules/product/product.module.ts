import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {ConfigModule} from "../config/config.module";
import {Product} from "./product.model";
import {ProductService} from "./product.service";
import {ProductController} from "./product.controller";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: "Product", schema: Product }]),
    ],
    providers: [ProductService],
    exports: [ProductService],
    controllers: [ProductController],
})
export class ProductModule {}
