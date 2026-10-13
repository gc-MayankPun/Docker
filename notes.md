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