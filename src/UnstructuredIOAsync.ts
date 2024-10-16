import type { UnstructuredIO } from './UnstructuredIO';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import { fileExistsAsync } from './utils/fileExistsAsync';
import { StringifiableError } from './utils/StringifiableError';

const rm = util.promisify(fs.rm);
const readFile = util.promisify(fs.readFile);

type TUnstructuredIO = typeof UnstructuredIO;

function createCallSyncAPI<Func extends keyof TUnstructuredIO>(func: Func) {
  return async function(options: Parameters<TUnstructuredIO[Func]>[0], async: {
    /**
     * This directory will be used for IPC
     * pass something like /tmp
     */
    absoluteTmpDir: string;

    /**
     * Pass a signal if you want to be able to abort the partitioning or chunking
     */
    signal?: AbortSignal;

    /**
     * Control the amounts of memory unstructured can use
     */
    nodeOptions?: {
      maxOldSpaceSize?: number;
    };
  }) {
    const callId = uuid();

    const tsScript = path.resolve(__dirname, './async-entry.ts');
    const jsScript = path.resolve(__dirname, './async-entry.js');
    const isTSScript = await fileExistsAsync(tsScript);

    const resultFile = path.resolve(__dirname, async.absoluteTmpDir, callId);

    // Spawn the new Node.js process
    const child = childProcess.spawn('node', [
      ...isTSScript
        ? ['-r ts-node/register']
        : [],

      ...async.nodeOptions?.maxOldSpaceSize
        ? [
          `--max-old-space-size=${async.nodeOptions?.maxOldSpaceSize}`,
        ]
        : [],

      isTSScript
        ? tsScript
        : jsScript,

      func,
      callId,
      resultFile,
      btoa(JSON.stringify(options)),
    ], {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
      signal: async.signal,
    });

    await new Promise<void>((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        reject(new StringifiableError(`Child process exited with code ${code}`));
      });

      child.on('error', (err) => {
        reject(err);
      });
    });

    // get the result
    const { result, data } = JSON.parse(await readFile(resultFile, 'utf-8'));
    await rm(resultFile);

    if (result === 'error') {
      throw new StringifiableError(data);
    }

    return data;
  };
}

/**
 * Use this API when you want control over the amounts of memory that unstructured
 * or when you want to be able to kill the process.
 */
export const UnstructuredIOAsync = {
  ensureEnvironmentSetup: createCallSyncAPI('ensureEnvironmentSetup'),
  partition: createCallSyncAPI('partition'),
} satisfies Record<keyof TUnstructuredIO, any>;
