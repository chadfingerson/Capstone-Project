const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
var secured = require('../lib/secured');
const fs = require('fs');
const latex = require('latex');
const auth0 = require('../lib/auth0.js');
var latexPrinter = require('../lib/latex-pdf-printer.js');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res, next) => {
    var context = {
        layout: 'user'
    }
    if (req.session.notify) {
        context.notify = req.session.notify;
        delete req.session.notify;
    }
    res.render('userLanding', context);
});

router.get('/create', (req, res, next) => {
    res.render('userCreateAward', { layout: 'user' });
});

router.post('/create', (req, res, next) => {
   
    insertAward(req, (context) => {
        console.log('insertAward finished');
        var db = new sqlite3.Database('./db/empRec.db');
        sql = "Select Signature From User Where UserName = ?"

        db.get(sql, [req.user.id], (err, row) => {
            if (err) {
                console.log('error in inserting award');
                return console.error(err.message);
            } else {
                latexPrinter.GeneratePdf(context, row.Signature);
                latexPrinter.EmailPdf(req.body.email, context.awardID);
            }

        });
    });
    
    
    

    req.session.notify = "Award for " + req.body.name + " created and emailed.";
    res.redirect('/users');
    
});

router.get('/view', (req, res, next) => {
    //Connecting to database
    var db = new sqlite3.Database('./db/empRec.db');

    let sql = "SELECT Id, TypeOfAward, NameOfAwardee, EmailAddress, DateTimeAward, Department FROM Award WHERE UserName = ?";
    let params = req.user.id;
    db.all(sql, params, (err, rows) => {
        if (err) {
            return console.error(err.message);
        } else {
            var context = {};
            context.rows = rows;
            context.layout = 'user';
            res.render('userViewAwards', context);
        }
    });
    db.close();
});

router.get('/update', (req, res, next) => {
    var db = new sqlite3.Database('./db/empRec.db');

    let sql = "SELECT Id, UserName, Email, FirstName, LastName, Signature, IsAdmin from User where UserName = ?"
    let params = req.user.id;

    db.get(sql, [params], function (err, row) {
        if (err) {
            return console.error(err.message);
        } else {
            var context = {};
            context = row;
            context.layout = 'user';
            res.render('userUpdate', context);
        }
    });
    db.close();
});

router.post('/update', (req, res, next) => {
    var db = new sqlite3.Database('./db/empRec.db');

    let data = [req.body.firstName, req.body.lastName, req.body.email, req.body.id];
    let sql = "UPDATE User SET FirstName = ?, LastName = ?, Email = ? WHERE Id = ?";
    db.run(sql, data, function (err) {
        if (err) {
            return console.error(err.message);
        } else {
            var data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: null,
                email: req.body.email
            };
            auth0.updateLogin(req.user.id, data);

            req.session.notify = "User information updated.";
            res.redirect('/users');
        }
    });
    db.close();
});

router.get('/delete/:id', (req, res, next) => {
    var db = new sqlite3.Database('./db/empRec.db');

    let sql = "DELETE FROM Award WHERE id=?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return console.error(err.message);
        } else {
            res.redirect('/users/view');
        }
    });
    db.close();
});

module.exports = router; 

function insertAward(req, callback) {
    //Connecting to database
    var db = new sqlite3.Database('./db/empRec.db');
    // Create insert statement for database
    let data = [req.body.award, req.body.name, req.body.email, req.body.awardDate, req.body.department, req.user.id];
    let placeholders = '(' + data.map((data) => '?').join(', ') + ')';
    let sql = 'INSERT INTO Award (`TypeOfAward`, `NameOfAwardee`, `EmailAddress`, `DateTimeAward`, `Department`, `UserName`) VALUES ' + placeholders;
    var context;
    console.log('in insertAward');
    // Insert award into database
    db.run(sql, data, function (err) {
        if (err) {
            return console.error(err.message);
        }
        context = {
            awardID: this.lastID,
            presenter: req.user.name.givenName + ' ' + req.user.name.familyName,
            name: req.body.name,
            award: req.body.award,
            date: req.body.awardDate,
            department: req.body.department
        };     
        callback(context);

    });
    db.close();
}