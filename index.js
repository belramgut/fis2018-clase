var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');
var cors = require('cors');

var port = 3000;
var BASE_URL = "/api/v1";
var filename = __dirname + "/contacts.json";

var path = require('path')
const CONTACTS_APP_DIR = "/dist/contacts-app";

var app = express();
app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.join(__dirname, CONTACTS_APP_DIR)));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, CONTACTS_APP_DIR, '/index.html'));
});

console.log("Starting API server...");

var db = new DataStore({
    filename: filename,
    autoload: true
});

var contacts = [
    { "name": "juan", "phone": 5555 },
    { "name": "jose", "phone": 6666 },
    { "name": "julio", "phone": 7777 }
];

app.get(BASE_URL + "/contacts", function (req, res) {
    var c = db.find({}, function (err, contacts) {
        if (err) {
            console.log("Error accesing database ", err);
            res.sendStatus(500);
        } else {
            res.send(contacts.map((contact) => {
                delete contact._id;
                return contact;
            }));
        }
    });
});

app.post(BASE_URL + "/contacts", function (req, res) {
    var contact = req.body;
    db.insert(contact);
    res.sendStatus(201);
});

app.put(BASE_URL + "/contacts", (req, res) => {
    // Forbidden
    console.log(Date() + " - PUT /contacts");

    res.sendStatus(405);
});

app.delete(BASE_URL + "/contacts", (req, res) => {
    // Remove all contacts
    console.log(Date() + " - DELETE /contacts");

    db.remove({});

    res.sendStatus(200);
});


app.post(BASE_URL + "/contacts/:name", (req, res) => {
    // Forbidden
    console.log(Date() + " - POST /contacts");

    res.sendStatus(405);
});


app.get(BASE_URL + "/contacts/:name", (req, res) => {
    // Get a single contact
    var name = req.params.name;
    console.log(Date() + " - GET /contacts/" + name);

    db.find({ "name": name }, (err, contacts) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);
        } else {
            if (contacts.length > 1) {
                console.warn("Incosistent DB: duplicated name");
            }
            res.send(contacts.map((contact) => {
                delete contact._id;
                return contact;
            })[0]);
        }
    });
});


app.delete(BASE_URL + "/contacts/:name", (req, res) => {
    // Delete a single contact
    var name = req.params.name;
    console.log(Date() + " - DELETE /contacts/" + name);

    db.remove({ "name": name }, {}, (err, numRemoved) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);
        } else {
            if (numRemoved > 1) {
                console.warn("Incosistent DB: duplicated name");
            } else if (numRemoved == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

app.put(BASE_URL + "/contacts/:name", (req, res) => {
    // Update contact
    var name = req.params.name;
    var updatedContact = req.body;
    console.log(Date() + " - PUT /contacts/" + name);

    if (name != updatedContact.name) {
        res.sendStatus(409);
        return;
    }

    db.update({ "name": name }, updatedContact, (err, numUpdated) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);
        } else {
            if (numUpdated > 1) {
                console.warn("Incosistent DB: duplicated name");
            } else if (numUpdated == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

app.listen(port);

console.log("Server ready!");