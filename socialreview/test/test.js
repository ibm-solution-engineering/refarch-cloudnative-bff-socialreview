const expect = require('chai').expect;
const request = require('request');
const rp = require('request-promise');
const random = require('random-js')();
const random_name = require('random-name');
const random_words = require('random-words');
const moment = require('moment');
const prettyjson = require('prettyjson');
const _ = require('underscore');


describe('BlueCompute Social Review BFF Test Suites', function () {

  // Running the test locally
  var serviceBaseUrl = process.env.apic_url ? process.env.apic_url : "http://localhost:3000";
  var client_key = process.env.client_key ? process.env.client_key : "";
  var get_review_options = {
    uri: serviceBaseUrl + '/api/reviews/list',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-ibm-client-id': client_key
    },
    resolveWithFullResponse: true,
    json: true
  };

  // One minute timeout in case tests get slow
  this.timeout(60000);

  // test the home page loading
  describe('when requests to GET /reviews/list', function () {
    it('should validate', function (done) {
      var options = get_review_options;

      rp(options).then(function (response) {
        var body = response.body;
        //console.log(prettyjson.render(body));
        expect(response).to.have.property('statusCode', 200);
        expect(body).to.not.be.null;
        expect(body).to.not.be.undefined;
        done();

      }).catch(function (error) {
        console.error(error.statusCode + ": " + error.message);
        done(error);
      });
    });
  });

  describe('when requests to POST /reviews/comment', function () {
    it('should create a review and retrieve it', function (done) {
      var endpoint = serviceBaseUrl + '/api/reviews/comment';
      var first_name = random_name.first();
      var last_name = random_name.last();
      var options = {
        method: 'POST',
        url: endpoint,
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
          'x-ibm-client-id': client_key
        },
        form: {
          comment: random_words({exactly: 5, join: ' '}),
          itemId: random.integer(1, 100000),
          rating: random.integer(1, 5),
          reviewer_email: first_name.toLowerCase() + last_name.toLowerCase() + '@' + random_words(1) + '.com',
          reviewer_name: first_name + " " + last_name,
          review_date: moment().format("MM/DD/YYYY")
        },
        resolveWithFullResponse: true,
        json: true
      };
      var review_id = null;

      // Create review
      rp(options).then(function (response) {
        var body = response.body;

        expect(response).to.have.property('statusCode', 200);
        expect(body).to.not.be.null;
        expect(body).to.not.be.undefined;
        expect(body).to.have.property('_id');

        // Save review id
        review_id = body._id;
        //console.log("Created review with id: " + review_id);

        // Getting all reviews again to find the one we need
        var new_options = get_review_options;

        // Retrieve reviews
        return rp(new_options);

      }).then(function (response) {
        var body = response.body;
        //console.log(body);

        expect(response).to.have.property('statusCode', 200);
        expect(body).to.not.be.null;
        expect(body).to.not.be.undefined;

        //console.log("Got reviews again for verification");
        // Find review that matches id
        var review = _.findWhere(body, {_Id: review_id});
        var r_id = review ? review._Id : 'not a proper _id';
        expect(r_id).to.equal(review_id);

        done();

      }).catch(function (error) {
        console.error(error.statusCode + ": " + error.message);
        done(error);
      });

    });
  });
});
