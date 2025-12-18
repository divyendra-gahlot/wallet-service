Wallet Service

A. INTRO

A light-weight wallet system built with Node.js + TypeScript, supporting wallet creation, balance updates (credit/debit), transaction history, and strong decimal precision enforcement (up to 4 places).
The project uses in-memory storage and includes atomic concurrency-safe updates using per-wallet locking.

Tech Stack used

1. Node.js, TypeScript

2. Express.js

3. Big.js for precise decimal arithmetic

4. Jest for unit & concurrency testing

5. In-memory DB using Maps
---------------------------------------------------------------------------------
B. API Endpoints

1. POST /setup (Setup Wallet)

curl --location 'http://localhost:3000/setup' \
--header 'Content-Type: application/json' \
--data '{"balance":30.2223,"name":"Muse"}'

Request 

{"balance":30.2223,"name":"Muse"}

Response

{
    "id": "35a09281-c7f3-451d-9a25-f897f688e764",
    "balance": 30.2223,
    "name": "Muse",
    "transactionId": "b399b3e8-d011-4b34-9926-0a067c17a957",
    "date": "2025-12-13T17:20:27.491Z"
}

2. GET /wallet/:walletId (Get wallet info by wallet Id)


curl --location 'http://localhost:3000/wallet/35a09281-c7f3-451d-9a25-f897f688e764'

Pass walletId in the path variable.

Response 

{
    "id": "35a09281-c7f3-451d-9a25-f897f688e764",
    "name": "Muse",
    "balance": 130.6913,
    "date": "2025-12-13T17:20:27.491Z"
}

3. POST /transact/:walletId (Perform transaction on a wallet)

Request

{
  "amount": 50.2345,
  "description": "Recharge"
}

Response

{
    "balance": 130.6913,
    "transactionId": "0a88d585-0550-4f75-a263-11160a0e31ab"
}

4. GET /transactions?walletId=<id>&skip=<n>&limit=<n> (Get transactions by walletId)

Pass walletId in the query params and not in the path variables as we are searching/filtering . We can also pass the skip and limit query params.

Response
[
    {
        "id": "1bb5cd41-5b18-48a9-b2fd-22c3de14f828",
        "walletId": "e93a7aee-4fde-4b1e-af46-4a0c356008ad",
        "amount": 50.2345,
        "description": "Recharge",
        "balance": 80.4568,
        "type": "CREDIT",
        "date": "2025-12-14T07:02:00.908Z"
    },
    {
        "id": "3acc707a-a69a-4309-a599-86a1b8cc71b0",
        "walletId": "e93a7aee-4fde-4b1e-af46-4a0c356008ad",
        "amount": 30.2223,
        "balance": 30.2223,
        "description": "Setup",
        "type": "CREDIT",
        "date": "2025-12-14T07:01:47.026Z"
    }
]
-------------------------------------------------------------------------
C. Setup Instructions

1. npm install
2. npm run build
3. npm start
If you want to run unit test cases then 
4. npm uninstall jest @types/jest (Version mismatch that's why)
5. npm install --save-dev jest@29 @types/jest@29 ts-jest@29
6. npx ts-jest config:init
7. npm test (I have written some unit test cases to test various situations)

-------------------------------------------------------------------------
D. Database Design

This project uses in-memory Maps:

D1. Wallets Table
Map<walletId, Wallet>

Wallet has these fields->

id
name
balance
date created

D2. Transactions Table
Map<transactionId, Transaction>

Transaction has these fields->

id
walletId
amount
balance after transaction
type (CREDIT/DEBIT)
description
date
-------------------------------------------------------------------------------------
E. Concurrency Handling (Atomic Updates)

Whenever two users try to credit/debit the same wallet simultaneously, race conditions can occur.

This project uses a per-wallet mutex lock:

Only one transaction per wallet executes at a time

Prevents lost updates

Ensures balances remain accurate

Keeps transaction ordering consistent

This simulates real-world payment-system atomicity.
------------------------------------------------------------------------------------------
F. Decimal Precision Rules

The system guarantees:

Inputs must have ≤4 decimal places

All computed balances are rounded to 4 decimal places

Big.js is used for all financial arithmetic
-------------------------------------------------------------------------------------------
G. Testing

Test coverage includes:

Wallet creation

Credit/debit operations

Precision validation

Error cases

Concurrency tests (simultaneous updates)
---------------------------------------------------------------------------------------
H. Debugging

Added meaningful logs for debugging , if any issue arises during software development cycle.
-----------------------------------------------------------------------------------------
I have also attached the postman collection.
Just replace baseURL with http://localhost:3000