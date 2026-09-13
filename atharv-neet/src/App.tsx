import { useEffect, useState } from "react"

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Home,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings,
  Star,
  Target,
  Trash2,
  UserRound,
} from "lucide-react"

import { Button } from "./ui/button"

type Page =
  | "Home"
  | "Tasks"
  | "Syllabus"
  | "Tests"
  | "Materials"
  | "Analytics"
  | "Focus Timer"
  | "Saved"
  | "Trash"
  | "Settings"

const navigation = [
  { label: "Home" as Page, icon: Home },
  { label: "Tasks" as Page, icon: CheckSquare },
  { label: "Syllabus" as Page, icon: BookOpen },
  { label: "Tests" as Page, icon: ClipboardCheck },
  { label: "Materials" as Page, icon: FileText },
  { label: "Analytics" as Page, icon: BarChart3 },
]

const personal = [
  { label: "Saved" as Page, icon: Star },
  { label: "Trash" as Page, icon: Trash2 },
]

function App() {
  const [page, setPage] = useState<Page>("Home")

  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [subject, setSubject] = useState("Physics")

  useEffect(() => {
    if (!isRunning) return

    const interval = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isRunning])

  function resetTimer() {
    setIsRunning(false)
    setSeconds(0)
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="flex min-h-screen">

        {/* ================= SIDEBAR ================= */}

        <aside className="flex w-[250px] shrink-0 flex-col border-r border-zinc-800/80 bg-[#0c0c0f]">

          {/* Workspace Header */}
          <div className="flex h-[72px] items-center border-b border-zinc-800/80 px-4">

            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-zinc-800/50">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-950">
                P
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-semibold text-zinc-100">
                  PreMed
                </p>

                <p className="truncate text-xs text-zinc-500">
                  Study workspace
                </p>

              </div>

              <ChevronDown className="h-4 w-4 text-zinc-500" />

            </button>

          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-5">

            {/* Workspace */}
            <div className="mb-7">

              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Workspace
              </p>

              <nav className="space-y-0.5">

                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = page === item.label

                  return (
                    <SidebarButton
                      key={item.label}
                      icon={Icon}
                      active={active}
                      onClick={() => setPage(item.label)}
                    >
                      {item.label}
                    </SidebarButton>
                  )
                })}

              </nav>

            </div>

            {/* Tools */}
            <div className="mb-7">

              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Tools
              </p>

              <nav className="space-y-0.5">

                <SidebarButton
                  icon={Target}
                  active={page === "Focus Timer"}
                  onClick={() => setPage("Focus Timer")}
                >
                  Focus Timer
                </SidebarButton>

              </nav>

            </div>

            {/* Personal */}
            <div>

              <div className="mb-2 flex items-center justify-between px-2">

                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                  Personal
                </p>

                <button className="text-zinc-600 transition-colors hover:text-zinc-300">
                  <Plus className="h-3.5 w-3.5" />
                </button>

              </div>

              <nav className="space-y-0.5">

                {personal.map((item) => {
                  const Icon = item.icon

                  return (
                    <SidebarButton
                      key={item.label}
                      icon={Icon}
                      active={page === item.label}
                      onClick={() => setPage(item.label)}
                    >
                      {item.label}
                    </SidebarButton>
                  )
                })}

              </nav>

            </div>

          </div>

          {/* Sidebar Bottom */}
          <div className="border-t border-zinc-800/80 p-3">

            <SidebarButton
              icon={Settings}
              active={page === "Settings"}
              onClick={() => setPage("Settings")}
            >
              Settings
            </SidebarButton>

            <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <UserRound className="h-3.5 w-3.5 text-zinc-500" />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium text-zinc-300">
                  Student
                </p>

                <p className="text-[11px] text-zinc-600">
                  Personal account
                </p>

              </div>

            </div>

          </div>

        </aside>

        {/* ================= MAIN ================= */}

        <main className="min-w-0 flex-1">

          {/* Top Bar */}
          <header className="flex h-[72px] items-center justify-between border-b border-zinc-800/80 px-8">

            <div>

              <p className="text-xs font-medium text-zinc-600">
                {page === "Focus Timer" ? "Tools" : "Workspace"}
              </p>

              <h1 className="mt-0.5 text-sm font-medium text-zinc-200">
                {page}
              </h1>

            </div>

            <div className="flex items-center gap-2">

              <Button
                variant="outline"
                className="h-8 gap-2 border-zinc-800 bg-transparent text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Today
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <Settings className="h-4 w-4" />
              </Button>

            </div>

          </header>

          {/* ================= PAGE CONTENT ================= */}

          {page === "Home" && (
            <HomePage
              onOpenTimer={() => setPage("Focus Timer")}
            />
          )}

          {page === "Focus Timer" && (
            <FocusTimerPage
              seconds={seconds}
              isRunning={isRunning}
              subject={subject}
              setSubject={setSubject}
              setIsRunning={setIsRunning}
              resetTimer={resetTimer}
            />
          )}

          {page !== "Home" && page !== "Focus Timer" && (
            <PlaceholderPage title={page} />
          )}

        </main>

      </div>
    </div>
  )
}

