import { jest } from "@jest/globals";
import { validate } from "../src/middleware/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../src/validators/task.validator.js";
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

describe("validate middleware - createTaskSchema", () => {
  it("should call next() if validation passes", () => {
    const req = mockReq({ title: "My Task" });
    const res = mockRes();

    validate(createTaskSchema)(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 400 if title is missing", () => {
    const req = mockReq({});
    const res = mockRes();

    validate(createTaskSchema)(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Validation failed" }),
    );
  });

  it("should return errors array on failure", () => {
    const req = mockReq({ title: "" });
    const res = mockRes();

    validate(createTaskSchema)(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(jsonCall.errors).toBeInstanceOf(Array);
    expect(jsonCall.errors.length).toBeGreaterThan(0);
  });

  it("should set req.body to parsed data on success", () => {
    const req = mockReq({ title: "  My Task  " });
    const res = mockRes();

    validate(createTaskSchema)(req as Request, res as Response, mockNext);

    expect(req.body.title).toBe("My Task");
  });
});

describe("validate middleware - updateTaskSchema", () => {
  it("should call next() with empty body (all fields optional)", () => {
    const req = mockReq({});
    const res = mockRes();

    validate(updateTaskSchema)(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should call next() with valid completed field", () => {
    const req = mockReq({ completed: true });
    const res = mockRes();

    validate(updateTaskSchema)(req as Request, res as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 400 if completed is not boolean", () => {
    const req = mockReq({ completed: "yes" });
    const res = mockRes();

    validate(updateTaskSchema)(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if title is empty string", () => {
    const req = mockReq({ title: "" });
    const res = mockRes();

    validate(updateTaskSchema)(req as Request, res as Response, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
