# LiveRetro

Let's make having retro's easy but most importantly environmently friendly.

Have retro's online so remote workers can join in with the sticky note fun without actually using sticky notes.

## Don't know what a retrospective is? 
https://retromat.org/blog/what-is-a-retrospective/



# Starting Guide
This project contains two seperate repositories. This one and https://github.com/Yoosh94/LiveRetro.UI
This project contains the code for a backend node server. The UI project is a react application. 

### Prerequisite
Node.js - https://nodejs.org/en/download/
Understanding of Socket.io - https://socket.io/

### Node Server
1. Clone the repository
2. Open the project (my preferred editor is vscode)
3. Open a terminal (this can be inside vscode or your operating systems terminal and run `npm install`
4. Run `npm run dev`
5. This will run nodemon to watch all .ts files and reload when any of them change. This will mean you do not need to restart the server each time you make a change.

### React application
1. Clone the repository inside the server application.
2. Open the project
3. Open a terminal and run `npm install`
4. Run _npm start_
5. This will run  the react application on localhost:3000 and you should see a browser open up automatically.

### Running the server in a docker container
1. Ensure you have docker installed on your machine
2. Navigate to the root folder and type the following command to build an image `docker build . -t {someName}`
3. This will create an image for you and you can see this by typing `docker image ls`
4. To run the container run `docker container run -i -p 8080:5000 {someName}`

