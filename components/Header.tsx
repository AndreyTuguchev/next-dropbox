"use client"

import { SignedOut, UserButton, SignInButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggler } from "./ThemeToggler"

function Header() {
  return (
    <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className=" w-fit">  {/* bg-[#0160FE]*/}
            <Image src="/next-dropbox-logo.png" alt="logo containing open box collored into dark blue" width={150} height={150} className="skiplazy w-[70px] " />
          </div>
            <h1 className="font-bold text-xl">NextDropbox</h1>
        </Link>
        <div className="px-5 flex space-x-2 items-center">
          {/* Theme toggler */}
          <ThemeToggler></ThemeToggler>

          <UserButton afterSignOutUrl="/"></UserButton>
          <SignedOut>
            <SignInButton afterSignInUrl="/dashboard" mode="modal" />
          </SignedOut>
        </div>
    </header>
  )
}

export default Header