# logger
Server Log Management System 

**Note that we need to add the logger middleware present in the productServer as a plugin in any project so as to capture the logs of all APIs without using any 3rd parth npm module**
**Note adding the LOGGER_URL i.e sendLog API endpoint and the LOGGER_KEY i.e apiKey in the config i.e .evn file of any productServer**

Steps to Start Log Management Server :-

1) add the desired configuration in the .env file of logManagementServer directory

2) npm install

3) node app.js

4) open swagger default using --> http://localhost:3000/api-docs or login at /loginAdmin endpoint using the default admin credentails

5) use the accessToken returned after login and add server at /addServer endpoint by passing name and uid along with the admin access token

6) addServer endpoint returns apiKey when a server is added, add this apiKey to the LOGGER_KEY parameter in the config file the product server

7) you can provide or revoke access of any server using /enableOrDisableAccess endpoint

8) Once the middleware is setup with an active apiKey, our logManagement server will start receiving and storing the server logs in mongodb

Fetching logs :-

**just enter the apiKey, and from and to date in milliseconds in the /getLogs GET endpoint (can be found in the swagger file) and send the parameters in query you will view all the logs**

Business Problem: Creating a plugin which can be added to many product servers and sends logs to only one common server and that can easilyt fetching logs on based of time and permission.

Solution: Created a common server which has an endpoint that will recieve all the requests from the middleware installed on one of our product server

Futher Steps: 1) Creating npm module for this middleware
              2) Securing admin passwords and server information using bcrypt sale instead of MD5
              3) MongoDB aggregation framework for various filters while fetching logs
              4) Achieveing scalability using load balancing 
              5) More extension of the logManagementServer application by maybe using ELK stack.
              6) Effectively transfer messages without delay from publisher to subscriber using like messaging queues like kafka etc messaging queues.
          

