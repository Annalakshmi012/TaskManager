@echo off
echo Installing backend dependencies...
cd backend
npm install
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo Setup complete!
echo ---------------
echo 1. Start MongoDB locally or make sure your MongoDB Atlas is running.
echo 2. In backend/.env, set MONGO_URI and JWT_SECRET.
echo 3. Run backend: cd backend && npm run dev
echo 4. Run frontend: cd frontend && npm run dev
pause
