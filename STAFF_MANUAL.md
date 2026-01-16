# 🛡️ DankBud Staff Protocol: Order Fulfillment

**Role**: Admin / Dispatcher
**Objective**: Ensure every order is verified, packed securely, and handed over professionally.

---

## 1. 🖥️ Command Center Routine
**URL**: `/admin`
**Action**: Keep this tab open on the shop iPad/Laptop. It refreshes every 30 seconds.

### Status Indicators
*   **🟠 PENDING**: New order received. Has NOT been processed.
*   **🔵 PAID**: Payment verified. Ready for packing.
*   **🟢 DISPATCHED**: Left the building (Delivery) or Handed over (Collection).

---

## 2. ⚡ Step-by-Step Fulfillment Flow

### Step A: New Order Received (🟠 PENDING)
1.  **Check Details**:
    *   Click the order card to see items.
    *   Note if it is **DELIVERY 🚚** or **COLLECTION 📦**.
2.  **Verify Payment**:
    *   **EFT**: Check business bank account for incoming payment matching `Ref: ORD-XXXXXX`.
    *   **CASH**: If marked as Cash, you can proceed to pack, but flag it for the driver to collect cash.
3.  **Action**:
    *   Once payment is confirmed (or cash is approved), Update Status to **PAID**.
    *   *The customer will (eventually) get a notification (Future Feature).*

### Step B: Packing (🔵 PAID)
1.  **Pick Stock**:
    *   Go to inventory and pull the exact strains and quantities.
    *   *Double Check weights.*
2.  **Pack**:
    *   Place in vacuum-sealed bag (smell proof).
    *   Place inside branded DankBud bag.
    *   Staple receipt/order slip to the bag.

### Step C: Handover (🟢 DISPATCHED)
1.  **For Delivery 🚚**:
    *   Hand bag to Driver.
    *   Give Driver the Address & Special Instructions (e.g., "Gate Code 1234").
    *   **Action**: Click **DISPATCH** in Admin Panel.
2.  **For Collection 📦**:
    *   Store bag in "Ready for Collection" bin.
    *   When customer arrives, ask for **Order ID** and **Member ID** (SA ID card).
    *   Hand over package.
    *   **Action**: Click **DISPATCH** in Admin Panel to close the order.

---

## 3. 🚨 Troubleshooting
*   **"Inventory Missing"**: If a user ordered something we don't have, contact them immediately via WhatsApp to offer a swap (e.g., "Sour Diesel is out, want Lemon Haze?").
*   **"Payment not showing"**: Do NOT dispatch until payment clears or Proof of Payment is verified authentic.
*   **"Driver delayed"**: WhatsApp the customer to manage expectations.

---
*Stay Safe. Stay Dank.*
