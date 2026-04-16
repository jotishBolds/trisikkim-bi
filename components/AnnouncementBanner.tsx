"use client";

import { useEffect, useRef, useState } from "react";
import { Megaphone } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  link?: string | null;
}

export default function AnnouncementBanner() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) setItems(d.data);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="w-full bg-[#1a1550] border-b border-white/10 flex items-center overflow-hidden"
      style={{ height: 36 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="shrink-0 flex items-center gap-1.5 bg-[#f4c430] px-3 h-full z-10">
        <Megaphone className="w-3.5 h-3.5 text-[#1a1550]" />
        <span className="text-[#1a1550] text-[11px] font-bold uppercase tracking-widest whitespace-nowrap hidden sm:block">
          Notice
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div
          ref={trackRef}
          className="flex items-center gap-0 whitespace-nowrap"
          style={{
            animation: paused
              ? "marquee 40s linear infinite paused"
              : "marquee 40s linear infinite",
          }}
        >
          {repeated.map((item, idx) => (
            <span
              key={`${item.id}-${idx}`}
              className="inline-flex items-center"
            >
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-[#f4c430] text-[12px] transition-colors duration-200 underline-offset-2 hover:underline cursor-pointer px-6"
                >
                  {item.title}
                </a>
              ) : (
                <span className="text-white/90 text-[12px] px-6">
                  {item.title}
                </span>
              )}

              <span className="text-[#f4c430]/50 text-[10px] select-none">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
