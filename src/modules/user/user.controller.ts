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
  CacheTTL, NotFoundException, Query, Put,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { UserService, IGenericMessageBody } from "./user.service";
import { PatchUserPayload } from "./payload/patch.user.payload";
import {IUser, UserPaginated, UserResp} from "./user.model";
import {errorsTypes} from "../../common/errors"
import {userRespMapper} from "../../common/userResp.maper";
import {UpdateUserPayload} from "./payload/update.user.payload";

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
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "user",
    action: "read",
    possession: "any",
  })
  async getAllUser(@Query("page") page: number ,@Query("per_page") perPage: number = 6, @Query("delay") delay: number): Promise<UserPaginated> {
    return this.userService.getAllPagination(page, perPage, delay);
  }

  /**
   * Patch a user
   * @param {RegisterUserPayload} payload
   * @returns {Promise<IUser>} mutated profile data
   */
  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "user",
    action: "update",
    possession: "any",
  })
  async patchUser(@Param("id") id: string, @Body() payload: PatchUserPayload): Promise<IUser> {
    return await this.userService.patch(id, payload);
  }

  /**
   * Update a user
   * @param {UpdateUserPayload} payload
   * @returns {Promise<IUser>} mutated profile data
   */
  @Put(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "user",
    action: "update",
    possession: "any",
  })
  async updateUser(@Param("id") id: string, @Body() payload: UpdateUserPayload): Promise<IUser> {
    return await this.userService.update(id, payload);
  }

  /**
   * Delete a user from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the uer has been deleted
   */
  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "user",
    action: "create",
    possession: "any",
  })
  async delete(@Param("id") id: string,): Promise<IGenericMessageBody> {
    return await this.userService.delete(id);
  }
}
