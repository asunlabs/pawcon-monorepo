import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ApisModule } from 'src/features/apis/apis.module';
import typeOrmModuleOption from './config/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(typeOrmModuleOption),
        ApisModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
