# アプリケーションについて

<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/xyzsince2014/tokyomap-app">
<img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/xyzsince2014/tokyomap-app">

## 概要
以下のREADMEに記載<br>
https://github.com/xyzsince2014/tokyomap-web

<br>

## バージョン
- express 4.16.1
- passport 0.4.1
- socket.io 2.3.0

<br>

## 開発環境
```bash
cd app
cp <環境変数ファイル> .dev.env # 環境変数設定
yarn install
docker-compose up -d
```
<p>ローカルに&nbsp;`git clone`&nbsp;後, 上記のコマンドを叩くと以下のエンドポイントが動く.<br>
https://localhost/api <br>
https://localhost/socket.io
</p>