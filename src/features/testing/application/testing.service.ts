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
      await this.dataSource.query('TRUNCATE TABLE users CASCADE')
    await this.dataSource.query('TRUNCATE TABLE devices CASCADE')
      await this.dataSource.query('TRUNCATE TABLE devices CASCADE')
      await this.dataSource.query('TRUNCATE TABLE tokens CASCADE')
      await this.dataSource.query('TRUNCATE TABLE likes CASCADE')
      await this.dataSource.query('TRUNCATE TABLE comments CASCADE')
      await this.dataSource.query('TRUNCATE TABLE posts CASCADE')
      await this.dataSource.query('TRUNCATE TABLE blogs CASCADE')
  }

}
