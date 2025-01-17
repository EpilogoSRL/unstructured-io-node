import { interpreter } from 'node-calls-python';
import { cleanArgs } from './utils/cleanArgs';
import { MutexValue } from './utils/MutexValue';
import { rootDir } from './utils/rootDir';
import { ensureEnvironmentSetup } from './utils/ensureEnvironmentSetup';
import { fileExistsAsync } from './utils/fileExistsAsync';
import { StringifiableError } from './utils/StringifiableError';

const pythonEntry = new MutexValue(async () => {
  const venv = rootDir('/python/venv/lib/python3.11/site-packages');
  if (await fileExistsAsync(venv)) {
    interpreter.addImportPath(venv);
  }

  return interpreter.import(rootDir('/python/entry.py'), false);
});

export const UnstructuredIO = {
  ensureEnvironmentSetup,
  async partition(options: {
    /**
     * A string defining the target filename path.
     */
    filename?: string;

    /**
     * A string defining the file content in MIME type.
     */
    content_type?: string;

    /**
     * A file-like object using "rb" mode.
     * not supported because of node-calls-python
     */
    file?: never;

    /**
     * The filename to store in element metadata when 'file' is not null.
     */
    file_filename?: string;

    /**
     * The URL for a remote document.
     */
    url?: string;

    /**
     * If true, the output will include page breaks if the filetype supports it.
     * Default is false.
     */
    include_page_breaks?: boolean;

    /**
     * The strategy to use for partitioning PDF/image. 'auto' or 'hi_res'.
     * Default is 'auto'.
     */
    strategy: 'auto' | 'hi_res' | 'fast' | 'ocr_only';

    /**
     * The encoding method used to decode the text input.
     * Defaults to 'utf-8' if not provided.
     */
    encoding?: string;

    /**
     * The headers to be used in conjunction with the HTTP request if URL is set.
     */
    headers?: { [key: string]: string };

    /**
     * Document types to skip table extraction with.
     * Default includes ['pdf', 'jpg', 'png', 'heic'].
     */
    skip_infer_table_types?: string[];

    /**
     * Determines whether or not SSL verification is used in HTTP requests.
     * Default is true.
     */
    ssl_verify?: boolean;

    /**
     * The languages present in the document, for OCR and partitioning.
     */
    languages?: string[];

    /**
     * @deprecated
     * Use 'skip_infer_table_types' to opt out of table extraction.
     * Default is false.
     */
    pdf_infer_table_structure?: boolean;

    /**
     * If true, detected images are saved or stored in metadata. Applicable if 'strategy=hi_res'.
     * Default is false.
     */
    extract_images_in_pdf?: boolean;

    /**
     * Types of elements to extract images from. Applicable if 'strategy=hi_res'.
     */
    extract_image_block_types?: string[];

    /**
     * If true, stores images in the payload. Applicable if 'strategy=hi_res'.
     * Default is false.
     */
    extract_image_block_to_payload?: boolean;

    /** Path for saving images from documents. Applicable if 'strategy=hi_res'.
     */
    extract_image_block_output_dir?: string;

    /**
     * If true, retains the XML tags in the output. Only applies to partition_xml.
     * Default is false.
     */
    xml_keep_tags?: boolean;

    /**
     * The timeout for the HTTP request if URL is set.
     * Defaults to indefinitely.
     */
    request_timeout?: number;

    /**
     * The layout detection model name used when 'strategy=hi_res'.
     */
    hi_res_model_name?: string;

    /**
     * @deprecated
     * Use 'hi_res_model_name' instead.
     */
    model_name?: string;

    /**
     * If true and inference from message header failed, infer last_modified metadata from bytes.
     * Default is false.
     */
    date_from_file_object?: boolean;

    /**
     * What page number should be assigned to the first page in the document.
     * Default is 1.
     */
    starting_page_number?: number;

    /**
     * @deprecated
     * A function or false.
     */
    paragraph_grouper?: never;

    /**
     * @deprecated
     * Use 'languages' instead. The OCR languages for the document.
     */
    ocr_languages?: string;

    /**
     * Detect language per element instead of at the document level.
     * Default is false.
     */
    detect_language_per_element?: boolean;

    /**
     * Additional metadata about the data source.
     */
    data_source_metadata?: any; // This needs a specific type if available

    /**
     * The filename to use for metadata when a file is provided.
     */
    metadata_filename?: string;

    /**
     * Chunking params below
     * Chunking can be performed as part of partitioning by specifying a value for the chunking_strategy argument.
     * The current options are basic and by-title (described below).
     */
    chunking_strategy?: 'basic' | 'by_title';

    /**
     * The hard maximum size for a chunk.
     * No chunk will exceed this number of characters.
     * A single element that by itself exceeds this size will be divided into two or more chunks using text-splitting.
     */
    max_characters?: number;

    /**
     * The “soft” maximum size for a chunk.
     * A chunk that already exceeds this number of characters will not be extended,
     * even if the next element would fit without exceeding the specified hard maximum.
     * This can be used in conjunction with max_characters to set a “preferred” size,
     * like “I prefer chunks of around 1000 characters,
     * but I’d rather have a chunk of 1500 (max_characters) than resort to text-splitting”.
     * This would be specified with (..., max_characters=1500, new_after_n_chars=1000).
     */
    new_after_n_chars?: number;

    /**
     * Only when using text-splitting to break up an oversized chunk,
     * include this number of characters from the end of the prior chunk as a prefix on the next.
     * This can mitigate the effect of splitting the semantic unit represented by the
     * oversized element at an arbitrary position based on text length.
     */
    overlap?: number;

    /**
     * Also apply overlap between “normal” chunks, not just when text-splitting to break up an oversized element.
     * Because normal chunks are formed from whole elements that each have a clean semantic boundary,
     * this option may “pollute” normal chunks.
     * You’ll need to decide based on your use-case whether this option is right for you.
     */
    overlap_all?: boolean;

    additional_partition_args?: {
      coordinates?: boolean;
    };
    /**
     * Any additional properties.
     * kwargs support disabled for now
     */
    // [key: string]: any
  }) {
    const result = await errorHandler(async () => {
      return interpreter.call(
        await pythonEntry.getValue(),
        'partition',
        cleanArgs({
          // Must match python/unstructured.io/unstructured/partition/auto.py::partition signature
          __kwargs: true,

          // Allow unknown parameter injection
          ...options,

          filename: options.filename,
          content_type: options.content_type,
          file: options.file,
          file_filename: options.file_filename,
          url: options.url,
          include_page_breaks: options.include_page_breaks,
          strategy: options.strategy ?? 'hi_res',
          encoding: options.encoding,
          paragraph_grouper: options.paragraph_grouper,
          headers: options.headers,
          skip_infer_table_types: options.skip_infer_table_types ?? [],
          ssl_verify: options.ssl_verify,
          ocr_languages: options.ocr_languages,
          languages: options.languages,
          detect_language_per_element: options.detect_language_per_element,
          pdf_infer_table_structure: options.pdf_infer_table_structure,
          extract_images_in_pdf: options.extract_images_in_pdf,
          extract_image_block_types: options.extract_image_block_types,
          extract_image_block_output_dir: options.extract_image_block_output_dir,
          extract_image_block_to_payload: options.extract_image_block_to_payload,
          xml_keep_tags: options.xml_keep_tags,
          data_source_metadata: options.data_source_metadata,
          metadata_filename: options.metadata_filename,
          request_timeout: options.request_timeout,
          hi_res_model_name: options.hi_res_model_name,
          model_name: options.model_name,
          date_from_file_object: options.date_from_file_object,
          starting_page_number: options.starting_page_number ?? 1,

          /**
           * Chunking params below
           */
          chunking_strategy: options.chunking_strategy,
          max_characters: options.max_characters,
          new_after_n_chars: options.new_after_n_chars,
          overlap: options.overlap,
          overlap_all: options.overlap_all,
        }),
      );
    });

    return result as Array<{
      type?: string;
      element_id?: string;
      text?: string | undefined;
      metadata?: {
        detection_class_prob?: number;
        coordinates?: {
          points?: [number, number][];
          system?: string;
          layout_width?: string;
          layout_height?: string;
        };
        last_modified?: string;
        filetype?: string;
        languages?: string[];
        page_number?: number;
        file_directory?: string;
        filename?: string;
      };
    }>;
  },
};

async function errorHandler<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (e) {
    throw new StringifiableError(e);
  }
}
