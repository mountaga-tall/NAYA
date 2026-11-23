"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    let intervalId: number | undefined;
    let stopped = false;

    async function initialise() {
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        const profile = data?.profile as ReminderProfile | undefined;
        if (!profile?.id || !profile.remindersEnabled || !profile.reminderTime) return;

        const [targetHour, targetMinute] = profile.reminderTime.split(":").map(Number);
        if (!Number.isInteger(targetHour) || !Number.isInteger(targetMinute)) return;

        let checking = false;
        const checkTime = async () => {
          if (stopped || checking) return;
          checking = true;

          try {
            const now = new Date();
            const target = new Date(now);
            target.setHours(targetHour, targetMinute, 0, 0);
            const elapsed = now.getTime() - target.getTime();
            const reminderKey = "naya-reminder:" + profile.id + ":" + localDateKey(now);

            if (elapsed >= 0 && elapsed < 20 * 60 * 1000 && !localStorage.getItem(reminderKey)) {
              const title = "Un petit moment pour toi 🌸";
              const options: NotificationOptions = {
                body: "Tu peux noter ton flux, ton humeur ou tes symptômes dans ton journal Naya.",
                icon: "/icon.svg",
                tag: reminderKey,
                renotify: false,
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
          } catch (error) {
            console.warn("Naya reminder could not be displayed", error);
          } finally {
            checking = false;
          }
        };

        await checkTime();
        intervalId = window.setInterval(checkTime, 60 * 1000);
      } catch (error) {
        console.warn("Naya reminder preferences unavailable", error);
      }
    }

    void initialise();

    return () => {
      stopped = true;
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
