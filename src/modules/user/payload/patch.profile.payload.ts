import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsAlphanumeric,
  Matches,
} from "class-validator";

/**
 * Patch Profile Payload Class
 */
export class PatchProfilePayload {
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

  /**
   * Password field
   */
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
