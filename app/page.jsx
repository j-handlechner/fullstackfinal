import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LogoutButton from '../components/LogoutButton'
import { redirect } from 'next/navigation'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if(user !== null) {
    redirect('/groups')
  }
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-16">
        <p className="text-white p-3">fullstack challenge</p>
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                Hey, {user.email}!
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <div className="flex flex-col items-center mb-4 lg:mb-12">
          <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
          <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
            Fullstack Development Challenge{' '}
            <strong>Divvyup</strong> rebuild
          </p>
        </div>

        <Link
          href="/login"
          className="py-2 px-4 rounded-md w-4/12 scale-120 self-center text-xl bg-white text-black text-center no-underline bg-btn-background hover:bg-gray-500"
        >
          Login
        </Link>

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        <div className="flex flex-col gap-8 text-foreground">
          <h2 className="text-lg font-bold text-center">
            Von Johannes Handlechner und Alexander Buchner
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
          </div>
        </div>

        <div className="flex justify-center text-center text-xs">
          <p>
            Powered by{' '}
            <Link
              href="https://supabase.com/"
              target="_blank"
              className="font-bold"
            >
              Supabase
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
