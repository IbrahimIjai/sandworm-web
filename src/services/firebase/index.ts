import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

import seedDatabase from "../localDb/seed";

let db;
let auth;

function initAdminApp() {
  if (admin.apps.length) {
    return admin.apps[0];
  }

  if (
    process.env.NODE_ENV === "development" &&
    !process.env.GOOGLE_APPLICATION_CREDENTIALS
  ) {
    console.log("🔥 Firebase: dev env");
    admin.initializeApp({
      projectId: "sandworm-8aa45",
      storageBucket: "sandworm-8aa45.appspot.com",
    });

    return admin.apps[0];
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const decoded = Buffer.from(
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
      "base64"
    ).toString("utf-8");

    const serviceAccount = JSON.parse(decoded);

    if (!serviceAccount) {
      throw new Error("❌ Firebase service account not found");
    }

    console.log("🔥 Firebase: prod env with service account");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "sandworm-8aa45.appspot.com",
    });

    return admin.apps[0];
  }

  throw new Error("❌ Firebase init failed: No credentials or env match");
}

const app = initAdminApp();

// Firestore + Emulator config
db = getFirestore();

if (
  process.env.FIRESTORE_EMULATOR_HOST &&
  process.env.NODE_ENV !== "production"
) {
  console.log("🧪 Firestore emulator enabled");
  try {
    db.settings({ host: "localhost:8080", ssl: false });
  } catch (e: any) {
    if (!e.message.includes("settings()")) {
      console.error("🔥 Firestore emulator settings error:", e);
    }
  }

  // Seed DB once after emulator is up
  seedDatabase().then(() => console.log("🌱 Seeded DB"));
}

auth = getAuth();

export { admin, auth, db, app };
