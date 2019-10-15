#!/bin/bash


cd ~/BTL/Backend
git pull
alias node=$1/node
$1/npm install
$2/pm2 restart backend
