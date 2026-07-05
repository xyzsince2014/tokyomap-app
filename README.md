# tokyomap-bff

<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/xyzsince2014/tokyomap-bff">
<img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/xyzsince2014/tokyomap-bff">

Backend resources for https://tokyomap.live

## How to dev

### mTLS setup

```bash
# generate this RP's key + CSR (private key stays here)
./generate-rp-certificate.sh

# hand the CSR `tokyomap.csr` to tallyme-dev and get it signed back (cf. tallyme-dev README)
# the signed certificate `tokyomap.crt` + key must live under app/certs/
```

dev.env must have
```bash
RP_CLIENT_CERT_PATH=./certs/tokyomap.crt
RP_CLIENT_KEY_PATH=./certs/tokyomap.key
```

### Run
```zsh
cd app
pnpm start
```

## Related repositories

- [tallyme-idp](https://github.com/xyzsince2014/tallyme-idp)
- [tallyme-resource](https://github.com/xyzsince2014/tallyme-resource)
- [tallyme-dev](https://github.com/xyzsince2014/tallyme-dev)
