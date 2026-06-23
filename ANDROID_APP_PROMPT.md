# 🚀 PROMPT: بناء تطبيق Astora Android متكامل

## 📱 نظرة عامة

بناء تطبيق Android احترافي لإدارة منصة Astora Backend مع واجهة مستخدم حديثة باستخدام Jetpack Compose.

---

## 🎯 المتطلبات الأساسية

### 1. تشغيل Backend على Termux

```bash
# تثبيت Termux من F-Droid (النسخة الصحيحة)
# تثبيت Python و Git
pkg update && pkg upgrade
pkg install python git openssh

# استنساخ المشروع
git clone https://github.com/0o0shadow0o0/astora-backend.git
cd astora-backend

# تثبيت التبعيات
npm install --legacy-peer-deps

# تشغيل السيرفر
npm run start:dev

# سيرفر التشغيل: http://localhost:3000
```

### 2. إعداد Android Studio

```
- Android Studio Hedgehog (2023.1.1) أو أحدث
- Kotlin 1.9.x
- Java 17
- Compose BOM 2024.02.00
- Min SDK: 26 | Target SDK: 34
```

---

## 🏗️ هيكل المشروع

```
astora-android/
├── app/
│   └── src/main/
│       ├── java/com/astora/app/
│       │   ├── data/
│       │   │   ├── api/
│       │   │   │   ├── ApiClient.kt
│       │   │   │   ├── ApiService.kt
│       │   │   │   └── AuthInterceptor.kt
│       │   │   ├── model/
│       │   │   │   ├── User.kt
│       │   │   │   ├── Chat.kt
│       │   │   │   ├── Message.kt
│       │   │   │   ├── Contact.kt
│       │   │   │   ├── WhatsAppAccount.kt
│       │   │   │   ├── Product.kt
│       │   │   │   ├── Order.kt
│       │   │   │   └── Customer.kt
│       │   │   └── repository/
│       │   │       ├── AuthRepository.kt
│       │   │       ├── ChatRepository.kt
│       │   │       ├── WhatsAppRepository.kt
│       │   │       └── StoreRepository.kt
│       │   ├── di/
│       │   │   └── AppModule.kt
│       │   ├── ui/
│       │   │   ├── theme/
│       │   │   │   ├── Color.kt
│       │   │   │   ├── Type.kt
│       │   │   │   └── Theme.kt
│       │   │   ├── navigation/
│       │   │   │   ├── NavGraph.kt
│       │   │   │   └── Screen.kt
│       │   │   ├── components/
│       │   │   │   ├── ChatBubble.kt
│       │   │   │   ├── ContactItem.kt
│       │   │   │   ├── ProductCard.kt
│       │   │   │   └── CommonComponents.kt
│       │   │   ├── auth/
│       │   │   │   ├── LoginScreen.kt
│       │   │   │   └── RegisterScreen.kt
│       │   │   ├── home/
│       │   │   │   └── HomeScreen.kt
│       │   │   ├── chat/
│       │   │   │   ├── ChatListScreen.kt
│       │   │   │   └── ChatDetailScreen.kt
│       │   │   ├── whatsapp/
│       │   │   │   ├── WhatsAppAccountsScreen.kt
│       │   │   │   └── QRScannerScreen.kt
│       │   │   ├── store/
│       │   │   │   ├── ProductsScreen.kt
│       │   │   │   ├── ProductDetailScreen.kt
│       │   │   │   ├── OrdersScreen.kt
│       │   │   │   └── CartScreen.kt
│       │   │   └── settings/
│       │   │       └── SettingsScreen.kt
│       │   └── AstoraApp.kt
│       └── res/
│           └── values/
│               └── strings.xml
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

---

## 📋 PROMPT الكامل

### 🎨 الواجهة الأمامية (UI)

#### 1. الثيم والألوان

```kotlin
// Color.kt
val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)
val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)

