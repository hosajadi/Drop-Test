import {Test, TestingModule} from "@nestjs/testing";
import {UserService} from "./user.service";
import {IUser, User} from "./user.model";
import {getModelToken} from "@nestjs/mongoose";
import {ConfigService} from "../config/config.service";
import {MongoMemoryServer} from "mongodb-memory-server";
import {connect, Connection, Model} from "mongoose";
import {RegisterUserPayload} from "../auth/payload/register.payload";
import {AppRoles} from "../app/app.roles";
import {NotAcceptableException, NotFoundException} from "@nestjs/common";
import * as argon2 from "argon2";
import * as mongooseType from "mongoose";
import * as crypto from "crypto";

const registerUserPayload1: RegisterUserPayload = {
    firstName: "Hossein",
    lastName: "Sajadi",
    email:"hossein.sajadinia@gmail.com",
    roll: AppRoles.ADMIN,
    password: "Ho959"
};

const registerUserPayload2: RegisterUserPayload = {
    firstName: "Hamed",
    lastName: "Sajadi",
    email:"hamed.sajadinia@gmail.com",
    roll: AppRoles.DEFAULT,
    password: "Hamed959"
};

describe("UserService", () => {
    let userService: UserService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let userModel: Model<IUser>
    let configService: ConfigService;

    beforeAll(async () =>{
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        userModel = mongoConnection.model( "User", User );
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken("User"),
                    useValue: userModel,
                },
                {
                    provide: ConfigService,
                    useValue: new ConfigService(".env"),
                },
            ],
        }).compile();
        userService = module.get<UserService>(UserService);
        configService = module.get<ConfigService>(ConfigService);
    })

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    afterEach(async () => {
        const collections = mongoConnection.collections;
        // tslint:disable-next-line:forin
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    it("should be defined", () => {
        expect(userService).toBeDefined();
    });

    describe("create user", () => {

        it("should create user and return the created user", async () => {
            const createdUser = await userService.create(registerUserPayload1);
            expect(createdUser.firstName).toBe(registerUserPayload1.firstName)
        });

        it("should return an NotAcceptableException because the email duplication", async () => {
            await userService.create(registerUserPayload1);
            const createdUser = () => {
                return userService.create(registerUserPayload1);
            }

            await expect(createdUser()).rejects.toThrow(NotAcceptableException);
        })

        it("the saved password must be equal to generated salt with same seed", async () => {
            const createdUser  = await userService.create(registerUserPayload1);
            const password  = await argon2.hash(registerUserPayload1.password, {salt: new Buffer(createdUser.salt)});
            expect(password).toBe(createdUser.password)
        })
    });

    describe("get user by Id",  () => {

        it("should get the exact user we created by id", async () => {
          const createdUser = await userService.create(registerUserPayload2);
          const gotUser = await userService.getById(createdUser._id.toString());
          expect(gotUser.salt).toBe(createdUser.salt);
        });

        it("should return CastError exception by passing invalid id", async () => {
            const gotUser = () => {
                userService.getById("for test");
            };
            await  expect(gotUser).rejects;
        });

        it("should return null or undefined if we ask for invalid random id", async () => {
            const randomString = crypto.randomBytes(12).toString("hex");
            const gotUser = await userService.getById(mongooseType.Types.ObjectId.createFromHexString(randomString).toString());
            expect(gotUser).toBeNull();
        });
    });

    describe("get user by email", () => {

        it("should return the exact user which created", async () => {
           await userService.create(registerUserPayload2);
           const gotByEmail = await userService.getByEmail(registerUserPayload2.email);
           expect(registerUserPayload2.email).toBe(gotByEmail.email);
        });

        it("should return null if pass invalid email", async () => {
            const gotByEmail = await userService.getByEmail("email.forText@gmail.com");
            expect(gotByEmail).toBeNull();
        });
    });

    describe("get all user", () => {

        it("should return an empty array if no users found", async () => {
            const result = await userService.getAll();

            expect(result).toEqual([]);
        });

        it("should return an  array with length of 2 if we create 2 user", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            const result = await userService.getAll();

            expect(result.length).toBe(2);
        });
    });

    describe("get all user paginated", () => {
        const registerUserPayload3 = Object.assign({}, registerUserPayload1);
        registerUserPayload3.email = "test1@gmail.com";
        const registerUserPayload4 = Object.assign({}, registerUserPayload2);
        registerUserPayload4.email = "test2@gmail.com";

        it("should return paginated(page:1, limit:1) users with correct data", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            await userService.create(registerUserPayload4);
            const userPaginated = await userService.getAllPagination(1, 1, null);
            expect(userPaginated.data[0].email).toBe(registerUserPayload1.email)
        });

        it("should return paginated(page:2, limit:1) users with correct data", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            await userService.create(registerUserPayload4);
            const userPaginated = await userService.getAllPagination(2, 1, null);
            expect(userPaginated.data[0].email).toBe(registerUserPayload2.email)
        });

        it("should return paginated(page:2, limit:2) users with correct data", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            await userService.create(registerUserPayload4);
            const userPaginated = await userService.getAllPagination(2, 2, null);
            expect(userPaginated.data[1].email).toBe(registerUserPayload4.email)
        });

        it("should correctly calculate total_number", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            await userService.create(registerUserPayload4);
            const userPaginated = await userService.getAllPagination(2, 2, null);
            expect(userPaginated.total).toBe(4)
        });

        it("should correctly calculate total_page for (page:1, limit:1)", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            const userPaginated = await userService.getAllPagination(1, 1, null);
            expect(userPaginated.total_page).toBe(3)
        });

        it("should correctly calculate total_page for (page:1, limit:2)", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            const userPaginated = await userService.getAllPagination(1, 2, null);
            expect(userPaginated.total_page).toBe(2)
        });

        it("should return 0 for length of (page:4, limit:1) if all dataLength is 3", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            const userPaginated = await userService.getAllPagination(4, 1, null);
            expect(userPaginated.data.length).toBe(0)
        });

        it("should return 0 for length of (page:2, limit:4) if all dataLength is 3", async () => {
            await userService.create(registerUserPayload1);
            await userService.create(registerUserPayload2);
            await userService.create(registerUserPayload3);
            const userPaginated = await userService.getAllPagination(2, 4, null);
            expect(userPaginated.data.length).toBe(0)
        });
    });

    describe("get user by email and password", () => {

        it("get valid user by passing valid email and password", async () => {
            const createdUser = await userService.create(registerUserPayload1);
            const gotUserByEmailAndPass = await userService.getByEmailAndPass(registerUserPayload1.email, registerUserPayload1.password);
            expect(gotUserByEmailAndPass.email).toBe(createdUser.email);
        });

        it("should return null if provided password is invalid", async () => {
            await userService.create(registerUserPayload1);
            const gotUserByEmailAndPass = await userService.getByEmailAndPass(registerUserPayload1.email, "some random pass");
            expect(gotUserByEmailAndPass).toBeNull();
        });

        it("should throw a NotFountException if provided email is invalid", async () => {
            await userService.create(registerUserPayload1);
            const gotUserByEmailAndPass = () => {
                return userService.getByEmailAndPass(registerUserPayload1.email+".", registerUserPayload1.password);
            }
            await expect(gotUserByEmailAndPass()).rejects.toThrow(NotFoundException);
        });
    });

    describe("update user", () => {

        it("should update the user correctly", async () => {
            const updatePayload = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "testEmail"
            };
            const createdUser = await userService.create(registerUserPayload1);
            const updatedUser = await userService.update(createdUser._id.toString(), updatePayload);
            expect(updatedUser.email).toBe(updatePayload.email);
        });

        it("should throw a NotFoundException if provided id is invalid", async () => {
            const updatePayload = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: "testEmail"
            };
            await userService.create(registerUserPayload1);
            const updatedUser = () => {
                const randomString = crypto.randomBytes(12).toString("hex");
                return userService.update(mongooseType.Types.ObjectId.createFromHexString(randomString).toString(), updatePayload);
            };

            await expect(updatedUser()).rejects.toThrow(NotFoundException);
        });
    });

    describe("patch user", () => {

        it("should patch the user correctly", async () => {
            const patchPayload = {
                firstName: null,
                lastName: null,
                email: "testEmail"
            };
            const createdUser = await userService.create(registerUserPayload1);
            const updatedUser = await userService.patch(createdUser._id.toString(), patchPayload);
            expect(updatedUser.email).toBe(patchPayload.email);
        });

        it("should patch the user correctly if we change another field", async () => {
            const patchPayload = {
                firstName: null,
                lastName: null,
                email: "testEmail"
            };
            const createdUser = await userService.create(registerUserPayload1);
            const updatedUser = await userService.patch(createdUser._id.toString(), patchPayload);
            expect(updatedUser.firstName).toBe(createdUser.firstName);
        });

        it("should throw a NotFoundException if provided id is invalid", async () => {
            const patchPayload = {
                firstName: "testFirstName",
                lastName: "testLastName",
                email: null
            };
            await userService.create(registerUserPayload1);
            const updatedUser = () => {
                const randomString = crypto.randomBytes(12).toString("hex");
                return userService.patch(mongooseType.Types.ObjectId.createFromHexString(randomString).toString(), patchPayload);
            };

            await expect(updatedUser()).rejects.toThrow(NotFoundException);
        });
    });
});
