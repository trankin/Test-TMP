# Stage 1: Build stage
FROM balenalib/raspberrypi4-64-alpine-node:16.19-3.12-run AS build

# Install necessary build dependencies (pcsc-lite, python, build-base, ccid driver)
RUN apk add --no-cache \
    pcsc-lite-dev \
    build-base \
    python3 \
    py3-pip \
    ccid \
    eudev \
    && ln -sf python3 /usr/bin/python

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install node modules including nfc-pcsc which needs pcsc-lite-dev
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Stage 2: Runtime stage (final image)
FROM balenalib/raspberrypi4-64-alpine-node:16.19-3.12-run

# Install runtime dependencies (pcsc-lite-libs, pcsc-lite, ccid)
RUN apk add --no-cache \
    pcsc-lite-libs \
    pcsc-lite \
    ccid \
    eudev \
    && rm -rf /var/cache/apk/*

# Modify Info.plist to update the ifdDriverOptions value from 0x0000 to 0x0001
RUN sed -i '/<key>ifdDriverOptions<\/key>/{n;s/<string>0x0000<\/string>/<string>0x0001<\/string>/}' /usr/lib/pcsc/drivers/ifd-ccid.bundle/Contents/Info.plist

# Copy udev rules (if necessary for your ACR122U device)
COPY 10-acr122u.rules /etc/udev/rules.d/


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy node_modules and application code from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Copy the start script
COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

ENV UDEV=1
# Set the entrypoint to the start script
ENTRYPOINT ["/usr/src/app/start.sh"]
