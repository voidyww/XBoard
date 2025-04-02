import admin from "firebase-admin";

const raw = process.env.FIREBASE_ADMIN_SDK || "{}";
const serviceAccount = JSON.parse(raw);

// 🧠 Fix the private key formatting
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();
