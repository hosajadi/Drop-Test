import * as winston from "winston";
import * as rotateFile from "winston-daily-rotate-file";
import { Module, CacheModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule, MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { WinstonModule } from "../winston/winston.module";
import { AccessControlModule } from "nest-access-control";
import { roles } from "./app.roles";
import type { RedisClientOptions } from "redis";
// import * as redisStore from "cache-manager-redis-store";
import redisStore from "cache-manager-redis-store";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          uri: configService.get("DB_URL"),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as MongooseModuleAsyncOptions),
    }),
    // WinstonModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return configService.isEnv("dev")
    //       ? {
    //           level: "info",
    //           format: winston.format.json(),
    //           defaultMeta: { service: "user-service" },
    //           transports: [
    //             new winston.transports.Console({
    //               format: winston.format.simple(),
    //             }),
    //           ],
    //         }
    //       : {
    //           level: "info",
    //           format: winston.format.json(),
    //           defaultMeta: { service: "user-service" },
    //           transports: [
    //             new winston.transports.File({
    //               filename: "logs/error.log",
    //               level: "error",
    //             }),
    //             new winston.transports.Console({
    //               format: winston.format.simple(),
    //             }),
    //             new rotateFile({
    //               filename: "logs/application-%DATE%.log",
    //               datePattern: "YYYY-MM-DD",
    //               zippedArchive: true,
    //               maxSize: "20m",
    //               maxFiles: "14d",
    //             }),
    //           ],
    //         };
    //   },
    // }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: "redis://localhost:6379",
    }),
    AccessControlModule.forRoles(roles),
    ConfigModule,
    AuthModule,
    UserModule,
    AccessControlModule.forRoles(roles)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
