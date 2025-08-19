import Link from 'next/link';

interface HeaderProps {
  links: {
    discord: { name: string; href: string; }[];
    survival: { name: string; href: string; }[];
    deathmatch: { name: string; href: string; }[];
  };
}

export default function Header({ links }: HeaderProps) {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            IceCode
          </Link>
          <div className="flex space-x-4">
            <div className="relative group">
              <button className="hover:text-blue-400">Discord</button>
              <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded-lg">
                {links.discord.map((link) => (
                  <Link key={link.name} href={link.href} className="block py-1 hover:text-blue-400">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative group">
              <button className="hover:text-blue-400">Survival</button>
              <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded-lg">
                {links.survival.map((link) => (
                  <Link key={link.name} href={link.href} className="block py-1 hover:text-blue-400">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative group">
              <button className="hover:text-blue-400">Deathmatch</button>
              <div className="absolute hidden group-hover:block bg-gray-800 p-2 rounded-lg">
                {links.deathmatch.map((link) => (
                  <Link key={link.name} href={link.href} className="block py-1 hover:text-blue-400">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
