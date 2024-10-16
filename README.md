# @epilogo/unstructured-io-node

- Current Hash `6ba376ab7eaa73e12be35438bae47cfa0ca7dfe5`
- Current Version: `0.15.14` https://github.com/Unstructured-IO/unstructured/commit/6ba376ab7eaa73e12be35438bae47cfa0ca7dfe5

To release a new version
1. Replace all `6ba376ab7eaa73e12be35438bae47cfa0ca7dfe5` with the new hash
2. Replace all `0.15.14` with the new version tag
3. Run `./scripts/unstructured.sh`

This library provides Node.js bindings to the `unstructured.io` Python module. It enables Node.js applications to utilize the document parsing capabilities of the `unstructured` library.

## Motivation

The `unstructured` Python library excels at extracting structured data from various document formats, including PDFs, HTML, Word documents, and more. However, there are situations where utilizing this functionality within a Node.js environment directly is desirable. This library bridges that gap, allowing Node.js applications to leverage the power of `unstructured` without relying solely on a Python environment.

## Installation

You can install the library using npm, yarn, or pnpm:

```bash
npm install @epilogo/unstructured-io-node
yarn add @epilogo/unstructured-io-node
pnpm add @epilogo/unstructured-io-node
```

## Post-installation

The post-installation script (`install.sh`) will execute the following:

1. **Clone the `unstructured-io` repository:** It clones a specific commit `6ba376ab7eaa73e12be35438bae47cfa0ca7dfe5` repository into a `python/unstructured-io` directory within the library's folder.
2. **Install system dependencies:** Based on your operating system (currently supporting Linux and macOS), it installs the necessary system packages for `unstructured` to function. These packages include tools for image processing, OCR, and handling various document formats.
3. **Create and activate a Python virtual environment:** It creates a virtual environment within the `python` directory to isolate the Python dependencies of this library.
4. **Install Python dependencies:** It installs the `unstructured` Python package along with its dependencies within the activated virtual environment.
5. **Install Node.js and pnpm:**

## Usage

Here's a basic example demonstrating how to use the library:

```typescript
import { UnstructuredIO } from '@epilogo/unstructured-io-node';
import * as path from 'path';

// This must be called at least once in your container or local environment
// It takes care of installing the neccesary dependencies.
// Only macOS and Linux is supported
await UnstructuredIO.ensureEnvironmentSetup();

const partitioned = await UnstructuredIO.partition({
 filename: path.join(__dirname, '../__tests__/data/your-document.pdf'), 
 strategy: 'hi_res',
 languages: ['eng'],
});

console.log(partitioned);
```

**Explanation:**

1. **Import:** Import the `UnstructuredIO` object from the library.
2. **Call `partition`:** Invoke the `partition` function on the `UnstructuredIO` object, passing an options object as an argument.
    - **`filename`:** Specify the path to the document you want to process.
    - **`strategy`, `languages`, etc.:**  Adjust other options as needed based on the `unstructured` Python library's API.
3. **Process the result:**  The `partition` function returns the extracted structured data, which you can then process according to your application's needs.

Refer to the `unstructured` library's documentation ([https://docs.unstructured.io/](https://docs.unstructured.io/)) for details on available options and their usage within the `partition` function.
