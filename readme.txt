## Installing express js with express js


## To start an Express project with TypeScript, you can follow these steps:

### install the required dependencies:


`` npm install --save express @types/express typescript ts-node ``

- Create a tsconfig.json file in the root of your project, and add the following configuration:

```
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "build",
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*"]
    }
  },
  "include": ["src"]
}

```

- Create a src directory, and create an index.ts file in it. This will be the entry point of your app.

- In the index.ts file, add the following code to create an Express app:

```
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

```

you have to first install ts-node using the command below 

`` npm install -g ts-node ``

- in your package.json paste this listen

`` "start": "nodemon --exec ts-node src/index.ts"  ``

ts-node helps to run the server locally

- Run the app using the command npm start


This will start the server, and you should be able to visit http://localhost:3000 in your browser to see the "Hello, World!" message.


## install neccessary dependencies

npm i body-parser dotenv mongoose nodemailer
npm i --save-dev @types/md5

- The body-parser middleware is used to parse the request body of an HTTP request in an Express app. It can be used to extract and parse data that is sent in the request body, such as JSON data or form data.

- we are going to use dotenv to store our environment variables

- md5 is what we are going to use to hash our password

- nodemailer package would be used to send email messages in our code

- mongoose is used to provide a simple interface for interacting with a MongoDB database in a Node.js app.

## setup DB



## SignUp Authentication

- in the src folder create routes folder, the routes folder is where we would store all our routes
- create the schemas folder inside the scr folder, we would be storing all our database model schemas here
- inside the schemas folder create a models.ts file

paste the following code in the file


```
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:String,
    email: String,
    password: String,
    phoneNumber: String,
    isVerified: Boolean,
    userToken: String,
})


export const User = mongoose.model('User', userSchema

```



