#!/bin/sh

# Ensure /run/pcscd directory exists
mkdir -p /run/pcscd
chown pcscd:pcscd /run/pcscd

# Start pcscd
pcscd --auto-exit

# Start the Node.js app
npm start