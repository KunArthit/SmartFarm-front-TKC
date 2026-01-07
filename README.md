SmartFarm Frontend (TKC)
========================
⚙️ Installation
----------------
ก่อนเริ่มต้น ตรวจสอบให้แน่ใจว่ามีการติดตั้ง Bun แล้ว
ถ้ายังไม่มี สามารถติดตั้งได้โดยคำสั่ง:

curl -fsSL https://bun.sh/install | bash

จากนั้นให้ clone โปรเจกต์แล้วติดตั้ง dependencies:

git clone https://github.com/<your-username>/SmartFarm-frontend-TKC.git
cd SmartFarm-frontend-TKC
bun install


🧠 Environment Variables
-------------------------
สร้างไฟล์ .env.local ที่ root ของโปรเจกต์
ตัวอย่าง:

NEXT_PUBLIC_API_BASE_URL=https://api.smartfarm-tkc.com
NEXT_PUBLIC_MAP_API_KEY=YOUR_MAP_KEY_HERE


💻 Development
---------------
เริ่มรันโปรเจกต์ในโหมดพัฒนา:

bun run dev

จะสามารถเข้าถึงได้ที่:
http://localhost:5173


🏗️ Build for Production
------------------------
bun run build
bun run start

หรือ deploy ขึ้น production environment เช่น Vercel, Netlify, หรือ Docker


🧪 Scripts
-----------
คำสั่ง         | คำอธิบาย
----------------|----------------------------------
bun run dev     | รันเซิร์ฟเวอร์โหมดพัฒนา
bun run build   | Build โปรเจกต์สำหรับ production
bun run start   | เริ่มรันเซิร์ฟเวอร์ production
bun run lint    | ตรวจสอบ code style และ lint error


📦 Deployment
--------------
สามารถ deploy ได้หลายรูปแบบ เช่น:

✅ Vercel (แนะนำ)
- เชื่อม GitHub repository กับ Vercel
- ระบบจะ build และ deploy อัตโนมัติ

🐳 Docker
สร้าง Dockerfile เช่น:

FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
