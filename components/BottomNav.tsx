"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    name: "Accueil",
    path: "/accueil",
    icon: "🏠",
  },
  {
    name: "Calendrier",
    path: "/calendrier",
    icon: "📅",
  },
  {
    name: "Journal",
    path: "/journal",
    icon: "➕",
  },
  {
    name: "Insights",
    path: "/insights",
    icon: "📊",
  },
  {
    name: "Profil",
    path: "/profil",
    icon: "👤",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E7DDD8] bg-white">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-semibold transition ${
                active
                  ? "text-[#D96C5B]"
                  : "text-[#2C1A16]/40"
              }`}
            >
              <span
                className={`text-xl ${
                  active ? "scale-110" : ""
                }`}
              >
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
