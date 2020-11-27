#!/bin/bash
# delete by `eksctl delete cluster --name Tokyomap-eks`
eksctl create cluster \
--vpc-public-subnets subnet-0d7c8a6a10410efd0,subnet-0f8e11c82de94d59c \
--name Tokyomap-eks \
--region ap-northeast-1 \
--version 1.14 \
--nodegroup-name Tokyomap-eks-nodegroup \
--node-type t2.small \
--nodes 2 \
--nodes-min 2 \
--nodes-max 5
