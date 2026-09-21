import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function app() {
  return getApps().find(app => app.name === "pmb-admin") || initializeApp({
    credential: applicationDefault(),
    ...(process.env.FIREBASE_PROJECT_ID ? { projectId: process.env.FIREBASE_PROJECT_ID } : {}),
  }, "pmb-admin");
}

export const collections = {
  content: "LandingPageContent", admins: "LandingPageAdmins", attempts: "LandingPageLoginAttempts", audit: "LandingPageAudit", sessions: "LandingPageSessions",
};
export function database() { return getFirestore(app(), process.env.FIRESTORE_DATABASE_ID || "(default)"); }
export function firebaseAuth() { return getAuth(app()); }
export function webApiKey() {
  const config = process.env.FIREBASE_WEBAPP_CONFIG;
  const key = process.env.FIREBASE_WEB_API_KEY || (config ? JSON.parse(config).apiKey : undefined);
  if (!key) throw new Error("FIREBASE_WEB_API_KEY belum dikonfigurasi.");
  return key as string;
}
