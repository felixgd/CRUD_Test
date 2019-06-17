# CRUD_Test
## To install:
```
cd server

npm install

cd ..

cd client

cd mevn-stack

npm install
```
Remember to fill up the .env file located on `server/` with your data.

## .env Format:
```
DB_URI=

SENDER_EMAIL:

SENDGRID_API_KEY:

DOMAIN_CLIENT:

SERVER_DOMAIN:
```
If the SendGrid API Key is not entered, you'll be able to log in but you won't be able to change the password.

If you enter the SendGrid API, you'll get a verification email and you won't be able to log in until you verify your account.

## To run the server:
```
cd server

node server.js
```
## To run the client:
```
cd client

cd mevn-stack

npm run dev
```

# Added features
1. Send Emails when:
- The User signs up (for verification).
- A costumer is created.
- A loan is created.

2. Cron Job for:
- Automatically flag a costumer when he does not returns the books.
- Automatically sends an email the day before of the return date.
