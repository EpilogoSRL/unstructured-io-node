#!/bin/bash

SCRIPT_DIR=./scripts
PYTHON_DIR="$SCRIPT_DIR/../python"
UNAME=$(uname -s)

if [ ! -d "$PYTHON_DIR/unstructured-io" ]; then
  ssh-keyscan github.com >> ~/.ssh/known_hosts &&
  (
    # Navigate to the directory
    cd "$PYTHON_DIR" && \
    # Execute the following commands in a subshell
    (
      git clone --depth 1 git@github.com:krishanmarco/unstructured-io.git unstructured-io \
        && cd unstructured-io \
        && git fetch --depth 1 origin 8b7e5bbeac17f6a782a629538f7108da3e9f4fbf \
        && git checkout 8b7e5bbeac17f6a782a629538f7108da3e9f4fbf \
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
      pandoc=3.2.1 \
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
    brew install pandoc@3.2.1 \
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

###
### Unstructured dependencies (pip)
###
if [ "$UNAME" == "Linux" ] ; then
  echo "Nothing to do"
elif [ "$UNAME" == "Darwin" ] ; then
  python3 -m venv "$PYTHON_DIR"/venv
  source "$PYTHON_DIR"/venv/bin/activate
else
    echo "Unsupported operating system"
    exit 1
fi

python3 -m pip install --upgrade pip setuptools
python3 -m pip install "numpy<2.0"
python3 -m pip install "unstructured[all-docs]==0.15.12";
python3 -m pip install requests;
python3 -m pip install psutil;
