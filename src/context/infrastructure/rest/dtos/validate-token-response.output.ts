import { ApiProperty } from "@nestjs/swagger";

export class ValidateTokenResponse {
  @ApiProperty({
    description: "ID único del usuario",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Nombre del usuario",
    example: "Juan Pérez",
  })
  name: string;

  @ApiProperty({
    description: "Email del usuario",
    example: "usuario@ejemplo.com",
  })
  email: string;

  @ApiProperty({
    description: "Fecha de creación del usuario",
    example: "2024-03-20T12:00:00Z",
  })
  createdAt: Date;
}
