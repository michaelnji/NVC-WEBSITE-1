"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHomePage } from "@/components/admin/pages/home"
import { AdminProjectsPage } from "@/components/admin/pages/projects"
import { AdminAboutPage } from "@/components/admin/pages/about"
import { AdminContactPage } from "@/components/admin/pages/contact"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { ButtonAdmin } from "@/components/admin/button-admin"

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [checking, setChecking] = useState(true)
  const [session, setSession] = useState<any>(null)
  const { t } = useLanguage()
  const L = t.admin

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, sess: any) => {
      setSession(sess)
    })
    return () => {
      // @ts-ignore optional unsubscribe
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  if (checking) {
    return (
      <div className=" min-h-screen grid place-items-center bg-background/60 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="text-sm text-muted-foreground">{L.loading}</div>
      </div>
    );
  }

  if (!session) {
    return <LoginInline />
  }
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-background/60 backdrop-blur-sm supports-backdrop-filter:bg-background/60 overflow-hidden overscroll-none">
      <div className="border-b-2 border-border bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="w-full px-4 lg:px-6 py-3">
          <div
            className={`h-14 items-center ${
              sidebarOpen
                ? "lg:grid lg:grid-cols-[210px_1fr]"
                : "lg:grid lg:grid-cols-[0px_1fr]"
            }`}
          >
            <div className="hidden lg:flex items-center relative ">
              <Image
                src="/logo-dark.svg"
                alt="Logo"
                width={140}
                height={36}
                className="h-9 w-auto"
              />
            </div>
            <div className="relative flex items-center justify-end">
              <h1 className="absolute left-1/2 -translate-x-1/2 translate-y-0.5 text-xl md:text-[40px] font-display uppercase tracking-wider leading-none">
                {L.panelTitle}
              </h1>
              <div className="flex items-center gap-3">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outer Tabs: site pages */}
      <Tabs defaultValue="home" className="w-full">
        <div
          className={`w-full px-2 lg:px-4 py-4 grid grid-cols-1 ${
            sidebarOpen ? "lg:grid-cols-[210px_1fr]" : "lg:grid-cols-[0px_1fr]"
          } gap-0 lg:gap-4 h-full overflow-hidden`}
        >
          {/* Sidebar: pages */}
          <aside
            className={`hidden lg:block h-full overflow-hidden border-r-2 border-border ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="h-full flex flex-col pt-0 px-3 pb-3">
              <TabsList className="flex flex-col items-stretch gap-2 bg-transparent w-full h-auto">
                <TabsTrigger
                  value="home"
                  className="justify-start border border-transparent rounded-md px-3 py-2 lg:py-2.5 text-[0.95rem] lg:text-base focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M3 10.5 12 3l9 7.5" />
                      <path d="M5 10v10h14V10" />
                      <path d="M9 21V12h6v9" />
                    </svg>
                    {L.nav.home}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="projets"
                  className="justify-start border border-transparent rounded-md px-3 py-2 lg:py-2.5 text-[0.95rem] lg:text-base focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    {L.nav.projects}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="a-propos"
                  className="justify-start border border-transparent rounded-md px-3 py-2 lg:py-2.5 text-[0.95rem] lg:text-base focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                    </svg>
                    {L.nav.about}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="justify-start border border-transparent rounded-md px-3 py-2 lg:py-2.5 text-[0.95rem] lg:text-base focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M4 4h16v16H4z" />
                      <path d="M22 6 12 13 2 6" />
                    </svg>
                    {L.nav.contact}
                  </span>
                </TabsTrigger>
              </TabsList>
              <div className="mt-auto flex flex-col gap-2">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {L.actions.viewSite}
                </Link>
                <ButtonAdmin
                  confirm
                  confirmTitle={L.actions.logout}
                  confirmMessage={
                    "You are about to log out of the admin panel."
                  }
                  confirmConfirmLabel={"Log out"}
                  confirmCancelLabel={"Cancel"}
                  onClick={async () => {
                    const supabase = createSupabaseBrowserClient();
                    await supabase.auth.signOut();
                  }}
                >
                  {L.actions.logout}
                </ButtonAdmin>
              </div>
            </div>
          </aside>

          {/* Content area */}
          <main className="min-w-0 w-full px-2 lg:px-6 h-full overflow-auto overscroll-contain">
            {/* Mobile page switcher */}
            <div className="lg:hidden mb-4 px-2">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger
                  value="home"
                  className="border border-transparent rounded-md px-2.5 py-2 text-[0.95rem] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M3 10.5 12 3l9 7.5" />
                      <path d="M5 10v10h14V10" />
                      <path d="M9 21V12h6v9" />
                    </svg>
                    {L.nav.home}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="projets"
                  className="border border-transparent rounded-md px-2.5 py-2 text-[0.95rem] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    {L.nav.projects}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="a-propos"
                  className="border border-transparent rounded-md px-2.5 py-2 text-[0.95rem] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                    </svg>
                    {L.nav.about}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="border border-transparent rounded-md px-2.5 py-2 text-[0.95rem] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-brand data-[state=active]:text-white data-[state=active]:border-brand"
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M4 4h16v16H4z" />
                      <path d="M22 6 12 13 2 6" />
                    </svg>
                    {L.nav.contact}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* HOME */}
            <TabsContent value="home" className="mt-0">
              <AdminHomePage />
            </TabsContent>

            {/* PROJETS */}
            <TabsContent value="projets" className="mt-0">
              <AdminProjectsPage />
            </TabsContent>

            {/* A PROPOS */}
            <TabsContent value="a-propos" className="mt-0">
              <AdminAboutPage />
            </TabsContent>

            {/* CONTACT */}
            <TabsContent value="contact" className="mt-0">
              <AdminContactPage />
            </TabsContent>
          </main>
        </div>
      </Tabs>
    </div>
  );
}

function LoginInline() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [failCount, setFailCount] = useState(0)
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)

  // Cooldown remaining in seconds
  const remaining = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)) : 0

  const { t } = useLanguage()
  const L = t.admin.login

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    // Throttle: after 5 fails, wait 30s
    if (cooldownUntil && Date.now() < cooldownUntil) return

    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(L.invalidCredentials)
      setLoading(false)
      const newCount = failCount + 1
      setFailCount(newCount)
      if (newCount >= 5) {
        const until = Date.now() + 30_000
        setCooldownUntil(until)
        // auto-clear cooldown after interval
        setTimeout(() => setCooldownUntil(null), 30_000)
      }
      return
    }
  }

  const onForgot = async () => {
    setError(null)
    setInfo(null)
    if (!email) {
      setError(L.forgotPasswordEmailRequired)
      return
    }
    const supabase = createSupabaseBrowserClient()
    const redirectTo = `${window.location.origin}/admin`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) {
      setError(L.forgotPasswordError)
      return
    }
    setInfo(L.forgotPasswordSuccess)
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background/60 backdrop-blur-sm supports-backdrop-filter:bg-background/60 p-4">
      <div className="w-full max-w-sm rounded-xl border-2 border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <Image
            src="/logo-dark.svg"
            alt="Logo"
            width={128}
            height={32}
            className="h-8 w-auto"
          />
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              {L.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-brand bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              {L.passwordLabel}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[#F15A25]"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          {info && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {info}
            </div>
          )}
          <button
            type="submit"
            disabled={
              loading || (cooldownUntil !== null && Date.now() < cooldownUntil)
            }
            className="w-full rounded-md border border-brand bg-brand text-white px-4 py-2 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? L.submitting
              : remaining > 0
              ? `${L.retryIn} ${remaining}s`
              : L.submit}
          </button>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{L.restricted}</span>
            <button
              type="button"
              onClick={onForgot}
              className="text-brand hover:underline"
            >
              {L.forgotPasswordLink}
            </button>
          </div>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">{L.noSignup}</p>
      </div>
    </div>
  );
}
