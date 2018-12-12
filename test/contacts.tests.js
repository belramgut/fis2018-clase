var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var Contact = require('../contacts');
var expect = chai.expect;
var mongoose = require('mongoose');


describe('Contact DB connection', () => {

    before((done) => {

        var dbUrl = process.env.DB || 'mongodb://localhost/test';
        mongoose.connect(dbUrl);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            done();
        });

    });

    beforeEach((done) => {
        Contact.deleteMany({}, (err) => {
            done();
        });
    });


    it("writes a contact in the DB", (done) => {
        var contact = new Contact({ name: "pepa", phone: 8888 });
        contact.save((err, contact) => {
            expect(err).is.null;
            Contact.find({}, (err, contacts) => {
                expect(contacts).to.have.lengthOf(1);
                done();
            });
        });
    });


    it("returns all contacts from the bd");
})