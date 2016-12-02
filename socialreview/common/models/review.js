module.exports = function (Review) {

  Review.comment = function (comment, itemId, rating, reviewer_email, reviewer_name, review_date, cb) {

    Review.post(comment, itemId, rating, reviewer_email, reviewer_name, review_date, function (err, response, context) {
      if (err) {
        console.error('> error: ' + error.stack);
        throw err;
      } //error making request
      if (response.error) {
        console.error('> response error: ' + response.error.stack);
        cb(null, '> response error: ' + response.error.stack);
      }
      console.log('> data fetched successfully from remote server');
      //verify via `curl localhost:3000/api/review`
      //next();
      cb(null, response);
    });

  };

  // This code is trying to parse the incoming request Authorization headers
  // Save it to a variable then pass to the REST connect template
  // To pass the Authorization header, it requires the template define the header: Authorization entry
  // This call will update the value
  Review.beforeRemote('list', function (ctx, report, next) {
    var ds = Review.getDataSource(),
      listOperation = ds.settings.operations[0],
      headers = listOperation.template.headers;
    headers['Authorization'] = ctx.req.headers.authorization;
    next();
  });

  // Set the JWT Token to the backend POST function
  // But the hook point is on the comment API
  Review.beforeRemote('comment', function (ctx, report, next) {
    var ds = Review.getDataSource(),
      listOperation = ds.settings.operations[1],
      headers = listOperation.template.headers;
    headers['Authorization'] = ctx.req.headers.authorization;
    next();
  });

  Review.remoteMethod(
    'comment', {
      accepts: [{arg: 'comment', type: 'string'},
        {arg: 'itemId', type: 'string'},
        {arg: 'rating', type: 'string'},
        {arg: 'reviewer_email', type: 'string'},
        {arg: 'reviewer_name', type: 'string'},
        {arg: 'review_date', type: 'string'}
      ],
      returns: {arg: '_id', type: 'string'}
    }
  );

};
