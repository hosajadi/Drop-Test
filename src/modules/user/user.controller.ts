import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  NotFoundException, Query, Put, ForbiddenException
} from "@nestjs/common";
import { ACGuard, UseRoles } from "nest-access-control";
import { UserService, IGenericMessageBody } from "./user.service";
import { PatchUserPayload } from "./payload/patch.user.payload";
import {IUser, UserPaginated, UserResp} from "./user.model";
import {errorsTypes} from "../../common/errors"
import {userRespMapper} from "../../common/userResp.maper";
import {UpdateUserPayload} from "./payload/update.user.payload";
import {CurrentUser} from "../../common/user.decorator";
import {AppRoles} from "../app/app.roles";
import {JwtAuthGuard} from "../auth/jwt.auth.guard";
import {CacheTTL, CacheKey, CacheInterceptor } from "@nestjs/cache-manager";

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
  @CacheTTL(5)
  @UseInterceptors(CacheInterceptor)
  @Get(":id")
  @UseGuards(JwtAuthGuard, ACGuard)
  async getUserById(@Param("id") id: string): Promise<UserResp> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException(errorsTypes.user.USER_NOT_FOUND);
    }

    return userRespMapper(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, ACGuard)
  @UseRoles({
    resource: "user",
    action: "read",
    possession: "any",
  })
  async getAllUser(@Query("page") page: number ,@Query("per_page") perPage: number = 6, @Query("delay") delay: number): Promise<UserPaginated> {
    if (delay) {
      return this.userService.getAllPaginationWithoutCache(page, perPage, delay);
    }
  return this.userService.getAllPagination(page, perPage, delay);
  }

  /**
   * Patch a user
   * @param {RegisterUserPayload} payload
   * @returns {Promise<IUser>} mutated profile data
   */
  @Patch(":id?")
  @UseGuards(JwtAuthGuard, ACGuard)
  @UseRoles({
    resource: "user",
    action: "update",
    possession: "own",
  })
  async patchUser(@CurrentUser() user: IUser, @Param("id") id: string, @Body() payload: PatchUserPayload): Promise<IUser> {
    if(id){
      if(user.roles.includes(AppRoles.ADMIN)){
        return await this.userService.patch(id, payload);
      }
      throw new ForbiddenException(errorsTypes.user.USER_NOT_ALLOWED)
    }
    return await this.userService.patch(user.id, payload);
  }

  /**
   * Update a user
   * @param {UpdateUserPayload} payload
   * @returns {Promise<IUser>} mutated profile data
   */
  @Put(":id?")
  @UseGuards( JwtAuthGuard)
  @UseRoles({
    resource: "user",
    action: "update",
    possession: "own",
  })
  async updateUser(@CurrentUser() user: IUser, @Param("id") id: string, @Body() payload: UpdateUserPayload): Promise<IUser> {
    if(id){
      if (user.roles.includes(AppRoles.ADMIN)){
        return await this.userService.update(id, payload);
      }
      throw new ForbiddenException(errorsTypes.user.USER_NOT_ALLOWED)
    }
    return await this.userService.update(user.id, payload);
  }

  /**
   * Delete a user from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the uer has been deleted
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, ACGuard)
  @UseRoles({
    resource: "user",
    action: "create",
    possession: "any",
  })
  async delete(@Param("id") id: string,): Promise<IGenericMessageBody> {
    return await this.userService.delete(id);
  }

  @Get("/currentUser")
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: IUser): Promise<IUser>{
    return user;
  }
}
