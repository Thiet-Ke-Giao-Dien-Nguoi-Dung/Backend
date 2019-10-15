#!/bin/bash


cd ~/BTL/Backend
git pull
$1/npm install
$2/pm2 restart backend
