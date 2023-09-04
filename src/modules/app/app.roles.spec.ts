import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {AccessControlModule, ACGuard} from "nest-access-control";
import {AppRoles} from "../app/app.roles";
import { roles } from "./app.roles";


interface AuthenticatedRequest extends Request {
    readonly user: UserPrincipal;
}
interface UserPrincipal {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roll: AppRoles;
}

describe("ACGuard", () => {
    let guard: ACGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new ACGuard(reflector, roles);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    it("should skip(return true) if the `UseRoles` decorator is not set", async () => {
        jest.spyOn(reflector, "get").mockImplementation((a: any, b: any) => null);
        const context = createMock<ExecutionContext>();
        const result = await guard.canActivate(context);

        expect(result).toBeTruthy();
        expect(reflector.get).toBeCalled();
    });

    // it("should return true if the `UseRoles` decorator is set", async () => {
    //     jest.spyOn(reflector, "get").mockImplementation((a: any, b: any) => AppRoles.DEFAULT);
    //     const context: ExecutionContext = createMock<ExecutionContext>({
    //         getHandler: jest.fn(),
    //         switchToHttp: jest.fn().mockReturnValue({
    //             getRequest: jest.fn().mockReturnValue({
    //                 user: {
    //                     email: "ho.sajadi@gmail.com",
    //                     firstName: "Hossein",
    //                     lastName: "Sajadi",
    //                     password: "testPass",
    //                     roll: AppRoles.DEFAULT },
    //             } as AuthenticatedRequest),
    //         }),
    //     });
    //
    //     const result = await guard.canActivate(context);
    //     expect(result).toBeTruthy();
    //     expect(reflector.get).toBeCalled();
    // });
    //
    // it("should return false if the `UseRoles` decorator is set but role is not allowed", async () => {
    //     jest.spyOn(reflector, "get").mockReturnValue(AppRoles.ADMIN);
    //     const request = {user: { roll: AppRoles.DEFAULT }} as AuthenticatedRequest;
    //     const context = createMock<ExecutionContext>();
    //     const httpArgsHost = createMock<HttpArgumentsHost>({getRequest: () => request,});
    //     context.switchToHttp.mockImplementation(() => httpArgsHost);
    //
    //     const result = await guard.canActivate(context);
    //     expect(result).toBeFalsy();
    //     expect(reflector.get).toBeCalled();
    // });
});
