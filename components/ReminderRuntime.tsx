"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type ReminderProfile = {
  id?: string;
  remindersEnabled?: boolean;
  reminderTime?: string;
};

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export default function ReminderRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    let minuteInterval: number | undefined;
    let refreshInterval: number | undefined;
    let stopped = false;
    let loading = false;
    let profile: ReminderProfile | null = null;

    async function checkTime() {
      if (stopped || !profile?.id || !profile.remindersEnabled || !profile.reminderTime) return;
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const [targetHour, targetMinute] = profile.reminderTime.split(":").map(Number);
      if (!Number.isInteger(targetHour) || !Number.isInteger(targetMinute)) return;

      const now = new Date();
      const target = new Date(now);
      target.setHours(targetHour, targetMinute, 0, 0);
      const elapsed = now.getTime() - target.getTime();
      const reminderKey = "naya-reminder:" + profile.id + ":" + localDateKey(now);

      // A reminder can still be shown when the user opens Naya later that day.
      if (elapsed < 0 || elapsed > 4 * 60 * 60 * 1000 || localStorage.getItem(reminderKey)) return;

      const title = "Un petit moment pour toi 🌸";
      const options: NotificationOptions = {
        body: "Tu peux noter ton flux, ton humeur ou tes symptômes dans ton journal Naya.",
        icon: "/icon.svg",
        tag: reminderKey,
      };

      const registration = "serviceWorker" in navigator
        ? await navigator.serviceWorker.getRegistration()
        : undefined;

      if (registration) {
        await registration.showNotification(title, options);
      } else {
        new Notification(title, options);
      }
      localStorage.setItem(reminderKey, "sent");
    }

    async function refreshPreferences() {
      if (stopped || loading) return;
      loading = true;
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        if (!response.ok) {
          profile = null;
          return;
        }
        const data = await response.json();
        profile = data?.profile as ReminderProfile | undefined ?? null;
        await checkTime();
      } catch (error) {
        console.warn("Naya reminder preferences unavailable", error);
      } finally {
        loading = false;
      }
    }

    const onPreferencesChanged = () => { void refreshPreferences(); };
    window.addEventListener("naya:reminders-changed", onPreferencesChanged);
    window.addEventListener("focus", onPreferencesChanged);

    void refreshPreferences();
    minuteInterval = window.setInterval(() => {
      void checkTime().catch((error) => console.warn("Naya reminder unavailable", error));
    }, 60 * 1000);
    refreshInterval = window.setInterval(onPreferencesChanged, 5 * 60 * 1000);

    return () => {
      stopped = true;
      window.removeEventListener("naya:reminders-changed", onPreferencesChanged);
      window.removeEventListener("focus", onPreferencesChanged);
      if (minuteInterval !== undefined) window.clearInterval(minuteInterval);
      if (refreshInterval !== undefined) window.clearInterval(refreshInterval);
    };
  }, [pathname]);

  return null;
}
