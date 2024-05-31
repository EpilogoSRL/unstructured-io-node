import * as path from 'path';
import * as fs from 'fs';

export function pythonDir(relative: string) {
  const fromDist = path.join(__dirname, `../../../python/${relative}`);
  if (fs.existsSync(fromDist)) {
    return fromDist;
  }

  const fromSrc = path.join(__dirname, `../../python/${relative}`);
  return fromSrc;
}
