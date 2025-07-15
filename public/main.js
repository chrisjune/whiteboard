
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const penBtn = document.getElementById('pen');
const eraserBtn = document.getElementById('eraser');
const clearBtn = document.getElementById('clear');

// --- WebSocket Connection ---
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}`);

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'draw') {
        drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.lineWidth);
    } else if (data.type === 'clear') {
        clearCanvas();
    }
};

// --- Canvas Setup ---


let drawing = false;
let lastX = 0;
let lastY = 0;
let tool = 'pen'; // 'pen' or 'eraser'
let penColor = 'black';
let eraserColor = 'white'; // Same as canvas background
let lineWidth = 5;

// Handle canvas resizing
const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        if (entry.target === canvas) {
            const { width, height } = entry.contentRect;
            canvas.width = width;
            canvas.height = height;
            // Redraw content if necessary, or clear if it's a fresh resize
            // For now, we'll just clear it to avoid distortion of old drawings
            clearCanvas();
        }
    }
});
resizeObserver.observe(canvas);

// --- Tool Selection ---
penBtn.addEventListener('click', () => {
    tool = 'pen';
    penBtn.classList.add('active');
    eraserBtn.classList.remove('active');
});

eraserBtn.addEventListener('click', () => {
    tool = 'eraser';
    eraserBtn.classList.add('active');
    penBtn.classList.remove('active');
});

// Set pen as default active tool
penBtn.classList.add('active');

clearBtn.addEventListener('click', () => {
    // Send a clear message to the server
    ws.send(JSON.stringify({ type: 'clear' }));
});

// --- Drawing Logic ---
function startDrawing(e) {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    drawing = false;
}

function draw(e) {
    if (!drawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;
    const color = tool === 'pen' ? penColor : eraserColor;
    const currentLineWidth = tool === 'pen' ? 5 : 20; // Eraser is thicker

    // Draw on local canvas
    drawLine(lastX, lastY, currentX, currentY, color, currentLineWidth);

    // Send data to server
    const data = {
        type: 'draw',
        x0: lastX,
        y0: lastY,
        x1: currentX,
        y1: currentY,
        color: color,
        lineWidth: currentLineWidth
    };
    ws.send(JSON.stringify(data));

    [lastX, lastY] = [currentX, currentY];
}

function drawLine(x0, y0, x1, y1, color, width) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); // Stop if mouse leaves canvas
canvas.addEventListener('mousemove', draw);
