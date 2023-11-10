---
title: ToDo Application
---

This is a simple ToDo application with user login and persistent storage of ToDo items in a sql database.
Both API and MS SQL database live in a docker container, which makes it easy to start and test.

## Prerequisites

To run this project, it is preferable you be on a Microsoft Windows OS. You will need to have the following installed:

* **Docker for Desktop. You can download it [here](https://docs.docker.com/desktop/install/windows-install/).
* **Node.Js and Npm. You can download it [here](https://nodejs.org/en/download/).
* **.NET on Windows. See instructions [here](https://learn.microsoft.com/en-us/dotnet/core/install/windows?tabs=net70).
* **VsCode. You can download it [here](https://code.visualstudio.com/download).

## Initial Setup

Before running this project, you will need to run a few commands in powershell.

1. dotnet dev-certs https -ep "$env:USERPROFILE\.aspnet\https\ToDoBackend.Api.pfx" -p <password here> (This password will later be used in the docker-compose.yml file. in the project it is set to todoc3rtp@ssword1
2. dotnet dev-certs https --trust

## Running the API

1. Open a powershell window to the folder where the docker-compose.yml file is located for the ToDoBackendApi project. In this case, it is \ToDoBackendApi\ToDoBackendApi\
2. Edit the docker-compose.yml file and replace the ASPNETCORE_Kestrel__Certificates__Default__Password value with the password you used in step 1 of Initial Setup, if you used a different one.
3. Run docker-compose build command in powershell
4. Once that is done, run docker-compose -f .\docker-compose.yml up -d

This will build and run the api and the appropriate ms sql server instance in Docker.

## Running the UI

1. Open the todo-app folder in VsCode. (\ToDoAppUI\todo-app)
2. Open a terminal window in VsCode. Make sure it is pointed to the todo-app folder.
3. Run npm install.
4. Run npm start.

This will install all the necessary npm packages and run the UI in a new browser window. It should automatically connect to the local Docker instance of the API and allow you to register a new user and test the app!