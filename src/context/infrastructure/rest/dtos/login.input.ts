import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginInput {
  @ApiProperty({
    description: "Email del usuario",
    example: "usuario@ejemplo.com",
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "password123",
    type: String,
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
