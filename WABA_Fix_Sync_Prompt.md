# **SYSTEM INSTRUCTION: Debug & Repair WABA Messaging and Template Sync**

The current multi-tenant WABA platform is experiencing failures in two-way messaging (Send/Receive) and Template Synchronization. Implement the following technical fixes immediately.

## **1\. WEBHOOK ROUTING & TRAFFIC WARDEN (Fixing Send/Receive)**

The system is receiving payloads but failing to route or display them.

* **Payload Validation:** Ensure the Webhook listener verifies the hub.verify\_token correctly during the initial handshake with Meta.  
* **Tenant Mapping Logic:** Implement a "Traffic Warden" service that:  
  1. Extracts the metadata.phone\_number\_id from the incoming JSON payload (entry\[0\].changes\[0\].value.metadata.phone\_number\_id).  
  2. Queries the Tenants table for the matching meta\_phone\_number\_id.  
  3. If found, identifies the tenant\_id and pushes the message object to that tenant's specific WebSocket stream or Redis queue.  
* **Outbound Fix:** Ensure outbound requests use the specific access\_token stored for that tenant\_id. Implement a check to log the exact Meta API response (error codes like 131030 or 100\) for every failed send.

## **2\. TEMPLATE TWO-WAY SYNC ENGINE**

Templates are not syncing status updates or being fetched correctly.

* **Initial Sync:** Implement a background job that calls GET https://graph.facebook.com/v21.0/{waba\_id}/message\_templates for each tenant. It must map the response to the internal Templates table, updating status, name, and components.  
* **Status Update Webhook:** Add a listener for the message\_template\_status\_update event. When Meta changes a template status (Approved/Rejected/Flagged):  
  1. Extract the message\_template\_id and event (e.g., APPROVED).  
  2. Update the corresponding record in your database.  
  3. Trigger a real-time UI notification for the Tenant Admin.

## **3\. LOGGING & DIAGNOSTICS UI**

Build a "Firehose" debugger for the Super Admin to identify bottlenecks:

* **Webhook Logs:** Create a table that stores the raw JSON of the last 100 incoming Meta Webhooks.  
* **Delivery Receipts:** Ensure the system correctly processes delivered and read statuses from Meta payloads to update the checkmarks in the Team Inbox.

## **4\. SECURITY & PERMISSIONS**

* Ensure the access\_token being used for POST requests has the necessary scopes: whatsapp\_business\_messaging and whatsapp\_business\_management.  
* Verify that the Webhook URL is explicitly registered and "Subscribed" to messages and message\_template\_status\_update in the Meta App Dashboard.