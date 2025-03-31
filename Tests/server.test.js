import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js"; // Import your server as an ES Module

const { expect } = chai;

// Use chai-http for HTTP requests
chai.use(chaiHttp);

describe("API Service Tests", () => {
    it("should return a welcome message on '/' route", (done) => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal({ message: "Welcome to API Service" });
                done();
            });
    });

    it("should return a healthy status on '/health'", (done) => {
        chai.request(app)
            .get("/health")
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.equal("Healthy!");
                done();
            });
    });

    it("should retrieve all users on '/users' route", (done) => {
        chai.request(app)
            .get("/users")
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property("users");
                expect(res.body.users).to.be.an("array");
                done();
            });
    });

    it("should insert a new user on '/users' POST route", (done) => {
        const newUser = { user: { username: "testuser", password: "testpassword" } };

        chai.request(app)
            .post("/users")
            .send(newUser)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("username", "testuser");
                expect(res.body).to.have.property("password", "testpassword");
                done();
            });
    });

    it("should retrieve a single user on '/users/:id'", (done) => {
        chai.request(app)
            .get("/users/1")
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property("user");
                expect(res.body.user).to.be.an("object");
                done();
            });
    });
});