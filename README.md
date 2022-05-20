# MERN_Developer_Profile

# Add the default.json file in the config folder (config/default.json)

{
    "mongoURI": "mongodb+srv://<username>:<password>@cluster0.amt66.mongodb.net/SND?retryWrites=true&w=majority",
    "jwtSecretKey": "someJwtSecrateKey",
    "githubClientID": "<GithubClientID>",
    "githubClientSecret": "<GithubClientSecret>"
}

# Install the server dependencies
npm install

# Install the client dependencies
cd client
npm install

# To run the server
npm run server

# To run the client
npm run client

# To run the application (Run both server & client)
npm run dev

# To build the app for production
cd client
npm run build

Live version of the app on : https://glacial-beach-79161.herokuapp.com/
