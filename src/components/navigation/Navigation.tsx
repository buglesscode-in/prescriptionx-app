import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import SignOutButton from '../SignOutButton.tsx';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Pill, LayoutDashboard, FileText, PlusCircle, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Templates', path: '/templates', icon: FileText },
    { label: 'New Prescription', path: '/prescription', icon: PlusCircle },
    { label: 'Hospital Settings', path: '/enterprise', icon: Building2 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight text-foreground">
            Prescription<span className="text-primary">X</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <div className="h-6 w-px bg-border mx-2" />
          <SignOutButton />
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center w-full cursor-pointer',
                      location.pathname === item.path &&
                        'bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <div className="h-px bg-border my-2" />
              <DropdownMenuItem asChild>
                <div className="w-full">
                  <SignOutButton />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
