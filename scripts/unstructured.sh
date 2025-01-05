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
        && git fetch --depth 1 origin b981d7197f06710027bf7a92446830fd917e6586 \
        && git checkout b981d7197f06710027bf7a92446830fd917e6586 \
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
    brew install pandoc@3.2.1
    brew install poppler
    brew install leptonica
    brew install tesseract-ocr
    brew install tesseract-ocr
    brew install tesseract
    brew install libreoffice
    brew install libmagic
else
    echo "Unsupported operating system"
    exit 1
fi


install_pip_dependencies() {
  python3.11 -m pip install --upgrade pip setuptools
  python3.11 -m pip install "unstructured[all-docs]==0.16.11"
}

###
### Unstructured dependencies (pip)
###
if [ "$UNAME" == "Linux" ] ; then
    # Install dependencies in the parent environment
    install_pip_dependencies
fi

# Create and activate the virtual environment
python3.11 -m venv "$PYTHON_DIR"/venv
source "$PYTHON_DIR"/venv/bin/activate
install_pip_dependencies

cp "$SCRIPT_DIR/activate_this.py" "$PYTHON_DIR/venv/bin/activate_this.py"
