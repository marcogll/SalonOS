#!/bin/bash

echo "🔑 Setting up SSH agent for GitHub push..."

# Kill any existing SSH agents
pkill ssh-agent 2>/dev/null

# Start new SSH agent
eval "$(ssh-agent -s)"

# Add the GitHub SSH key
ssh-add ~/.ssh/id_github

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Push completed successfully!"