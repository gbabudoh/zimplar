"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-z-red p-1.5 rounded-lg shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-z-red">
              Zimplar
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-z-gray hover:text-z-red font-medium transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/about"
              className="text-z-gray hover:text-z-red font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-z-red font-bold hover:text-z-red/80 transition-colors cursor-pointer"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-z-red text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-z-red/90 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
            >
              Create Account
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-z-red p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              href="/courses"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-lg font-medium text-z-gray border-b border-z-blue/30"
            >
              Courses
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-lg font-medium text-z-gray border-b border-z-blue/30"
            >
              About
            </Link>
            <div className="pt-4 space-y-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-3 rounded-xl font-bold text-z-red border-2 border-z-red/10 cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-z-red text-white py-3 rounded-xl font-bold cursor-pointer shadow-lg"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
