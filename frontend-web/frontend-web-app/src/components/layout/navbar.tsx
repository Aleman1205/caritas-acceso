"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  return (
    <nav className="w-full bg-[#0f172a] border-b border-[#1e293b] px-6 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="text-lg font-bold text-blue-400">Cáritas</div>

      {/* Middle: Search */}
      <div className="flex-1 mx-6 max-w-lg">
        <Input
          type="search"
          placeholder="Search"
          className="bg-[#1e293b] text-white border-none focus-visible:ring-2 focus-visible:ring-blue-500"
        />
      </div>

      {/* Right: Avatar + Button */}
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          className="text-white hover:bg-[#1e293b] hover:text-blue-400"
        >
          Iniciar sesión
        </Button>
      </div>
    </nav>
  )
}
