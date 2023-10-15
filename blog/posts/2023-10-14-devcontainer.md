---
title: 'Using a Dev Container for Development' 
date: 2023-10-14
url: 'devcontainer'
---

# {{ $frontmatter.title }}

{{ new Date($frontmatter.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}

Docker has been revolutionary for the software industry.
It has made the separation of hardware and system possible.
Gone are the days of hours of system setup to get a build to run.

Yet when I wanted to open my websites I realised I don't have [Node.js](https://nodejs.org/en) or any of my project dependencies installed yet. 
Taking the two minutes this would require every time I format my PC, every odd year, is tedious and sucks.
Controlling node versions for each project sucks even more([nvm](makes it slightly more bearable)).

What if the system setup ships with the project itself?
Further, what if this is in the form of a nicely packed Docker image?
In comes development containers or [dev containers](https://code.visualstudio.com/docs/devcontainers/containers) for short. 



## Why change?

For most of my personal development I make use of [WSL](https://learn.microsoft.com/en-us/windows/wsl/) on my Windows machine.
This allows me to use an Ubuntu distribution where I can easily install all my needed dependencies in isolation from my main OS.
This isolation has increased my efficiency and reduced the heartache that comes from installing software on Windows, despite the best efforts of [WinGet](https://github.com/microsoft/winget-cli).

![Dev Containers](./../assets/devcontainer.png)

Devcontainers seamlessly integrates with VS Code to offer a development experience out of a project specific Docker image.
This is exactly what I want and need.
This gives the ability to setup a project once for everyone that will use it into the future. 
There are startup time costs and hardware requirements to be able to do this, but most developers would not find this a hindrance given the benefits.

## Prerequisites

This project requires you to setup Docker and VS Code to run dev containers.

### Docker

1. Create an account at [Docker](https://hub.docker.com/) (if you are screaming about their open source betrayal, go to [podman](https://podman.io/) instead).
2. Install [Docker Desktop](https://docs.docker.com/desktop/)
3. Open Docker Desktop, accept the terms and conditions and log in with your account.
4. 

### Visual Studio Code Dev Containers Extension

1. Download and install [VS Code](https://code.visualstudio.com/download)
2. After installation install the `Dev Containers` and `Docker` extensions.
3. You can open up a sample dev container to see that it is working.

## Creating the dev container

VS Code makes use of a `.devcontainer` and a setup file therein, `devcontainer.json`, to configure a development container.
If it finds such a file it automatically asks if you want to reopen the window from a dev container.

### Specify the .devcontainer.json

The following file can be added to your project.
This is the example file that the dev containers tutorial uses with a few changes specific to my project.

```json
//devcontainer.json
{
  "name": "Node.js",
  "image": "mcr.microsoft.com/devcontainers/javascript-node",
  "customizations": {
    "vscode": {
      "settings": {},
      "extensions": ["streetsidesoftware.code-spell-checker"]
    }
  },
  "postCreateCommand": "npm install",
  "postStartCommand": "npm run docs:dev"
}
```

I chose the latest javascript-node dev container form the [Microsoft Artifact Registry](https://mcr.microsoft.com/en-us).
I also changed the `postCreateCommand` to run `npm install` to install the necessary dependencies for my project.
Further, the `postStartCommand` serves up my blog using `npm run docs:dev`.

You can even specify the project settings for VS Code. 
I included a spell checker since this is for a blogging project.
When opening up the project in the future you will be prompted to do so in a container. 

I can now open up my project using a dev container and node is installed and ready to use from any PC.
All of my project dependencies are installed and the website is served automatically on image startup. 
This is quite easy to do and there are many prebuilt images to suit your project.

### Potential issues

Note that if a repository was initialised on windows it might be necessary to include a `.gitattributes` file as follow.
```
* text=auto eol=lf
*.{cmd,[cC][mM][dD]} text eol=crlf
*.{bat,[bB][aA][tT]} text eol=crlf
```
This solves the issue of different default line endings on Linux and Windows.

Another issue that could occur is that Docker is not running when you want to open up the container. 
Check that docker is running on your system using,
```shell
docker --version
```

## Future enhancements

What if we want more customizability in our dev container? 
We can do this through the use of a Dockerfile to create a custom Docker image.
This allow the setup of more complex build and installation steps.
This is done by replacing the image configuration with a build configuration.
```json
//"image": "mcr.microsoft.com/devcontainers/javascript-node",
"build": { "dockerfile": "Dockerfile" },
```

Then in the `.devcontainer` directory you can create a `Dockerfile` and specify the build steps.

We can also install dev container [features](https://containers.dev/implementors/features/).
A feature is a unit of software that can be included in your devcontainer.
Here is an example from the Github repo for [devcontainer features](https://github.com/devcontainers/features),
```json
"name": "my-project-devcontainer",
"image": "mcr.microsoft.com/devcontainers/base:ubuntu",  // Any generic, debian-based image.
"features": {
    "ghcr.io/devcontainers/features/go:1": {
        "version": "1.18"
    },
    "ghcr.io/devcontainers/features/docker-in-docker:1": {
        "version": "latest",
        "moby": true
    }
}
```
In this example the `go` and `docker-in-docker` features are included in the dev container.

## Closing remarks

Using dev containers allows for consistency in development, in the same manner that containers introduced consistency for builds.
This benefits our development greatly, especially when working on collaborative projects.
This allows for a singular and isolated project setup, that can be used by anyone, everywhere that ships with the project itself.
I will definitely be using this for most of my projects going forward, and hope some of you do too! 
