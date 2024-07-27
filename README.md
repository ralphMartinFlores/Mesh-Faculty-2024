
# GC MESH

Real time messaging system module of GCLamp made with </> by Flash Coders

### Prerequisites

    Node.js: Ensure you have Node.js installed. You can download it here.
    Angular CLI: Install Angular CLI globally using npm install -g @angular/cli.
    MySQL: Install MySQL. You can download it 
            - https://dev.mysql.com/downloads/mysql/. 
    Docker: Install Docker. You can download it 
            - https://www.docker.com/products/docker-desktop/.


## Installation
    git clone https://github.com/ralphMartinFlores/Mesh-Faculty-2024
    cd Mesh-Faculty-2024

    Install Dependencies:

    npm install --legacy-peer-deps

    Run the Application:
    
    Go to faculty folder: ng serve --open
    Go to student folder: ng serve --open

    Navigate to http://localhost:4200/ to view the app.

### Node.js: Ensure you have Node.js 14 installed using nvm.

    Install nvm:

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

    or follow the instructions here.
    Install Node.js 14:

    sh

    nvm install 14
    nvm use 14

    Angular CLI: Install Angular CLI globally using:

    sh

    npm install -g @angular/cli

### Run Docker Containers:

    Ensure Docker is running.
    Build and run the Docker containers:
    In your terminal, go to /api folder where docker-compose.yml located
    And run docker-compose up -b

### Import database on your dockerized environment
    Make sure your docker is running
    Go to http://localhost:8087
    Login as root as username and "password" as password
    After successfully logging-in, Import your database in gclamp database
## Features

### Real-Time Messaging

    Instant Messaging: Send and receive messages instantly.

### Group Messaging

    Create Groups: Users can create groups and add members.
    Group Chat: Send and receive messages in group chats.

### Active Users

    Online Status: See which users are currently online.

### Participants

    View Participants: See the list of participants in a conversation or group.
    Add/Remove Participants: Easily add or remove participants from a group chat.
    Participant Roles: Assign roles (e.g., admin, member) to participants in a group chat.


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Authors

- [@austineraye](https://www.github.com/austineraye)

