#!/bin/bash

# E-Commerce Backend Quick Start Script

echo "🚀 E-Commerce Backend Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if MongoDB is running (optional)
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB detected"
else
    echo "⚠️  MongoDB not found locally. Make sure MongoDB is running."
    echo "Use: mongod (Windows) or brew services start mongodb-community (Mac)"
    echo "Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️  Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created. Update MONGODB_URI if needed."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "🗂️  Seeding database with products..."
npm run seed

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Server will run on: http://localhost:5000"
echo "API Documentation available at: http://localhost:5000/api"
