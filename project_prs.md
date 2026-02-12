Below is a **single, complete, production-grade master prompt** that combines:

1. **Core WhatsApp Business API SaaS**
2. **Web-based Installer & Setup Wizard**
3. **Marketing Landing Site + Stripe Subscription System**

All in **one unified prompt** for **Next.js + PostgreSQL** architecture, ready to give to Emergent or any AI developer.

---

# MASTER PROMPT

## Full WhatsApp Business API SaaS + Installer + Landing System

### Tech: Next.js + PostgreSQL + Stripe

---

## Project Overview

Build a **production-ready, multi-tenant WhatsApp Business API SaaS platform** using **Next.js**.
The system must include:

1. **Core WhatsApp SaaS application**
2. **Web-based installation & setup wizard**
3. **Marketing website with Stripe subscription system**
4. **Multi-tenant architecture**
5. **Admin, Manager, and Agent roles**
6. **Scalable, secure, and production-ready code**

The final system should be a **complete commercial SaaS product**.

---

# Technology Stack

### Core Stack

* Next.js 14+ (App Router)
* TypeScript
* PostgreSQL
* Prisma ORM
* TailwindCSS
* NextAuth (or custom JWT auth)
* Stripe for billing
* REST API + Webhooks

---

# High-Level Architecture

```
/app
   /(marketing)
       home
       pricing
       features
       solutions
       about
       contact

   /(auth)
       login
       register
       forgot-password

   /(installer)
       setup
       database
       admin-user
       complete

   /(dashboard)
       dashboard
       inbox
       automation
       campaigns
       crm
       analytics
       settings
       billing

/api
   auth
   whatsapp
   stripe
   webhooks
```

---

# PART 1: CORE WHATSAPP BUSINESS API SAAS

## Core Functional Modules

### 1. Multi-Tenant Workspace System

Each company gets:

* Separate workspace
* Own WhatsApp numbers
* Own agents
* Own CRM data
* Own automation flows

### Workspace Structure

```
Workspace
 ├── Users
 ├── WhatsApp Numbers
 ├── Contacts
 ├── Conversations
 ├── Automation Flows
 ├── Campaigns
 ├── Templates
 └── Settings
```

---

## User Roles

### 1. Super Admin

* Global system control
* Billing overview
* Workspace management

### 2. Manager

* Manage agents
* View analytics
* Configure automation

### 3. Agent

* Chat with customers
* Manage assigned conversations

---

## WhatsApp Core Features

### Inbox

* Real-time messaging
* Multi-agent assignment
* Chat tags
* Notes
* Status (open, pending, resolved)

### Contacts CRM

* Contact profiles
* Tags
* Custom fields
* Conversation history

### Automation

* Visual flow builder
* Auto replies
* Keyword triggers
* Time-based messages
* AI chatbot integration

### Broadcast Campaigns

* Template-based campaigns
* Audience selection
* Delivery tracking
* Read metrics

### Templates

* Create WhatsApp templates
* Submit to Meta
* Template categories:

  * Utility
  * Marketing
  * Authentication

---

## Analytics Dashboard

Show:

* Messages sent
* Messages received
* Response time
* Agent performance
* Campaign results

---

# PART 2: INSTALLER & SETUP WIZARD

Create a **web-based installer** accessible at:

```
/install
```

If system not installed:

* Redirect to installer

---

## Installer Steps

### Step 1: System Check

* Node version
* Database connection
* Environment variables

### Step 2: Database Setup

Form:

* Host
* Port
* DB name
* Username
* Password

Actions:

* Test connection
* Run migrations
* Seed default data

---

### Step 3: Create Super Admin

Form:

* Name
* Email
* Password

Actions:

* Create super admin account
* Create default workspace

---

### Step 4: Platform Settings

Form:

* Platform name
* Default currency
* Timezone
* Email settings

---

### Step 5: Installation Complete

Actions:

* Generate `.env` file
* Lock installer
* Redirect to login

---

# PART 3: MARKETING LANDING SITE

The marketing site must exist inside the same Next.js app.

---

## Marketing Pages

### 1. Home Page

Sections:

1. Hero

   * Headline
   * Subtext
   * CTA: Start Free Trial

2. Features

   * Shared inbox
   * Automation
   * CRM
   * Campaigns

3. Solutions

   * Education
   * E-commerce
   * Healthcare
   * Real estate

4. Integrations

   * Shopify
   * WooCommerce
   * Zapier
   * API

5. Pricing preview

6. Testimonials

7. FAQ

8. Final CTA

---

### 2. Pricing Page

3 plans:

#### Starter

* 1 number
* 2 agents
* Basic automation

#### Growth

* 3 numbers
* 5 agents
* Full automation
* CRM

#### Enterprise

* Unlimited numbers
* Unlimited agents
* API access
* White label

---

### 3. Features Page

Detailed modules:

* Shared inbox
* Automation
* CRM
* Campaigns
* Analytics
* Integrations

---

### 4. Solutions Page

Industry use cases:

* Education institutes
* E-commerce
* Clinics
* Travel agencies
* Support teams

---

### 5. About Page

* Mission
* Vision
* Team
* Security
* Compliance

---

### 6. Contact Page

Contact form:

Fields:

* Name
* Email
* Company
* Message

Actions:

* Save to database
* Send email notification

---

# PART 4: STRIPE SUBSCRIPTION SYSTEM

## Plan System

Database tables:

### plans

* id
* name
* price_monthly
* price_yearly
* features_json

### subscriptions

* id
* workspace_id
* plan_id
* stripe_customer_id
* stripe_subscription_id
* status
* renewal_date

---

## Stripe Flow

1. User selects plan
2. Clicks Subscribe
3. Redirect to Stripe Checkout
4. Payment success
5. Webhook updates subscription
6. Activate plan in workspace

---

## Billing Dashboard (User Side)

Allow users to:

* View subscription
* Change plan
* Cancel plan
* Update payment method
* Download invoices

---

## Super Admin Billing Panel

Show:

* Total revenue
* Monthly recurring revenue
* Active subscriptions
* Churn rate
* Plan distribution

---

# Authentication Flow

From landing page:

### Start Free Trial

1. Signup
2. Create workspace
3. Assign free trial plan
4. Redirect to dashboard

---

# UI/UX Requirements

Design must be:

* Modern SaaS style
* Mobile-first
* Fast loading
* Accessible
* Dark/light mode support

Use:

* TailwindCSS
* Component-based UI
* Clean typography

---

# SEO & Performance

Implement:

* Meta tags
* Open Graph
* Sitemap
* Robots.txt
* Static generation for marketing pages
* Lazy loading images

---

# Security Requirements

* CSRF protection
* Rate limiting
* Input validation
* Secure Stripe webhooks
* Password hashing
* Role-based access control

---

# Advanced Features (Differentiators)

Add innovative features:

1. AI auto-reply assistant
2. Auto lead scoring
3. Smart conversation routing
4. Multi-language auto-translation
5. Voice-to-text replies
6. AI campaign optimizer
7. Predictive response suggestions
8. Customer sentiment detection
9. Knowledge base auto-replies
10. WhatsApp mini landing pages for products

---

# Deliverables

The final system must include:

1. Core WhatsApp SaaS platform
2. Multi-tenant workspace system
3. Admin, manager, agent roles
4. Web-based installer
5. Full marketing website
6. Stripe subscription system
7. Billing dashboards
8. AI-powered features
9. Secure, production-ready architecture
