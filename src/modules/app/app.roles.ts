import { RolesBuilder } from "nest-access-control";

export enum AppRoles {
  DEFAULT = "DEFAULT",
  ADMIN = "ADMIN",
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.DEFAULT)
    .readOwn("user")
    .updateOwn("user")
    .deny("auth")
    .deleteOwn("user")
  .grant(AppRoles.ADMIN)
    .extend(AppRoles.DEFAULT)
    .readAny("user")
    .updateAny("user")
    .createAny("user")
    .createAny("auth")
    .deleteAny("user");
