import type { Type } from "@nestjs/common";
export interface IPaginatedType<T> {
    data: T[];
    page: number;
    total: number;
    per_page: number;
    total_page: number;
}

export function BasicPaginatedModel<T>(classRef: Type<T>): Type<IPaginatedType<T>> {

    abstract class PaginatedType implements IPaginatedType<T> {
        data: T[];
        page: number;
        total: number;
        per_page: number;
        total_page: number;
    }

    return PaginatedType as Type<IPaginatedType<T>>;
}
