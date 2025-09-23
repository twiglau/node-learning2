import { ConfigFactory } from '@nestjs/config';
import fs, { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as _ from 'lodash-es';
import path from 'path';

const YAML_COMMON_CONFIG_FILENAME = 'config.yml';
const filePath = path.join(__dirname, '../config', YAML_COMMON_CONFIG_FILENAME);

const envPath = path.join(
  __dirname,
  '../config',
  `config.${process.env.NODE_ENV || 'development'}.yml`,
);

const commonConfig = yaml.load(readFileSync(filePath, 'utf8')) as ConfigFactory;
const envConfig = yaml.load(fs.readFileSync(envPath, 'utf8')) as ConfigFactory;

// 因为 ConfigModule 有一个 load 方法 -> 函数
export default () => {
  return _.merge(commonConfig, envConfig);
};
