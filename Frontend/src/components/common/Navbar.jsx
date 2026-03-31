import React, { useState } from 'react';
import { Search, Globe, User, Menu, X } from 'lucide-react';
import { mockData } from '../../data/mockData';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IP</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">InvestPro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {mockData.navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-secondary hover:text-primary font-medium text-sm transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-48">
            <Search size={18} className="text-secondary" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent ml-2 outline-none text-sm w-full text-primary placeholder-secondary"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex">
              <Globe size={20} className="text-secondary" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex">
              <User size={20} className="text-secondary" />
            </button>
            <button className="btn btn-primary hidden sm:inline-block">
              Get Started
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col gap-3 mt-4">
              {mockData.navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-secondary hover:text-primary font-medium text-sm px-2 py-2"
                >
                  {item.label}
                </a>
              ))}
              <button className="btn btn-primary w-full mt-2">Get Started</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
