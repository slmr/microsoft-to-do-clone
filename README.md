# Microsoft to do clone

Aplikasi task manager sederhana dibuat menyerupai [Microsoft To Do](https://todo.microsoft.com/tasks/).

## Fitur
- Login menggunakan Akun Google
- Mobile responsive
- Dark mode 🌙
- Drag and drop task
- Pengelompokan berdasarkan list
- Mendukung subtask

## Tech
Aplikasi ini dibangun dengan menggunakan tech stack sebagai berikut:
- [Next.js](https://nextjs.org)
- [Chakra-ui](https://chakra-ui.com)
- [Firebase](https://firebase.google.com)
- [Typescript](https://www.typescriptlang.org)

## Instalasi

Clone repository dengan memasukan perintah pada terminal:

```sh
git clone https://github.com/slmr/microsoft-to-do-clone.git
```

Instal dependency
```sh
npm install
```

Setup Firebase
Ubah nama file `.env.local.example` menjadi `.env.local`
Ubah isi file configurasi pada `.env.local` dengan menyamakan denagn Firebase SDK snippet configurasi yang dapat dilihat pada Project settings [Firebase console](https://console.firebase.google.com/)

Menjalankan server `development`
```sh
npm run dev
```
Verifikasi development server dengan navigasi ke [http://localhost:3000](http://localhost:3000) pada browser.

Menjalankan server `production`
```sh
npm run start
```

## Deploy ke Vercel

Cara termudah untuk mendeploy aplikasi ini yaitu dengan menggunakan layanan [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## License
MIT