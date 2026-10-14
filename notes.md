# Docker

## 1. Why do we need a Docker?

Imagine you are building an application, where suppose you are building API using Node.js, Express and PostgreSQL.

Your application needs:
- Node.js to execute teh JavaScript
- Express and other npm packages to handle requests
- PostgreSQL to store data
- Particular versions of those dependencies
- Configuration to connect everything together

On your machine, everything works perfectly.

Now you send the project to another developer or deploy it to a server.

Their machine has a different Node.js version. PostgreSQL insn't installed. A required system library is missing.

Your code might be perfectly fine but the application doesn't run.

This is the classic developer problem: <b>"It works on my machine!"</b>

## 2. Why can't we just share the source code?

Because source code isn't always enough to produce a working application.

- <b>Without docker:</b> You share a recipe and expect someone to  have all the right ingredients, equipment and cooking conditions.

- <b>With docker:</b> You package the application with much of the environment it needs, so someone else can reproduce it more reliably.

Docker helps package an application and its dependencies into a container image. The image can then be used to run containers on compatible machines.

It doesn't package an entire independent operating system kernel and it doesn't automatically solve every configuration problem. But it removes a large amount of environment-related friction.

## 3. What Docker changes

Without Docker, you might set up every machine separately:

- Your laptop: Install and configure everything
- Production server: Repeat the setup

With Docker:

- Application image: Application + dependencies + filesystem environment
- Your laptop: Run a container
- Production server: Run a container

The image helps keep the application environment consistent, provided the hosts support it and external configuration is handled correctly.

That's the central value of Docker: <b>build the environment once, then reuse it.</b>

## 4. Three words to familiar with

- Container: A running isolated application environment. It has a filesystem view, processes and networking configuration.
- Image: The packaged template from which Docker creates containers. An image is not itself a running application.
- Dockerfile: A text file containing instructions Docker uses to build an image.

## 5. Containers vs virtual machines

- A container isolates application processes while sharing the host operating-system kernel.
- A virtual machine (VM) virtualizes hardware and normally runs its own guest operating system and kernel.
- Containers are often quicker to start and use fewer resources, but they are not a replacement for every VM use case.
- On non-Linux hosts, Docker commonly uses a lightweight Linux VM to provide the Linux kernel containers need.

## 6. Images and containers are different
An image is a reusable template. A container is a particular instance created from that image.

One image can create multiple containers. Each container has its own runtime state and writable layer, while sharing the image's underlying layers.

Useful commands:

```docker
docker images                 # List local images
docker ps                     # List running containers
docker ps -a                  # List all containers, including stopped ones
docker run hello-world        # Download if needed, then run a test container
```
Container lifecycle commands:

```docker
docker stop CONTAINER_NAME    # Stop a running container
docker start CONTAINER_NAME   # Start an existing stopped container
docker rm CONTAINER_NAME      # Remove a stopped container
docker rmi IMAGE_NAME         # Remove an image, if no container depends on it
```

*Stopping a container does not remove it. Removing a container does not automatically remove its image.*

## 7. Running an existing image: Nginx example

```docker
docker run -d --name my-nginx -p 8080:80 nginx
```

- run: create and start a container.
- -d: run in the background (detached mode).
- --name my-nginx: assign a readable container name.
- -p 8080:80: map host port 8080 to container port 80.
- nginx: the image to use. Docker downloads it if needed.

Port mapping follows this pattern: -p HOST_PORT:CONTAINER_PORT.

## 8. Updating an application image

A running container is created from a particular image. Editing a source file on your host does not automatically update the code inside an already-created image/container in this workflow.

Rebuild the image and recreate the container:

```docker
docker build -t docker-demo .
docker stop my-docker-app
docker rm my-docker-app
docker run -d --name my-docker-app -p 3000:3000 docker-demo
```

Later, bind mounts will let you use host files directly for a development workflow.

## 9. Useful troubleshooting commands

```docker
docker ps                     # Running containers
docker ps -a                  # All containers
docker images                 # Local images
docker logs my-docker-app     # Application logs
docker inspect my-docker-app  # Detailed container configuration
docker exec -it my-docker-app sh  # Shell inside a running container
```

*If a command fails, read the error carefully. Check that the Docker daemon is running, the container name is correct, and the image/container exists.*