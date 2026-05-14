import {
  createTaskSchema,
  updateTaskSchema,
} from "../src/validators/task.validator.js";

describe("createTaskSchema", () => {
  it("should pass with valid title", () => {
    const result = createTaskSchema.safeParse({ title: "My Task" });
    expect(result.success).toBe(true);
  });

  it("should pass with title and description", () => {
    const result = createTaskSchema.safeParse({
      title: "My Task",
      description: "Some description",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if title is missing", () => {
    const result = createTaskSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should fail if title is empty string", () => {
    const result = createTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("should fail if title exceeds 200 characters", () => {
    const result = createTaskSchema.safeParse({ title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("should fail if description exceeds 1000 characters", () => {
    const result = createTaskSchema.safeParse({
      title: "My Task",
      description: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("should trim whitespace from title", () => {
    const result = createTaskSchema.safeParse({ title: "  My Task  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("My Task");
    }
  });
});

describe("updateTaskSchema", () => {
  it("should pass with all fields", () => {
    const result = updateTaskSchema.safeParse({
      title: "Updated Task",
      description: "Updated description",
      completed: true,
    });
    expect(result.success).toBe(true);
  });

  it("should pass with empty object (all fields optional)", () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should pass with only completed field", () => {
    const result = updateTaskSchema.safeParse({ completed: false });
    expect(result.success).toBe(true);
  });

  it("should fail if completed is not boolean", () => {
    const result = updateTaskSchema.safeParse({ completed: "yes" });
    expect(result.success).toBe(false);
  });

  it("should fail if title is empty string", () => {
    const result = updateTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });
});
