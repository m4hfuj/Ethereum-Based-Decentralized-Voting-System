# Ethereum-Based Decentralized Voting System

#### This project introduces a secure, transparent, and tamper-resistant solution for modern elections by harnessing the power of Ethereum blockchain technology. It allows users to vote remotely while ensuring voter anonymity and safeguarding against fraud or manipulation. By eliminating centralized control, the system promotes trust and accountability in the electoral process, making it a reliable foundation for future democratic practices.


## 🚀 Features
- 🔐 Implements JWT for secure voter authentication and authorization.
- ⛓️ Uses Ethereum blockchain to ensure transparent and immutable voting records.
- ⚖️ Eliminates the need for intermediaries, enabling a trustless voting process.
- 🛠️ Admin panel for managing candidates, setting election timelines, and monitoring results.
- 🧑‍💻 User-friendly interface for voters to cast votes and access candidate details.


## 🧰 Requirements
- Node.js (v22.14.0)
- Python (v3.10.16)
- Metamask Browser Extension
- FastAPI
- MySQL (Port: 3306)
- Ganache
- Truffle



## ⚙️ Installation

1. Clone the repository:

       git clone https://github.com/m4hfuj/Ethereum-Based-Decentralized-Voting-System.git

2. Download and install Ganache from: [Ganache](https://trufflesuite.com/ganache/)

3. Open Ganache and create a new workspace named `development`.
   In the Truffle Projects section, click `ADD PROJECT` and select the `truffle-config.js` file from the cloned repository.

4. Download and install the MetaMask browser extension: [MetaMask](https://metamask.io/download/)

5. Create a new wallet in MetaMask (if you don’t have one), then import accounts from Ganache using the private keys.

6. Add a new custom network in MetaMask with the following details:
       
       Network Name: Localhost 7575
       RPC URL: http://localhost:7545
       Chain ID: 1337
       Currency Symbol: ETH


7. Open XAMPP and start MySQL. Create a new database named `voter_db`.

8. Inside the `voter_db` database, create a table named `voters` using the following SQL:

       CREATE TABLE voters (
           voter_id VARCHAR(36) PRIMARY KEY NOT NULL,
           role ENUM('admin', 'user') NOT NULL,
           password VARCHAR(255) NOT NULL
       );

   Add some sample records manually for testing.

9. Install Truffle globally:

       npm install -g truffle


10. Navigate to the root directory of the cloned project and install Node.js dependencies:

       npm install


11. Install required Python packages:

       pip install fastapi mysql-connector-python pydantic python-dotenv uvicorn uvicorn[standard] PyJWT



## 💻 Usage

#### Note: Update the database credentials in the `./Database_API/.env` file.

1. Open a terminal in the project root directory.

2. Launch Ganache and open the `development` workspace.

3. In the project root terminal, enter the Truffle console:

       truffle console

   Inside the console, compile the smart contracts:

       compile

   After compilation, exit the Truffle console:

       .exit

4. Bundle `app.js` using Browserify:

       browserify ./src/js/app.js -o ./src/dist/app.bundle.js

5. Start the Node.js server:

       node index.js

6. Open a new terminal window and navigate to the `Database_API` folder:

       cd Database_API

   Then start the FastAPI backend server:

       uvicorn main:app --reload --host 127.0.0.1

7. In another terminal window, migrate the Truffle contracts to the local blockchain:

       truffle migrate


You're all set! The Voting app should be up and running at http://localhost:8080/.<br>

