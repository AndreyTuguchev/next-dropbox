import { UserButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <main className="">
        <h1>Next Level Dropbox</h1>
        <UserButton />
    </main>
  )
}