/* ========================================================= */
/* SIDEBAR BUTTON */
/* ========================================================= */

type SidebarButtonProps = {
  icon: typeof Home
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function SidebarButton({
  icon: Icon,
  active,
  onClick,
  children,
}: SidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`h-9 w-full justify-start gap-3 rounded-md px-3 text-sm font-medium ${
        active
          ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100"
          : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200"
      }`}
    >
      <Icon
        className="h-[17px] w-[17px]"
        strokeWidth={1.8}
      />

      {children}
    </Button>
  )
}

/* ========================================================= */
/* HOME */
/* ========================================================= */

function HomePage({
  onOpenTimer,
}: {
  onOpenTimer: () => void
}) {
  return (
    <section className="mx-auto max-w-6xl px-8 py-10">

      {/* Welcome */}
      <div className="mb-8">

        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
          Overview
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Your preparation,
          <br />
          in one place.
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
          Plan your study, stay ahead of your tests, and understand
          where your preparation needs attention.
        </p>

      </div>

      {/* Progress */}
      <div className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-5">

        <div className="mb-6 flex items-start justify-between">

          <div>

            <p className="text-sm font-medium text-zinc-200">
              Preparation progress
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Your syllabus completion over time
            </p>

          </div>

          <Button
            variant="ghost"
            className="h-8 gap-2 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          >
            View analytics
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>

        </div>

        <div className="relative h-[300px] overflow-hidden rounded-lg border border-zinc-800/70 bg-[#09090b]">

          <div className="absolute inset-0 flex flex-col justify-between px-12 py-6">

            <div className="border-t border-zinc-800/60" />
            <div className="border-t border-zinc-800/60" />
            <div className="border-t border-zinc-800/60" />
            <div className="border-t border-zinc-800/60" />
            <div className="border-t border-zinc-800/60" />

          </div>

          <div className="absolute left-3 top-6 bottom-6 flex flex-col justify-between text-[10px] text-zinc-700">

            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>

          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
              <BarChart3 className="h-4 w-4 text-zinc-700" />
            </div>

            <p className="text-sm text-zinc-400">
              Your progress graph will appear here
            </p>

            <p className="mt-1 max-w-sm text-center text-xs leading-5 text-zinc-600">
              Start tracking your syllabus to see how your preparation
              changes over time.
            </p>

          </div>

        </div>

      </div>

      {/* Focus summary */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-[#0c0c0f] p-5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              <Target className="h-5 w-5 text-zinc-500" />
            </div>

            <div>

              <p className="text-sm font-medium text-zinc-200">
                Focus Timer
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Start a focused study session and record your time.
              </p>

            </div>

          </div>

          <Button
            onClick={onOpenTimer}
            variant="outline"
            className="h-9 gap-2 border-zinc-800 bg-transparent text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            Open timer
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>

        </div>

      </div>

      {/* Today's Plan + Exam */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">

        <div className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-5 lg:col-span-2">

          <p className="text-sm font-medium text-zinc-200">
            Today
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Your study plan
          </p>

          <div className="mt-6 flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800">

            <CheckSquare className="mb-3 h-5 w-5 text-zinc-700" />

            <p className="text-sm text-zinc-400">
              Nothing planned yet
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Your tasks will appear here.
            </p>

          </div>

        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#0c0c0f] p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-zinc-200">
                Exam
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Target date
              </p>

            </div>

            <Target className="h-4 w-4 text-zinc-600" />

          </div>

          <div className="mt-10">

            <p className="text-2xl font-semibold text-zinc-200">
              Not set
            </p>

            <p className="mt-2 text-xs leading-5 text-zinc-600">
              Set your target exam date to unlock your countdown.
            </p>

          </div>

        </div>

      </div>

    </section>
  )
}

/* ========================================================= */
/* FOCUS TIMER PAGE */
/* ========================================================= */

type FocusTimerPageProps = {
  seconds: number
  isRunning: boolean
  subject: string
  setSubject: (subject: string) => void
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
  resetTimer: () => void
}

function FocusTimerPage({
  seconds,
  isRunning,
  subject,
  setSubject,
  setIsRunning,
  resetTimer,
}: FocusTimerPageProps) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedTime = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ].join(":")

  return (
    <section className="mx-auto max-w-5xl px-8 py-10">

      {/* Header */}
      <div className="mb-10">

        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
          Focus
        </p>

        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Focus Timer
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
          Put everything else aside and focus on one subject at a time.
          Your study sessions can later become part of your analytics.
        </p>

      </div>

      {/* Timer */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0c0c0f]">

        <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12">

          {/* Status */}
          <div className="mb-8 flex items-center gap-2">

            <div
              className={`h-2 w-2 rounded-full ${
                isRunning ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            />

            <span className="text-xs text-zinc-500">
              {isRunning ? "Session in progress" : "Ready to focus"}
            </span>

          </div>

          {/* Timer */}
          <div className="font-mono text-7xl font-medium tracking-[-0.04em] text-zinc-100 sm:text-8xl">
            {formattedTime}
          </div>

          <p className="mt-5 text-sm text-zinc-500">
            {isRunning
              ? `Studying ${subject}`
              : "Choose a subject and start your session"}
          </p>

          {/* Subject */}
          <div className="mt-10">

            <label className="mb-2 block text-center text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              Subject
            </label>

            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={isRunning}
              className="h-10 min-w-[180px] rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-center text-sm text-zinc-300 outline-none transition-colors focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
              <option>Other</option>
            </select>

          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-3">

            <Button
              onClick={() => setIsRunning((current) => !current)}
              className="h-11 min-w-[120px] gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start
                </>
              )}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              className="h-11 gap-2 border-zinc-800 bg-transparent px-4 text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

          </div>

        </div>

        {/* Timer Footer */}
        <div className="grid border-t border-zinc-800 sm:grid-cols-3">

          <TimerStat
            label="Today's focus"
            value="0h 0m"
          />

          <TimerStat
            label="Sessions"
            value="0"
          />

          <TimerStat
            label="Current subject"
            value={subject}
          />

        </div>

      </div>

      {/* Future history */}
      <div className="mt-4 rounded-xl border border-zinc-800 bg-[#0c0c0f] p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm font-medium text-zinc-200">
              Session history
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Your completed focus sessions will appear here.
            </p>

          </div>

          <ClockIcon />

        </div>

        <div className="mt-5 flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-zinc-800">

          <p className="text-xs text-zinc-600">
            No completed sessions yet.
          </p>

        </div>

      </div>

    </section>
  )
}

/* ========================================================= */
/* TIMER STAT */
/* ========================================================= */

function TimerStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="px-5 py-4">

      <p className="text-[11px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-zinc-300">
        {value}
      </p>

    </div>
  )
}

/* ========================================================= */
/* PLACEHOLDER */
/* ========================================================= */

function PlaceholderPage({
  title,
}: {
  title: string
}) {
  return (
    <section className="mx-auto max-w-6xl px-8 py-10">

      <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
        Workspace
      </p>

      <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
        {title}
      </h2>

      <p className="mt-3 text-sm text-zinc-500">
        This workspace will be built next.
      </p>

    </section>
  )
}

/* ========================================================= */
/* CLOCK */
/* ========================================================= */

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-600"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  )
}

export default App