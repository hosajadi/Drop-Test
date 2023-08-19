import * as crypto from "crypto";
import * as gravatar from "gravatar";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  BadRequestException,
  Injectable,
  NotAcceptableException, NotFoundException,
} from "@nestjs/common";
import {IUser, UserPaginated, UserResp} from "./user.model";
import {RegisterUserPayload} from "modules/auth/payload/register.payload";
import { AppRoles } from "../app/app.roles";
import { PatchProfilePayload } from "./payload/patch.profile.payload";
import {errorsTypes} from "../../common/errors";
import * as argon2 from "argon2";
import {ConfigService} from "../config/config.service";
import {string} from "@hapi/joi";
import {userRespMapper} from "../../common/userResp.maper";


/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

/**
 * User Service
 */
@Injectable()
export class UserService {
  /**
   * Constructor
   * @param {Model<IProfile>} userModel
   */
  constructor(
    @InjectModel("User") private readonly userModel: Model<IUser>,
    private readonly configService: ConfigService,
  ) {}

  getById(id: string): Promise<IUser> {
    const userResp = new UserResp();
    return this.userModel.findById(id).exec();
  }

  getByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({email,}).exec();
  }

  async getAll(): Promise<IUser[]> {
    const allUser = await this.userModel.find({});
    if (!allUser) {
      return [];
    }
    return allUser;
  }

  async getAllPagination(page: number, limit: number): Promise<UserPaginated> {
    const total = await this.userModel.countDocuments();
    const totalPages = Math.ceil(total / limit);
    const allUser = await this.userModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec()
    const allRespUser = allUser.map((user)=>{
      return userRespMapper(user);
    });
    const userPaginate = new UserPaginated()
    userPaginate.page = page;
    userPaginate.data = allRespUser;
    userPaginate.total = total;
    userPaginate.total_page = totalPages;
    userPaginate.per_page = limit;

    return userPaginate;
  }

  async getByEmailAndPass(email: string, password: string): Promise<IUser> {
    const user:IUser = await this.userModel.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundException(errorsTypes.user.USER_NOT_FOUND);
    }

    const hash = await argon2.hash(password, {salt: new Buffer(user.salt)});

    if(user.password === hash) {
      return user;
    }
    return null;
  }

  async create(payload: RegisterUserPayload): Promise<IUser> {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException(
        errorsTypes.user.USER_ALREADY_EXIST,
      );
    }
    const salt = await argon2.hash(this.configService.get("WEBTOKEN_SECRET_KEY"));
    const {firstName, lastName, email, roll} = payload;
    const createdUser = new this.userModel({
      email,
      firstName,
      lastName,
      password: await argon2.hash(payload.password, {salt: new Buffer(salt)}),
      salt,
      avatar: gravatar.url(payload.email, {
        protocol: "http",
        s: "200",
        r: "pg",
        d: "404",
      }),
      roles: roll,
    });

    return createdUser.save();
  }

  async edit(payload: PatchProfilePayload): Promise<IUser> {
    const { email } = payload;
    const updatedProfile = await this.userModel.updateOne(
      { email },
      payload,
    );
    return this.getByEmail(email);
  }

  delete(username: string): Promise<IGenericMessageBody> {
    return this.userModel.deleteOne({ username }).then(profile => {
      if (profile.deletedCount === 1) {
        return { message: `Deleted ${username} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a profile by the name of ${username}.`,
        );
      }
    });
  }
}
