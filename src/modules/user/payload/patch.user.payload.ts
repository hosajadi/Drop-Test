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
export class PatchUserPayload {
  /**
   * Email field
   */
  @IsEmail()
  @IsOptional()
  email: string;

  /**
   * FirstName field
   */
  @Matches(/^[a-zA-Z ]+$/)
  @IsOptional()
  firstName: string;

  /**
   * LastName field
   */
  @Matches(/^[a-zA-Z ]+$/)
  @IsOptional()
  lastName: string;
}
