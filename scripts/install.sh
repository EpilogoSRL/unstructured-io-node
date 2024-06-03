#!/bin/bash

sudo_command() {
  if command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    "$@"
  fi
}

SCRIPT_DIR=./scripts
PYTHON_DIR="$SCRIPT_DIR/../python"
UNAME=$(uname -s)

###
### Python
###
# Check if the ./python directory exists, create it if not
[ -d "$PYTHON_DIR" ] || mkdir "$PYTHON_DIR"
if [ "$UNAME" == "Linux" ] ; then
    # Assume Debian-based Linux
    sudo_command apt-get update
    sudo_command apt-get install -y \
      make \
      g++ \
      python3 \
      python3-dev \
      python3-venv \
      python3-distutils \
      python3-distutils-extra \
      python3-pip;
elif [ "$UNAME" == "Darwin" ] ; then
    # macOS
    brew update
    brew install python3;
else
    echo "Unsupported operating system"
    exit 1
fi

###
### Unstructured
###
chmod +x "$SCRIPT_DIR/unstructured.sh"
source "$SCRIPT_DIR/unstructured.sh";
echo "DONE" >> "$SCRIPT_DIR/setup_complete";
