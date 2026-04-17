# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.


===== PENJELASAN ENDPOINT ====
1. POST api/gacha/users (untuk membuat user baru)
  {
    email,
    password,
    full_name: fullName,
    confirm_password: confirmPassword,
  }

2. GET api/gacha/users (mendapatkan informasi semua users)

3. GET api/gacha/users/winners (mendapatkan list pemenang)

4. GET api/gacha/prizes/status (mendapatkan list hadiah dan ketersediaanya)

5. POST api/gacha/prizes/roll (untuk melakukan gacha sebanyak 5x per hari)

6. GET api/gacha/prizes/history/all (untuk mendapatkan history gacha semua users)

7. GET api/gacha/prizes/history/:email ( untuk mendapatkan history gacha user tertentu)
