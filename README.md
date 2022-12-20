
# Welcome to DevTube - a Youtube Frontend replica I have developed with React.js

  

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

  

## Dependencies

- Node.js API Server

- MongoDB

- Google Firebase Storage

## Description
DevTube is a Youtube frontend replica that I have developed with React.js framework.
This app uses Google Firebase Storage to store all the images and videos that have been uploaded by users,
it is also uses Google Firebase Authentication.
There are 2 possible ways to sign up:
- Google - will ask you to choose your Google-Account you want to continue with.
- Email - Will ask you to fill 3 inputs - Username, Email, and Password.

DevTube allows you to signup, signin, upload new videos, view others videos, like and comment videos, and read others comments.
Once you have uploaded a video, the video can be editted by changing its Title, Description, and Hashtags. **Note: changing the video itself or its image is  `NOT` possible!**
DevTube also allows you to edit your own profile information.

## Environment Variables
- REACT_APP_apiKey - Your Firebase API key
- REACT_APP_authDomain - Your Firebase AuthDomain
- REACT_APP_projectId - Your Firebase projectId
- REACT_APP_storageBucket - Your Firebase storageBucket
- REACT_APP_messagingSenderId - Your Firebase messagingSenderId
- REACT_APP_appId - Your Firebase appId
  

## Available Scripts
In the project directory, you can run:
### `npm start`

Runs the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\

You may also see any lint errors in the console.

###  `docker build -t <image-name> .`
Creates a docker image of DevTube's Frontend Application

### `docker-compose up`
Will build DevTube's Frontend Application image and run it on a docker container exposed to port 3000.