// ألوان التطبيق
val AstoraGreen = Color(0xFF25D366)  // WhatsApp green
val AstoraBlue = Color(0xFF007AFF)  // iOS blue
val DarkBackground = Color(0xFF121212)
val LightBackground = Color(0xFFFFFBFE)
```

#### 2. شاشة تسجيل الدخول

```
البنية:
┌─────────────────────────────┐
│         🔐 Astora           │
│                             │
│    ┌─────────────────┐      │
│    │  البريد الإلكتروني │      │
│    └─────────────────┘      │
│    ┌─────────────────┐      │
│    │    كلمة المرور    │      │
│    └─────────────────┘      │
│                             │
│    [      تسجيل الدخول      ] │
│                             │
│    ليس لديك حساب؟ تسجيل     │
└─────────────────────────────┘
```

#### 3. الشاشة الرئيسية

```
┌─────────────────────────────┐
│ ☰  Astora          👤 🔔  │
├─────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │ 💬  │ │ 📱  │ │ 🛒  │  │
│  │الشات │ │واتساب│ │المتجر│  │
│  └─────┘ └─────┘ └─────┘  │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │ 📊  │ │ 📅  │ │ ⚙️  │  │
│  │AI   │ │الجدول│ │الإعدادات│ │
│  └─────┘ └─────┘ └─────┘  │
├─────────────────────────────┤
│  📱 الحسابات connected: 2    │
│  ┌─────────────────────┐    │
│  │ 📱 +966XXXXXXXX     │    │
│  │ 🟢 متصل             │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

#### 4. شاشة المحادثات

```
┌─────────────────────────────┐
│ ← المحادثات          🔍 🔴  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🔍 بحث في المحادثات...   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 👤 أحمد محمد             │ │
│ │ مرحباً، كيف حالك؟       │ │
│ │ 14:30                   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 👤 سارة علي             │ │
│ │ أنا جاهزة للاجتماع       │ │
│ │ 13:45              🔴 2 │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 👤 شركة XYZ             │ │
│ │ طلب #1234 تم شحنه ✓    │ │
│ │ 12:00                   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

#### 5. شاشة تفاصيل المحادثة

```
┌─────────────────────────────┐
│ ← 👤 أحمد محمد    📞 📹 ⋮  │
├─────────────────────────────┤
│                             │
│      ┌─────────────────┐    │
│      │ مرحباً! كيف حالك │    │
│      │      14:30      │    │
│      └─────────────────┘    │
│                             │
│      ┌─────────────────┐    │
│      │ أنا بخير، شكراً │    │
│      │      14:31      │    │
│      └─────────────────┘    │
│                             │
│      ┌─────────────────┐    │
│      │ هل تريد ترتيب   │    │
│      │ اجتماع غداً؟    │    │
│      │      14:32      │    │
│      └─────────────────┘    │
│                             │
├─────────────────────────────┤
│ 📎  Type a message...   📷 │
└─────────────────────────────┘
```

---

## 🔌 اتصال API

### Base URL (للتشغيل على Termux)

```kotlin
object ApiConfig {
    // عند تشغيل محلياً على Termux
    const val BASE_URL = "http://localhost:3000/api/v1/"
    
    // عند التشغيل على شبكة LAN
    // const val BASE_URL = "http://192.168.1.x:3000/api/v1/"
}
```

### Endpoints

```kotlin
// Authentication
POST   /auth/login
POST   /auth/register
POST   /auth/refresh
POST   /auth/logout

// Users
GET    /users/me
PUT    /users/me
GET    /users

// WhatsApp
GET    /whatsapp/accounts
POST   /whatsapp/accounts
PUT    /whatsapp/accounts/{id}
DELETE /whatsapp/accounts/{id}
POST   /whatsapp/accounts/{id}/connect
POST   /whatsapp/accounts/{id}/disconnect
GET    /whatsapp/accounts/{id}/qr

// Chat
GET    /chat/threads
GET    /chat/threads/{id}
GET    /chat/threads/{id}/messages
POST   /chat/threads/{id}/messages
POST   /chat/{id}/send-message
POST   /chat/{id}/send-media
POST   /chat/{id}/mark-read

// Contacts
GET    /contacts
POST   /contacts
PUT    /contacts/{id}
DELETE /contacts/{id}

// Store
GET    /products
GET    /products/{id}
POST   /products
PUT    /products/{id}
DELETE /products/{id}
GET    /orders
POST   /orders
GET    /orders/{id}
GET    /customers

