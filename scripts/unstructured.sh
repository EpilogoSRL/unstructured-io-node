#!/bin/bash

SCRIPT_DIR=./scripts
PYTHON_DIR="$SCRIPT_DIR/../python"
UNAME=$(uname -s)

if [ ! -d "$PYTHON_DIR/unstructured-io" ]; then
  ssh-keyscan github.com >> ~/.ssh/known_hosts &&
  (
    cd "$PYTHON_DIR" && \
    (
      git clone --depth 1 git@github.com:krishanmarco/unstructured-io.git unstructured-io \
        && cd unstructured-io \
        && git fetch --depth 1 origin 6ba376ab7eaa73e12be35438bae47cfa0ca7dfe5 \
        && git checkout 6ba376ab7eaa73e12be35438bae47cfa0ca7dfe5 \
        && rm -rf .git
    )
  )
fi

###
### Unstructured dependencies
###
if [ "$UNAME" == "Linux" ] ; then
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


install_pip_dependencies() {
  python3.12 -m pip install --upgrade pip setuptools
  python3.12 -m pip install "numpy<2.0"
  python3.12 -m pip install "unstructured[all-docs]==0.15.14"
  python3.12 -m pip install requests
  python3.12 -m pip install psutil
}

###
### Unstructured dependencies (pip)
###
if [ "$UNAME" == "Linux" ] ; then
    # Install dependencies in the parent environment
    install_pip_dependencies
fi

# Create and activate the virtual environment
python3.12 -m venv "$PYTHON_DIR"/venv
source "$PYTHON_DIR"/venv/bin/activate

# Install dependencies in the virtual environment
install_pip_dependencies
