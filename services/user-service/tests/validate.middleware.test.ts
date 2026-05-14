import { jest } from "@jest/globals";
import { validate } from "../src/middleware/validate.middleware.js";
import { registerSchema } from "../src/validators/auth.validator.js";
import { Request, Response, NextFunction } from "express";

const mockReq = (body: object): Partial<Request> => ({ body });

const mockRes = (): Partial<Response> => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;
  return res;
};

const mockNext: NextFunction = jest.fn();

describe("validate middleware", () => {
  it("should call next() if validation passes", () => {
    const req = mockReq({
      name: "Surya Parua",
      email: "surya@example.com",
      password: "secure123",
    });
    const res = mockRes();

    validate(registerSchema)(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 400 if validation fails", () => {
    const req = mockReq({
      name: "S",
      email: "not-an-email",
      password: "123",
    });
    const res = mockRes();

    validate(registerSchema)(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Validation failed" }),
    );
  });

  it("should return errors array on failure", () => {
    const req = mockReq({ name: "", email: "", password: "" });
    const res = mockRes();

    validate(registerSchema)(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(jsonCall.errors).toBeInstanceOf(Array);
    expect(jsonCall.errors.length).toBeGreaterThan(0);
  });

  it("should set req.body to parsed data on success", () => {
    const req = mockReq({
      name: "  Surya  ",
      email: "SURYA@EXAMPLE.COM",
      password: "secure123",
    });
    const res = mockRes();

    validate(registerSchema)(req as Request, res as Response, mockNext);

    expect(req.body.email).toBe("surya@example.com");
    expect(req.body.name).toBe("Surya");
  });
});
