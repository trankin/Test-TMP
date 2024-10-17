# Stage 1: Build stage
FROM node:16-alpine AS build

# Install necessary build dependencies (pcsc-lite, python, build-base, ccid driver)
RUN apk add --no-cache \
    pcsc-lite-dev \
    build-base \
    python3 \
    py3-pip \
    ccid \
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
FROM node:16-alpine

# Install runtime dependencies (pcsc-lite-libs, pcsc-lite, ccid)
RUN apk add --no-cache \
    pcsc-lite-libs \
    pcsc-lite \
    ccid \
    && rm -rf /var/cache/apk/*

# Modify Info.plist to update the ifdDriverOptions value from 0x0000 to 0x0001
RUN sed -i '/<key>ifdDriverOptions<\/key>/{n;s/<string>0x0000<\/string>/<string>0x0001<\/string>/}' /usr/lib/pcsc/drivers/ifd-ccid.bundle/Contents/Info.plist

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy node_modules and application code from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Copy the start script
COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

# Set the entrypoint to the start script
ENTRYPOINT ["/usr/src/app/start.sh"]