#!/bin/bash


cd ~/BTL/Backend
git pull
$(echo $1)/npm install
$(echo $2)/pm2 restart backend
