import {Controller, Body, Post, UseGuards} from "@nestjs/common";
import { AuthService, ITokenReturnBody } from "./auth.service";
import { LoginPayload } from "./payload/login.payload";
import { RegisterUserPayload } from "./payload/register.payload";
import { UserService } from "../user/user.service";
import {AuthGuard} from "@nestjs/passport";
import {ACGuard, UseRoles} from "nest-access-control";
import {JwtAuthGuard} from "./jwt.auth.guard";

/**
 * Authentication Controller
 */
@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Login route to validate and create tokens for users
   * @param {LoginPayload} payload the login dto
   */
  @Post("login")
  async login(@Body() payload: LoginPayload): Promise<ITokenReturnBody> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {RegisterUserPayload} payload the registration dto
   */
  @Post("register")
  @UseGuards(JwtAuthGuard, ACGuard)
  @UseRoles({
    resource: "auth",
    action: "create",
    possession: "any"
  })
  async register(@Body() payload: RegisterUserPayload): Promise<ITokenReturnBody> {
    const user = await this.userService.create(payload);
    return await this.authService.createToken(user);
  }
}

