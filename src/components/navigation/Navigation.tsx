import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SignOutButton from "../SignOutButton.tsx"
import { ThemeToggle } from "@/components/ThemeToggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between px-4 py-2">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-6">
                <Link
                    to="/"
                    className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300"
                >
                    Home
                </Link>
                <Link
                    to="/prescription"
                    className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300"
                >
                    New Prescription
                </Link>
                <Link
                    to="/enterprise"
                    className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300"
                >
                    Hospital Settings
                </Link>
                <ThemeToggle />
                <SignOutButton />
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link to="/">Home</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/prescription">New Prescription</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/enterprise">Hospital Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <ThemeToggle />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SignOutButton />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
