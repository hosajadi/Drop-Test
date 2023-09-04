import { ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import {JwtAuthGuard} from "./jwt.auth.guard";
import {Reflector} from "@nestjs/core";
import { createMock } from "@golevelup/ts-jest";

const mockExecutionContext = createMock<ExecutionContext>({
    switchToHttp: () => ({
        getRequest: () => ({
            headers: {
                authorization: "Bearer invalid-jwt-token",
            },
        }),
    }),
});

describe("JwtAuthGuard", () => {
    let guard: JwtAuthGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new JwtAuthGuard(reflector);
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    it("should pass authentication with a valid JWT token", async () => {
        const result = await guard.canActivate(mockExecutionContext);
        expect(result).toBe(true);
    });

    it("should return true when IS_PUBLIC_ROUTE is true", () => {
        reflector.getAllAndOverride = jest.fn().mockReturnValue(true);
        const context = createMock<ExecutionContext>();
        const canActivate = guard.canActivate(context);

        expect(canActivate).toBe(true);
    });

    it("should throw UnauthorizedException with an invalid JWT token", async () => {
        const test = () => {
            guard.canActivate(mockExecutionContext);
        }

        await expect(test()).rejects.toThrow(UnauthorizedException);
    });
});
