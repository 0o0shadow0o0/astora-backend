import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsAppService } from '../services/whatsapp.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import {
  CreateWhatsAppAccountDto,
  UpdateWhatsAppAccountDto,
  SendMessageDto,
  SendMediaDto,
  SendLocationDto,
} from '../dto/whatsapp.dto';

@ApiTags('whatsapp')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller({ path: 'whatsapp', version: '1' })
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('accounts')
  @ApiOperation({ summary: 'Create a new WhatsApp account' })
  async createAccount(@Req() req: any, @Body() dto: CreateWhatsAppAccountDto) {
    return this.whatsappService.createAccount(req.user.id, dto);
  }

  @Get('accounts')
  @ApiOperation({ summary: 'Get all WhatsApp accounts' })
  async findAll(@Req() req: any) {
    return this.whatsappService.findAll(req.user.id);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get WhatsApp account by ID' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.whatsappService.findOne(id, req.user.id);
  }

  @Put('accounts/:id')
  @ApiOperation({ summary: 'Update WhatsApp account' })
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateWhatsAppAccountDto,
  ) {
    return this.whatsappService.update(id, req.user.id, dto);
  }

  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Delete WhatsApp account' })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.whatsappService.delete(id, req.user.id);
    return { message: 'WhatsApp account deleted successfully' };
  }

  @Post('accounts/:id/connect')
  @ApiOperation({ summary: 'Connect WhatsApp account' })
  async connect(@Param('id') id: string, @Req() req: any) {
    return this.whatsappService.connect(id, req.user.id);
  }

  @Post('accounts/:id/disconnect')
  @ApiOperation({ summary: 'Disconnect WhatsApp account' })
  async disconnect(@Param('id') id: string, @Req() req: any) {
    await this.whatsappService.disconnect(id);
    return { message: 'WhatsApp account disconnected successfully' };
  }

  @Get('accounts/:id/qr')
  @ApiOperation({ summary: 'Get QR code for authentication' })
  async getQRCode(@Param('id') id: string, @Req() req: any) {
    return this.whatsappService.getQRCode(id, req.user.id);
  }

  @Get('accounts/:id/contacts')
  @ApiOperation({ summary: 'Get contacts from WhatsApp account' })
  async getContacts(@Param('id') id: string, @Req() req: any) {
    return this.whatsappService.getContacts(id, req.user.id);
  }

  @Post('accounts/:id/messages')
  @ApiOperation({ summary: 'Send text message' })
  async sendMessage(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: SendMessageDto,
  ) {
    return this.whatsappService.sendMessage(id, req.user.id, dto);
  }

  @Post('accounts/:id/media')
  @ApiOperation({ summary: 'Send media message' })
  async sendMedia(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: SendMediaDto,
  ) {
    return this.whatsappService.sendMedia(id, req.user.id, dto);
  }

  @Post('accounts/:id/location')
  @ApiOperation({ summary: 'Send location message' })
  async sendLocation(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: SendLocationDto,
  ) {
    return this.whatsappService.sendLocation(id, req.user.id, dto);
  }
}
