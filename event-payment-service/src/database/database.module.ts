import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './database.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/configs/config.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class DatabaseModule {}
