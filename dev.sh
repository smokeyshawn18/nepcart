#!/bin/bash

# Exit if frontend or backend doesn't exist
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ frontend or backend folder not found."
    exit 1
fi

echo "🚀 Starting Backend..."
(
    cd backend || exit
    pnpm dev
) &

echo "🚀 Starting Frontend..."
(
    cd frontend || exit
    pnpm dev
) &

# Wait for both processes
wait
