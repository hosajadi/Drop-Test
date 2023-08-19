import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  CacheKey,
  CacheTTL, NotFoundException, Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { UserService, IGenericMessageBody } from "./user.service";
import { PatchProfilePayload } from "./payload/patch.profile.payload";
import {IUser, UserPaginated, UserResp} from "./user.model";
import {errorsTypes} from "../../common/errors";
import { plainToClass } from "class-transformer";
import {userRespMapper} from "../../common/userResp.maper";
// import {CacheInterceptor, CacheTTL} from "@nestjs/cache-manager";

/**
 * User Controller
 */
@Controller("api/users")
export class UserController {
  constructor(
      private readonly userService: UserService) {}

  /**
   * Retrieves a particular user
   * @param id the user given id to fetch
   * @returns {Promise<IUser>} queried profile data
   */
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @CacheKey("getById")
  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "user",
    action: "read",
    possession: "any",
  })
  async getUserById(@Param("id") id: string): Promise<UserResp> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException(errorsTypes.user.USER_NOT_FOUND);
    }

    return userRespMapper(user);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @CacheKey("getAllUser")
  @Get()
  async getAllUser(@Query("page") page: number ,@Query("per_page") perPage: number = 6): Promise<UserPaginated> {
    return this.userService.getAllPagination(page, perPage);
  }

  /**
   * Edit a user
   * @param {RegisterUserPayload} payload
   * @returns {Promise<IUser>} mutated profile data
   */
  @Patch()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "user",
    action: "update",
    possession: "any",
  })
  async patchProfile(@Body() payload: PatchProfilePayload) {
    return await this.userService.edit(payload);
  }

  /**
   * Removes a user from the database
   * @param {string} email the email to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the profile has been deleted
   */
  @Delete(":email")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "user",
    action: "create",
  })
  async delete(
    @Param("email") email: string,
  ): Promise<IGenericMessageBody> {
    return await this.userService.delete(email);
  }
}
