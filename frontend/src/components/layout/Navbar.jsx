import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Menu, X, ShieldCheck } from 'lucide-react';
import { navLinks } from '../../data/navigation';
import { useTheme } from '../../hooks/useTheme';

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container-shell pt-3">
        <nav className="glass-panel rounded-2xl px-4 py-3 md:px-6 md:py-3.5 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-accent-500" />
            <span className="text-sm md:text-base">Fake News Detector</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-accent-600 dark:text-indigo-300' : 'text-slate-600 hover:text-accent-600 dark:text-slate-300 dark:hover:text-indigo-300'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              className="md:hidden rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass-panel rounded-2xl px-4 py-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-50 text-accent-600 dark:bg-slate-800 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
