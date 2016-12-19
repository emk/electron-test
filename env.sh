# Source this with `. env.sh` before running `yarn` or `native/build.sh`.
# This sets up the configuration required by `node-gyp` and `neon` to build
# native modules that will successfully link against Electron instead of
# the system copy of NodeJS.

export NEON_NODE_ABI=50
export npm_config_target=1.4.12
export npm_config_arch=x64
export npm_config_target_arch=x64
export npm_config_disturl=https://atom.io/download/electron
export npm_config_runtime=electron
export npm_config_build_from_source=true
