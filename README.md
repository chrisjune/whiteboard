# Real-time Whiteboard

This is a simple real-time whiteboard application built with Node.js, Express, and WebSocket.

## Features

*   Real-time drawing on a shared whiteboard
*   Pen and eraser tools
*   Clear button to reset the whiteboard
*   Responsive canvas

## How to Run

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the server:
    ```bash
    npm start
    ```
3.  Open your browser and go to `http://localhost:3000`

## How to Run Tests

1.  Install Playwright browsers:
    ```bash
    npx playwright install
    ```
2.  Run the tests:
    ```bash
    npx playwright test
    ```

## Project Structure

*   `server.js`: The main server file that handles WebSocket connections and serves static files.
*   `public/`: The directory for static files (HTML, CSS, and JavaScript).
    *   `index.html`: The main HTML file for the whiteboard.
    *   `main.js`: The client-side JavaScript file that handles drawing on the canvas and WebSocket communication.
    *   `style.css`: The CSS file for styling the whiteboard.
*   `tests/`: The directory for Playwright tests.
    *   `whiteboard.spec.js`: The test file for the whiteboard functionality.
