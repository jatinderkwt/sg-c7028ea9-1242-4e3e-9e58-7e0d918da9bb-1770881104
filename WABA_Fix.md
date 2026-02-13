Below is a **precise, production-level Meta WhatsApp Cloud API integration specification**.
This is written as a **technical implementation guide** you can directly use inside your **Next.js SaaS project**.

---

# Meta WhatsApp Cloud API Integration Specification

This document covers:

1. System architecture
2. WhatsApp onboarding flow
3. Sending messages
4. Receiving messages (webhooks)
5. Template management
6. Media handling
7. Conversation billing logic
8. Required database structure
9. Security and production practices

---

# 1. Core Architecture

### Meta Cloud API Base URL

```
https://graph.facebook.com/v18.0/
```

### Required Credentials

You must obtain from Meta:

| Credential      | Description                       |
| --------------- | --------------------------------- |
| Access Token    | Permanent system user token       |
| Phone Number ID | WhatsApp phone number identifier  |
| WABA ID         | WhatsApp Business Account ID      |
| App ID          | Meta App identifier               |
| App Secret      | Meta App secret                   |
| Verify Token    | Custom webhook verification token |

---

# 2. Environment Variables

```
META_APP_ID=
META_APP_SECRET=
META_VERIFY_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_WABA_ID=
WHATSAPP_ACCESS_TOKEN=
```

---

# 3. WhatsApp Onboarding Flow

### Step 1: Create Meta App

1. Go to Meta for Developers
2. Create App → Business type
3. Add WhatsApp product

---

### Step 2: Add Phone Number

Inside WhatsApp Manager:

1. Add phone number
2. Verify with OTP
3. Get:

   * Phone Number ID
   * WABA ID

---

### Step 3: Generate System User Token

1. Go to Business Settings
2. Create System User
3. Assign:

   * WhatsApp Business Account
   * Full control
4. Generate permanent token

---

# 4. Sending Messages

## Endpoint

```
POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages
```

### Headers

```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

---

## 4.1 Send Text Message

### Request

```json
{
  "messaging_product": "whatsapp",
  "to": "965XXXXXXXX",
  "type": "text",
  "text": {
    "body": "Hello from WhatsApp SaaS"
  }
}
```

---

## 4.2 Send Template Message

### Request

```json
{
  "messaging_product": "whatsapp",
  "to": "965XXXXXXXX",
  "type": "template",
  "template": {
    "name": "order_confirmation",
    "language": {
      "code": "en_US"
    },
    "components": [
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "John"
          },
          {
            "type": "text",
            "text": "#12345"
          }
        ]
      }
    ]
  }
}
```

---

## 4.3 Send Image Message

```json
{
  "messaging_product": "whatsapp",
  "to": "965XXXXXXXX",
  "type": "image",
  "image": {
    "link": "https://example.com/image.jpg"
  }
}
```

---

## 4.4 Send Interactive Buttons

```json
{
  "messaging_product": "whatsapp",
  "to": "965XXXXXXXX",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": {
      "text": "Choose an option"
    },
    "action": {
      "buttons": [
        {
          "type": "reply",
          "reply": {
            "id": "yes",
            "title": "Yes"
          }
        },
        {
          "type": "reply",
          "reply": {
            "id": "no",
            "title": "No"
          }
        }
      ]
    }
  }
}
```

---

# 5. Webhook Configuration

## Webhook URL

Example:

```
https://yourdomain.com/api/webhooks/whatsapp
```

---

## Webhook Verification Endpoint

### GET request from Meta

```
GET /api/webhooks/whatsapp
```

### Query parameters

```
hub.mode
hub.challenge
hub.verify_token
```

### Response logic

If token matches:

Return:

```
hub.challenge
```

---

## Example Verification Code (Pseudo)

```js
if (mode === "subscribe" && token === VERIFY_TOKEN) {
  return challenge;
}
```

---

# 6. Incoming Message Webhook Payload

### Example Incoming Text Message

```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "965XXXXXXXX",
                "id": "wamid.HBg...",
                "timestamp": "1690000000",
                "text": {
                  "body": "Hello"
                },
                "type": "text"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Webhook Processing Logic

### Step 1: Receive event

### Step 2: Extract:

* Sender number
* Message ID
* Message type
* Message content

### Step 3: Store in database

### Step 4: Trigger:

* Automation
* Agent assignment
* Notifications

---

# 7. Message Status Webhooks

Meta sends delivery updates.

### Example Status Payload

