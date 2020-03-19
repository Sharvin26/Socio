Configure the firebase SDK and install all the required packages.

Packages dependencies:

1. express
2. firebase
3. firebase-functions
4. firebase-admin
5. busboy

To install the packages go to the `functions` directory and install the dependencies using the following command:

`npm install --save <package-name>`

Once configuration is done create a javascript file named `config.js` in `functions/util` directory. 

Add the firebase configuration in this file in the following way:

```
module.exports = {
    apiKey: "....",
    authDomain: "....",
    databaseURL: "....",
    projectId: "....",
    storageBucket: "....",
    messagingSenderId: "....",
    appId: "....",
    measurementId: "...."
};
```