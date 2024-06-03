import { UnstructuredIO } from '../src';
import * as path from 'path';
import NodeCallsPythonPartitioned from './data/node-calls-python-partitioned.json';
import WithImagesPartitioned from './data/with-images-partitioned.json';
import { ensureEnvironmentSetup } from '../src/utils/ensureEnvironmentSetup';

describe('unstructured-io-node', () => {

  beforeAll(async () => {
    // Give enough timeout in case the dependencies need to be installed
    await ensureEnvironmentSetup();
  }, 30 * 60 * 1000);


  it('partitions a file', async () => {
    const partitioned = await UnstructuredIO.partition({
      filename: path.join(__dirname, '../__tests__/data/node-calls-python.pdf'),
      strategy: 'hi_res',
      languages: ['eng'],
      xml_keep_tags: true,
    });

    expect(partitioned).toMatchObject(NodeCallsPythonPartitioned);
  }, 200 * 1000);

  it('partitions a file that requires OCR', async () => {
    const partitioned = await UnstructuredIO.partition({
      filename: path.join(__dirname, '../__tests__/data/with-images.pdf'),
      strategy: 'hi_res',
      languages: ['eng', 'ita'],
      xml_keep_tags: true,
      include_page_breaks: false,
    });

    expect(partitioned).toMatchObject(WithImagesPartitioned);
  }, 200 * 1000);
});
