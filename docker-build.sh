#!/bin/bash

docker image rm tokyomap.app:dev

docker build -t tokyomap.app:dev app
