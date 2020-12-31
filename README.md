# The Thing Repository #

A simple Express and MongoDB-powered webapp that can be used to store information about the things you have bought.

Authentication is handled by [Auth0](https://auth0.com/), using the `express-openid-connect` Node module. 

## Setup ##
- Create a [Auth0 account](https://auth0.com/signup).
- Install [MongoDB](https://www.mongodb.com/).
- Run `npm install` to install all required modules.
- Create a `.env` file and fill it with the below details:

```
PORT
MONGO_DB_URL
SESSSECRET
AUTH_BASE_URL
AUTH_CLIENT_ID
AUTH_ISSUER_BASE_ID
```
- `SESSSECRET` refers to a long, random secret value used for Auth token generation. 
    - You can run `node -e "console.log(crypto.randomBytes(32).toString('hex'))"` to get a value for this.
- The final three values can be obtained from the [Auth0 Dashboard](https://manage.auth0.com/dashboard/).

## Running ##
Run `node .\app.js` and navigate to `localhost:8080`, or whichever URL you have provided as the base URL.