# Deploy using Ngrok

This method allows you to instantly share your local app with the world using a public URL.

## Prerequisites
1.  **Sign up** for a free account at [ngrok.com](https://dashboard.ngrok.com/signup).
2.  **Get your Authtoken** from the [dashboard](https://dashboard.ngrok.com/get-started/your-authtoken).

## Step 1: Configure Token
1.  Create a file named `.env` in this directory.
2.  Copy your token into it:
    ```
    NGROK_AUTHTOKEN=your_actual_token_here
    ```

## Step 2: Run
Start the app and the tunnel:
```bash
docker-compose up -d
```

## Step 3: Get URL
You can find your public URL in two ways:
1.  **Check Logs**:
    ```bash
    docker-compose logs ngrok
    ```
    Look for a line that says `addr=web:80 url=https://....ngrok-free.app`

2.  **Web Interface**:
    Open [http://localhost:4040](http://localhost:4040) in your browser to see the tunnel status and URL.

## Step 4: Share!
Send the `https://....ngrok-free.app` link to anyone. Note that free accounts have session limits, so you might need to restart occasionally.
