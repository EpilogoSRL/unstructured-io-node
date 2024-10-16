import { spawn } from 'child_process';
import { fileExistsAsync } from './fileExistsAsync';
import { rootDir } from './rootDir';
import fs from 'fs';
import { StringifiableError } from './StringifiableError';

/**
 * Check if the python venv directory exists
 * this is used to flag if install.sh has run or not
 */
export async function ensureEnvironmentSetup() {
  const venvPath = rootDir('/python/venv');
  const scriptsDir = rootDir('/scripts');
  const installCompleteFilePath = '/tmp/unstructured_io_1_0_13_setup_complete';
  const installScriptPath = rootDir('/scripts/install.sh');
  const unstructuredScriptPath = rootDir('/scripts/unstructured.sh');

  const venvExists = await fileExistsAsync(venvPath);
  const setupCompleteFileExists = await fileExistsAsync(installCompleteFilePath);

  if (venvExists || setupCompleteFileExists) {
    return;
  }

  fs.chmodSync(installScriptPath, '755');
  fs.chmodSync(unstructuredScriptPath, '755');

  return new Promise<void>((resolve, reject) => {
    console.log('venv does not exist, running install script');
    const child = spawn(installScriptPath, {
      stdio: 'inherit',
      shell: true,
      cwd: rootDir(),
    });

    child.on('error', (error) => {
      console.error('failed to start install script:', error);
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('install script completed successfully');
        fs.writeFileSync(installCompleteFilePath, 'done');
        resolve();
      } else {
        console.error(`install script exited with code ${code}`);
        reject(new StringifiableError(`install script exited with code ${code}`));
      }
    });
  });
}
