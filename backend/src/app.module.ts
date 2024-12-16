import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService],
})
export class AppModule {}
