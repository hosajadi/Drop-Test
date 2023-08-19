import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    IsAlphanumeric,
    Matches, IsOptional,
} from "class-validator";

/**
 * Patch Profile Payload Class
 */
export class UpdateUserPayload {
    /**
     * Email field
     */
    @IsEmail()
    @IsNotEmpty()
    email: string;

    /**
     * FirstName field
     */
    @Matches(/^[a-zA-Z ]+$/)
    @IsNotEmpty()
    firstName: string;

    /**
     * LastName field
     */
    @Matches(/^[a-zA-Z ]+$/)
    @IsNotEmpty()
    lastName: string;
}
