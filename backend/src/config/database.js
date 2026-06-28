import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'stockforge',
  process.env.MYSQL_USER || 'stockforge_user',
  process.env.MYSQL_PASSWORD || 'stockforge_pass',
  {
    host: process.env.MYSQL_HOST || 'mysql',
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    pool: isTest ? { max: 1, min: 0 } : { max: 5, min: 0 }
  }
);
