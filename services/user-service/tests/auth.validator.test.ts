import {
  registerSchema,
  loginSchema,
} from "../src/validators/auth.validator.js";

describe("registerSchema", () => {
  it("should pass with valid data", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "secure123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if name is missing", () => {
    const result = registerSchema.safeParse({
      email: "jane@example.com",
      password: "secure123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if name is less than 2 characters", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "jane@example.com",
      password: "secure123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if email is invalid", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      password: "secure123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if password is less than 6 characters", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
  });

  it("should lowercase the email", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "JANE@EXAMPLE.COM",
      password: "secure123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("jane@example.com");
    }
  });
});

describe("loginSchema", () => {
  it("should pass with valid data", () => {
    const result = loginSchema.safeParse({
      email: "jane@example.com",
      password: "secure123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if email is missing", () => {
    const result = loginSchema.safeParse({
      password: "secure123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if password is empty", () => {
    const result = loginSchema.safeParse({
      email: "jane@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if email is invalid format", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "secure123",
    });
    expect(result.success).toBe(false);
  });
});
