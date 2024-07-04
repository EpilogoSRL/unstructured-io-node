FROM ubuntu:22.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
SHELL ["/bin/bash", "-c"]


# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install node
# Install base dependencies
RUN apt-get update \
    && apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        wget \
        openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Install node
ENV NODE_VERSION=20.7.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN npm install -g pnpm
RUN npm install -g ts-node

RUN apt-get update && apt-get install -y \
      make \
      g++ \
      python3 \
      python3-dev \
      python3-venv \
      python3-distutils \
      python3-distutils-extra \
      python3-pip \
      libpython3.11;

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN chmod +x ./scripts/install.sh;
RUN chmod +x ./scripts/unstructured.sh;

RUN pnpm install
RUN . ./scripts/install.sh
CMD ["bash"]
