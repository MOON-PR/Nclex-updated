
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Divider from '../gui/Divider'
import dynamic from "next/dynamic";
import { useAuth } from '@/app/context/AuthContext';

const links = [
  { href: '/practice', label: 'Practice' },
  { href: '/courses', label: 'Courses' },
  { href: '/events', label: 'Events' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const { isLoggedIn, logout,user } = useAuth();

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const Modal = dynamic(() => import('./Modal'), {
    ssr: false
  });


  useEffect(() => setMounted(true), []);

  useEffect(() => { }, [showModal]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (<>
    <>
      <header className="header">


        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl tracking-tight transition-all duration-300 hover:scale-105 relative group" style={{ color: 'var(--text)' }}>
            <span className="relative z-10">▲ NCLEX</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-medical-green opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 rounded-lg"></span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex gap-7 items-center">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="group relative text-sm font-semibold transition-all duration-300 hover:scale-105" style={{ color: 'var(--text)' }}>
                {label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2.5px] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${pathname === href ? 'scale-x-100' : ''
                    }`}
                  style={{ background: 'var(--primary)' }}
                />
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>


            {mounted && (
              <button
                onClick={toggleTheme}
                className={`p-1.5 rounded transition-colors ${theme === 'system'
                  ? 'bg-gray-700 text-white hover:bg-gray-800 dark:bg-neutral-500 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800'
                  : theme === 'dark'
                    ? ' bg-neutral-500 text-white hover:bg-neutral-600'
                    : 'bg-gray-700 text-white hover:bg-gray-800'
                  }`}
                aria-label="Toggle theme"
              >
                {theme === 'light' && <Moon size={16} />}
                {theme === 'dark' && <Sun size={16} />}
                {theme === 'system' && <Monitor size={16} />}
              </button>
            )}

          </div>


          <div className="flex items-center gap-4">
            {isLoggedIn  ? (
              <>
                {/* Avatar and Dropdown Wrapper */}
                <div
                  className="relative"
                  onMouseEnter={() => { setIsHovered(true) }}
                  onMouseLeave={() => {setIsHovered(false);}}
                >
                  {/* Avatar Circle */}
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 cursor-pointer bg-white">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : null}

                    {/* Fallback Initial (shows if image is missing or failed) */}
                    <div
                      className="w-full h-full flex items-center justify-center text-black font-bold uppercase"
                      style={{ display: user.image ? 'none' : 'flex' }}
                    >
                      {user.name?.[0]}
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isHovered && (
                    <div className="absolute top-11 right-0 rounded z-50 isHover">
                      <ul className="py-2 text-sm ">
                        <li>
                          <Link href="/" className="block px-4 py-2 dropDownLink ">
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard" className="block px-4 py-2 dropDownLink ">
                            Dashboard
                          </Link>
                        </li>
                        {user.role == 'admin' && (
                          <li>
                            <Link href="/admin" className="block px-4 py-2 dropDownLink ">
                              Admin
                            </Link>
                          </li>
                        )}
                        <li className='dropDownLink'>
                          <button
                            onClick={logout}
                            className="block px-4 py-2 dropDownLink"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>



              </>
            ) : (
              <button
                className="button-primary"
                style={{ padding: '0.65rem 2.2rem', fontSize: '0.9rem' }}
                onClick={() => setShowModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mobileMenu">
            <nav className="flex flex-col gap-4 px-6 py-4">
              {links.map(({ href, label }) => (
                <Link 
                  key={href} 
                  href={href} 
                  className="text-base font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ color: 'var(--text)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {!isLoggedIn && (
                <button
                  className="button-primary mt-2"
                  onClick={() => {
                    setShowModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}

        <Divider />
      </header >
      {showModal && <Modal onClose={() => setShowModal(false)} theme="system" />}
    </>

  </>
  );
}
