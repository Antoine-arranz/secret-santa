import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { CreateGameDto, JoinGameDto } from '../models/game.model';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto) {
    return await this.gameService.createGame(createGameDto);
  }

  @Get(':id')
  async getGame(@Param('id') id: string) {
    return await this.gameService.getGame(id);
  }

  @Put(':id/join')
  async joinGame(
    @Param('id') id: string,
    @Body() joinGameDto: JoinGameDto,
  ) {
    return await this.gameService.joinGame(id, joinGameDto);
  }

  @Post(':id/draw')
  async drawName(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return await this.gameService.drawName(id, name);
  }
}
