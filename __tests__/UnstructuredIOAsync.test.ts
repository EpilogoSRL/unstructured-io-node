import { UnstructuredIOAsync } from '../src';
import * as path from 'path';
import PartitionsAndChunksAFile from './data/partitions-and-chunks-a-file.json';
import { ensureEnvironmentSetup } from '../src/utils/ensureEnvironmentSetup';

describe('UnstructuredIOAsync', () => {
  beforeAll(async () => {
    // Give enough timeout in case the dependencies need to be installed
    await ensureEnvironmentSetup();
  }, 30 * 60 * 1000);

  it('partitions and chunks a file', async () => {
    const partitioned = await UnstructuredIOAsync.partition({
      filename: path.join(__dirname, '../__tests__/data/node-calls-python.pdf'),
      strategy: 'hi_res',
      languages: ['eng'],
      xml_keep_tags: true,
      chunking_strategy: 'basic',
      max_characters: 5,
    }, {
      absoluteTmpDir: __dirname,
      signal: undefined,
      nodeOptions: {
        maxOldSpaceSize: 2048,
      }
    });

    expect(partitioned).toMatchObject(PartitionsAndChunksAFile);
  }, 200 * 1000);

  it('aborts partitioning', async () => {
    const abortController = new AbortController();

    const partitionedPromise = UnstructuredIOAsync.partition({
      filename: path.join(__dirname, '../__tests__/data/node-calls-python.pdf'),
      strategy: 'hi_res',
      languages: ['eng'],
      xml_keep_tags: true,
      chunking_strategy: 'basic',
      max_characters: 5,
    }, {
      absoluteTmpDir: __dirname,
      signal: abortController.signal,
      nodeOptions: {
        maxOldSpaceSize: 2048,
      }
    });

    // Wait 10 seconds
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 10 * 1000);
    });

    // Abort
    abortController.abort('User aborted');

    let result;
    try {
      result = await partitionedPromise;
    } catch(e) {
      // Operation was aborted
      result = e;
    }

    expect(result).toMatchObject({
      code: 'ABORT_ERR',
      name: 'AbortError',
      cause: 'User aborted'
    });
  }, 200 * 1000);
});
