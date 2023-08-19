import { Schema, Document } from "mongoose";
import { AppRoles } from "modules/app/app.roles";
import {Exclude, Expose} from "class-transformer";
import {BasicPaginatedModel} from "../../common/pagination.mapper";


/**
 * Mongoose User Schema
 */
export const User = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  avatar: { type: String, required: true },
  roles: [{ type: String }],
  date: {type: Date, default: Date.now},
});

/**
 * Mongoose User Document
 */
export interface IUser extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;

  /**
   * Email
   */
  readonly email: string;

  /**
   * firstName
   */
  readonly firstName: string;

  /**
   * lastName
   */
  readonly lastName: string;

  /**
   * Password
   */
  readonly password: string;

  /**
   * Salt for password
   */
  readonly salt: string;

  /**
   * Avatar
   */
  readonly avatar: string;

  /**
   * Roles
   */
  readonly roles: AppRoles;

  /**
   * Date
   */
  readonly date: Date;
}

export class UserResp {
  readonly  _id: string;

  readonly email: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly avatar: string;
}

export class UserPaginated extends BasicPaginatedModel(UserResp) {}
