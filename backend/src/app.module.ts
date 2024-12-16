import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Party } from "./entities/party.entity";
import { GameController } from "./controllers/game.controller";
import { GameService } from "./services/game.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgresql://secret_santa_mnz1_user:TBfEN21IN2w9MMxpqzHiFEb3tUpeayRo@dpg-ctg7utm8ii6s73clo6f0-a.oregon-postgres.render.com/secret_santa_mnz1",
      entities: [Party],
      synchronize: true, // Ne pas utiliser en production
      ssl: {
        rejectUnauthorized: false, // Nécessaire pour Render
      },
    }),
    TypeOrmModule.forFeature([Party]),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class AppModule {}
