var server = require('../server')
var chaiHttp = require('chai-http')
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

chai.use(chaiHttp);

describe("Contacts API", () => {
    it("Hola mundo de prueba", (done) => {
        var x = 3;
        var y = 5;
        var resultado = x + y;
        expect(resultado).to.equal(8);
        done();
    });

    describe("GET /", () => {
        it("Should return an HTML", (done) => {
            chai.request(server.app).get('/').end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
        });
    });

    before((done) => {

        var contacts = [
            { "name": "juan", "phone": 5555 },
            { "name": "pepe", "phone": 5555 }
        ];

        var dbFindStub = sinon.stub(server.db, 'find'); //pongo find porque cuando yo llamo a /contacts lo que hay dentro es un find
        dbFindStub.yields(null, contacts); //porque el metodo find devuelve un (err,contacts)


        done();
    });

    /*beforeEach((done) => {

        server.db.remove({}, { multi: true }, () => {
            server.db.insert(contacts, () => {
                done();
            });
        });
    });*/

    describe("GET /contacts", () => {
        it("Should return all contacts", (done) => {
            chai.request(server.app).get('/api/v1/contacts').end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(2);
                done();
            });
        });
    });

    describe("POST /contacts", () => {
        it("Should create a new contact", (done) => {

            var contact = { "name": "jaime", "phone": 1111 };
            var dbMock = sinon.mock(server.db);
            dbMock.expects('insert').withArgs(contact);

            chai.request(server.app).post('/api/v1/contacts')
                .send(contact).end((err, res) => {
                    expect(res).to.have.status(201);
                    dbMock.verify();
                    done();
                });
        });

    });

});







