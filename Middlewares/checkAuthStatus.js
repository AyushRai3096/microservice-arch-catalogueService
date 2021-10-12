const axios = require('axios');
const _ = require('lodash');

checkAuthStatus = (req, res, next) => {
    let config = {
        headers: {
            authorization: req.get('authorization')
        }
    }
    axios.post("http://localhost:5000/user/authenticate", {}, config)
        .then(response => {
            next();
        })
        .catch(err => {
            console.log("Error: " + err);
            next(err);
        });
}

module.exports = checkAuthStatus; 