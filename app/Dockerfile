FROM node:16

LABEL maintainer="xyzsince2014 <xyzsince2014@gmail.com>"

WORKDIR /src

# 依存関係ファイルだけ先にコピーしてインストール（キャッシュを効かせるため）
COPY package.json yarn.lock ./
RUN yarn install --production

# ソースコードをコピー
COPY . .

EXPOSE 8080

ENTRYPOINT [ "yarn", "start:prod" ]
