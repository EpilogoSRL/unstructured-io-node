#!/bin/bash

echo "@epilogo/unstructured-io-node running install script..."

SCRIPT_DIR=$(dirname "$0")
PYTHON_DIR="$SCRIPT_DIR/../python"
VENV_DIR="$PYTHON_DIR/venv"

# Check if the ./python directory exists, create it if not
[ -d "$PYTHON_DIR" ] || mkdir "$PYTHON_DIR"

# Clone unstructured-io
if [ ! -d "$PYTHON_DIR/unstructured-io" ]; then
  echo "@epilogo/unstructured-io-node cloning unstructured e1447e0c0797382bb44dda67cada32ba97..."
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

# Determine OS platform
UNAME=$(uname -s)

# Define install commands for different platforms
echo "@epilogo/unstructured-io-node installing OS deps..."
if [ "$UNAME" == "Linux" ] ; then
    # Assume Debian-based Linux
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip
    sudo apt-get install -y pandoc \
      poppler-utils \
      leptonica \
      tesseract-ocr \
      tesseract-lang \
      libreoffice \
      libmagic \
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

# Common setup for Python environment using built-in venv
python3 -m venv "$VENV_DIR"
source "$VENV_DIR"/bin/activate

# Now install your dependencies within the virtual environment
echo "@epilogo/unstructured-io-node installing python deps..."
python3 -m pip install --upgrade pip setuptools
python3 -m pip install "unstructured[all-docs]";
python3 -m pip install requests;

# Node.js and pnpm installation
if ! command -v node >/dev/null 2>&1 || [ "$(node -v)" != "v20.7.0" ]; then
    echo "Node.js not found, installing..."
    # Use nvm to manage Node.js versions
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20.7.0
    nvm use 20.7.0
fi

# Check pnpm version and install if not present or not correct version
if ! command -v pnpm >/dev/null 2>&1 || [ "$(pnpm -v)" != "8.12.1" ]; then
    echo "pnpm not found, installing..."
    npm install -g pnpm@8.12.1
fi

echo "@epilogo/unstructured-io-node done"
