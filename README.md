# IBM API Connect Loopback Node.js application as Business Facing Microservice

*This project is part of the 'IBM Cloud Native Reference Architecture' suite, available at
https://github.com/ibm-cloud-architecture/refarch-cloudnative*

This project sits between the API gateway and the backend socialreview microservices. It is built with IBM API Connect Loopback framework as well as integrated API definition (OpenAPI) with following functionality:

 - Implement the SocialReview API managed by IBM API connect
 - Invoke the backend microservices component
 - Expose the Loopback REST API as consumer facing APIs following OpenAPI standard
 - Augment the JSON data payload for Mobile and Web client

The Loopback application is managed under the `socialreview` folder.  
The API definition is defined under the `socialreview/definition` folder.

The application uses Loopback REST Connector to integrate with backend Microservices. You can find more information about the connector at: https://docs.strongloop.com/display/APIC/REST+connector

## Run the application locally:

To run the application or edit the API definition, we recommend to install IBM API connect developer toolkit (cli) at https://console.ng.bluemix.net/docs/cli/index.html#cli.

- Configure the application

  This bff application consumes the REST services provided by the backend socialreview Microservices. For example the Bluemix container group route: http://socialreviewservice.mybluemix.net/
  You need to provide this information to the Loopback datasource configuration.   
  Edit the file `socialreview\server\datasource.json`  
  Replace the 'baseURL' and operation 'url' with your microservice endpoint, for example:

  ```
  "template": {
    "method": "GET",
    "url": "http://socialreviewservice.mybluemix.net/micro/review",
    "options": {
      "strictSSL": false,
      "useQuerystring": true
    }
  ```

- Run the application:

  `$ cd socialreview`  
  `$ npm install`  

  The application can run as either a standalone Node.js application or as part of the IBM API connect managed runtime (which includes API micro gateway for testing the API. This is the recommended approach):

  - Run as IBM API Connect component

   `$ apic start`

   You should see message like:  
   `Service socialreview started on port 4001  
    Service socialreview-gw started on port 4002`

    You can Validate the application at:
    [http://localhost:4001/api/reviews/list](http://localhost:4001/api/reviews/list)  

  - Run as a standard Node.js app

  `$ npm start`

  You can Validate the application at:
  [http://localhost:3000/api/reviews/list](http://localhost:3000/api/reviews/list)  


## Deploy to Bluemix runtime as API Connect Loopback application:

Create Auto-Scaling service in your Bluemix space.

`$ cf create-service Auto-Scaling free cloudnative-autoscale-socialreview`

IBM API Connect developer toolkit provides integrated command line utility to deploy the Loopback application to Bluemix (as Cloud Foundry application) as well as publishing the APIs. To do this, you need to have your Bluemix API Connect service configured properly, if not, please reference the setup README at the root repository *https://github.com/ibm-cloud-architecture/refarch-cloudnative*

Assuming deploying to API connect environment at: us.apiconnect.ibmcloud.com/orgs/centusibmcom-cloudnative-dev  
Use the following command to deploy the Loopback application

   `$ apic login --server us.apiconnect.ibmcloud.com`  
   `$ apic config:set app=apic-app://us.apiconnect.ibmcloud.com/orgs/centusibmcom-cloudnative-dev/apps/socialreview-bff-app`   
   `$ apic apps:publish`

Bind Auto-Scaling service to the published app.

   `$ cf bs socialreview-bff-app cloudnative-autoscale-socialreview`
   `$ cf restage socialreview-bff-app`   


This will deploy the Socialreview BFF application to Bluemix runtime.
