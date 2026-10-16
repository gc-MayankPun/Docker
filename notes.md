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

# Docker Volume & Bind Mounts

## 1. The problem: containers are replaceable

Imagine you're running PostgreSQL in a Docker container. You created a database and inserted 100 users.

Then you remove the container:

```docker
docker rm -f my-database
```

If the database files existed only in that container's writable layer, they're gone with it.

Here's the key distinction:
- Removing a container deletes it's writable layer.
- Removing a container doesn't normally remove its image.
- Data stored in a separate volume can survive container removal.

Docker containers are designed to be replaceable. Important data needs a home outside the container's writable layer.

## 2. What is Docker Volume?

A volume is a persistent storage managed by Docker. You can attach it to a container, remove that container and attach the same volume to another one.

- Container A: Writes database files
- Docker volume: Persistent databse files
- Container B: Can reuse the same data

The volume is independent of either container.

Docker volume commands:
```docker
docker volume create mydata     # Create a volume
docker volume ls                # List volumes
docker volume inspect mydata    # Inspect the volume
```

*Docker manages the volume's storage location for you. You generally don't need to manipulate its internal files directly.*

## 3. What is a bind mount?

A bind mount connects a specific path on your host machine to a path inside a container.

For example, you have a project on your machine:
```text
/home/user/docker-learning/app/
- server.js
- package.json
- Dockerfile
```

You can mount that directory into a container. Changes to the host files then become visible inside the container and changes made to shared files inside the container can affect host files too.

- Your Project: Edit server.js in your editor
- Container's mounted directory: Sees the same files

## 4. Volume vs Bind mount

| Feature | Volume | Bind mount |
|------|-----|------|
| Storage                    | Manged by Docker                            | A specific host path |
| Typical use                | Database data, persistent app data          | Source code, development files |
| Survives container removal | Yes, unless separately deleted              | Host files remain |
| Host can access files      | Yes, through usually Docker-managed storage | Directly at the mounted path |

So... 
- Use volumes when data should persist independently of the container.
- Use bind mounts when a container needs access to specific host files.

## 5. Docker Volume Commands

Volumes store data independently of a container's lifecycle.

```bash
docker volume create mydata    # Create a volume
docker volume ls               # List volumes
docker volume inspect mydata   # View volume details
docker volume rm mydata        # Delete a volume
docker volume prune            # Remove unused volumes
```

**Mount a volume inside a container:**
```bash
docker run --rm -v mydata:/data alpine
```
- `mydata`: Volume name
- `/data`: Path inside the container
- `-v`: Connects the volume to the container

**Write and read persistent data:**
```bash
docker run --rm -v mydata:/data alpine sh -c 'echo "Hello Docker" > /data/message.txt'
docker run --rm -v mydata:/data alpine cat /data/message.txt
```

The data remains in the volume even after the container is removed.

## 6. Bind Mount Commands

Bind mounts connect a host file or directory to a path inside a container. Changes can be reflected on both sides.

**Create a host directory and file:**
```bash
mkdir -p ~/docker-learning/bind-demo
echo "Hello Docker" > ~/docker-learning/bind-demo/message.txt
```

**Mount the directory:**
```bash
docker run --rm -it --mount type=bind,src="$HOME/docker-learning/bind-demo",dst=/workspace alpine sh
```

Inside the container:
```bash
ls /workspace                         # List files
cat /workspace/message.txt            # Read file
echo "Updated" >> /workspace/message.txt  # Append text
exit                                  # Exit container
```

Verify the change on the host:
```bash
cat ~/docker-learning/bind-demo/message.txt
```

**Bind mount syntax:**
```bash
docker run --mount type=bind,src=/host/path,dst=/container/path IMAGE
```
- `type=bind`: Specifies a bind mount
- `src`: Host file or directory
- `dst`: Destination path inside the container
- `IMAGE`: Docker image to run

**Remember:**
- **Volume:** Docker-managed storage, useful for persistent data.
- **Bind mount:** Connects a specific host path to a container path, useful for development.
- Both can keep data available beyond a container's lifecycle, provided the underlying storage remains intact.

# Docker Networking

## 1. Why does Docker networking matter?

Imagine you have a web application and a database running in separate containers. The web app needs to send SQL queries to the database. Docker networking provides the connection between them.

- Your browser: http://localhost:8080 -> published port: 8080 -> 80
- Web container: Port 80 inside the container
- *container communicate over a Docker network*
- Database container: Accessible to connected containers

There are two concepts to keep separate:
- Port publishing lets traffic reach a container through a port on your host machine
- Docker networks let containers communicate with each other

## 2. Creating a custom network

Create one and check that it exists
```docker
docker network create app-network
docker network ls 
```

Now launch two containers on same network
```docker
docker run -dit --name frontend --network app-network alpine sh
docker run -dit --name backend --network app-network alpine sh
```

here's what the flags mean:
- -d: Run in the background
- -i: Keep standard input open
- -t: Allocate a terminal
- --name: Give the container a recognizable name
- --network: Connect it to the specified Docker network
- alpine: Use a small Linux image
- sh: Start a shell

Now let's make the container talk with each other
```docker
docker exec frontend ping -c 3 backend
```

## 3. Docker Network commands

```docker
docker network ls                                           # List networks
docker network inspect bridge                               # Inspect a network
docker network create app-network                           # Create a custom network
docker run -d --name my-app --network app-network IMAGE     # Run a container on a network
docker network connect app-network CONTAINER                # Connect an existing network
docker network disconnect app-network CONTAINER             # Disconnect a network
docker network rm app-network                               # Remove a network
```