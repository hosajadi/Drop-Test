import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User } from "./user.model";
import { UserController } from "./user.controller";
import {ConfigModule} from "../config/config.module";

@Module({
  imports: [
      ConfigModule,
      MongooseModule.forFeature([{ name: "User", schema: User }]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
