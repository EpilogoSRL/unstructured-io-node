import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

const venvPath = path.join(__dirname, '../../python/venv');
const installCompleteFilePath = path.join(__dirname, '../../scripts/setup_complete');
const installScriptPath = path.join(__dirname, '../../scripts/install.sh');

function fileExistsAsync(path: string) {
  return new Promise<boolean>((resolve) => {
    fs.access(venvPath, fs.constants.F_OK, (err) => {
      if (!err) {
        resolve(true)
        return;
      }

      resolve(false);
    });
  })
}

/**
 * Check if the python venv directory exists
 * this is used to flag if install.sh has run or not
 */
export async  function ensureEnvironmentSetup() {
  const venvExists = await fileExistsAsync(venvPath);
  const setupCompleteFileExists = await fileExistsAsync(installCompleteFilePath);

  if (venvExists || setupCompleteFileExists) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    console.log('venv does not exist, running install script');
    const child = spawn(installScriptPath, {
      stdio: 'inherit',
      shell: true
    });

    child.on('error', (error) => {
      console.error('failed to start install script:', error);
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('install script completed successfully');
        resolve();
      } else {
        console.error(`install script exited with code ${code}`);
        reject(new Error(`install script exited with code ${code}`));
      }
    });
  });
}
