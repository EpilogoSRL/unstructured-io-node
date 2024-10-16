import sys
import os
import traceback

current_script_path = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_script_path, './unstructured.io'))

from unstructured.partition.auto import partition as unstructured_partition
from unstructured.staging.base import elements_to_dicts

def partition(*args, **kwargs):
    try:
        # Call the original partition function from the unstructured library
        result = unstructured_partition(*args, **kwargs)

        # Convert the elements of the result to dictionaries
        return elements_to_dicts(result)

    except Exception as e:
        # Capture the full error stack trace
        error_message = traceback.format_exc()

        # Print or return the full error message (adjust based on how you are handling output)
        print(f"Error: {error_message}")

        # re-raise the exception
        raise RuntimeError(f"An error occurred in the partition function: {error_message}")
