import { NestFactory } from "@nestjs/core";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
// import headers from "fastify-helmet";
import { AppModule } from "./modules/app/app.module";
import { ValidationPipe } from "@nestjs/common";
import {config} from "dotenv";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.enableCors();
  // app.register(headers);
  app.useGlobalPipes(new ValidationPipe());
  config();
  await app.listen(process.env.APP_PORT, "0.0.0.0");
}

void bootstrap();
