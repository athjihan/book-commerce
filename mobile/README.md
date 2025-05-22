
# 📱 Frontend Mobile – Book Commerce

Proyek ini merupakan bagian frontend dari aplikasi **Book Commerce** yang dibangun menggunakan **React Native**, **Expo**, dan **NativeWind**.

## 🛠️ Teknologi yang Digunakan

- **React Native** `v0.79.2`  
- **Expo** `v53`  
- **NativeWind** `v4.1`  

## 🚀 Cara Menjalankan Aplikasi

1. Masuk ke folder `mobile`:
   ```bash
   cd mobile
   ```

2. Install semua dependencies:
   ```bash
   npm install
   ```

3. Menjalankan aplikasi:

   - 📱 **Android**:
     ```bash
     npm run android
     ```

   - 🍏 **iOS**:
     ```bash
     npm run ios
     ```

   - 🌐 **Web**:
     ```bash
     npm run web
     ```

   - Atau gunakan Expo CLI:
     ```bash
     npx expo start
     ```

## 📁 Struktur Folder (Ringkasan)

```
mobile/
├── App/
│   ├── components/
│   │   └── card.tsx
│   ├── utils/
│   │   └── imageMap.ts
│   ├── _layout.tsx
│   ├── Global.css
│   └── index.tsx
├── Assets/
│   ├── cover/
│   ├── Fonts/
│   └── Images/
├── Services/
│   ├── catalogService.js
│   ├── detailService.js
│   └── searchService.js
├── App.json
├── .gitignore
├── babel.config.json
├── eslint.config.json
├── metro.config.json
├── nativewind-env.d.ts
├── package-lock.json
├── package.json
├── react-native-vector-icons.d.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## ⚙️ Environment Configuration

Buat file `app.config.js` untuk menyimpan konfigurasi endpoint API:

```js
export default{
   expo: {
      extra : {
      BOOK_SEARCH_API = "YOUR_API";
      BOOK_DISPLAY_API = "YOUR_API";
      BOOK_DETAIL_API = "YOUR_API";
      },
   },
};
```

> Pastikan untuk tidak menyimpan data sensitif secara langsung di dalam repositori publik.

---

### 👥 Created by: **Team Skelebel**
