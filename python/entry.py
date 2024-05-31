import sys
import os

current_script_path = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_script_path, './unstructured.io'))

from unstructured.partition.auto import partition as unstructured_partition
from unstructured.staging.base import elements_to_dicts  # Import elements_to_dicts function

def partition(*args, **kwargs):
    # Call the original partition function from the unstructured library
    result = unstructured_partition(*args, **kwargs)

    # Convert the elements of the result to dictionaries
    return elements_to_dicts(result)
