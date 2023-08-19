import {IsEmail, IsNotEmpty } from "class-validator";

/**
 * Login Paylaod Class
 */
export class LoginPayload {
  /**
   * email field
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Password field
   */
  @IsNotEmpty({message: "Missing password"})
  password: string;
}
