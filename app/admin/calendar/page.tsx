'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

// ── Types ──────────────────────────────────────────────
interface CalendarEvent {
    id: string
    title: string
    date: string
    type: 'deadline' | 'lead' | 'milestone'
    color: string
    meta?: string
}

interface CrmTask {
    id: string; title: string; type: string; status: string; priority: string
    dueDate: string | null; project: { title: string }
}

interface Lead {
    id: string; name: string; subject: string; status: string; label: string; createdAt: string
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarPage() {
    const now = new Date()
    const [currentMonth, setCurrentMonth] = useState(now.getMonth())
    const [currentYear, setCurrentYear] = useState(now.getFullYear())
    const [tasks, setTasks] = useState<CrmTask[]>([])
    const [leads, setLeads] = useState<Lead[]>([])
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const [tasksRes, leadsRes] = await Promise.all([
                fetch('/api/admin/crm/tasks'),
                fetch('/api/contact'),
            ])
            if (tasksRes.ok) {
                const data = await tasksRes.json()
                setTasks(data.tasks || data)
            }
            if (leadsRes.ok) setLeads(await leadsRes.json())
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    // Build events map: date string -> events
    const events = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {}
        const addEvent = (e: CalendarEvent) => {
            const key = e.date
            if (!map[key]) map[key] = []
            map[key].push(e)
        }

        // CRM task deadlines
        tasks.forEach(t => {
            if (!t.dueDate || t.status === 'done') return
            const d = new Date(t.dueDate)
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            const colors: Record<string, string> = {
                urgent: 'bg-red-500', high: 'bg-amber-500', medium: 'bg-blue-500', low: 'bg-gray-500'
            }
            addEvent({
                id: t.id,
                title: t.title,
                date: dateStr,
                type: t.type === 'milestone' ? 'milestone' : 'deadline',
                color: colors[t.priority] || 'bg-blue-500',
                meta: `${t.project.title} · ${t.priority}`,
            })
        })

        // Lead creation dates
        leads.forEach(l => {
            if (['archived', 'lost'].includes(l.status)) return
            const d = new Date(l.createdAt)
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            addEvent({
                id: l.id,
                title: l.name,
                date: dateStr,
                type: 'lead',
                color: l.label === 'hot' ? 'bg-red-400' : l.label === 'warm' ? 'bg-amber-400' : 'bg-cyan-400',
                meta: l.subject,
            })
        })

        return map
    }, [tasks, leads])

    // Calendar grid logic
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    // Monday = 0, Sunday = 6  (getDay: Sun=0...Sat=6)
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
        else setCurrentMonth(m => m - 1)
        setSelectedDay(null)
    }
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
        else setCurrentMonth(m => m + 1)
        setSelectedDay(null)
    }
    const goToToday = () => {
        setCurrentMonth(now.getMonth())
        setCurrentYear(now.getFullYear())
        setSelectedDay(now.getDate())
    }

    const selectedDateStr = selectedDay
        ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        : null
    const selectedEvents = selectedDateStr ? (events[selectedDateStr] || []) : []

    // Today's date string
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--neon-cyan)]" />
            </div>
        )
    }

    // Count upcoming and overdue
    const todayMs = now.getTime()
    const upcoming = tasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate).getTime() > todayMs && new Date(t.dueDate).getTime() - todayMs < 7 * 86400000).length
    const overdue = tasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate).getTime() < todayMs).length

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Calendar</h1>
            <p className="text-[var(--text-muted)] text-sm mb-6">Task deadlines and lead timeline</p>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="cyber-card p-3 text-center">
                    <div className="text-xl font-bold text-amber-400">{upcoming}</div>
                    <div className="text-xs text-[var(--text-muted)]">Due This Week</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-xl font-bold text-red-400">{overdue}</div>
                    <div className="text-xs text-[var(--text-muted)]">Overdue</div>
                </div>
                <div className="cyber-card p-3 text-center">
                    <div className="text-xl font-bold text-cyan-400">{leads.filter(l => !['archived', 'lost'].includes(l.status)).length}</div>
                    <div className="text-xs text-[var(--text-muted)]">Active Leads</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 cyber-card p-5">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-sm flex items-center justify-center transition-all">
                            ←
                        </button>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold">{MONTHS[currentMonth]} {currentYear}</h2>
                            <button onClick={goToToday} className="text-xs text-[var(--neon-cyan)] hover:underline">Today</button>
                        </div>
                        <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-sm flex items-center justify-center transition-all">
                            →
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-xs text-[var(--text-muted)] py-1 font-medium">{d}</div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for offset */}
                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}

                        {/* Day cells */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                            const dayEvents = events[dateStr] || []
                            const isToday = dateStr === todayStr
                            const isSelected = selectedDay === day

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                                    className={`aspect-square rounded-lg p-1 text-sm transition-all relative flex flex-col items-center 
                                        ${isToday ? 'ring-1 ring-[var(--neon-cyan)]' : ''}
                                        ${isSelected ? 'bg-[var(--neon-cyan)]/15 border border-[var(--neon-cyan)]/40' : 'hover:bg-[var(--bg-secondary)]'}
                                        ${dayEvents.length > 0 ? 'font-medium' : 'text-[var(--text-muted)]'}
                                    `}
                                >
                                    <span className={`text-xs ${isToday ? 'text-[var(--neon-cyan)] font-bold' : ''}`}>{day}</span>
                                    {/* Event dots */}
                                    {dayEvents.length > 0 && (
                                        <div className="flex gap-0.5 mt-auto flex-wrap justify-center">
                                            {dayEvents.slice(0, 3).map((e, idx) => (
                                                <span key={idx} className={`w-1.5 h-1.5 rounded-full ${e.color}`} />
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <span className="text-[8px] text-[var(--text-muted)]">+{dayEvents.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Urgent</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> High</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Medium</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Lead</span>
                    </div>
                </div>

                {/* Day Detail Panel */}
                <div className="cyber-card p-5">
                    {selectedDay ? (
                        <>
                            <h3 className="font-semibold mb-4">
                                {MONTHS[currentMonth]} {selectedDay}, {currentYear}
                            </h3>
                            {selectedEvents.length === 0 ? (
                                <p className="text-sm text-[var(--text-muted)] py-4 text-center">Nothing scheduled</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedEvents.map(e => (
                                        <div key={e.id} className="p-3 rounded-lg bg-[var(--bg-secondary)] border-l-3" style={{ borderLeftColor: e.color.replace('bg-', '').includes('red') ? '#ef4444' : e.color.includes('amber') ? '#f59e0b' : e.color.includes('cyan') ? '#22d3ee' : '#3b82f6', borderLeftWidth: '3px' }}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs">
                                                    {e.type === 'lead' ? '👤' : e.type === 'milestone' ? '🏆' : '📋'}
                                                </span>
                                                <span className="text-sm font-medium">{e.title}</span>
                                            </div>
                                            {e.meta && (
                                                <p className="text-xs text-[var(--text-muted)] ml-5">{e.meta}</p>
                                            )}
                                            <span className="text-[10px] text-[var(--text-muted)] ml-5 capitalize">{e.type}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-3xl mb-2">📅</div>
                            <p className="text-sm text-[var(--text-muted)]">Click a day to see details</p>
                        </div>
                    )}

                    {/* Upcoming deadlines quick list */}
                    <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
                        <h4 className="text-xs font-medium text-[var(--text-muted)] mb-3">UPCOMING DEADLINES</h4>
                        {tasks
                            .filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) >= new Date())
                            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                            .slice(0, 5)
                            .map(t => {
                                const d = new Date(t.dueDate!)
                                const daysLeft = Math.ceil((d.getTime() - todayMs) / 86400000)
                                return (
                                    <div key={t.id} className="flex items-center justify-between py-1.5 text-xs">
                                        <span className="truncate flex-grow">{t.title}</span>
                                        <span className={`flex-shrink-0 ml-2 ${daysLeft <= 2 ? 'text-amber-400' : 'text-[var(--text-muted)]'}`}>
                                            {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                                        </span>
                                    </div>
                                )
                            })}
                        {tasks.filter(t => t.dueDate && t.status !== 'done' && new Date(t.dueDate) >= new Date()).length === 0 && (
                            <p className="text-xs text-[var(--text-muted)]">No upcoming deadlines</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
