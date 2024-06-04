import fs from 'fs';

export function realPathSync(absolutePath: string) {
  if (!fs.existsSync(absolutePath)) {
    return absolutePath;
  }

  return fs.realpathSync(absolutePath);
}
