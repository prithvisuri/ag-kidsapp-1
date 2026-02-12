# Deployment Guide for Kids App

This guide will help you deploy your application as a Docker container and link it to a custom domain with SSL (HTTPS).

## Prerequisites
- A server (VPS from DigitalOcean, AWS EC2, Linode, etc.) with Docker and Docker Compose installed.
- A domain name (e.g., `sillyschool.com`) purchased from a registrar (GoDaddy, Namecheap, etc.).

## Step 1: Build and Publish Docker Image

You need to build your image and push it to a container registry (like Docker Hub) so your server can pull it.

1.  **Login to Docker Hub** (Create an account on [hub.docker.com](https://hub.docker.com) if needed):
    ```bash
    docker login
    ```

2.  **Build the Image**:
    Replace `yourusername` with your actual Docker Hub username.
    ```bash
    docker build -t yourusername/kids-app:latest .
    ```

3.  **Push the Image**:
    ```bash
    docker push yourusername/kids-app:latest
    ```

## Step 2: Prepare Your Server

1.  **SSH into your server**.
2.  **Create a folder** for your app:
    ```bash
    mkdir kids-app
    cd kids-app
    ```
3.  **Create a `docker-compose.yml` file** on the server.
    We'll use **Nginx Proxy Manager** alongside your app. It handles domains and SSL certificates automatically.

    Create the file:
    ```bash
    nano docker-compose.yml
    ```
    
    Paste the following content:
    ```yaml
    version: '3.8'
    services:
      app:
        image: yourusername/kids-app:latest
        restart: always
        # We don't need to expose ports publicly if using the proxy network
        # But for simple testing, you can leave it internally reachable
        networks:
          - app-network

      nginx-proxy-manager:
        image: 'jc21/nginx-proxy-manager:latest'
        restart: unless-stopped
        ports:
          - '80:80'
          - '81:81'
          - '443:443'
        volumes:
          - ./data:/data
          - ./letsencrypt:/etc/letsencrypt
        networks:
          - app-network

    networks:
      app-network:
        driver: bridge
    ```

4.  **Start the Services**:
    ```bash
    docker-compose up -d
    ```

## Step 3: Configure Domain & SSL

1.  **DNS Configuration**:
    Go to your domain registrar (e.g., GoDaddy) and point your domain's **A Record** to your server's IP address.
    - Type: `A`
    - Name: `@` (or `www`)
    - Value: `YOUR_SERVER_IP`

2.  **Setup Nginx Proxy Manager**:
    - Open your browser and go to `http://YOUR_SERVER_IP:81`.
    - Default login:
        - Email: `admin@example.com`
        - Password: `changeme`
    - Change your credentials as prompted.

3.  **Link Domain to Container**:
    - Click **Proxy Hosts** -> **Add Proxy Host**.
    - **Domain Names**: `yourdomain.com`
    - **Scheme**: `http`
    - **Forward Hostname / IP**: `app` (This matches the service name in docker-compose)
    - **Forward Port**: `80` (The internal port Nginx serves in the container)
    - **Block Common Exploits**: Enable.
    - **SSL Tab**:
        - Select **Request a new SSL Certificate**.
        - Enable **Force SSL**.
        - Enable **HTTP/2 Support**.
        - Enter your email address.
        - Agree to Terms.
    - Click **Save**.

## Verification
Wait a few minutes for DNS to propagate, then visit `https://yourdomain.com`. Your Kids App should be live and secure!
