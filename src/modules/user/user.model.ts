import * as mongose from "mongoose";
import { AppRoles } from "../app/app.roles";
import {Exclude, Expose} from "class-transformer";
import {BasicPaginatedModel} from "../../common/pagination.mapper";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


// /**
//  * Mongoose User Schema
//  */
// export const User = new Schema({
//   _id: { type: Schema.Types.ObjectId },
//   email: { type: String, required: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   password: { type: String, required: true },
//   salt: { type: String, required: true },
//   avatar: { type: String, required: true },
//   roles: [{ type: String }],
//   date: {type: Date, default: Date.now},
// });

/**
 * Mongoose User Document
 */
@Schema()
export class IUser extends mongose.Document {
  /**
   * UUID
   */
  @Prop( mongose.SchemaTypes.ObjectId,)
  id: string;

  /**
   * Email
   */
  @Prop()
  email: string;

  /**
   * firstName
   */
  @Prop()
  firstName: string;

  /**
   * lastName
   */
  @Prop()
  lastName: string;

  /**
   * Password
   */
  @Prop()
  password: string;

  /**
   * Salt for password
   */
  @Prop()
  salt: string;

  /**
   * Avatar
   */
  @Prop()
  avatar: string;

  /**
   * Roles
   */
  @Prop()
  roles: AppRoles;

  /**
   * Date
   */
  @Prop()
  date: Date;
}

export class UserResp {
  readonly  _id: string;

  readonly email: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly avatar: string;
}

export class UserPaginated extends BasicPaginatedModel(UserResp) {}

export const User = SchemaFactory.createForClass(IUser);
