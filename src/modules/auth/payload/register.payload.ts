import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsAlphanumeric,
  Matches,
} from "class-validator";
import {AppRoles} from "../../app/app.roles";

/**
 * Register USer Payload Class
 */
export class RegisterUserPayload {
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
  @IsNotEmpty({message: "Missing password"})
  password: string;

  @IsNotEmpty()
  roll: AppRoles;
}
