import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { CreateGameDto, JoinGameDto } from '../models/game.model';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @Get(':id')
  getGame(@Param('id') id: string) {
    return this.gameService.getGame(id);
  }

  @Put(':id/join')
  joinGame(
    @Param('id') id: string,
    @Body() joinGameDto: JoinGameDto,
  ) {
    return this.gameService.joinGame(id, joinGameDto);
  }

  @Post(':id/draw')
  drawName(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.gameService.drawName(id, name);
  }
}
