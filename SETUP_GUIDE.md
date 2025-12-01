# Temply Setup Guide (Монгол)

## ✅ 1. Schema Суусан

Schema амжилттай суусан! Одоо дараах алхмуудыг хийх хэрэгтэй.

## 🔍 2. Schema Шалгах

Supabase SQL Editor-д энэ query ажиллуулж хүснэгтүүд үүссэн эсэхийг шалгана уу:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Харагдах ёстой хүснэгтүүд:
- users
- templates
- purchases
- downloads
- membership
- cart_items
- payouts
- reviews
- posts
- profiles
- follows

## 🔑 3. Environment Variables Тохируулах

### 3.1 Supabase Dashboard-аас Keys авна уу

1. https://app.supabase.com руу очно уу
2. Таны project-ийг сонгоно уу
3. Settings → API руу очно уу
4. Дараах утгуудыг хуулна уу:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (НУУЦЛАХ!)

### 3.2 .env.local файл үүсгэх

Project root-д `.env.local` файл үүсгэж, дараах агуулгыг оруулна уу:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Анхаар:** `.env.local` файлыг git-д commit хийхгүй байх!

## 🚀 4. Development Server Ажиллуулах

```bash
npm install
npm run dev
```

Server http://localhost:3001 дээр ажиллана.

## ✅ 5. Шалгах

### 5.1 Бүртгэл үүсгэх тест

1. http://localhost:3001/auth/register руу очно уу
2. Шинэ бүртгэл үүсгэнэ уу
3. Supabase Dashboard → Authentication → Users руу очоод хэрэглэгч үүссэн эсэхийг шалгана уу

### 5.2 Database шалгах

Supabase Dashboard → Table Editor руу очоод:
- `users` хүснэгтэд хэрэглэгч үүссэн эсэхийг шалгана уу
- `profiles` хүснэгтэд профайл үүссэн эсэхийг шалгана уу

## 🔒 6. Row Level Security (RLS) Шалгах

RLS policies зөв тохируулагдсан эсэхийг шалгана уу:

1. Supabase Dashboard → Authentication → Policies руу очно уу
2. Бүх хүснэгтүүдэд policies байгаа эсэхийг шалгана уу

## 📝 7. Дараагийн Алхмууд

- ✅ Schema суусан
- ✅ Environment variables тохируулах
- ⏳ Бүртгэл үүсгэх тест
- ⏳ Нэвтрэх тест
- ⏳ Загвар үүсгэх тест
- ⏳ Сагс функц тест

## 🆘 Асуудал гарвал

1. **Environment variables алдаа:** `.env.local` файл зөв тохируулагдсан эсэхийг шалгана уу
2. **RLS алдаа:** Supabase Dashboard → Authentication → Policies руу очоод шалгана уу
3. **Connection алдаа:** Supabase Dashboard → Settings → API-аас URL болон keys зөв эсэхийг шалгана уу

Амжилт хүсье! 🚀

