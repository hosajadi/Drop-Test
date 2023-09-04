import { ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import {JwtAuthGuard} from "./jwt.auth.guard";
import {Reflector} from "@nestjs/core";
import { createMock } from "@golevelup/ts-jest";
import {AuthGuard} from "@nestjs/passport";

describe("JwtAuthGuard", () => {
    let guard: JwtAuthGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new JwtAuthGuard();
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    it("should return true for `canActivate`", async () => {
        AuthGuard("jwt").prototype.canActivate = jest.fn(() => Promise.resolve(true),);
        AuthGuard("jwt").prototype.logIn = jest.fn(() => Promise.resolve());
        expect(await guard.canActivate(createMock<ExecutionContext>())).toBeTruthy();
    });

    it("handle Request: error", async () => {
        const error = { name: "test", message: "error" } as Error;

        try {
            guard.handleRequest(error, {}, {}, createMock<ExecutionContext>());
        } catch (e) {
            expect(e).toEqual(error);
        }
    });

    it("handleRequest", async () => {
        expect(
            await guard.handleRequest(undefined, { username: "Hossein" }, undefined, createMock<ExecutionContext>()),
        ).toEqual({ username: "Hossein" });
    });

    it("handleRequest: Unauthorized", async () => {
        try {
            guard.handleRequest(undefined, undefined, undefined, createMock<ExecutionContext>());
        } catch (e) {
            expect(e).toBeDefined();
        }
    });
    // it("should pass authentication with a valid JWT token", async () => {
    //     const mockExecutionContext = createMock<ExecutionContext>({
    //         getHandler: jest.fn(),
    //         switchToHttp: jest.fn().mockReturnValue({
    //             getRequest: jest.fn().mockReturnValue({
    //                 headers: {
    //                     authorization: "Bearer valid-jwt-token",
    //                 },
    //             }),
    //         }),
    //     });
    //     const result = await guard.canActivate(mockExecutionContext);
    //     expect(result).toBe(true);
    // });
    //
    // it("should throw UnauthorizedException with an invalid JWT token", async () => {
    //     const mockExecutionContext = createMock<ExecutionContext>({
    //         getHandler: jest.fn(),
    //         switchToHttp: jest.fn().mockReturnValue({
    //             getRequest: jest.fn().mockReturnValue({
    //                 headers: {
    //                     authorization: "Bearer inValid-jwt-token",
    //                 },
    //             }),
    //         }),
    //     });
    //     const test = () => {
    //         guard.canActivate(mockExecutionContext);
    //     }
    //
    //     await expect(test()).rejects.toThrow(UnauthorizedException);
    // });
});
