FROM ubuntu:22.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
SHELL ["/bin/bash", "-c"]

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Add deadsnakes PPA for Python 3.12 and Tesseract OCR PPA
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:deadsnakes/ppa \
    && add-apt-repository -y ppa:alex-p/tesseract-ocr5 \
    && apt-get update

# Install base dependencies, including Python and document processing tools
RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    git \
    gcc \
    wget \
    tar \
    xz-utils \
    tzdata \
    rsync \
    libssl-dev \
    openssh-client \
    make \
    g++ \
    node-gyp \
    python3.12 \
    python3.12-dev \
    python3.12-venv \
    python3-pip \
    python3.12-distutils \
    libpython3.12 \
    libgl1 \
    poppler-utils \
    libreoffice \
    pandoc \
    tesseract-ocr \
    tesseract-ocr-all \
    libtesseract-dev \
    libmagic-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pip compatible with Python 3.12
RUN curl -sS https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
    && python3.12 get-pip.py \
    && rm get-pip.py

# **Set PYTHON environment variable for node-gyp**
ENV PYTHON=python3.12

# **Force all 'python3' and 'python' commands to use Python 3.12**
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1 \
    && update-alternatives --install /usr/bin/python python /usr/bin/python3.12 1 \
    && update-alternatives --set python3 /usr/bin/python3.12 \
    && update-alternatives --set python /usr/bin/python3.12

# **Ensure 'python3-config' and 'python-config' point to Python 3.12**
RUN ln -sf /usr/bin/python3.12-config /usr/bin/python3-config \
    && ln -sf /usr/bin/python3.12-config /usr/bin/python-config

# Verify that 'python' and 'python3' point to Python 3.12
RUN python --version && python3 --version

# Install Node.js via NVM and set up global packages
ENV NODE_VERSION=20.7.0
ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install ${NODE_VERSION} \
    && nvm use v${NODE_VERSION} \
    && nvm alias default v20.7.0 \
    && npm install -g pnpm ts-node

# Ensure the NVM path is available
ENV PATH="$NVM_DIR/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# Set up application directory and copy files
RUN mkdir -p /app
COPY . /app
WORKDIR /app

# Make necessary scripts executable
RUN chmod +x ./scripts/install.sh ./scripts/unstructured.sh

# Install application dependencies
RUN pnpm install

# Run custom install script
RUN ./scripts/install.sh

# Default command
CMD ["bash"]
