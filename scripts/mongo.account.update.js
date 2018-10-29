const mongoose = require('mongoose');

const Account = require('../app/models/account');
const config = require('../config');


const mongoAccountUpdate = (electionOwner, electionAddress, finiteElection) =>
    new Promise((resolve, reject) => {
        mongoose.connect(config.db, {useNewUrlParser: true})
            .then(() => {
                console.log("mongoDB connected.");
            })
            .catch(err => {
                console.error(err.message);
                reject(err);
            });
        Account.update(
            {"etherAccount": electionOwner},
            {
                "$push": {
                    "deployedElections": {
                        address: electionAddress,
                        finite: finiteElection
                    }
                }
            },
            (err) => {
                if (err) return reject(err);
                else console.log("Saved to MongoDB!");
                mongoose.connection.close();
                resolve(true);
            }
        );
    }
);

module.exports = mongoAccountUpdate;