#!/usr/bin/env bash
rm -rf app/ethereum/build
rm -rf backup/data/*
mkdir backup
mv data backup/data
mkdir data
mkdir data/candidate
mkdir data/publicKey
mkdir data/secretKey
mkdir data/result
truffle migration --reset
node scripts/ipfs.region.js
node scripts/mongo.account.update.js


