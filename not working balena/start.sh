#!/bin/sh
udevadm control --reload-rules && udevadm trigger
# Check if pcscd is already running
if pgrep -x "pcscd" > /dev/null
then
    echo "pcscd is already running."
else
    echo "Starting pcscd..."
    pcscd --debug &
fi

# Start your Node.js app
npm start
