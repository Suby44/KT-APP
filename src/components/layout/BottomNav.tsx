import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Today", icon: "🌸", end: true },
  { to: "/calendar", label: "Calendar", icon: "📅", end: false },
  { to: "/insights", label: "Insights", icon: "📊", end: false },
  { to: "/settings", label: "Settings", icon: "⚙️", end: false },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 border-t border-bloom-100 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {tabs.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  isActive ? "text-bloom-600" : "text-neutral-400"
                }`
              }
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
