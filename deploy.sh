#!/bin/bash

cd ~/workspace/ETO/Backend
git pull
export PATH=$PATH:$1
$1/npm install
$1/pm2 restart backend
