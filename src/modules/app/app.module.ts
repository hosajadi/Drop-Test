import * as winston from "winston";
import * as rotateFile from "winston-daily-rotate-file";
import { WinstonModule } from "../winston/winston.module";
import { Module } from "@nestjs/common";
import {CacheModule} from "@nestjs/cache-manager";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { AccessControlModule } from "nest-access-control";
import { roles } from "./app.roles";
import {ProductModule} from "../product/product.module";
// import { redisStore } from "cache-manager-redis-store";


@Module({
  imports: [
    // MongooseModule.forRootAsync("mongodb://localhost:27017/rahyab"),
    // CacheModule.register(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("DB_URL"),
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.isEnv("dev")
          ? {
              level: "info",
              format: winston.format.json(),
              defaultMeta: { service: "user-service" },
              transports: [
                new winston.transports.Console({
                  format: winston.format.simple(),
                }),
              ],
            }
          : {
              level: "info",
              format: winston.format.json(),
              defaultMeta: { service: "user-service" },
              transports: [
                new winston.transports.File({
                  filename: "logs/error.log",
                  level: "error",
                }),
                new winston.transports.Console({
                  format: winston.format.simple(),
                }),
                new rotateFile({
                  filename: "logs/application-%DATE%.log",
                  datePattern: "YYYY-MM-DD",
                  zippedArchive: true,
                  maxSize: "20m",
                  maxFiles: "14d",
                }),
              ],
            };
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisStore = require("cache-manager-redis-store").redisStore;
        return {
          store: redisStore,
          host: configService.get("REDIS_HOST"),
          port: +configService.get("REDIS_PORT"),
          ttl: 5,
        }
      },
      isGlobal: true,
    }),
    AccessControlModule.forRoles(roles),
    ConfigModule,
    AuthModule,
    UserModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
