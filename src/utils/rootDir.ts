import * as path from 'path';
import * as fs from 'fs';
import { realPathSync } from './realPathSync';

export function rootDir(relative: string = '') {
  const fromDist = realPathSync(path.join(__dirname, `../../..${relative}`));
  if (fs.existsSync(fromDist) && process.env.NO_DIST === 'false') {
    return fromDist;
  }

  const fromSrc = realPathSync(path.join(__dirname, `../..${relative}`));
  return fromSrc;
}
