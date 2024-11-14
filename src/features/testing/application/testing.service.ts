import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Injectable()
export class TestingService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
  }

  async deleteAll() {
    await this.dataSource.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    await this.dataSource.query('TRUNCATE TABLE devices RESTART IDENTITY CASCADE');
    await this.dataSource.query('TRUNCATE TABLE devices RESTART IDENTITY CASCADE');
    await this.dataSource.query('TRUNCATE TABLE tokens RESTART IDENTITY CASCADE');
    await this.dataSource.query('TRUNCATE TABLE likes RESTART IDENTITY CASCADE');
    await this.dataSource.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
    await this.dataSource.query('TRUNCATE TABLE posts RESTART IDENTITY CASCADE');
    await this.dataSource.query('TRUNCATE TABLE blogs RESTART IDENTITY CASCADE');
  }

}
