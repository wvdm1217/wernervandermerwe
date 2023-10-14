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
4. Check that docker is running on your system using
```shell
docker --version
```

### Visual Studio Code Dev Containers Extension

1. Download and install [VS Code](https://code.visualstudio.com/download)
2. After installation install the `Dev Containers` and `Docker` extensions.
3. You can open up a sample dev container to see that it is working.

## Creating the dev container

VS Code makes use of a `.devcontainer` and a setup file therein, `devcontainer.json`, to configure a development container.
If it finds such a file it automatically asks if you want to reopen the window from a dev container.

### Specify the .devcontainer.json

```json
//devcontainer.json
{
  "name": "Node.js",

  // Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
  "image": "mcr.microsoft.com/devcontainers/javascript-node",

  // Features to add to the dev container. More info: https://containers.dev/features.
  // "features": {},

  "customizations": {
    "vscode": {
      "settings": {},
      "extensions": ["streetsidesoftware.code-spell-checker"]
    }
  },

  // "forwardPorts": [3000],

  "portsAttributes": {
    "3000": {
      "label": "Hello Remote World",
      "onAutoForward": "notify"
    }
  },

  "postCreateCommand": "npm install"

  // "remoteUser": "root"
}
```