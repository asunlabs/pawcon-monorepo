import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ApisEntity } from 'src/features/apis/apis.entity';

dotenv.config(); // nest config module should be loaded prior to dotenv

const typeOrmModuleOption: TypeOrmModuleOptions = {
    type: 'postgres',
    username: 'postgres',
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'pawcon-database', // db name
    entities: [ApisEntity],
    autoLoadEntities: true,
    synchronize: false,
};

export default typeOrmModuleOption;
