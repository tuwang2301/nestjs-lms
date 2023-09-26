import {
    Body,
    Controller,
    Get, Param,
    Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../common/custom.decorator";
import { NotificationService } from "src/notification/notification.service";
import { NotificationTestDTO } from "./dto/notification.dto";
import { ResponseObject } from "src/common/ResponseObject";

@Controller("notification")
@ApiTags("Notification")
@ApiBearerAuth()
export class NotificationController {
    constructor(
        private notificationService: NotificationService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Test notification' })
    @Public()
    async sendNoti(@Query() notiDTO: NotificationTestDTO) {
        try {
            const result = await this.notificationService.sendPush(notiDTO.user_id, notiDTO.title, notiDTO.body);
            return new ResponseObject(true, "Sign in successfully", result);
        } catch (e) {
            return new ResponseObject(false, "Sign in fail", e.message);
        }
    }
}
