import {IProduct, ProductResp} from "../modules/product/product.model";

function productMapper(iProduct: IProduct): ProductResp {
    return {
        id: iProduct.id.toString(),
        name: iProduct.name,
        year: iProduct.year,
        color: iProduct.color,
        pantone_value: iProduct.pantone_value,
    };
}

export const productRespMapper = productMapper;
