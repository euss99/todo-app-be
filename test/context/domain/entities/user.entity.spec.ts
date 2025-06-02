import { User } from "@/context/domain/entities/user.entity";

describe("User Entity", () => {
  it("debería exponer los datos correctamente", () => {
    const now = new Date();
    const user = new User("1", "test@mail.com", "pass", "Test", now, now);

    expect(user.getId()).toBe("1");
    expect(user.getEmail()).toBe("test@mail.com");
    expect(user.getPassword()).toBe("pass");
    expect(user.getName()).toBe("Test");
    expect(user.getCreatedAt()).toBe(now);
    expect(user.getUpdatedAt()).toBe(now);
  });
});
