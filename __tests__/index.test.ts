import { UnstructuredIO } from '../src';
import * as path from 'path';
import NodeCallsPythonPartitioned from './data/node-calls-python-partitioned.json';

describe('unstructured-io-node', () => {
  it('partitions a file', async () => {
    const partitioned = await UnstructuredIO.partition({
      filename: path.join(__dirname, '../__tests__/data/node-calls-python.pdf'),
      strategy: 'hi_res',
      languages: ['eng'],
      xml_keep_tags: true,
    });

    expect(partitioned).toMatchObject(NodeCallsPythonPartitioned);
  }, 200 * 1000);
});
