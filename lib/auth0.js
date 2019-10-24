var dotenv = require('dotenv');
dotenv.config();

var ManagementClient = require('auth0').ManagementClient;
var auth0 = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: 'read:users update:users create:users delete:users'
});

// This function expects an object in the following format:
// {
//     'email' : "sample@google.com",
//     'password' : "password123",
//     'firstName' : "John",
//     'lastName' : "Doe",
//     'role' : "User" or "Admin"
// }
//
// Example:
// var auth0 = require('./lib/auth0.js');
// var newUser = {
//     email: "someone@nowhere.com",
//     password: "passWord123",
//     firstName: "John",
//     lastName: "Doe",
//     role: "User"
// };
// auth0.addLogin(newUser)
// .then( (userId) => {
//     console.log(userId);
// })
// .catch((error) => {
//     console.log(error);
// });
module.exports.addLogin = function addLogin(data) {
    var user = {
        email: data.email,
        password: data.password,
        given_name: data.firstName,
        family_name: data.lastName,
        verify_email: false,
        connection: "Username-Password-Authentication"
    };

    // If the role is user, create account and assign them the user role
    if (data.role == 'User') {
        return auth0.createUser(user).then( (userData) => {
            var params = { id : userData.user_id };
            var data = { "roles" : ["rol_qs19ksUF7v2bajkn"]};
            auth0.assignRolestoUser(params, data);
            return userData.user_id;
        })
        .catch( (error) => {
            console.log(error);
            return null;
        });
    }

    // If the role is admin, create account and assign them the admin role.
    if (data.role == 'Admin') {
        return auth0.createUser(user).then( (userData) => {
            var params = { id : userData.user_id };
            var data = { "roles" : ["rol_5DUI4HXtt8F3IpvT"]};
            auth0.assignRolestoUser(params, data);
            return userData.user_id;
        })
        .catch( (error) => {
            console.log(error);
            return null;
        });
    }

    // A role was not specified. This should not be reached but is here as a fail safe.
    return auth0.createUser(user).then( (userData) => {
        return userData.user_id;
    })
    .catch( (error) => {
        console.log(error);
        return null;
    });
}

// This function expects an object in the following format:
// {
//     "id": "auth0|5d2a463eba4a7e0d2be7de40"
// }
module.exports.deleteLogin = function deleteLogin(data) {
    auth0.deleteUser(data, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
    });
}

// {
//     'email' : "sample@google.com",
//     'password' : "password123",
//     'firstName' : "John",
//     'lastName' : "Doe",
// }
module.exports.updateLogin = function updateLogin(user_id, data) {
    var params = { id: user_id };
    var user = {
        email: data.email,
        password: data.password,
        given_name: data.firstName,
        family_name: data.lastName
    };
    if ((user.password != null)) {
        auth0.updateUser(params, { password: user.password }, function (err, user) {
            if (err) {
                console.log(err);
            }
        });
    }
    delete user.password;
    auth0.updateUser(params, user, function (err, user) {
        if (err) {
            console.log(err);
        }
    });
}

// Given the id of a user return what role they are.
module.exports.getRole = function getRole(user_id) {
    var data = { id: user_id };
    return auth0.getUserRoles(data).then( userRole => {
        return userRole[0].name;
    })
    .catch( (error) => {
        console.log(error);
        return null;
    });
}