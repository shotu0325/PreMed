import { useEffect, useMemo, useState } from "react"
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileUp,
  FolderOpen,
  Home,
  ListTodo,
  MoreHorizontal,
  Play,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  ExternalLink,
  Upload,
  X,
  Plus,
  LogOut,
  Mail,
  LockKeyhole,
  User,
  Menu,
} from "lucide-react"

import { Button } from "./ui/button"
import { syllabusBySubject } from "./data/syllabus"
import { supabase } from "./lib/supabase"

/* =========================================================
   TYPES
========================================================= */

type Page =
  | "Home"
  | "Syllabus"
  | "Tests"
  | "Materials"
  | "Analytics"
  | "Focus Timer"
  | "Saved"
  | "Trash"
  | "Settings"

type Subject = "Physics" | "Chemistry" | "Biology"

type TestType =
  | "Coaching"
  | "Self Test"
  | "Mock Test"
  | "Other"

type TestStatus =
  | "upcoming"
  | "pending"
  | "completed"
  | "missed"

type TestTarget = {
  id: string
  title: string
  completed: boolean
  source: "preset" | "custom"
}

type MaterialType = "YouTube" | "Website" | "PDF / Document" | "Other"

type PersonalMaterial = {
  id: string
  title: string
  type: MaterialType
  url: string
  subject?: Subject
  chapter?: string
  reminderDate?: string
  reminderTime?: string
  completed: boolean
}

type Test = {
  id: string
  name: string
  date: string
  time: string
  type: TestType
  subjects: Subject[]
  chapters: Partial<Record<Subject, string[]>>
  targets?: TestTarget[]
  status: TestStatus
  createdAt: string
}


type TestResult = {
  id: string
  testId: string
  totalMarks: number
  physicsMarks: number
  chemistryMarks: number
  biologyMarks: number
  correct: number
  incorrect: number
  unattempted: number
  accuracy: number
  rank?: number
  createdAt: string
}

type ActivityName =
  | "Theory"
  | "Module"
  | "NCERT"
  | "PYQs"
  | "Practice / DPP"
  | "Chapter Test"
  | "Revision"

type SyllabusActivity = {
  completed: boolean
  custom: boolean
}

type ActivityState = Record<
  string,
  SyllabusActivity
>

/* =========================================================
   CONSTANTS
========================================================= */

const SUBJECTS: Subject[] = [
  "Physics",
  "Chemistry",
  "Biology",
]

const TEST_CHAPTER_OPTIONS: Record<Subject, string[]> = {
  Physics: (syllabusBySubject.Physics ?? []).map((chapter) => chapter.name),
  Chemistry: (syllabusBySubject.Chemistry ?? []).map((chapter) => chapter.name),
  Biology: (syllabusBySubject.Biology ?? []).map((chapter) => chapter.name),
}

const TARGET_MATERIAL_OPTIONS = [
  "PYQs",
  "Mistake Book",
  "DPP",
  "Module",
  "NCERT",
  "Theory / Notes",
  "Revision",
  "Practice Questions",
  "Previous Test Analysis",
]

const DEFAULT_ACTIVITIES: ActivityName[] = [
  "Theory",
  "Module",
  "NCERT",
  "PYQs",
  "Practice / DPP",
  "Chapter Test",
  "Revision",
]

/* =========================================================
   HELPERS
========================================================= */

function generateId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function getTestDate(test: Test) {
  // A test time is optional. Use midnight for date calculations when no time is set.
  return new Date(`${test.date}T${test.time || "00:00"}`)
}

function getDaysRemaining(test: Test) {
  const now = new Date()
  const testDate = getTestDate(test)

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  const target = new Date(
    testDate.getFullYear(),
    testDate.getMonth(),
    testDate.getDate()
  )

  return Math.round(
    (target.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  )
}

function formatTestDate(test: Test) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(getTestDate(test))
}

