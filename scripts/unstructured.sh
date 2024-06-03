#!/bin/bash

SCRIPT_DIR=./scripts
PYTHON_DIR="$SCRIPT_DIR/../python"

if [ ! -d "$PYTHON_DIR/unstructured-io" ]; then
  ssh-keyscan github.com >> ~/.ssh/known_hosts &&
  (
    # Navigate to the directory
    cd "$PYTHON_DIR" && \
    # Execute the following commands in a subshell
    (
      git clone --depth 1 git@github.com:krishanmarco/unstructured-io.git unstructured-io \
        && cd unstructured-io \
        && git fetch --depth 1 origin 293901e1447e0c0797382bb44dda67cada32ba97 \
        && git checkout 293901e1447e0c0797382bb44dda67cada32ba97 \
        && rm -rf .git
    )
  )
fi

###
### Unstructured dependencies
###
if [ "$UNAME" == "Linux" ] ; then
    # Assume Debian-based Linux
    sudo_command apt-get update
    sudo_command apt-get install -y \
      pandoc \
      poppler-utils \
      libleptonica-dev \
      tesseract-ocr \
      tesseract-ocr-all \
      libreoffice \
      ffmpeg \
      libsm6 \
      libxext6 \
      libmagic-dev;
elif [ "$UNAME" == "Darwin" ] ; then
    # macOS
    brew update
    brew install pandoc \
      poppler \
      leptonica \
      tesseract-ocr \
      tesseract-lang \
      tesseract \
      libreoffice \
      libmagic;
else
    echo "Unsupported operating system"
    exit 1
fi

python3 -m pip install --upgrade pip setuptools
python3 -m pip install "unstructured[all-docs]";
python3 -m pip install requests;