```json
{
  "statuses": [
    {
      "id": "wamid.HBg...",
      "status": "delivered",
      "timestamp": "1690000010",
      "recipient_id": "965XXXXXXXX"
    }
  ]
}
```

### Possible Statuses

| Status    | Meaning           |
| --------- | ----------------- |
| sent      | Sent to WhatsApp  |
| delivered | Delivered to user |
| read      | User read message |
| failed    | Message failed    |

---

# 8. Template Management

## Create Template

### Endpoint

```
POST /{WABA_ID}/message_templates
```

---

### Example Template Request

```json
{
  "name": "order_confirmation",
  "language": "en_US",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Hello {{1}}, your order {{2}} is confirmed."
    }
  ]
}
```

---

## Template Statuses

| Status   | Meaning      |
| -------- | ------------ |
| PENDING  | Under review |
| APPROVED | Ready to use |
| REJECTED | Not approved |

---

## Get Templates

```
GET /{WABA_ID}/message_templates
```

---

# 9. Media Upload

## Step 1: Upload Media

```
POST /{PHONE_NUMBER_ID}/media
```

### Headers

```
Authorization: Bearer ACCESS_TOKEN
Content-Type: multipart/form-data
```

### Form data

```
file: image.jpg
type: image/jpeg
messaging_product: whatsapp
```

---

### Response

```json
{
  "id": "MEDIA_ID"
}
```

---

## Step 2: Send Media

```json
{
  "messaging_product": "whatsapp",
  "to": "965XXXXXXXX",
  "type": "image",
  "image": {
    "id": "MEDIA_ID"
  }
}
```

---

# 10. Conversation Window Rules

### 24-Hour Customer Service Window

| Scenario                   | Allowed Messages       |
| -------------------------- | ---------------------- |
| Within 24h of user message | Free-form messages     |
| After 24h                  | Template messages only |

---

# 11. Conversation Types (Billing)

| Type           | Trigger                |
| -------------- | ---------------------- |
| Service        | User initiated         |
| Utility        | Transactional template |
| Authentication | OTP templates          |
| Marketing      | Promotional templates  |

---

# 12. Required Database Tables

## workspaces

* id
* name
* plan_id

## whatsapp_numbers

* id
* workspace_id
* phone_number
* phone_number_id
* access_token

## contacts

* id
* workspace_id
* phone
* name
* tags

## conversations

* id
* workspace_id
* contact_id
* status
* assigned_agent_id

## messages

* id
* conversation_id
* whatsapp_message_id
* direction (inbound/outbound)
* type
* content
* status
* timestamp

## templates

* id
* workspace_id
* name
* language
* category
* status

---

# 13. Message Flow (End-to-End)

## Outgoing

1. Agent sends message
2. API call to Meta
3. Store message as "sent"
4. Receive status webhook
5. Update status

---

## Incoming

1. Meta sends webhook
2. Parse message
3. Find or create contact
4. Find or create conversation
5. Store message
6. Trigger:

   * Automation
   * Agent notification

---

# 14. Security Best Practices

### Token Security

* Store tokens encrypted
* Never expose in frontend

### Webhook Security

* Validate Meta signature
* Use HTTPS only

---

# 15. Rate Limits

Meta Cloud API:

| Limit        | Value                       |
| ------------ | --------------------------- |
| Messages/sec | Tier-based                  |
| Default      | ~80 messages/sec per number |

---

# 16. Production Requirements

You must have:

* Verified Business
* Approved WhatsApp number
* Approved templates
* HTTPS webhook endpoint
* Privacy policy
* Terms of service

---

# 17. Testing Endpoints

### Send Test Message

```
POST /{PHONE_NUMBER_ID}/messages
```

### Get Phone Numbers

```
GET /{WABA_ID}/phone_numbers
```

---

# 18. Required API Endpoints in Your SaaS

## Internal APIs

### Messaging

```
POST /api/messages/send
GET  /api/conversations
GET  /api/messages
```

### Webhooks

```
POST /api/webhooks/whatsapp
GET  /api/webhooks/whatsapp (verification)
```

### Templates

```
POST /api/templates/create
GET  /api/templates
```

---

# If you want next:

I can provide:

1. Full **PostgreSQL schema**
2. Complete **Next.js API routes**
3. Production **webhook handler code**
4. Full **template approval automation**
5. End-to-end **message queue architecture**
6. Multi-number load balancing system
7. White-label reseller architecture

Just tell me which part you want next.
