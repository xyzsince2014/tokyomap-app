#!/bin/bash

set -euo pipefail

# client = CN and output filename
CLIENT="tokyomap"

cd "$(dirname "$0")"
DIR="./app/certs"
mkdir -p "$DIR"

# generate a 2048-bit RSA private key for the RP
openssl genrsa -out "$DIR/$CLIENT.key" 2048

# build a CSR (Certificate Signing Request) from that key; CN=$CLIENT identifies this client to the CA
openssl req -new -key "$DIR/$CLIENT.key" -subj "/CN=$CLIENT" -out "$DIR/$CLIENT.csr"
