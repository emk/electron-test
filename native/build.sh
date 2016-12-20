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

# Create a fake home directory under ~/.electron-gyp to cache things
# related to Electron builds.  We need to make symlinks to various Rust
# config directories if we want this to work.
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

# Run the actual build, and copy it to where node will find it.  Ideally
# we'd just call `neon build`, but that requires neon-bindings/neon#109 and
# neon-bindings/neon-cli#31 to have any chance of working.
case `uname -s` in
    Darwin)
        cd native
        cargo rustc --release -- -C link-args=-Wl,-undefined,dynamic_lookup
        cp target/release/libtestnative.dylib index.node
        ;;
    Linux)
        cd native
        cargo build --release
        cp target/release/libtestnative.so index.node
        ;;
    *)
        echo "Don't know how to build native extensions on this platform" 2>&1
        exit 1
esac
