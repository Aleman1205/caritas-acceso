"use client"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  return (
    <nav className="w-full bg-[#0f172a] border-b border-[#1e293b] px-6 py-3 flex items-center justify-between">
      <div className="text-lg font-bold text-blue-400">Cáritas</div>

      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}
