This is a social network platform with features like:

1. Register.
2. Login.
3. Add a new post. ( Known as scream in platform )
4. Delete scream.
5. View other users scream.
6. Like scream.
7. comment on scream.
8. unLike scream.
9. Update own profile.


Configure the firebase SDK and install all the required packages.

Packages dependencies:

1. react
2. express
3. firebase
4. firebase-functions
5. firebase-admin
6. busboy
7. react-router-dom
8. material-ui/core
9. axios

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

To run the firebase server locally use the following command:

```
firebase serve
```

To deploy on the firebase use the following command:

```
firebase deploy
```