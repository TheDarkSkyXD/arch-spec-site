# LemonSqueezy Payment Integration

This document explains how to set up and use the LemonSqueezy payment integration in ArchSpec.

## Overview

ArchSpec uses LemonSqueezy for handling payments and subscriptions. The integration allows users to:

1. Subscribe to paid plans to access AI features
2. Manage their subscriptions through the customer portal
3. Automatically receive access to AI features upon successful payment

## Configuration for Self-Hosting

To set up LemonSqueezy in your self-hosted version, you'll need to:

### 1. Create a LemonSqueezy Account

- Sign up at [LemonSqueezy](https://www.lemonsqueezy.com/)
- Create a store and set up your products/subscription plans

### 2. Configure Environment Variables

Add the following environment variables to your backend `.env` file:

```
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
LEMONSQUEEZY_SIGNING_SECRET=your_signing_secret
```

### 3. Set Up Webhooks

In your LemonSqueezy dashboard:

1. Go to Settings > Webhooks
2. Create a new webhook with the following endpoint:
   - For production: `https://yourdomain.com/api/payments/webhooks/lemonsqueezy`
   - For development: Use ngrok to expose your local endpoint
3. Select the following events to listen for:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_resumed`
   - `subscription_expired`
   - `order_created`

### 4. Create Subscription Products

1. In your LemonSqueezy dashboard, create subscription products
2. Make note of the product and variant IDs
3. Update the product IDs in your backend configuration

## Development Setup

For local development, you'll need to expose your webhook endpoint using ngrok:

```bash
ngrok http 8000
```

The start-dev scripts (PowerShell and bash) already include ngrok setup for LemonSqueezy webhooks.

## Testing Subscriptions

To test the subscription flow:

1. Use LemonSqueezy test mode
2. Create test products with test pricing
3. Use test card information for payments:
   - Card Number: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits

## Subscription Status Management

The system automatically handles subscription status changes through webhooks. When a user:

- Creates a subscription: AI features are enabled
- Cancels a subscription: AI features remain active until the end of the billing period
- Subscription expires: AI features are disabled

## User Interface

The subscription management UI is available at:

- `/subscription` - View current subscription status
- `/subscription-plan` - Change or upgrade subscription plans

## Troubleshooting

### Webhook Issues

If webhooks aren't being received:

1. Check ngrok connection for local development
2. Verify webhook URL in LemonSqueezy dashboard
3. Confirm webhook secret matches your environment variable

### Payment Issues

If payments are failing:

1. Ensure test mode is enabled for development
2. Check LemonSqueezy dashboard for error messages
3. Verify product and variant IDs match your configuration
