import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class RegisterProductPayload {
    /**
     * Name field
     */
    @IsNotEmpty()
    name: string;

    /**
     * Year field
     */
    @IsNumber()
    year: string;

    /**
     * Color field
     */
    @Matches(/^#[0-9A-F]{6}$/)
    color: string;

    /**
     * pantone_value field
     */
    @IsString()
    pantone_value: string;
}
