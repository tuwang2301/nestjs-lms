import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class NotificationTestDTO {
    @ApiProperty()
    user_id: number
    @ApiProperty()
    @IsString()
    title: string
    @ApiProperty()
    @IsString()
    body: string
}