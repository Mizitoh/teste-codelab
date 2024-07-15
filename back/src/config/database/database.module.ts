import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        logging: configService.get('DB_LOGGING') === 'true' ? true : ['error'],
        migrations: [__dirname + '/migration/*{.ts,.js}'],
        migrationsRun: process.env.NODE_ENV !== 'test',
        synchronize: process.env.NODE_ENV === 'test',
        autoLoadEntities: process.env.NODE_ENV === 'test',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DataBaseModule {}
