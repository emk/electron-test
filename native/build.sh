#!/bin/bash
#
# This script can be invoked from the root directory as `native/build.sh`.
# It will make sure we have the right Node.js headers to build a module for
# Electron and run the actual build manually.
#
# If this is giving weird resutls, try:
#
#     rm -rf node_modules native/target
#
# ...and try again.

set -euo pipefail

export NEON_NODE_ABI=50
export npm_config_target=1.4.12
export npm_config_arch=x64
export npm_config_target_arch=x64
export npm_config_disturl=https://atom.io/download/electron
export npm_config_runtime=electron
export npm_config_build_from_source=true

# Create a fake home directory under ~/.electron-gyp to cache things
# related to Electron builds.
mkdir -p ~/.electron-gyp
if [ ! -h ~/.electron-gyp/.cargo ]; then
    ln -s ~/.cargo ~/.electron-gyp/
fi
if [ ! -h ~/.electron-gyp/.multirust ]; then
    ln -s ~/.multirust ~/.electron-gyp/
fi

# Switch to the fake home directory.
HOME=~/.electron-gyp

# Make sure that our Electron Node headers are installed.
if [ ! -d ~/.node-gyp/iojs-$npm_config_target ]; then
    node_modules/.bin/node-gyp install
fi

# Run the actual build, and copy it to where node will find it.
cd native
cargo build --release
cp target/debug/libtestnative.so index.node
