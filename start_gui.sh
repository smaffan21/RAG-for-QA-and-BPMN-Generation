#!/bin/bash

echo "Starting Railway RAG System with GUI..."

echo ""
echo "Starting API Server..."
python api_server.py &
API_PID=$!

echo ""
echo "Waiting for API server to start..."
sleep 3

echo ""
echo "Starting React Frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "System is starting..."
echo "Frontend will be available at: http://localhost:3000"
echo "API server running at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

# wait for user interrupt
trap 'kill $API_PID $FRONTEND_PID; exit' INT
wait
