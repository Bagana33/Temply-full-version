# Service Role Key Шалгах Заавар

## Асуудал
Service Key-д `role: undefined` байна. Энэ нь **service_role key биш** гэсэн үг.

## Шийдэл

### 1. Supabase Dashboard-аас Service Role Key авна уу

1. https://app.supabase.com руу очно уу
2. Project сонгоно уу: **hrtaescazsisyeftbdln**
3. **Settings** → **API** руу очно уу
4. **Project API keys** хэсэгт:
   - **anon public** key (энэ биш!)
   - **service_role** key (энэ нь зөв!)

5. **service_role** key-ийн хажууд:
   - **"Reveal"** эсвэл **"Copy"** товч дараана уу
   - **Бүх key-ийг хуулна уу** (маш урт байна, `eyJ...` гэж эхэлнэ)

### 2. Key-ийн ялгаа

**Anon Key (буруу):**
- `role: "anon"` байна
- Client-side ашиглана
- Хязгаарлагдсан эрхтэй

**Service Role Key (зөв):**
- `role: "service_role"` байна
- Server-side ашиглана
- Бүх эрхтэй (admin эрх)

### 3. .env.local файл засах

1. `.env.local` файлыг нээнэ уу
2. `SUPABASE_SERVICE_ROLE_KEY=` мөрийг олоно уу
3. **Хуучин key-ийг бүхэлд нь устгана уу**
4. **Шинэ service_role key-ийг оруулна уу**

Жишээ:
```bash
# Буруу (anon key):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydGFlc2NhenNpc3llZnRiZGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0Mzg4MzYsImV4cCI6MjA4MDAxNDgzNn0.2pp74BX7ZaWo8GFk6YHMJPi1yGHJ-hXDX0MV0HVJc_0

# Зөв (service_role key):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydGFlc2NhenNpc3llZnRiZGxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQzODgzNiwiZXhwIjoyMDgwMDE0ODM2fQ.XXXXX
```

**Анхаар:** 
- Key-ийн дунд хэсэгт `cm9sZSI6InNlcnZpY2Vfcm9sZSIs` байх ёстой (service_role)
- `cm9sZSI6ImFub24iLCI=` байвал буруу (anon key)

### 4. Development Server дахин эхлүүлэх

```bash
# Terminal дээр:
# 1. Server зогсоох (Ctrl+C эсвэл Cmd+C)
# 2. Дахин эхлүүлэх:
npm run dev
```

### 5. Шалгах

1. http://localhost:3001/auth/register руу очно уу
2. Бүртгэл үүсгэх оролдлого хийж үзнэ
3. Одоо алдаа гарахгүй байх ёстой

## Хэрэв алдаа одоо ч гарвал

Terminal дээрх алдааны мессежийг надад илгээнэ үү. Би туслах болно!

