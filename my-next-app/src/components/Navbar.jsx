"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LeafIcon, Menu } from "lucide-react";
import { checkToken } from "@/utils/checkAuth"
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/admin" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" },
  ];


  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const verifyToken = async () => {
      const tokenValid = await checkToken()
      setIsAuthenticated(tokenValid.status)
      setUserData(tokenValid.data);

    }
    verifyToken()
  }, [])


  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-semibold gap-5  text-primary">
              <span className="flex gap-2">
                <LeafIcon className="text-green-600" />
                <p><span className="text-green-600">Green</span>Meal.</p>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))} */}
              <Link href='/' className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href='/login' className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                About Us
              </Link>
              {isAuthenticated ? <> {userData.user.roleName === 'user'? 
                <Link href='/dashboard' className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
              :  <Link href='/admin' className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>}
              </> : ''

              }


              {!isAuthenticated ? <>
                <Link href='/login' className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href='/signup' className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </> : ''}
            </div>
          </div>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleMenu}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-6 flow-root">
                  <div className="space-y-2 py-6">
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
