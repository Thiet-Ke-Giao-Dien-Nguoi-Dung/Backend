#!/bin/bash


cd ~/BTL/Backend
git pull
npm install
pm2 restart backend
