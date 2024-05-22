# Tugas5_IF4020_Kriptografi_10

## Requirement
1. NPM (for frontend and backend)
2. Python (for cipherblock)

## How to run

1. Clone the repository and change directory

   ```bash
   git clone https://github.com/eiffelaqila/Tugas5_IF4020_Kriptografi_10
   cd Tugas5_IF4020_Kriptografi_10
   ```

2. Open three terminals, terminal 1 for `blockcipher`, terminal 2 for `backend`, and terminal 3 for `frontend`

### Block Cipher API

*) In the root folder.

1. Install requirements

   ```bash
   pip install -r blockcipher/requirements.txt
   ```

2. Run the program from root

   ```bash
   uvicorn blockcipher.main:app --reload
   ```

3. Block cipher API is now running in `http://localhost:8080`

### Backend

1. Change directory to `backend` folder

   ```bash
   cd backend
   ```

2. Install node modules

   ```bash
   npm install
   ```

3. Run the program

   ```bash
   npm run server
   ```

4. Backend API is now running in `http://localhost:5000`

### Frontend

1. Change directory to `frontend` folder

   ```bash
   cd frontend
   ```

2. Install node modules

   ```bash
   npm install
   ```

3. Run the program

   ```bash
   npm run dev
   ```

4. Frontend is now running in `http://localhost:3000`.

5. Use two incognito browsers to access two frontend

## Author
Program ini dikembangkan dalam rangka memenuhi salah satu tugas mata kuliah Kriptografi. Program ini dikembangkan oleh

* 13520074 - Eiffel Aqila Amarendra
* 13520122 - Alifia Rahmah
* 13520125 - Ikmal Alfaozi