// AI
POST   /ai/chat
GET    /ai/conversations

// Scheduler
GET    /scheduler/tasks
POST   /scheduler/tasks
PUT    /scheduler/tasks/{id}
DELETE /scheduler/tasks/{id}
```

---

## 🛠️ الكود الكامل

### 1. ApiClient.kt

```kotlin
package com.astora.app.data.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .addInterceptor(AuthInterceptor())
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(ApiConfig.BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
```

### 2. ApiService.kt

```kotlin
package com.astora.app.data.api

import com.astora.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    
    // Auth
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
    
    @POST("auth/refresh")
    suspend fun refreshToken(@Body request: RefreshRequest): Response<AuthResponse>
    
    // WhatsApp
    @GET("whatsapp/accounts")
    suspend fun getWhatsAppAccounts(): Response<List<WhatsAppAccount>>
    
    @POST("whatsapp/accounts/{id}/connect")
    suspend fun connectWhatsApp(@Path("id") id: String): Response<QRResponse>
    
    @POST("whatsapp/send-message")
    suspend fun sendMessage(@Body request: SendMessageRequest): Response<MessageResponse>
    
    // Chat
    @GET("chat/threads")
    suspend fun getChatThreads(): Response<List<ChatThread>>
    
    @GET("chat/threads/{id}/messages")
    suspend fun getMessages(@Path("id") threadId: String): Response<List<Message>>
    
    @POST("chat/{id}/send-message")
    suspend fun sendMessage(@Path("id") threadId: String, @Body request: SendMessageRequest): Response<Message>
    
    // Contacts
    @GET("contacts")
    suspend fun getContacts(): Response<List<Contact>>
    
    // Store
    @GET("products")
    suspend fun getProducts(): Response<List<Product>>
    
    @GET("orders")
    suspend fun getOrders(): Response<List<Order>>
    
    // AI
    @POST("ai/chat")
    suspend fun chatWithAI(@Body request: AIChatRequest): Response<AIChatResponse>
}
```

### 3. LoginScreen.kt (Jetpack Compose)

```kotlin
@Composable
fun LoginScreen(
    viewModel: AuthViewModel = viewModel(),
    onLoginSuccess: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Logo
        Text(
            text = "🔐 Astora",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary
        )
        
        Spacer(modifier = Modifier.height(48.dp))
        
        // Email Field
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("البريد الإلكتروني") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Password Field
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("كلمة المرور") },
            leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
            trailingIcon = { Icon(Icons.Default.Visibility, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation()
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Login Button
        Button(
            onClick = { viewModel.login(email, password) },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = Color.White
                )
            } else {
                Text("تسجيل الدخول", style = MaterialTheme.typography.titleMedium)
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Register Link
        TextButton(onClick = { /* Navigate to register */ }) {
            Text("ليس لديك حساب؟ سجل الآن")
        }
        
        // Error Message
        uiState.error?.let { error ->
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}
```

### 4. ChatListScreen.kt

```kotlin
@Composable
fun ChatListScreen(
    viewModel: ChatViewModel = viewModel(),
    onChatClick: (String) -> Unit
) {
    val threads by viewModel.threads.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.loadThreads()
    }
    
    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        TopAppBar(
            title = { Text("المحادثات") },
            actions = {
                IconButton(onClick = { /* Search */ }) {
                    Icon(Icons.Default.Search, contentDescription = "بحث")
                }
            }
        )
        
        // Chat List
        LazyColumn {
            items(threads) { thread ->
                ChatListItem(
                    thread = thread,
                    onClick = { onChatClick(thread.id) }
                )
            }
        }
    }
}

