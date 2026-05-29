# Panduan Deploy ke Vercel (SweetTreats Bakery) 🍰✨

Halo Sweetie! Jangan khawatir, aplikasi ini sudah dikonfigurasi secara optimal untuk dideploy ke **Vercel** tanpa error. 

Aplikasi ini menggunakan arsitektur **Hybrid Serverless** yang sempurna:
- **Frontend SPA (Vite):** Dideploy sebagai halaman statis super cepat.
- **AI Chatbot (Serverless API):** Dijalankan pada Serverless Node.js Function di `/api/chat.ts`.
- **Database (Supabase):** Mendukung sinkronisasi penuh, namun jika kunci tidak dimasukkan, aplikasi akan berjalan sangat lancar dalam **Demo Mode** dengan penyimpanan lokal!

---

## ⚡ Langkah Mudah Deploy ke Vercel (1-Click)

### Langkah 1: Hubungkan ke GitHub
1. Upload kode proyek SweetTreats Anda ke repository **GitHub** pribadi atau publik Anda.

### Langkah 2: Buat Project Baru di Vercel
1. Masuk ke [Vercel Dashboard](https://vercel.com/) dan klik **Add New > Project**.
2. Pilih repository GitHub proyek SweetTreats Anda.

### Langkah 3: Konfigurasi Proyek di Vercel
1. **Framework Preset:** Pilih `Vite` (maka Vercel akan otomatis menyetel Build Command: `npm run build` dan Output Directory: `dist`).
2. **Environment Variables (Sangat Penting!):**
   Masukkan variabel-variabel berikut di bagian *Environment Variables* Vercel demi fungsi yang lengkap:

| Nama Variabel | Deskripsi | Kebutuhan |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Kunci API Gemini Anda untuk Chatbot AI | Masukkan kunci nyata untuk obrolan pintar, atau biarkan kosong untuk **Offline Mode** |
| `VITE_SUPABASE_URL` | URL Proyek Supabase Anda | Masukkan jika ingin fitur database nyata, atau biarkan kosong untuk **Demo Mode** |
| `VITE_SUPABASE_ANON_KEY` | Kunci Publik Anonim Supabase Anda | Masukkan jika ingin fitur database nyata, atau biarkan kosong untuk **Demo Mode** |

3. Klik tombol **Deploy**! 🎉

---

## 🔍 Solusi Ketika Menemui Error "Failed to fetch"

Jika Anda menemui kendala `"Failed to fetch"` saat menguji aplikasi:

1. **Error Chatbot AI:**
   - **Penyebab:** Terjadi apabila token API Gemini Anda tidak sah, mencapai limit gratis, atau Anda deploy tanpa memasukkan `GEMINI_API_KEY`.
   - **Solusi:** Sistem kami telah dilengkapi penanganan fallback yang luar biasa! Jika kunci tidak disetel atau error, Chef Sweetie secara otomatis berpindah ke **Baking Offline Mode** dan akan tetap menjawab pertanyaan resep Anda dengan ramah!

2. **Error Database Supabase:**
   - **Penyebab:** Sebagian browser memblokir request ke domain placeholder atau server lokal jika pengaturan diletakkan sembarangan.
   - **Solusi:** Kami telah menyempurnakan `isDemoMode` agar mendeteksi otomatis ketiadaan kunci, sehingga database berganti total menggunakan **LocalStorage** lokal milik browser Anda. Anda tetap bisa mencoba membuat resep, menambah kategori, dan memberi bookmark ❤️ tanpa membutuhkan setup database eksternal!

---

Semangat membaking, Sweetie! Jika Anda membutuhkan bantuan tambahan atau penyesuaian visual, silakan tanyakan kepada Chef Sweetie! 🍰✨