function formatTestTime(test: Test) {
  if (!test.time) return "Time not set"

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(getTestDate(test))
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  page,
  setPage,
  userEmail,
  onLogout,
}: {
  page: Page
  setPage: (page: Page) => void
  userEmail: string
  onLogout: () => void
}) {
  const workspace = [
    {
      label: "Home",
      icon: Home,
    },
    {
      label: "Syllabus",
      icon: BookOpen,
    },
    {
      label: "Tests",
      icon: CalendarDays,
    },
    {
      label: "Materials",
      icon: FolderOpen,
    },
    {
      label: "Analytics",
      icon: BarChart3,
    },
  ] as const

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-[#090909] px-4 py-5 text-white md:block">
      <div className="mb-8 px-2">
        <div className="text-lg font-semibold tracking-tight">
          PreMed
        </div>

        <div className="mt-1 text-xs text-white/40">
          NEET preparation workspace
        </div>
      </div>

      <div className="space-y-7">
        <div>
          <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
            Workspace
          </div>

          <div className="space-y-1">
            {workspace.map((item) => {
              const Icon = item.icon
              const active = page === item.label

              return (
                <button
                  key={item.label}
                  onClick={() => setPage(item.label)}
                  className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                  />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
            Tools
          </div>

          <button
            onClick={() => setPage("Focus Timer")}
            className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition ${
              page === "Focus Timer"
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Clock3
              size={16}
              strokeWidth={1.8}
            />
            Focus Timer
          </button>
        </div>

        <div>
          <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/30">
            Personal
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setPage("Saved")}
              className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm ${
                page === "Saved"
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BookOpen size={16} />
              Saved
            </button>

            <button
              onClick={() => setPage("Trash")}
              className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm ${
                page === "Trash"
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Trash2 size={16} />
              Trash
            </button>
          </div>
        </div>

        <button
          onClick={() => setPage("Settings")}
          className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm ${
            page === "Settings"
              ? "bg-white/10 text-white"
              : "text-white/55 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Settings size={16} />
          Settings
        </button>
      </div>

      <div className="absolute bottom-5 left-4 right-4 border-t border-white/10 pt-4">
        <div className="mb-2 truncate px-2 text-[11px] text-white/25" title={userEmail}>
          {userEmail}
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm text-white/45 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

/* =========================================================
   MOBILE HEADER
========================================================= */

function MobileHeader({
  page,
  setPage,
  userEmail,
  onLogout,
}: {
  page: Page
  setPage: (page: Page) => void
  userEmail: string
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const items: { label: Page; icon: typeof Home }[] = [
    { label: "Home", icon: Home },
    { label: "Syllabus", icon: BookOpen },
    { label: "Tests", icon: CalendarDays },
    { label: "Materials", icon: FolderOpen },
    { label: "Analytics", icon: BarChart3 },
    { label: "Focus Timer", icon: Clock3 },
    { label: "Saved", icon: BookOpen },
    { label: "Trash", icon: Trash2 },
    { label: "Settings", icon: Settings },
  ]

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[#090909]/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold tracking-tight">PreMed</div>
          <div className="truncate text-[10px] text-white/30">{page}</div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Open navigation"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="grid grid-cols-2 gap-1">
            {items.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setPage(label); setOpen(false) }}
                className={`flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-left text-xs ${
                  page === label ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={15} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="max-w-[70%] truncate text-[10px] text-white/25">{userEmail}</span>
            <button type="button" onClick={onLogout} className="flex items-center gap-1.5 text-xs text-white/45 hover:text-white">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-white/30">
          {eyebrow}
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
          {description}
        </p>
      )}
    </div>
  )
}

/* =========================================================
   PENDING TEST CARD
========================================================= */

function PendingTestCard({
  test,
  onGave,
  onMissed,
}: {
  test: Test
  onGave: () => void
  onMissed: () => void
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div>
          <div className="mb-2">
            <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-amber-300">
              Needs confirmation
            </span>
          </div>

          <h3 className="text-base font-medium">
            Did you give this test?
          </h3>

          <p className="mt-1 text-sm text-white/45">
            {test.name} was scheduled for{" "}
            {formatTestDate(test)} at{" "}
            {formatTestTime(test)}.
          </p>
        </div>

        <Clock3
          size={18}
          className="shrink-0 text-white/30"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:flex">
        <Button
          onClick={onGave}
          className="h-9 bg-white text-black hover:bg-white/90"
        >
          <Check size={15} />
          I gave the test
        </Button>

        <Button
          onClick={onMissed}
          variant="outline"
          className="h-9 border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
        >
          <X size={15} />
          I missed it
        </Button>
      </div>
    </div>
  )
}

/* =========================================================
   NEXT TEST CARD
========================================================= */

function NextTestCard({
  test,
}: {
  test: Test
}) {
  const days = getDaysRemaining(test)

  let countdown = ""

  if (days === 0) {
    countdown = "Today"
  } else if (days === 1) {
    countdown = "Tomorrow"
  } else {
    countdown = `${days} days`
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div>
          <div className="mb-2 text-xs text-white/35">
            {test.type}
          </div>

          <h2 className="text-lg font-medium">
            {test.name}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/45">
            <span>{formatTestDate(test)}</span>
            <span className="text-white/20">
              •
            </span>
            <span>{formatTestTime(test)}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(test.subjects ?? []).map((subject) => (
              <span
                key={subject}
                className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/50"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-3xl font-semibold tracking-tight">
            {days}
          </div>

          <div className="mt-1 text-xs text-white/35">
            {countdown}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   ADD TEST FORM
========================================================= */

function AddTestForm({
  onAdd,
}: {
  onAdd: (test: Test) => void
}) {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("09:00")
  const [type, setType] =
    useState<TestType>("Coaching")
  const [subjects, setSubjects] = useState<
    Subject[]
  >([])
  const [chapters, setChapters] = useState<
    Partial<Record<Subject, string[]>>
  >({})

  const [targets, setTargets] = useState<TestTarget[]>([])
  const [targetSelection, setTargetSelection] = useState("")
  const [customTarget, setCustomTarget] = useState("")

  function addTarget(title: string, source: "preset" | "custom") {
    const value = title.trim()
    if (!value) return

    setTargets((current) =>
      current.some(
        (target) => target.title.toLowerCase() === value.toLowerCase()
      )
        ? current
        : [
            ...current,
            {
              id: generateId(),
              title: value,
              completed: false,
              source,
            },
          ]
    )
  }

  function addSelectedTarget() {
    if (!targetSelection) return
    addTarget(targetSelection, "preset")
    setTargetSelection("")
  }

  function addCustomTarget() {
    if (!customTarget.trim()) return
    addTarget(customTarget, "custom")
    setCustomTarget("")
  }

  function removeTarget(id: string) {
    setTargets((current) =>
      current.filter((target) => target.id !== id)
    )
  }

  function toggleSubject(subject: Subject) {
    setSubjects((current) => {
      const next = current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]

      if (!next.includes(subject)) {
        setChapters((currentChapters) => {
          const nextChapters = { ...currentChapters }
          delete nextChapters[subject]
          return nextChapters
        })
      }

      return next
    })
  }

  function addChapter(subject: Subject) {
    setChapters((current) => ({
      ...current,
      [subject]: [...(current[subject] ?? []), ""],
    }))
  }

  function updateChapter(
    subject: Subject,
    index: number,
    value: string
  ) {
    setChapters((current) => ({
      ...current,
      [subject]: (current[subject] ?? []).map((chapter, chapterIndex) =>
        chapterIndex === index ? value : chapter
      ),
    }))
  }

  function removeChapter(subject: Subject, index: number) {
    setChapters((current) => ({
      ...current,
      [subject]: (current[subject] ?? []).filter(
        (_, chapterIndex) => chapterIndex !== index
      ),
    }))
  }

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!name.trim()) {
      alert("Please enter a test name.")
      return
    }

    if (!date) {
      alert("Please select a test date.")
      return
    }

    if (subjects.length === 0) {
      alert("Please select at least one subject.")
      return
    }

    const cleanedChapters: Partial<Record<Subject, string[]>> = {}

    for (const subject of subjects) {
      const subjectChapters = (chapters[subject] ?? [])
        .map((chapter) => chapter.trim())
        .filter(Boolean)

      cleanedChapters[subject] = subjectChapters
    }

    onAdd({
      id: generateId(),
      name: name.trim(),
      date,
      time,
      type,
      subjects,
      chapters: cleanedChapters,
      targets,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    })

    setName("")
    setDate("")
    setTime("09:00")
    setType("Coaching")
    setSubjects([])
    setChapters({})
    setTargets([])
    setTargetSelection("")
    setCustomTarget("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-white/[0.02] p-5"
    >
      <div className="mb-5">
        <h3 className="text-sm font-medium">
          Add a test
        </h3>

        <p className="mt-1 text-xs text-white/35">
          Add coaching, mock, or self tests manually.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs text-white/40">
            Test name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="e.g. Major Test 4"
            className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none placeholder:text-white/20 focus:border-white/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/40">
            Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as TestType
              )
            }
            className="h-10 w-full rounded-md border border-white/10 bg-[#111] px-3 text-sm outline-none"
          >
            <option>Coaching</option>
            <option>Self Test</option>
            <option>Mock Test</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/40">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/40">
            Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
            className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-xs text-white/40">
          Subjects & chapters
        </label>

        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((subject) => {
            const selected =
              subjects.includes(subject)

            return (
              <button
                type="button"
                key={subject}
                onClick={() =>
                  toggleSubject(subject)
                }
                className={`rounded-md border px-3 py-1.5 text-xs transition ${
                  selected
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 text-white/45 hover:bg-white/5"
                }`}
              >
                {subject}
              </button>
            )
          })}
        </div>

        {subjects.length > 0 && (
          <div className="mt-4 space-y-3">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="rounded-md border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-white/70">
                    {subject}
                  </span>
                  <button
                    type="button"
                    onClick={() => addChapter(subject)}
                    className="text-[11px] text-white/40 transition hover:text-white/80"
                  >
                    + Add chapter
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {(chapters[subject] ?? []).map((chapter, index) => (
                    <div key={`${subject}-${index}`} className="flex flex-col gap-2 sm:flex-row">
                      <select
                        value={TEST_CHAPTER_OPTIONS[subject].includes(chapter) ? chapter : ""}
                        onChange={(e) =>
                          updateChapter(subject, index, e.target.value)
                        }
                        className="h-9 flex-1 rounded-md border border-white/10 bg-[#111] px-3 text-xs text-white/70 outline-none focus:border-white/20"
                      >
                        <option value="">Select a {subject} chapter...</option>
                        {TEST_CHAPTER_OPTIONS[subject].map((chapterName) => (
                          <option key={chapterName} value={chapterName}>
                            {chapterName}
                          </option>
                        ))}
                      </select>

                      <input
                        value={TEST_CHAPTER_OPTIONS[subject].includes(chapter) ? "" : chapter}
                        onChange={(e) =>
                          updateChapter(subject, index, e.target.value)
                        }
                        placeholder="Or type chapter name"
                        className="h-9 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-3 text-xs outline-none placeholder:text-white/20 focus:border-white/20"
                      />

                      <button
                        type="button"
                        onClick={() => removeChapter(subject, index)}
                        className="px-2 text-xs text-white/25 transition hover:text-white/60"
                        aria-label={`Remove ${subject} chapter`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {(chapters[subject] ?? []).length === 0 && (
                  <p className="mt-2 text-[11px] text-white/25">
                    Add the chapters covered in this test.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs text-white/40">
          Target material
        </label>

        <p className="mb-3 text-[11px] leading-5 text-white/25">
          Add what you want to finish before this test.
        </p>

        <div className="flex gap-2">
          <select
            value={targetSelection}
            onChange={(e) => setTargetSelection(e.target.value)}
            className="h-9 flex-1 rounded-md border border-white/10 bg-[#111] px-3 text-xs text-white/70 outline-none focus:border-white/20"
          >
            <option value="">Select material...</option>
            {TARGET_MATERIAL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Button
            type="button"
            onClick={addSelectedTarget}
            disabled={!targetSelection}
            className="h-9 bg-white/10 text-white hover:bg-white/15 disabled:opacity-30"
          >
            <Plus size={13} />
            Add
          </Button>
        </div>

        <div className="mt-2 flex gap-2">
          <input
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addCustomTarget()
              }
            }}
            placeholder="Add a custom target..."
            className="h-9 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-3 text-xs outline-none placeholder:text-white/20 focus:border-white/20"
          />

          <Button
            type="button"
            onClick={addCustomTarget}
            disabled={!customTarget.trim()}
            className="h-9 bg-white/10 text-white hover:bg-white/15 disabled:opacity-30"
          >
            <Plus size={13} />
            Add custom
          </Button>
        </div>

        {targets.length > 0 && (
          <div className="mt-3 space-y-2">
            {targets.map((target) => (
              <div
                key={target.id}
                className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                  <span className="truncate text-xs text-white/60">
                    {target.title}
                  </span>
                  {target.source === "custom" && (
                    <span className="text-[9px] uppercase tracking-wide text-white/20">
                      Custom
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeTarget(target.id)}
                  className="text-white/25 hover:text-white/60"
                  aria-label={`Remove ${target.title}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <Button
          type="submit"
          className="h-9 bg-white text-black hover:bg-white/90"
        >
          Add test
        </Button>
      </div>
    </form>
  )
}

/* =========================================================
   SCHEDULE UPLOAD
========================================================= */

function ScheduleUpload({
  selectedFile,
  onFileSelect,
}: {
  selectedFile: File | null
  onFileSelect: (file: File | null) => void
}) {
  function handleFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    onFileSelect(file)
  }

  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.015] p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row"
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
          <FileUp
            size={18}
            className="text-white/50"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium">
            Import coaching schedule
          </h3>

          <p className="mt-1 max-w-xl text-xs leading-5 text-white/35">
            Upload your coaching test schedule. The
            schedule will be reviewed before tests are
            added to your workspace.
          </p>

          <div className="mt-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition hover:bg-white/[0.08] hover:text-white">
              <Upload size={14} />

              Choose schedule

              <input
                type="file"
                className="hidden"
                accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={handleFile}
              />
            </label>
          </div>

          {selectedFile && (
            <>
              <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-white/[0.025] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <FileUp
                    size={14}
                    className="shrink-0 text-white/35"
                  />

                  <span className="truncate text-xs text-white/60">
                    {selectedFile.name}
                  </span>
                </div>

                <button
                  onClick={() =>
                    onFileSelect(null)
                  }
                  className="ml-3 text-white/30 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="mt-3 rounded-md border border-white/10 bg-white/[0.02] p-3 text-xs text-white/40">
                Schedule selected. The extraction and
                review step will be connected next.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   TESTS PAGE
========================================================= */

function TestResultModal({
  test,
  existingResult,
  onClose,
  onSave,
}: {
  test: Test
  existingResult?: TestResult
  onClose: () => void
  onSave: (result: Omit<TestResult, "id" | "testId" | "createdAt">) => Promise<void>
}) {
  const [totalMarks, setTotalMarks] = useState(existingResult?.totalMarks?.toString() ?? "")
  const [physicsMarks, setPhysicsMarks] = useState(existingResult?.physicsMarks?.toString() ?? "")
  const [chemistryMarks, setChemistryMarks] = useState(existingResult?.chemistryMarks?.toString() ?? "")
  const [biologyMarks, setBiologyMarks] = useState(existingResult?.biologyMarks?.toString() ?? "")
  const [correct, setCorrect] = useState(existingResult?.correct?.toString() ?? "")
  const [incorrect, setIncorrect] = useState(existingResult?.incorrect?.toString() ?? "")
  const [unattempted, setUnattempted] = useState(existingResult?.unattempted?.toString() ?? "")
  const [rank, setRank] = useState(existingResult?.rank?.toString() ?? "")
  const [saving, setSaving] = useState(false)

  const accuracy = Number(correct) + Number(incorrect) > 0
    ? (Number(correct) / (Number(correct) + Number(incorrect))) * 100
    : 0

  async function submit() {
    setSaving(true)
    try {
      await onSave({
        totalMarks: Number(totalMarks) || 0,
        physicsMarks: Number(physicsMarks) || 0,
        chemistryMarks: Number(chemistryMarks) || 0,
        biologyMarks: Number(biologyMarks) || 0,
        correct: Number(correct) || 0,
        incorrect: Number(incorrect) || 0,
        unattempted: Number(unattempted) || 0,
        accuracy: Number(accuracy.toFixed(2)),
        rank: rank ? Number(rank) : undefined,
      })
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, value: string, setValue: (value: string) => void) => (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-white/30">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none placeholder:text-white/20 focus:border-white/25"
      />
    </label>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-[#151515] p-4 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-white/30">Test result</div>
            <h2 className="mt-1 text-lg font-medium">{test.name}</h2>
            <p className="mt-1 text-xs text-white/35">Enter the result once. PreMed will use it for your performance trend.</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {field("Total marks", totalMarks, setTotalMarks)}
          {field("Physics", physicsMarks, setPhysicsMarks)}
          {field("Chemistry", chemistryMarks, setChemistryMarks)}
          {field("Biology", biologyMarks, setBiologyMarks)}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {field("Correct", correct, setCorrect)}
          {field("Incorrect", incorrect, setIncorrect)}
          {field("Unattempted", unattempted, setUnattempted)}
          {field("Rank (optional)", rank, setRank)}
        </div>

        <div className="mt-5 rounded-md border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/60">
          Accuracy <span className="ml-2 font-medium text-white">{accuracy.toFixed(1)}%</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
          <Button variant="outline" onClick={onClose} className="border-white/10 bg-transparent text-white/60 hover:bg-white/5 hover:text-white">Cancel</Button>
          <Button onClick={submit} disabled={saving} className="bg-white text-black hover:bg-white/90">{saving ? "Saving..." : "Save result"}</Button>
        </div>
      </div>
    </div>
  )
}

function TestsPage({
  tests,
  addTest,
  updateTestStatus,
  deleteTest,
  results,
  saveResult,
}: {
  tests: Test[]
  addTest: (test: Test) => void
  updateTestStatus: (
    id: string,
    status: TestStatus
  ) => void
  deleteTest: (id: string) => void
  results: TestResult[]
  saveResult: (test: Test, result: Omit<TestResult, "id" | "testId" | "createdAt">) => Promise<void>
}) {
  const [filter, setFilter] = useState<
    TestStatus
  >("upcoming")

  const [showAdd, setShowAdd] =
    useState(false)

  const [resultTest, setResultTest] =
    useState<Test | null>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const pendingTests = tests.filter(
    (test) => test.status === "pending"
  )

  const filteredTests = useMemo(() => {
    return tests
      .filter((test) => test.status === filter)
      .sort(
        (a, b) =>
          getTestDate(a).getTime() -
          getTestDate(b).getTime()
      )
  }, [tests, filter])

  const nextTest = tests
    .filter(
      (test) => test.status === "upcoming"
    )
    .sort(
      (a, b) =>
        getTestDate(a).getTime() -
        getTestDate(b).getTime()
    )[0]

  return (
    <div>
      <PageHeader
        eyebrow="Tests"
        title="Test workspace"
        description="Keep every coaching, mock, and self test in one place."
      />

      {pendingTests.length > 0 && (
        <div className="mb-6 space-y-3">
          {pendingTests.map((test) => (
            <PendingTestCard
              key={test.id}
              test={test}
              onGave={() =>
                setResultTest(test)
              }
              onMissed={() =>
                updateTestStatus(
                  test.id,
                  "missed"
                )
              }
            />
          ))}
        </div>
      )}

      {nextTest && (
        <div className="mb-8">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-white/30">
            Next test
          </div>

          <NextTestCard test={nextTest} />
        </div>
      )}

      <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex gap-1 overflow-x-auto rounded-md border border-white/10 bg-white/[0.02] p-1">
          {[
            ["upcoming", "Upcoming"],
            ["pending", "Needs confirmation"],
            ["completed", "Completed"],
            ["missed", "Missed"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                setFilter(
                  value as TestStatus
                )
              }
              className={`whitespace-nowrap rounded px-3 py-1.5 text-xs transition ${
                filter === value
                  ? "bg-white/10 text-white"
                  : "text-white/35 hover:text-white/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Button
          onClick={() =>
            setShowAdd(!showAdd)
          }
          className="h-9 shrink-0 bg-white text-black hover:bg-white/90"
        >
          {showAdd ? (
            <>
              <X size={14} />
              Close
            </>
          ) : (
            <>
              <Plus size={14} />
              Add test
            </>
          )}
        </Button>
      </div>

      {showAdd && (
        <div className="mb-6">
          <AddTestForm
            onAdd={(test) => {
              addTest(test)
              setShowAdd(false)
            }}
          />
        </div>
      )}

      {filteredTests.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-white/10">
          {filteredTests.map(
            (test, index) => (
              <div
                key={test.id}
                className={`flex flex-col items-stretch gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-5 ${
                  index !==
                  filteredTests.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {test.name}
                    </span>

                    <span className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white/35">
                      {test.type}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-white/35">
                    {formatTestDate(test)} •{" "}
                    {formatTestTime(test)}
                  </div>

                  <div className="mt-2 space-y-1">
                    {test.subjects.map((subject) => {
                      const subjectChapters = test.chapters?.[subject] ?? []

                      return (
                        <div key={subject} className="text-[10px] text-white/35">
                          <span className="text-white/50">{subject}</span>
                          {subjectChapters.length > 0 && (
                            <span className="ml-1 text-white/25">
                              • {subjectChapters.join(", ")}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:justify-end">
                {test.status === "completed" && (
                  <button
                    type="button"
                    onClick={() => setResultTest(test)}
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] text-white/45 hover:bg-white/[0.05] hover:text-white"
                  >
                    {results.some((result) => result.testId === test.id) ? "View / edit result" : "Add result"}
                  </button>
                )}

                  {test.status ===
                    "upcoming" && (
                    <span className="text-xs text-white/30">
                      {getDaysRemaining(
                        test
                      ) === 0
                        ? "Today"
                        : `${getDaysRemaining(
                            test
                          )}d`}
                    </span>
                  )}

                  {test.status ===
                    "pending" && (
                    <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] text-amber-300">
                      Confirm
                    </span>
                  )}

                  {test.status ===
                    "completed" && (
                    <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">
                      Completed
                    </span>
                  )}

                  {test.status ===
                    "missed" && (
                    <span className="rounded-full bg-red-400/10 px-2 py-1 text-[10px] text-red-300">
                      Missed
                    </span>
                  )}

                  <button
                    onClick={() =>
                      deleteTest(test.id)
                    }
                    className="rounded p-1.5 text-white/20 hover:bg-white/5 hover:text-white/60"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 py-14 text-center">
          <CalendarDays
            size={22}
            className="mx-auto text-white/20"
          />

          <div className="mt-3 text-sm text-white/45">
            No tests in this section
          </div>

          <div className="mt-1 text-xs text-white/25">
            Add a test or import your coaching
            schedule.
          </div>
        </div>
      )}

      <div className="mt-8">
        <ScheduleUpload
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />
      </div>
    </div>
  )

      {resultTest && (
        <TestResultModal
          test={resultTest}
          existingResult={results.find((result) => result.testId === resultTest.id)}
          onClose={() => setResultTest(null)}
          onSave={async (result) => {
            await saveResult(resultTest, result)
            setResultTest(null)
          }}
        />
      )}
}

/* =========================================================
   SYLLABUS ACTIVITY ROW
========================================================= */

function ActivityRow({
  activity,
  completed,
  onToggle,
}: {
  activity: ActivityName
  completed: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="group flex items-center gap-2 rounded px-2 py-1.5 text-left transition hover:bg-white/[0.04]"
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition ${
          completed
            ? "border-white/40 bg-white text-black"
            : "border-white/15 bg-transparent"
        }`}
      >
        {completed && <Check size={10} />}
      </div>

      <span
        className={`text-xs transition ${
          completed
            ? "text-white/30 line-through"
            : "text-white/50 group-hover:text-white/75"
        }`}
      >
        {activity}
      </span>
    </button>
  )
}

/* =========================================================
   CUSTOM ACTIVITY
========================================================= */

function CustomActivityInput({
  onAdd,
}: {
  onAdd: (name: string) => void
}) {
  const [value, setValue] =
    useState("")

  function submit() {
    const trimmed = value.trim()

    if (!trimmed) return

    onAdd(trimmed)
    setValue("")
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit()
          }

          if (e.key === "Escape") {
            setValue("")
          }
        }}
        placeholder="e.g. Allen exercise, DPP 12..."
        className="h-8 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 text-xs outline-none placeholder:text-white/20 focus:border-white/20"
      />

      <button
        onClick={submit}
        className="flex h-8 items-center justify-center rounded-md border border-white/10 px-2 text-white/50 hover:bg-white/5 hover:text-white"
      >
        <Check size={13} />
      </button>
    </div>
  )
}

/* =========================================================
   SYLLABUS UNIT CARD
========================================================= */

function SyllabusUnitCard({
  chapter,
  activityState,
  setActivityState,
}: {
  chapter: {
    id: string
    unit: number
    name: string
    classLevel?: string
  }
  activityState: ActivityState
  setActivityState: React.Dispatch<
    React.SetStateAction<ActivityState>
  >
}) {
  const [expanded, setExpanded] =
    useState(false)

  const [addingCustom, setAddingCustom] =
    useState(false)

  const prefix = chapter.id

  const defaultActivityKeys =
    DEFAULT_ACTIVITIES.map(
      (activity) =>
        `${prefix}::${activity}`
    )

  const customActivities = Object.entries(
    activityState
  )
    .filter(([key, value]) => {
      return (
        key.startsWith(`${prefix}::custom::`) &&
        value.custom
      )
    })
    .map(([key, value]) => ({
      key,
      name: key.replace(
        `${prefix}::custom::`,
        ""
      ),
      completed: value.completed,
    }))

  const completedCount =
    defaultActivityKeys.filter(
      (key) =>
        activityState[key]?.completed
    ).length +
    customActivities.filter(
      (item) => item.completed
    ).length

  const totalCount =
    DEFAULT_ACTIVITIES.length +
    customActivities.length

  function toggleActivity(
    key: string
  ) {
    setActivityState((current) => ({
      ...current,
      [key]: {
        completed:
          !current[key]?.completed,
        custom:
          current[key]?.custom ?? false,
      },
    }))
  }

  function addCustomActivity(
    name: string
  ) {
    const key = `${prefix}::custom::${name}`

    setActivityState((current) => ({
      ...current,
      [key]: {
        completed: false,
        custom: true,
      },
    }))

    setAddingCustom(false)
    setExpanded(true)
  }

  function deleteCustomActivity(
    key: string
  ) {
    setActivityState((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <div
        className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-white/[0.018]"
        onClick={() =>
          setExpanded(!expanded)
        }
      >
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
            completedCount === totalCount &&
            totalCount > 0
              ? "border-white/30 bg-white/80 text-black"
              : "border-white/10"
          }`}
        >
          {completedCount ===
            totalCount &&
            totalCount > 0 && (
              <Check size={12} />
            )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-white/80">
            Unit {chapter.unit} —{" "}
            {chapter.name}
          </div>

          {chapter.classLevel && (
            <div className="mt-1 text-[10px] text-white/25">
              {chapter.classLevel}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/25">
            {completedCount}/{totalCount}
          </span>

          {expanded ? (
            <ChevronDown
              size={15}
              className="text-white/25"
            />
          ) : (
            <ChevronRight
              size={15}
              className="text-white/25"
            />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/[0.06] bg-white/[0.012] px-5 pb-5 pt-4">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {DEFAULT_ACTIVITIES.map(
              (activity) => {
                const key = `${prefix}::${activity}`

                return (
                  <ActivityRow
                    key={activity}
                    activity={activity}
                    completed={
                      !!activityState[key]
                        ?.completed
                    }
                    onToggle={() =>
                      toggleActivity(
                        key
                      )
                    }
                  />
                )
              }
            )}
          </div>

          {customActivities.length >
            0 && (
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
                Added by you
              </div>

              <div className="space-y-1">
                {customActivities.map(
                  (item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <button
                        onClick={() =>
                          toggleActivity(
                            item.key
                          )
                        }
                        className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-white/[0.04]"
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-[3px] border ${
                            item.completed
                              ? "border-white/40 bg-white text-black"
                              : "border-white/15"
                          }`}
                        >
                          {item.completed && (
                            <Check size={10} />
                          )}
                        </div>

                        <span
                          className={`text-xs ${
                            item.completed
                              ? "text-white/30 line-through"
                              : "text-white/50"
                          }`}
                        >
                          {item.name}
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          deleteCustomActivity(
                            item.key
                          )
                        }
                        className="rounded p-1 text-white/15 hover:bg-white/5 hover:text-white/50"
                      >
                        <Trash2
                          size={12}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            {!addingCustom ? (
              <button
                onClick={() =>
                  setAddingCustom(true)
                }
                className="flex items-center gap-1.5 px-2 text-xs text-white/30 transition hover:text-white/70"
              >
                <Plus size={13} />
                Add activity
              </button>
            ) : (
              <CustomActivityInput
                onAdd={
                  addCustomActivity
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================================================
   SYLLABUS PAGE
========================================================= */

function SyllabusPage({ userId }: { userId: string }) {
  const [subject, setSubject] =
    useState<Subject>("Physics")

  const [search, setSearch] =
    useState("")

  const [activityState, setActivityState] =
    useState<ActivityState>(() => {
      try {
        const stored =
          localStorage.getItem(
            `premed-syllabus-activities-${userId}`
          )

        return stored
          ? JSON.parse(stored)
          : {}
      } catch {
        return {}
      }
    })

  useEffect(() => {
    localStorage.setItem(
      `premed-syllabus-activities-${userId}`,
      JSON.stringify(activityState)
    )
  }, [activityState, userId])

  const chapters =
    syllabusBySubject[subject]

  const filtered = chapters.filter(
    (chapter) =>
      chapter.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  )

  const allDefaultKeys =
    chapters.flatMap((chapter) =>
      DEFAULT_ACTIVITIES.map(
        (activity) =>
          `${chapter.id}::${activity}`
      )
    )

  const completedDefault =
    allDefaultKeys.filter(
      (key) =>
        activityState[key]?.completed
    ).length

  const percentage =
    allDefaultKeys.length === 0
      ? 0
      : Math.round(
          (completedDefault /
            allDefaultKeys.length) *
            100
        )

  return (
    <div>
      <PageHeader
        eyebrow="Syllabus"
        title="Syllabus tracker"
        description="Track your preparation without turning every chapter into dozens of tiny tasks."
      />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-fit gap-1 rounded-md border border-white/10 bg-white/[0.02] p-1">
          {SUBJECTS.map((item) => (
            <button
              key={item}
              onClick={() =>
                setSubject(item)
              }
              className={`rounded px-4 py-1.5 text-xs transition ${
                subject === item
                  ? "bg-white/10 text-white"
                  : "text-white/35 hover:text-white/60"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search syllabus"
            className="h-9 w-full rounded-md border border-white/10 bg-white/[0.02] pl-9 pr-3 text-xs outline-none placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-white/35">
              {subject} preparation
            </div>

            <div className="mt-2 text-2xl font-semibold">
              {percentage}%
            </div>
          </div>

          <div className="text-xs text-white/30">
            {completedDefault} /{" "}
            {allDefaultKeys.length} activities
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white/70 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {/* Activity explanation */}
      <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.015] px-5 py-4">
        <div className="flex items-start gap-3">
          <BookOpen
            size={16}
            className="mt-0.5 shrink-0 text-white/30"
          />

          <div>
            <div className="text-xs font-medium text-white/55">
              Track what you actually do
            </div>

            <p className="mt-1 text-xs leading-5 text-white/30">
              Open a unit to mark Theory, Module, NCERT,
              PYQs, Practice/DPP, Chapter Test and
              Revision. You can also add your own
              activity.
            </p>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="overflow-hidden rounded-lg border border-white/10">
        {filtered.map((chapter) => (
          <SyllabusUnitCard
            key={chapter.id}
            chapter={chapter}
            activityState={activityState}
            setActivityState={
              setActivityState
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-white/10 py-14 text-center">
          <Search
            size={20}
            className="mx-auto text-white/20"
          />

          <div className="mt-3 text-sm text-white/40">
            No matching syllabus units
          </div>

          <div className="mt-1 text-xs text-white/25">
            Try a different search.
          </div>
        </div>
      )}
    </div>
  )
}

function formatCountdown(test: Test) {
  const today = new Date()
  const target = getTestDate(test)
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const days = Math.ceil((end.getTime() - start.getTime()) / 86400000)
  if (days <= 0) return days === 0 ? "Today" : "Pending"
  if (days === 1) return "Tomorrow"
  return `${days} days`
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({
  nextTest,
  pendingTest,
  updateTestStatus,
  results,
  tests,
  user,
  studySecondsToday,
}: {
  nextTest?: Test
  pendingTest?: Test
  updateTestStatus: (id: string, status: TestStatus) => void
  results: TestResult[]
  tests: Test[]
  user: any
  studySecondsToday: number
}) {
  const now = new Date()
  const firstName =
    typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim().split(/\s+/)[0]
      : "there"

  const completedResults = results.filter((result) =>
    tests.some((test) => test.id === result.testId)
  )

  const averageAccuracy = completedResults.length
    ? completedResults.reduce((sum, result) => sum + result.accuracy, 0) / completedResults.length
    : 0

  const bestScore = completedResults.length
    ? Math.max(...completedResults.map((result) => result.totalMarks))
    : 0

  const trend = completedResults.slice(-7)
  const trendMax = Math.max(1, ...trend.map((result) => result.totalMarks))
  const trendMin = trend.length ? Math.min(...trend.map((result) => result.totalMarks)) : 0
  const trendRange = Math.max(1, trendMax - trendMin)
  const studyHours = Math.floor(studySecondsToday / 3600)
  const studyMinutes = Math.floor((studySecondsToday % 3600) / 60)
  const studyLabel = studySecondsToday === 0 ? "0h" : `${studyHours}h ${studyMinutes}m`

  const greeting =
    now.getHours() < 12 ? "Good morning." : now.getHours() < 18 ? "Good afternoon." : "Good evening."

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now)

  return (
    <div>
      <div className="mb-10">
        <div className="text-sm text-white/35">{formattedDate}</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {greeting} {firstName !== "there" ? firstName + "." : ""}
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Your preparation, in one place.
        </p>
      </div>

      {pendingTest && (
        <div className="mb-6">
          <PendingTestCard
            test={pendingTest}
            onGave={() => updateTestStatus(pendingTest.id, "completed")}
            onMissed={() => updateTestStatus(pendingTest.id, "missed")}
          />
        </div>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
          <div className="text-xs text-white/35">Next test</div>
          <div className="mt-3 text-2xl font-semibold">
            {nextTest ? formatCountdown(nextTest) : "—"}
          </div>
          <div className="mt-1 truncate text-xs text-white/30">
            {nextTest ? nextTest.name : "Nothing scheduled"}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
          <div className="text-xs text-white/35">Today's study</div>
          <div className="mt-3 text-2xl font-semibold">{studyLabel}</div>
          <div className="mt-1 text-xs text-white/30">logged today</div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
          <div className="text-xs text-white/35">Test accuracy</div>
          <div className="mt-3 text-2xl font-semibold">
            {completedResults.length ? `${averageAccuracy.toFixed(1)}%` : "—"}
          </div>
          <div className="mt-1 text-xs text-white/30">
            {completedResults.length ? `${completedResults.length} tests completed` : "No results yet"}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
          <div className="text-xs text-white/35">Best score</div>
          <div className="mt-3 text-2xl font-semibold">
            {completedResults.length ? bestScore : "—"}
          </div>
          <div className="mt-1 text-xs text-white/30">marks</div>
        </div>
      </div>

      {nextTest ? (
        <div className="mb-8">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-white/30">
            Next test
          </div>
          <NextTestCard test={nextTest} />
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-white/30" />
            <div>
              <div className="text-sm font-medium">No upcoming test</div>
              <div className="mt-1 text-xs text-white/35">
                Add your next coaching or mock test from the Tests workspace.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Test performance</div>
              <div className="mt-1 text-xs text-white/30">Your latest scores</div>
            </div>
            <div className="text-xs text-white/25">{completedResults.length} recorded</div>
          </div>

          {trend.length > 0 ? (
            <div className="mt-8">
              <svg viewBox="0 0 520 170" className="h-40 w-full overflow-visible">
                <line x1="0" y1="150" x2="520" y2="150" stroke="currentColor" className="text-white/10" />
                {trend.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/55"
                    points={trend.map((result, index) => {
                      const x = trend.length === 1 ? 260 : (index / (trend.length - 1)) * 500 + 10
                      const y = 140 - ((result.totalMarks - trendMin) / trendRange) * 110
                      return `${x},${y}`
                    }).join(" ")}
                  />
                )}
                {trend.map((result, index) => {
                  const x = trend.length === 1 ? 260 : (index / (trend.length - 1)) * 500 + 10
                  const y = 140 - ((result.totalMarks - trendMin) / trendRange) * 110
                  return <circle key={result.id} cx={x} cy={y} r="4" className="fill-white" />
                })}
              </svg>
              <div className="flex justify-between text-[10px] text-white/25">
                <span>Older</span>
                <span>Latest</span>
              </div>
            </div>
          ) : (
            <div className="mt-12 text-sm text-white/30">
              Complete your first test to start your performance graph.
            </div>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
          <div className="text-sm font-medium">Preparation snapshot</div>
          <div className="mt-7 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">Tests completed</span>
                <span className="text-white/60">{completedResults.length}</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full bg-white/50"
                  style={{ width: `${Math.min(100, completedResults.length * 10)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">Upcoming tests</span>
                <span className="text-white/60">
                  {tests.filter((test) => test.status === "upcoming").length}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/35">Average accuracy</span>
                <span className="text-white/60">
                  {completedResults.length ? `${averageAccuracy.toFixed(1)}%` : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   FOCUS TIMER
========================================================= */

function FocusTimerPage() {
  const [seconds, setSeconds] =
    useState(0)

  const [running, setRunning] =
    useState(false)

  const [subject, setSubject] =
    useState<Subject>("Physics")

  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      setSeconds(
        (current) => current + 1
      )
    }, 1000)

    return () =>
      clearInterval(interval)
  }, [running])

  const hours = Math.floor(
    seconds / 3600
  )

  const minutes = Math.floor(
    (seconds % 3600) / 60
  )

  const secs = seconds % 60

  const display = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":")

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Tools"
        title="Focus Timer"
        description="A simple timer for focused study sessions."
      />

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-10 text-center">
        <div className="text-6xl font-semibold tracking-tight tabular-nums">
          {display}
        </div>

        <div className="mt-8">
          <select
            value={subject}
            onChange={(e) =>
              setSubject(
                e.target.value as Subject
              )
            }
            className="rounded-md border border-white/10 bg-[#111] px-4 py-2 text-sm outline-none"
          >
            {SUBJECTS.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          <Button
            onClick={() =>
              setRunning(!running)
            }
            className="bg-white text-black hover:bg-white/90"
          >
            <Play size={15} />
            {running ? "Pause" : "Start"}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setRunning(false)
              setSeconds(0)
            }}
            className="border-white/10 bg-transparent text-white/70 hover:bg-white/5"
          >
            <RotateCcw size={15} />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PLACEHOLDER PAGES
========================================================= */

function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title={title}
        description={description}
      />

      <div className="rounded-lg border border-white/10 bg-white/[0.02] py-20 text-center">
        <div className="text-sm text-white/40">
          This workspace is coming next.
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   MATERIALS PAGE
========================================================= */

function MaterialsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [materials, setMaterials] = useState<PersonalMaterial[]>([])
  const [title, setTitle] = useState("")
  const [type, setType] = useState<MaterialType>("YouTube")
  const [url, setUrl] = useState("")
  const [subject, setSubject] = useState<Subject | "">("")
  const [chapter, setChapter] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("19:00")

  function addMaterial(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      alert("Please enter a material title.")
      return
    }

    if (!url.trim()) {
      alert("Please enter a link.")
      return
    }

    setMaterials((current) => [
      ...current,
      {
        id: generateId(),
        title: title.trim(),
        type,
        url: url.trim(),
        subject: subject || undefined,
        chapter: chapter.trim() || undefined,
        reminderDate: reminderDate || undefined,
        reminderTime: reminderDate ? reminderTime : undefined,
        completed: false,
      },
    ])

    setTitle("")
    setType("YouTube")
    setUrl("")
    setSubject("")
    setChapter("")
    setReminderDate("")
    setReminderTime("19:00")
    setShowAdd(false)
  }

  function toggleMaterial(id: string) {
    setMaterials((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    )
  }

  function deleteMaterial(id: string) {
    setMaterials((current) =>
      current.filter((item) => item.id !== id)
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow="Materials"
        title="Study materials"
        description="Keep useful resources and your own study links in one place."
      />

      <section className="mb-10">
        <div className="mb-4">
          <h2 className="text-sm font-medium">Suggested material</h2>
          <p className="mt-1 text-xs text-white/30">
            Useful resources you can open directly.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                  Practice
                </div>
                <h3 className="mt-2 text-sm font-medium">ExamGOAL</h3>
                <p className="mt-1 text-xs leading-5 text-white/35">
                  Practice NEET questions and online tests.
                </p>
              </div>
              <span className="rounded border border-white/10 px-2 py-1 text-[9px] text-white/30">
                Website
              </span>
            </div>
            <a
              href="https://examgoal.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs text-white/60 hover:bg-white/[0.08] hover:text-white"
            >
              Open resource <ExternalLink size={12} className="ml-2" />
            </a>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                  PW YouTube
                </div>
                <h3 className="mt-2 text-sm font-medium">Manzil</h3>
                <p className="mt-1 text-xs leading-5 text-white/35">
                  Open the official PW Manzil lectures on YouTube and continue from the playlist/channel.
                </p>
              </div>
              <span className="rounded border border-white/10 px-2 py-1 text-[9px] text-white/30">
                Playlist
              </span>
            </div>
            <a
              href="https://www.youtube.com/@PW-JEEWallah/search?query=Manzil"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs text-white/60 hover:bg-white/[0.08] hover:text-white"
            >
              Open Manzil <ExternalLink size={12} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium">My material</h2>
            <p className="mt-1 text-xs text-white/30">
              Add your own resources and optionally set a reminder.
            </p>
          </div>
          <Button
            onClick={() => setShowAdd((v) => !v)}
            className="h-9 bg-white text-black hover:bg-white/90"
          >
            {showAdd ? <X size={14} /> : <Plus size={14} />}
            {showAdd ? "Close" : "Add material"}
          </Button>
        </div>

        {showAdd && (
          <form
            onSubmit={addMaterial}
            className="mb-5 rounded-lg border border-white/10 bg-white/[0.02] p-5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-white/40">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rotational Motion one-shot"
                  className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/40">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MaterialType)}
                  className="h-10 w-full rounded-md border border-white/10 bg-[#111] px-3 text-sm outline-none"
                >
                  <option>YouTube</option>
                  <option>Website</option>
                  <option>PDF / Document</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs text-white/40">Link</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste the resource URL"
                  className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/40">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value as Subject | "")
                    setChapter("")
                  }}
                  className="h-10 w-full rounded-md border border-white/10 bg-[#111] px-3 text-sm outline-none"
                >
                  <option value="">No subject</option>
                  {SUBJECTS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/40">Chapter</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  disabled={!subject}
                  className="h-10 w-full rounded-md border border-white/10 bg-[#111] px-3 text-sm outline-none disabled:opacity-30"
                >
                  <option value="">
                    {subject ? "Select chapter" : "Select subject first"}
                  </option>
                  {subject &&
                    TEST_CHAPTER_OPTIONS[subject].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/40">
                  Reminder date
                </label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/40">
                  Reminder time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  disabled={!reminderDate}
                  className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm outline-none disabled:opacity-30"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="submit" className="h-9 bg-white text-black hover:bg-white/90">
                <Plus size={14} /> Add material
              </Button>
            </div>
          </form>
        )}

        {materials.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 px-5 py-10 text-center">
            <div className="text-sm text-white/35">No personal material yet.</div>
            <div className="mt-1 text-xs text-white/20">
              Add a resource you want to study later.
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-white/10">
            {materials.map((material, index) => (
              <div
                key={material.id}
                className={`flex items-center justify-between gap-5 px-5 py-4 ${
                  index !== materials.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleMaterial(material.id)}
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      material.completed
                        ? "border-white/30 bg-white/20"
                        : "border-white/15"
                    }`}
                  >
                    {material.completed && <Check size={10} />}
                  </button>

                  <div className="min-w-0">
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`block truncate text-sm font-medium hover:underline ${
                        material.completed ? "text-white/30 line-through" : ""
                      }`}
                    >
                      {material.title}
                    </a>
                    <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-white/30">
                      <span>{material.type}</span>
                      {material.subject && <span>· {material.subject}</span>}
                      {material.chapter && <span>· {material.chapter}</span>}
                      {material.reminderDate && (
                        <span>
                          · Reminder {material.reminderDate}
                          {material.reminderTime ? ` ${material.reminderTime}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] text-white/40 hover:bg-white/[0.05] hover:text-white/70"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteMaterial(material.id)}
                    className="p-1.5 text-white/20 hover:text-white/60"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function AnalyticsPage({ tests, results }: { tests: Test[]; results: TestResult[] }) {
  const completedTests = results
    .map((result) => ({
      result,
      test: tests.find((test) => test.id === result.testId),
    }))
    .filter((item): item is { result: TestResult; test: Test } => Boolean(item.test))
    .sort((a, b) => getTestDate(a.test).getTime() - getTestDate(b.test).getTime())

  const averageScore = completedTests.length
    ? completedTests.reduce((sum, item) => sum + item.result.totalMarks, 0) / completedTests.length
    : 0
  const averageAccuracy = completedTests.length
    ? completedTests.reduce((sum, item) => sum + item.result.accuracy, 0) / completedTests.length
    : 0
  const bestScore = completedTests.length ? Math.max(...completedTests.map((item) => item.result.totalMarks)) : 0

  return (
    <div>
      <PageHeader eyebrow="Analytics" title="Test performance" description="See how your scores and accuracy change across completed tests." />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Tests completed", completedTests.length.toString()],
          ["Average score", completedTests.length ? averageScore.toFixed(0) : "—"],
          ["Average accuracy", completedTests.length ? `${averageAccuracy.toFixed(1)}%` : "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
            <div className="text-xs text-white/35">{label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-white/10 bg-white/[0.025] p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium">Score trend</h2>
            <p className="mt-1 text-xs text-white/35">One point for every completed test.</p>
          </div>
          {completedTests.length > 0 && <div className="text-xs text-white/35">Best: {bestScore}</div>}
        </div>

        {completedTests.length < 2 ? (
          <div className="mt-10 flex h-48 items-center justify-center text-sm text-white/25">
            Complete at least two tests to see your score trend.
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto pb-2">
            <div className="relative h-56 min-w-[640px]">
              <div className="absolute inset-x-0 bottom-8 border-t border-white/10" />
              <div className="absolute inset-x-0 bottom-1/2 border-t border-white/5" />
              <div className="absolute inset-x-0 top-8 border-t border-white/5" />
              {completedTests.map((item, index) => {
                const max = Math.max(...completedTests.map((entry) => entry.result.totalMarks), 1)
                const min = Math.min(...completedTests.map((entry) => entry.result.totalMarks))
                const range = Math.max(max - min, 1)
                const left = completedTests.length === 1 ? 50 : (index / (completedTests.length - 1)) * 92 + 4
                const bottom = 32 + ((item.result.totalMarks - min) / range) * 64
                return (
                  <div key={item.result.id} className="absolute -translate-x-1/2" style={{ left: `${left}%`, bottom: `${bottom}%` }}>
                    <div className="group relative">
                      <div className="h-3 w-3 rounded-full border-2 border-[#111111] bg-white" />
                      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-white/10 bg-[#191919] px-2 py-1 text-[10px] text-white/70 group-hover:block">
                        {item.test.name}: {item.result.totalMarks} · {item.result.accuracy.toFixed(1)}%
                      </div>
                    </div>
                    <div className="mt-2 max-w-24 -translate-x-1/2 truncate text-center text-[9px] text-white/25">{item.test.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.025]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-medium">Completed tests</h2>
        </div>
        {completedTests.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-white/25">No test results yet.</div>
        ) : (
          <div>
            {completedTests.map(({ test, result }) => (
              <div key={result.id} className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 last:border-b-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{test.name}</div>
                  <div className="mt-1 text-xs text-white/30">{formatTestDate(test)} · {test.type}</div>
                </div>
                <div className="flex shrink-0 items-center gap-5 text-right">
                  <div><div className="text-sm font-medium">{result.totalMarks}</div><div className="text-[9px] text-white/25">marks</div></div>
                  <div><div className="text-sm font-medium">{result.accuracy.toFixed(1)}%</div><div className="text-[9px] text-white/25">accuracy</div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}


/* =========================================================
   AUTHENTICATION
========================================================= */

type AuthMode = "login" | "signup"

type AuthPageProps = {
  mode: AuthMode
  setMode: (mode: AuthMode) => void
}

function AuthPage({ mode, setMode }: AuthPageProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your name.")
          return
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters.")
          return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        })

        if (signUpError) throw signUpError

        if (data.session && data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: name.trim(),
          })
        } else {
          setMessage("Account created. Check your email to confirm your account, then log in.")
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (signInError) throw signInError
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : "Something went wrong."
      setError(text)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] px-6 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="text-xl font-semibold tracking-tight">PreMed</div>
            <div className="mt-2 text-sm text-white/40">Your medical entrance preparation workspace.</div>
          </div>

          <section className="rounded-lg border border-white/10 bg-[#161616] p-7">
            <div className="mb-6">
              <h1 className="text-lg font-medium">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
              <p className="mt-1 text-sm text-white/35">
                {mode === "login" ? "Sign in to continue to PreMed." : "Create your private PreMed workspace."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/45">Name</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm outline-none placeholder:text-white/20 focus:border-white/25"
                      placeholder="Your name"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs text-white/45">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm outline-none placeholder:text-white/20 focus:border-white/25"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs text-white/45">Password</span>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                    className="h-10 w-full rounded-md border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm outline-none placeholder:text-white/20 focus:border-white/25"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              {error && <div className="rounded-md border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-300">{error}</div>}
              {message && <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/60">{message}</div>}

              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-md bg-white text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-white/35">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login")
                  setError("")
                  setMessage("")
                }}
                className="text-white/70 hover:text-white"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </div>
          </section>

          <p className="mt-5 text-center text-[11px] leading-5 text-white/20">
            Your private study data is protected by Supabase authentication and database-level row security.
          </p>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [page, setPage] =
    useState<Page>("Home")

    const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"]>(null)

  const [tests, setTests] = useState<Test[]>([])
  const [results, setResults] = useState<TestResult[]>([])
  const [studySecondsToday, setStudySecondsToday] = useState(0)

  /* -------------------------------------------------------
     AUTH SESSION

     The UI is gated by the Supabase session. Database RLS
     remains the security boundary; this gate is not relied
     upon as the security mechanism.
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data, error } = await supabase.auth.getUser()

      if (!mounted) return

      if (error) {
        console.error("Error getting auth user:", error)
      }

      setUser(data.user ?? null)
      setAuthLoading(false)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  /* -------------------------------------------------------
     USER PROFILE

     The profile id is always the authenticated user's id.
     We never accept a profile id from the URL or UI.
  ------------------------------------------------------- */

  useEffect(() => {
    if (!user) return

    async function ensureProfile() {
      const fullName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : ""

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: fullName || null,
        },
        { onConflict: "id" }
      )

      if (error) {
        console.error("Error creating/updating profile:", error)
      }
    }

    ensureProfile()
  }, [user])

  /* -------------------------------------------------------
     LOAD USER DATA FROM SUPABASE
  ------------------------------------------------------- */

  useEffect(() => {
    if (!user) {
      setTests([])
      setResults([])
      setStudySecondsToday(0)
      return
    }

    async function loadTests() {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("user_id", user.id)
        .order("test_date", {
          ascending: true,
        })

      if (error) {
        console.error(
          "Error loading tests:",
          error
        )
        return
      }

      const formattedTests: Test[] =
        (data ?? []).map((test) => ({
          id: test.id,
          name: test.title,
          date: test.test_date,
          time: test.test_time ?? "",
          type:
            test.source === "coaching"
              ? "Coaching"
              : "Self Test",
          subjects:
            (test.subjects ?? []) as Subject[],
          chapters:
            (test.chapters ?? {}) as Partial<Record<Subject, string[]>>,
          status: test.status as TestStatus,
          createdAt: test.created_at,
        }))

      setTests(formattedTests)

      const { data: resultData, error: resultError } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (resultError) {
        console.error("Error loading test results:", resultError)
        return
      }

      setResults((resultData ?? []).map((result) => ({
        id: result.id,
        testId: result.test_id,
        totalMarks: result.total_marks ?? 0,
        physicsMarks: result.physics_marks ?? 0,
        chemistryMarks: result.chemistry_marks ?? 0,
        biologyMarks: result.biology_marks ?? 0,
        correct: result.correct ?? 0,
        incorrect: result.incorrect ?? 0,
        unattempted: result.unattempted ?? 0,
        accuracy: Number(result.accuracy ?? 0),
        rank: result.rank ?? undefined,
        createdAt: result.created_at,
      })))

      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const { data: sessionData, error: sessionError } = await supabase
        .from("study_sessions")
        .select("duration_seconds, started_at")
        .eq("user_id", user.id)
        .gte("started_at", startOfDay.toISOString())

      if (sessionError) {
        console.error("Error loading study sessions:", sessionError)
        setStudySecondsToday(0)
      } else {
        setStudySecondsToday(
          (sessionData ?? []).reduce(
            (sum, session) => sum + Number(session.duration_seconds ?? 0),
            0
          )
        )
      }
    }

    loadTests()
  }, [user])

  /* -------------------------------------------------------
     PENDING TEST CHECK

     IMPORTANT:
     Past tests become PENDING, not automatically MISSED.
  ------------------------------------------------------- */

  useEffect(() => {
    async function checkTests() {
      if (tests.length === 0) return

      const now = new Date()

      const testsToUpdate = tests.filter(
        (test) =>
          test.status === "upcoming" &&
          getTestDate(test).getTime() <=
            now.getTime()
      )

      if (testsToUpdate.length === 0) return

      const updatedIds =
        testsToUpdate.map((test) => test.id)

      const { error } = await supabase
        .from("tests")
        .update({
          status: "pending",
        })
        .in("id", updatedIds)

      if (error) {
        console.error(
          "Error updating pending tests:",
          error
        )
        return
      }

      setTests((current) =>
        current.map((test) =>
          updatedIds.includes(test.id)
            ? {
                ...test,
                status: "pending",
              }
            : test
        )
      )
    }

    checkTests()

    const interval = setInterval(
      checkTests,
      60 * 1000
    )

    return () =>
      clearInterval(interval)
  }, [tests])

  /* -------------------------------------------------------
     NEXT TEST
  ------------------------------------------------------- */

  const nextTest = tests
    .filter(
      (test) =>
        test.status === "upcoming"
    )
    .sort(
      (a, b) =>
        getTestDate(a).getTime() -
        getTestDate(b).getTime()
    )[0]

  /* -------------------------------------------------------
     PENDING TEST
  ------------------------------------------------------- */

  const pendingTest = tests
    .filter(
      (test) =>
        test.status === "pending"
    )
    .sort(
      (a, b) =>
        getTestDate(a).getTime() -
        getTestDate(b).getTime()
    )[0]

  /* -------------------------------------------------------
     TEST ACTIONS
  ------------------------------------------------------- */

  async function addTest(test: Test) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error(
        "No authenticated user found.",
        userError
      )

      alert(
        "Please log in before adding a test."
      )

      return
    }

    const { data, error } = await supabase
      .from("tests")
      .insert({
        user_id: user.id,
        title: test.name,
        test_date: test.date,
        test_time: test.time || null,
        source:
          test.type === "Coaching"
            ? "coaching"
            : "self",
        status: test.status,
        subjects: test.subjects,
        chapters: test.chapters,
        syllabus: null,
      })
      .select()
      .single()

    if (error) {
      console.error(
        "Error adding test:",
        error
      )

      alert(
        "Could not save the test. Check the browser console."
      )

      return
    }

    const savedTest: Test = {
      id: data.id,
      name: data.title,
      date: data.test_date,
      time: data.test_time ?? "",
      type:
        data.source === "coaching"
          ? "Coaching"
          : "Self Test",
      subjects:
        (data.subjects ?? []) as Subject[],
      chapters:
        (data.chapters ?? {}) as Partial<Record<Subject, string[]>>,
      status: data.status as TestStatus,
      createdAt: data.created_at,
    }

    setTests((current) => [
      ...current,
      savedTest,
    ])
  }

  async function saveResult(
    test: Test,
    result: Omit<TestResult, "id" | "testId" | "createdAt">
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("Please log in before saving a test result.")
      return
    }

    const existing = results.find((item) => item.testId === test.id)

    const payload = {
      test_id: test.id,
      user_id: user.id,
      total_marks: result.totalMarks,
      physics_marks: result.physicsMarks,
      chemistry_marks: result.chemistryMarks,
      biology_marks: result.biologyMarks,
      correct: result.correct,
      incorrect: result.incorrect,
      unattempted: result.unattempted,
      accuracy: result.accuracy,
      rank: result.rank ?? null,
    }

    const response = existing
      ? await supabase.from("test_results").update(payload).eq("id", existing.id).select().single()
      : await supabase.from("test_results").insert(payload).select().single()

    if (response.error) {
      console.error("Error saving test result:", response.error)
      alert("Could not save the test result. Check the browser console.")
      return
    }

    const data = response.data
    const saved: TestResult = {
      id: data.id,
      testId: data.test_id,
      totalMarks: data.total_marks ?? 0,
      physicsMarks: data.physics_marks ?? 0,
      chemistryMarks: data.chemistry_marks ?? 0,
      biologyMarks: data.biology_marks ?? 0,
      correct: data.correct ?? 0,
      incorrect: data.incorrect ?? 0,
      unattempted: data.unattempted ?? 0,
      accuracy: Number(data.accuracy ?? 0),
      rank: data.rank ?? undefined,
      createdAt: data.created_at,
    }

    setResults((current) =>
      existing
        ? current.map((item) => item.id === existing.id ? saved : item)
        : [...current, saved]
    )

    await updateTestStatus(test.id, "completed")
  }

  async function updateTestStatus(
    id: string,
    status: TestStatus
  ) {
    const { error } = await supabase
      .from("tests")
      .update({
        status,
      })
      .eq("id", id)

    if (error) {
      console.error(
        "Error updating test status:",
        error
      )

      alert(
        "Could not update the test."
      )

      return
    }

    setTests((current) =>
      current.map((test) =>
        test.id === id
          ? {
              ...test,
              status,
            }
          : test
      )
    )
  }

  async function deleteTest(id: string) {
    const { error } = await supabase
      .from("tests")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(
        "Error deleting test:",
        error
      )

      alert(
        "Could not delete the test."
      )

      return
    }

    setTests((current) =>
      current.filter(
        (test) => test.id !== id
      )
    )
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111111] text-sm text-white/40">
        Loading PreMed…
      </div>
    )
  }

  if (!user) {
    return <AuthPage mode={authMode} setMode={setAuthMode} />
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#111111] text-white">
      <div className="hidden md:block">
        <Sidebar
          page={page}
          setPage={setPage}
          userEmail={user.email ?? ""}
          onLogout={async () => {
            const { error } = await supabase.auth.signOut()
            if (error) console.error("Error signing out:", error)
          }}
        />
      </div>

      <main className="min-h-screen md:ml-64">
        <div className="md:hidden">
          <MobileHeader
            page={page}
            setPage={setPage}
            userEmail={user.email ?? ""}
            onLogout={async () => {
              const { error } = await supabase.auth.signOut()
              if (error) console.error("Error signing out:", error)
            }}
          />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          {page === "Home" && (
            <HomePage
              nextTest={nextTest}
              pendingTest={pendingTest}
              updateTestStatus={updateTestStatus}
              results={results}
              tests={tests}
              user={user}
              studySecondsToday={studySecondsToday}
            />
          )}

          {page === "Tests" && (
            <TestsPage
              tests={tests}
              addTest={addTest}
              updateTestStatus={
                updateTestStatus
              }
              deleteTest={deleteTest}
              results={results}
              saveResult={saveResult}
            />
          )}

          {page === "Syllabus" && (
            <SyllabusPage userId={user.id} />
          )}

          {page === "Focus Timer" && (
            <FocusTimerPage />
          )}

          {page === "Materials" && (
            <MaterialsPage />
          )}

          {page === "Analytics" && (
            <AnalyticsPage tests={tests} results={results} />
          )}

          {page === "Saved" && (
            <PlaceholderPage
              title="Saved"
              description="Keep important resources and items here."
            />
          )}

          {page === "Trash" && (
            <PlaceholderPage
              title="Trash"
              description="Deleted items will appear here."
            />
          )}

          {page === "Settings" && (
            <PlaceholderPage
              title="Settings"
              description="Manage your PreMed account and preferences."
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
