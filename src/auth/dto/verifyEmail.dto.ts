import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { IsString } from "@nestjs/class-validator";

export class VerifyEmailDto{
    @ApiProperty()
    @IsEmail()
    email: string
    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(7)
    token: string
}