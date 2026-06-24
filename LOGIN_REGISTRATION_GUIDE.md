# 🔐 دليل تسجيل الدخول والتسجيل - Astora Backend

## 📡 تشغيل السيرفر أولاً

### على Termux:
```bash
cd astora-backend
npm install --legacy-peer-deps
npm run start:dev
# السيرفر يعمل على: http://localhost:3000
```

### على الكمبيوتر:
```bash
cd astora-backend
npm install --legacy-peer-deps
npm run start:dev
# السيرفر يعمل على: http://localhost:3000
```

---

## 🔑 تسجيل حساب جديد (Register)

### API Endpoint:
```
POST http://localhost:3000/api/v1/auth/register
```

### البيانات المطلوبة:
```json
{
  "email": "test@example.com",
  "name": "اسم المستخدم",
  "username": "username",
  "password": "password123",
  "phone": "+966XXXXXXXXX"
}
```

### مثال بـ cURL:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "أحمد محمد",
    "username": "ahmed123",
    "password": "password123",
    "phone": "+966501234567"
  }'
```

### مثال بـ Postman:
1. Method: `POST`
2. URL: `http://localhost:3000/api/v1/auth/register`
3. Body → raw → JSON:
```json
{
  "email": "test@example.com",
  "name": "أحمد محمد",
  "username": "ahmed123",
  "password": "password123",
  "phone": "+966501234567"
}
```

### الاستجابة:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "أحمد محمد",
    "username": "ahmed123"
  }
}
```

---

## 🔓 تسجيل الدخول (Login)

### API Endpoint:
```
POST http://localhost:3000/api/v1/auth/login
```

### البيانات المطلوبة:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### مثال بـ cURL:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### الاستجابة:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "أحمد محمد",
    "username": "ahmed123"
  }
}
```

---

## 🔄 تجديد الـ Token

### API Endpoint:
```
POST http://localhost:3000/api/v1/auth/refresh
```

### البيانات المطلوبة:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🚪 تسجيل الخروج (Logout)

### API Endpoint:
```
POST http://localhost:3000/api/v1/auth/logout
```

### البيانات المطلوبة:
- Header: `Authorization: Bearer <accessToken>`

---

## 📱 ملاحظات للتطبيق

### 1. حفظ التوكن
```kotlin
// Android/Kotlin
val prefs = context.getSharedPreferences("astora", Context.MODE_PRIVATE)
prefs.edit().putString("accessToken", accessToken).apply()
prefs.edit().putString("refreshToken", refreshToken).apply()
```

### 2. استخدام التوكن في الطلبات
```kotlin
@Headers("Authorization: Bearer $accessToken")
```

### 3. تجديد التوكن تلقائياً
```kotlin
// عندما تنتهي صلاحية accessToken
val newTokens = apiService.refreshToken(refreshToken)
// احفظ التوكن الجديد
```

---

## ⚙️ إعدادات التطبيق

### .env (إنشاء ملف)
```env
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=astora

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=*
```

---

## 🧪 اختبار API

### Swagger Documentation:
```
http://localhost:3000/api/docs
```

### Postman Collection:
```json
{
  "info": {
    "name": "Astora API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/v1/auth/register",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"name\":\"Test\",\"username\":\"test\",\"password\":\"password123\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/v1/auth/login",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
        }
      }
    }
  ]
}
```

---

## ❌ المشاكل الشائعة

### 1. خطأ "User already exists"
- البريد الإلكتروني مستخدم بالفعل
- جرب بريد إلكتروني مختلف

### 2. خطأ "Invalid credentials"
- تحقق من البريد وكلمة المرور
- تأكد من تفعيل الحساب

### 3. خطأ "Connection refused"
- تأكد أن السيرفر يعمل
- تحقق من المنفذ (3000)

### 4. خطأ "jwt must be provided"
- أضف Header: `Authorization: Bearer <token>`

---

## 📞 APIs المتاحة بعد تسجيل الدخول

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | /users/me | بيانات المستخدم |
| GET | /whatsapp/accounts | حسابات واتساب |
| GET | /chat/threads | المحادثات |
| GET | /products | المنتجات |
| POST | /ai/chat | الدردشة مع AI |

---

## 🚀 مثال كامل للتسجيل والدخول

```bash
# 1. تسجيل حساب جديد
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@astora.com","name":"مستخدم تجريبي","username":"demo","password":"demo1234"}'

# 2. تسجيل الدخول
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@astora.com","password":"demo1234"}'

# 3. استخدام التوكن
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
