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

## Caveats / Limitations ##
This is a hobbyist project, and probably shouldn't be used in a real-world environment.  

- This *does not* work on Internet Explorer. All requests coming from an IE UA string will be redirected to a page that asks the user to update their browser.
- I am *not* a programmer by trade - I can program, just not amazingly. As a result, the code here isn't the most efficient. If you see something that could be made better, please raise a pull request!