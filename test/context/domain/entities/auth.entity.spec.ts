import { Auth } from "@/context/domain/entities/auth.entity";
import { User } from "@/context/domain/entities/user.entity";

describe("Auth Entity", () => {
  it("debería exponer el token y el usuario correctamente", () => {
    const now = new Date();
    const user = new User("1", "test@mail.com", "pass", "Test", now, now);

    const auth = new Auth("token123", user);

    expect(auth.getToken()).toBe("token123");
    expect(auth.getUser()).toBe(user);
    expect(auth.getUser().getEmail()).toBe("test@mail.com");
  });
});
