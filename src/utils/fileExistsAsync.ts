import fs from 'fs';

export function fileExistsAsync(absolutePath: string) {
  return new Promise<boolean>((resolve) => {
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (!err) {
        resolve(true);
        return;
      }

      resolve(false);
    });
  });
}
