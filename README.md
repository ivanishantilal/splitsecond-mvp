# SplitSecond MVP

## Overview
SplitSecond is a FinTech MVP for end-to-end group payment coordination, from expense capture to final settlement.

The app is designed around a common payment friction: coordinating group payments is fragmented, manual, and inefficient. Existing solutions often focus only on calculating who owes what, but do not structure the full payment process from start to finish.

SplitSecond addresses this by providing a structured, end-to-end flow that guides users from group creation and receipt capture to allocation, settlement, and payment confirmation.

This MVP was built as part of a FinTech assignment and focuses on demonstrating the core product flow and business logic rather than real banking integrations.

---

## Core Idea: End-to-End Group Payment System
Instead of acting as a simple bill-splitting tool, SplitSecond structures the entire group payment experience as a coordinated, step-by-step system.

SplitSecond enables users to:

- create a shared bill-splitting session  
- simulate nearby participant discovery  
- simulate receipt scanning and item extraction  
- choose between equal split and item-based split  
- assign items, tax, and tip to participants  
- automatically calculate how much each person owes  
- execute and confirm settlement through a structured payment flow with simulated biometric authentication  

---

## Differentiation from Existing Solutions

Existing apps such as Tab enable receipt-based bill splitting and item assignment. However, they typically stop at calculating what each person owes and rely on external platforms (e.g., Venmo) for actual payment.

SplitSecond extends this by structuring the entire group payment process:

- pre-payment coordination (group creation and participant discovery)  
- guided allocation of expenses  
- built-in settlement logic  
- integrated payment confirmation flow  

This positions SplitSecond not just as a bill-splitting tool, but as a complete group payment coordination system.

---

## Main Features

### 1. Welcome and account setup
Users can:
- log in  
- create an account  
- simulate a linked payment method  
- simulate enabled biometric authentication  

### 2. Start a split
Users can:
- define the occasion  
- name the group  
- simulate creating a shared group session  
- simulate nearby participants joining the session  

### 3. Smart receipt scanning
Users can:
- simulate OCR-based receipt scanning  
- auto-fill sample receipt items  
- manually edit items and prices  
- add tax and tip  

### 4. Proximity-based participant creation
Users can:
- simulate scanning nearby users  
- auto-fill sample participants  
- manually add or edit participants  

### 5. Flexible split logic
Users can choose:
- **Split equally**  
- **Split by items**  

For item-based splitting, users can assign:
- personal items to one person  
- shared items to multiple people  
- tax and tip as shared cost lines  

### 6. Automatic calculation
The app automatically computes:
- subtotal  
- tax and tip  
- total bill  
- per-person amounts  
- settlement suggestions  

### 7. Settlement and authentication
Users can:
- indicate who paid upfront  
- see who owes whom  
- simulate Face ID or fingerprint verification  
- confirm the final payment flow  

---

## Example Use Case
A group of friends finishes dinner at a restaurant. One user starts a split session, nearby friends join the group, the receipt is scanned, each person selects what they consumed, and the app calculates exact owed amounts. The payer is identified, settlement instructions are generated, and the payment is completed through a structured, app-guided settlement flow with biometric authentication.

---

## MVP Scope
This project is an MVP and therefore simulates several real-world technologies instead of implementing them fully.

### Simulated in the MVP
- proximity detection via Bluetooth / NFC  
- OCR-based receipt scanning  
- biometric authentication  
- real payment execution through banks or PSPs  

### Implemented in the MVP
- complete user flow  
- GUI  
- state management  
- split logic  
- item assignment logic  
- tax/tip handling  
- settlement calculation  
- mock confirmation flow  

---

## Technology Overview

### Programming language
- **Python**

Python was chosen because it enables fast prototyping and clear implementation of business logic.

### Framework
- **Streamlit**

Streamlit was chosen because it allows rapid development of a working GUI and makes it easy to test interactive MVP flows.

### Paradigm
The app follows a simple event-driven and state-based structure using:
- Streamlit session state  
- helper functions for business logic  
- modular rendering functions for each page  

---

## App Flow
The MVP follows this user journey:

1. Welcome / Login  
2. Start a Split  
3. Receipt  
4. People  
5. Choose Split Mode  
6. Assign Items  
7. Summary  
8. Confirm Payment  

---

## Code Structure
The code is organized into the following logical sections:

- **Session state setup**  
  Initializes all app variables used across the flow  

- **Helper functions**  
  Handles navigation, validation, and reusable utilities  

- **Calculation logic**  
  Computes totals, allocations, and settlements  

- **Simulation functions**  
  Simulates receipt scanning, nearby participant detection, and biometric confirmation  

- **Rendering functions**  
  Each step of the app is implemented as a separate render function  

- **Main router**  
  Controls which page is displayed based on the current step  

---

## How to Run the App

### 1. Clone the repository
```bash
git clone https://github.com/ivanishantilal/splitsecond-mvp.git
cd splitsecond-mvp
```
### 2. Install dependencies
``` bash
pip install streamlit
```
### 3. Run the app
``` bash
py -m streamlit run app.py 
```
### 4. Open the app
Streamlit will provide a local URL, usually:
``` bash
http://localhost:8501
```
Open this in your browser.
