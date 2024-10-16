import { UnstructuredIO, UnstructuredIOAsync } from '../src';
import * as path from 'path';
import PartitionsAFile from './data/partitions-a-file.json';
import PartitionsAFileWithOCR from './data/partitions-a-file-with-ocr.json';
import PartitionsAndChunksAFile from './data/partitions-and-chunks-a-file.json';
import { ensureEnvironmentSetup } from '../src/utils/ensureEnvironmentSetup';

describe('UnstructuredIO', () => {
  beforeAll(async () => {
    // Give enough timeout in case the dependencies need to be installed
    await ensureEnvironmentSetup();
  }, 30 * 60 * 1000);

  it('partitions a file', async () => {
    const partitioned = await UnstructuredIO.partition({
      filename: path.join(__dirname, '../__tests__/data/node-calls-python.pdf'),
      strategy: 'auto',
      languages: ['eng'],
      xml_keep_tags: true,
      additional_partition_args: {
        coordinates: true,
      }
    });

    expect(partitioned[0].metadata.coordinates.system).toBeDefined();
    expect(partitioned).toMatchObject(PartitionsAFile);
  }, 200 * 1000);

  it('partitions a file with OCR', async () => {
    const partitioned = await UnstructuredIO.partition({
      filename: path.join(__dirname, '../__tests__/data/with-images.pdf'),
      strategy: 'hi_res',
      languages: ['eng', 'ita'],
      xml_keep_tags: true,
      include_page_breaks: false,
    });

    expect(partitioned).toMatchObject(PartitionsAFileWithOCR);
  }, 200 * 1000);

  it('partitions and chunks a file', async () => {
    const partitioned = await UnstructuredIO.partition({
      filename: path.join(__dirname, '../__tests__/data/node-calls-python.pdf'),
      strategy: 'hi_res',
      languages: ['eng'],
      xml_keep_tags: true,
      chunking_strategy: 'basic',
      max_characters: 5,
    });

    expect(partitioned).toMatchObject(PartitionsAndChunksAFile);
  }, 200 * 1000);

  it('throws meaningful errors', async () => {
    try {
      await UnstructuredIO.partition({
        filename: '/file-that-doesnt-exist.pdf',
        strategy: 'hi_res',
        languages: ['eng'],
        xml_keep_tags: true,
        chunking_strategy: 'basic',
        max_characters: 5,
      });
    } catch(e) {
      expect(e.name.length).toBeGreaterThan(1);
      expect(e.message.length).toBeGreaterThan(10);
      expect(e.stack.length).toBeGreaterThan(10);
    }
  }, 200 * 1000);
});