@Composable
fun ChatListItem(
    thread: ChatThread,
    onClick: () -> Unit
) {
    ListItem(
        headlineContent = { Text(thread.contactName) },
        supportingContent = { Text(thread.lastMessage) },
        leadingContent = {
            Box {
                Icon(
                    Icons.Default.AccountCircle,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp)
                )
                if (thread.unreadCount > 0) {
                    Badge(
                        containerColor = MaterialTheme.colorScheme.primary
                    ) {
                        Text(thread.unreadCount.toString())
                    }
                }
            }
        },
        trailingContent = {
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    thread.lastMessageTime,
                    style = MaterialTheme.typography.bodySmall
                )
            }
        },
        modifier = Modifier.clickable(onClick = onClick)
    )
}
```

### 5. WhatsApp Accounts Screen

```kotlin
@Composable
fun WhatsAppAccountsScreen(
    viewModel: WhatsAppViewModel = viewModel()
) {
    val accounts by viewModel.accounts.collectAsState()
    val qrCode by viewModel.qrCode.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.loadAccounts()
    }
    
    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = { Text("حسابات WhatsApp") }
        )
        
        // Add Account Button
        Button(
            onClick = { viewModel.createAccount() },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Icon(Icons.Default.Add, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("إضافة حساب جديد")
        }
        
        // Accounts List
        LazyColumn {
            items(accounts) { account ->
                WhatsAppAccountItem(
                    account = account,
                    onConnect = { viewModel.connectAccount(account.id) },
                    onDisconnect = { viewModel.disconnectAccount(account.id) }
                )
            }
        }
        
        // QR Code Dialog
        qrCode?.let { qr ->
            AlertDialog(
                onDismissRequest = { viewModel.clearQR() },
                title = { Text("امسح رمز QR") },
                text = {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        // QR Code Image
                        Image(
                            painter = rememberAsyncImagePainter(qr),
                            contentDescription = "QR Code",
                            modifier = Modifier.size(250.dp)
                        )
                        Text(
                            "امسح هذا الرمز باستخدام WhatsApp على هاتفك",
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                },
                confirmButton = {
                    TextButton(onClick = { viewModel.clearQR() }) {
                        Text("إغلاق")
                    }
                }
            )
        }
    }
}
```

---

## 📦 المكتبات المطلوبة (build.gradle.kts)

```kotlin
dependencies {
    // Core Android
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Compose
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.7")
    
    // Hilt
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")
    
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Coil for images
    implementation("io.coil-kt:coil-compose:2.5.0")
    
    // DataStore
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.02.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

---

## 🔧 إعدادات الشبكة (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_CONTACTS" />

<application
    android:usesCleartextTraffic="true"
    ...>
    
    <!-- للسماح بـ HTTP (ليس HTTPS) عند التشغيل المحلي -->
    <activity ...>
        <intent-filter>
            <action android:name="android.intent.action.MAIN"/>
            ...
        </intent-filter>
    </activity>
</application>
```

---

## 🚀 التشغيل

### 1. تشغيل Backend على Termux

```bash
# فتح Termux
cd astora-backend
npm install
npm run start:dev

# ملاحظة: تأكد أن الهاتف والكمبيوتر على نفس الشبكة
# واحصل على IP الكمبيوتر: ifconfig
```

### 2. تشغيل التطبيق

```bash
# Android Studio
Open Project -> astora-android
Sync Project with Gradle Files
Run -> Run 'app'
```

### 3. ملاحظات مهمة

- **Localhost:** استخدم `http://10.0.2.2:3000` من المحاكي (AVD)
- **Real Device:** استخدم IP الشبكة المحلية للكمبيوتر
- **Termux:** تأكد من تثبيت OpenSSH وتشغيله
- **Firewall:** أوقف الجدار الناري مؤقتاً أو افتح المنفذ 3000

---

## 📱 ميزات إضافية مقترحة

1. **الإشعارات Push** - Firebase Cloud Messaging
2. **الرسائل الصوتية** - MediaPlayer + Recording
3. **مشاركة الملفات** - FileProvider
4. **الوضع الليلي** - Dark Theme
5. **التخزين المحلي** - Room Database
6. **Biometric Auth** - Fingerprint

---

## 🎯 ملخص

هذا الـ Prompt يوفر لك تطبيق Android كامل متكامل مع Astora Backend:
- ✅ تسجيل دخول/تسجيل
- ✅ إدارة حسابات WhatsApp
- ✅ المحادثات والرسائل
- ✅ إدارة المتجر
- ✅ الذكاء الاصطناعي
- ✅ إعدادات التطبيق

**انسخ هذا الـ Prompt في Claude/GPT وابدأ البناء! 🚀**
