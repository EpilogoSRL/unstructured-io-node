import { UnstructuredIOAsync } from '../src';
import * as path from 'path';
import PartitionsAndChunksAFile2 from './data/partitions-and-chunks-a-file2.json';
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
      max_characters: 5,
      additional_partition_args: {
        coordinates: true,
      }
    }, {
      absoluteTmpDir: __dirname,
      signal: undefined,
      nodeOptions: {
        maxOldSpaceSize: 2048,
      }
    });

    expect(partitioned[0].metadata.coordinates.system).toBeDefined();
    expect(partitioned).toMatchObject(PartitionsAndChunksAFile2);
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

  it('throws meaningful errors', async () => {
    try {
      await UnstructuredIOAsync.partition({
      filename: '/file-that-doesnt-exist.pdf',
      strategy: 'hi_res',
      languages: ['eng'],
      xml_keep_tags: true,
      chunking_strategy: 'basic',
      max_characters: 5,
    }, {
      absoluteTmpDir: __dirname,
      nodeOptions: {
        maxOldSpaceSize: 2048,
      }
    });
    } catch(e) {
      expect(e.name.length).toBeGreaterThan(1);
      expect(e.message.length).toBeGreaterThan(10);
      expect(e.stack.length).toBeGreaterThan(10);
    }
  }, 200 * 1000);
});
