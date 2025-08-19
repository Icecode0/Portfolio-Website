import React from 'react';
import Link from 'next/link';

type NavDropdownProps = {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
};

export const NavDropdown = ({ title, items }: NavDropdownProps) => (
  <div className="relative group">
    <button className="px-4 py-2 hover:text-gray-300 font-medium">
      {title}
    </button>
    <div className="absolute hidden group-hover:block w-48 bg-gray-800 rounded-md shadow-lg">
      {items.map((item) => (
        <Link 
          key={item.label}
          href={item.href}
          className="block px-4 py-2 text-sm hover:bg-gray-700"
        >
          {item.label}
        </Link>
      ))}
    </div>
  </div>
);