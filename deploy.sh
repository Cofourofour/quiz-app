#!/bin/bash

echo "🚀 Deploying your Quiz App to Vercel..."
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "Starting deployment..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add your Gmail credentials in Vercel dashboard"
echo "2. Set NEXT_PUBLIC_SITE_URL to your Vercel URL"
echo "3. Test your live quiz!"
echo ""
echo "💡 Don't forget to configure Gmail App Password for emails!"
