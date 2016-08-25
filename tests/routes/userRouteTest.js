var 
  request = require('supertest')('http://localhost:3000'),
  chai = require('chai'),
  expect = chai.expect;


describe('POST /user.', function() {
  // Email used to sign up user.
  var email = Math.random().toString(36).substr(2, 5);
  var password = 'badpassword';
  it('Should add the user to the applications database and return http code 200', function(done) {
    // Mock user.
    var body = {
      user : {
        firstname: 'MockMan',
        lastname: 'Bill',
        // gen random string so we don't insert duplicate and get 500 response.
        email: email,
        password: password
      }
    };
    // Make POST request.
    request
    .post('/user')
    .send(body)
    .expect(200)
    .expect(function(res) {
      expect(res.body.success).to.equal(true);
    })
    .end(function(err, res){
      done(err);
    });  
  }); 
});
	

