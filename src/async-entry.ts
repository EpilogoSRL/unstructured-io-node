import fs from 'fs';
import * as util from 'util';
import { UnstructuredIO } from './UnstructuredIO';
import { StringifiableError } from './utils/StringifiableError';

const writeFile = util.promisify(fs.writeFile);

function checkStringParam(name: string, value: any) {
  if (!value || value.length <= 0) {
    throw new StringifiableError([
      'async-entry',
      `Parameter Validation: ${name} was not specified`,
    ].join(', '));
  }
}

const [, , func, callId, resultFile, encodedOptions] = process.argv;
checkStringParam('func', func);
checkStringParam('callId', callId);
checkStringParam('resultFile', resultFile);
checkStringParam('encodedOptions', encodedOptions);

const options = JSON.parse(atob(encodedOptions));

(async () => {
  async function writeResultAndExit(data: any) {
    await writeFile(resultFile, JSON.stringify(data));
    process.exit(0);
  }

  try {
    const result = await UnstructuredIO[func](options);
    await writeResultAndExit({
      result: 'success',
      data: result,
    });
  } catch (e) {
    await writeResultAndExit({
      result: 'error',
      data: e,
    });
  }
})();
