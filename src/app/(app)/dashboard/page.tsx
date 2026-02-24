"use client";
// src/app/(app)/dashboard/page.tsx — FlowState Dashboard
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────
type Task = {
    id: string;
    title: string;
    completed: boolean;
    priority: "LOW" | "MEDIUM" | "HIGH";
    pomoEstimate: number;
    pomoDone: number;
    category?: string;
};

type TimerMode = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

type Playlist = {
    id: string;
    name: string;
    emoji: string;
    youtubeId: string;
    isPremium: boolean;
};

// ── Timer Modes Config ────────────────────────────────────
const TIMER_CONFIG: Record<TimerMode, { label: string; seconds: number; color: string }> = {
    FOCUS: { label: "Focus", seconds: 25 * 60, color: "#e8a87c" },
    SHORT_BREAK: { label: "Short Break", seconds: 5 * 60, color: "#7ec8c8" },
    LONG_BREAK: { label: "Long Break", seconds: 15 * 60, color: "#a8d8a8" },
};

// ── Utility ───────────────────────────────────────────────
function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function playBeep() {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
    } catch { /* ignore */ }
}

// ── Priority Badge ────────────────────────────────────────
const PRIORITY_STYLE = {
    HIGH: { bg: "rgba(220,60,60,0.15)", color: "#ff6b6b", label: "HIGH" },
    MEDIUM: { bg: "rgba(232,168,124,0.15)", color: "#e8a87c", label: "MED" },
    LOW: { bg: "rgba(126,200,200,0.15)", color: "#7ec8c8", label: "LOW" },
};

// ─────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    // ── Timer State ──────────────────────────────────────
    const [mode, setMode] = useState<TimerMode>("FOCUS");
    const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.FOCUS.seconds);
    const [running, setRunning] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [pomoCount, setPomoCount] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    // ── Music State ──────────────────────────────────────
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
    const [customUrl, setCustomUrl] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customYtId, setCustomYtId] = useState("");

    // ── Task form ────────────────────────────────────────
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

    // ── Fetch tasks ───────────────────────────────────────
    const { data: tasks = [] } = useQuery<Task[]>({
        queryKey: ["tasks"],
        queryFn: () => axios.get("/api/tasks").then(r => r.data),
        enabled: !!session,
        staleTime: 30_000,
    });

    // ── Fetch playlists ────────────────────────────────────
    const { data: playlists = [] } = useQuery<Playlist[]>({
        queryKey: ["playlists"],
        queryFn: () => axios.get("/api/music").then(r => r.data),
        enabled: !!session,
        staleTime: 300_000,
    });

    // ── Add Task ───────────────────────────────────────────
    const addTaskMutation = useMutation({
        mutationFn: (data: { title: string; priority: string }) =>
            axios.post("/api/tasks", data).then(r => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setNewTaskTitle("");
            toast.success("Task đã thêm!");
        },
        onError: () => toast.error("Không thể thêm task"),
    });

    // ── Toggle task complete ───────────────────────────────
    const toggleTask = useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            axios.patch(`/api/tasks/${id}`, { completed }).then(r => r.data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    // ── Delete task ────────────────────────────────────────
    const deleteTask = useMutation({
        mutationFn: (id: string) => axios.delete(`/api/tasks/${id}`).then(r => r.data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    // ── Timer Logic ────────────────────────────────────────
    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_CONFIG[newMode].seconds);
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    const handleSessionComplete = useCallback(async () => {
        playBeep();
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Save session to DB
        try {
            await axios.post("/api/sessions", {
                type: mode,
                duration: TIMER_CONFIG[mode].seconds,
                completed: true,
                taskId: activeTask?.id ?? null,
            });
        } catch { /* non-critical */ }

        if (mode === "FOCUS") {
            const next = pomoCount + 1;
            setPomoCount(next);
            toast.success(`🍅 Pomodoro #${next} hoàn thành! Nghỉ một chút nhé.`);
            switchMode(next % 4 === 0 ? "LONG_BREAK" : "SHORT_BREAK");
        } else {
            toast.success("⏰ Nghỉ xong! Quay lại làm việc thôi.");
            switchMode("FOCUS");
        }
    }, [mode, pomoCount, activeTask, switchMode]);

    useEffect(() => {
        if (running) {
            startTimeRef.current = Date.now() - (TIMER_CONFIG[mode].seconds - timeLeft) * 1000;
            intervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                const remaining = TIMER_CONFIG[mode].seconds - elapsed;
                if (remaining <= 0) {
                    handleSessionComplete();
                } else {
                    setTimeLeft(remaining);
                }
            }, 500);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, mode, handleSessionComplete]);

    // Update page title
    useEffect(() => {
        document.title = running
            ? `${formatTime(timeLeft)} — ${TIMER_CONFIG[mode].label} | FlowState`
            : "FlowState — Dashboard";
    }, [timeLeft, running, mode]);

    // Timer progress
    const progress = ((TIMER_CONFIG[mode].seconds - timeLeft) / TIMER_CONFIG[mode].seconds) * 100;
    const accent = TIMER_CONFIG[mode].color;
    const circumference = 2 * Math.PI * 110;

    // ── YouTube URL parser ─────────────────────────────────
    function parseYouTubeId(url: string) {
        const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
        return match?.[1] ?? null;
    }

    const handleCustomUrl = () => {
        const id = parseYouTubeId(customUrl);
        if (!id) { toast.error("URL YouTube không hợp lệ"); return; }
        setCustomYtId(id);
        setCurrentPlaylist(null);
        setShowCustomInput(false);
        setCustomUrl("");
    };

    const activeMusicId = currentPlaylist?.youtubeId ?? customYtId;

    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    // ── Styles ─────────────────────────────────────────────
    const S = {
        page: {
            minHeight: "100vh",
            background: "#0d0f14",
            color: "#e8e2d9",
            fontFamily: "'Inter', system-ui, sans-serif",
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gridTemplateRows: "60px 1fr",
        } as React.CSSProperties,
        navbar: {
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            background: "rgba(9,12,18,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            position: "sticky" as const,
            top: 0,
            zIndex: 50,
        },
        main: {
            padding: "28px",
            overflowY: "auto" as const,
            display: "flex",
            flexDirection: "column" as const,
            gap: 24,
        },
        sidebar: {
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            overflowY: "auto" as const,
            display: "flex",
            flexDirection: "column" as const,
            gap: 0,
        },
        card: {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 24,
        },
        sideSection: {
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
        },
        sectionTitle: {
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "rgba(232,226,217,0.4)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
            marginBottom: 14,
        },
        btn: (bg: string, fg: string = "#fff") => ({
            padding: "8px 18px",
            borderRadius: 12,
            background: bg,
            color: fg,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.82rem",
        }),
        input: {
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "9px 14px",
            color: "#e8e2d9",
            fontSize: "0.88rem",
            outline: "none",
        } as React.CSSProperties,
    };

    return (
        <div style={S.page}>
            {/* ── Navbar ── */}
            <nav style={S.navbar}>
                <span style={{ fontFamily: "Lora, serif", color: "#e8a87c", fontSize: "1rem" }}>
                    🌿 FlowState
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {session?.user?.image && (
                        <img src={session.user.image} alt="avatar"
                            style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid rgba(232,168,124,0.4)" }} />
                    )}
                    <span style={{ fontSize: "0.82rem", color: "rgba(232,226,217,0.6)" }}>
                        {session?.user?.name ?? "Guest"}
                    </span>
                </div>
            </nav>

            {/* ── Main (Timer + Tasks) ── */}
            <main style={S.main}>

                {/* Timer Card */}
                <div style={S.card}>
                    {/* Mode tabs */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center" }}>
                        {(["FOCUS", "SHORT_BREAK", "LONG_BREAK"] as TimerMode[]).map(m => (
                            <button key={m} onClick={() => switchMode(m)}
                                style={{
                                    padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                                    fontSize: "0.78rem", fontWeight: 600,
                                    background: mode === m ? TIMER_CONFIG[m].color : "rgba(255,255,255,0.06)",
                                    color: mode === m ? "#0d0f14" : "rgba(232,226,217,0.5)",
                                    transition: "all 0.2s",
                                }}>
                                {TIMER_CONFIG[m].label}
                            </button>
                        ))}
                    </div>

                    {/* Ring Timer */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                        <div style={{ position: "relative", width: 260, height: 260 }}>
                            <svg width="260" height="260" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                                <circle cx="130" cy="130" r="110" fill="none"
                                    stroke={accent} strokeWidth="10"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference * (1 - progress / 100)}
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.5s" }} />
                            </svg>
                            <div style={{
                                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: 4,
                            }}>
                                <div style={{ fontFamily: "Lora, serif", fontSize: "3.2rem", fontWeight: 600, color: accent, letterSpacing: "-0.02em" }}>
                                    {formatTime(timeLeft)}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "rgba(232,226,217,0.4)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                                    {TIMER_CONFIG[mode].label}
                                </div>
                                {activeTask && (
                                    <div style={{ fontSize: "0.72rem", color: "rgba(232,226,217,0.5)", maxWidth: 160, textAlign: "center", marginTop: 4, lineHeight: 1.4 }}>
                                        📌 {activeTask.title}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <button onClick={() => switchMode(mode)}
                                style={{ ...S.btn("rgba(255,255,255,0.06)", "rgba(232,226,217,0.5)"), padding: "10px 16px" }}>
                                ↺
                            </button>
                            <button onClick={() => setRunning(r => !r)}
                                style={{
                                    padding: "14px 48px", borderRadius: 28, border: "none", cursor: "pointer",
                                    background: accent, color: "#0d0f14", fontWeight: 700, fontSize: "1rem",
                                    boxShadow: `0 4px 24px ${accent}50`,
                                    transition: "transform 0.1s",
                                }}>
                                {running ? "⏸ Pause" : "▶ Start"}
                            </button>
                            <div style={{ fontSize: "0.78rem", color: "rgba(232,226,217,0.4)", textAlign: "center" }}>
                                🍅 {pomoCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks Card */}
                <div style={S.card}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                        <h2 style={{ fontFamily: "Lora, serif", fontSize: "1.1rem", margin: 0 }}>Tasks</h2>
                        <span style={{ fontSize: "0.75rem", color: "rgba(232,226,217,0.4)" }}>
                            {pendingTasks.length} remaining · {completedTasks.length} done
                        </span>
                    </div>

                    {/* Add task form */}
                    <form onSubmit={e => {
                        e.preventDefault();
                        if (!newTaskTitle.trim()) return;
                        addTaskMutation.mutate({ title: newTaskTitle.trim(), priority: newTaskPriority });
                    }} style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                        <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                            placeholder="Thêm task mới..."
                            style={{ ...S.input, flex: 1 }} />
                        <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                            style={{ ...S.input, width: 90 }}>
                            <option value="HIGH">🔴 High</option>
                            <option value="MEDIUM">🟡 Med</option>
                            <option value="LOW">🟢 Low</option>
                        </select>
                        <button type="submit" style={S.btn(accent, "#0d0f14")} disabled={addTaskMutation.isPending}>
                            +
                        </button>
                    </form>

                    {/* Task list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {pendingTasks.length === 0 && (
                            <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(232,226,217,0.3)", fontSize: "0.85rem" }}>
                                🎉 Không có task nào! Thêm task mới để bắt đầu.
                            </div>
                        )}
                        {pendingTasks.map(task => {
                            const p = PRIORITY_STYLE[task.priority];
                            const isActive = activeTask?.id === task.id;
                            return (
                                <div key={task.id} style={{
                                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                                    borderRadius: 12, border: `1px solid ${isActive ? accent + "40" : "rgba(255,255,255,0.06)"}`,
                                    background: isActive ? `${accent}08` : "rgba(255,255,255,0.02)",
                                    transition: "all 0.2s",
                                }}>
                                    <input type="checkbox" checked={false}
                                        onChange={() => toggleTask.mutate({ id: task.id, completed: true })}
                                        style={{ accentColor: accent, width: 16, height: 16, cursor: "pointer" }} />
                                    <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setActiveTask(isActive ? null : task)}>
                                        <div style={{ fontSize: "0.88rem" }}>{task.title}</div>
                                        <div style={{ fontSize: "0.7rem", color: "rgba(232,226,217,0.4)", marginTop: 2 }}>
                                            🍅 {task.pomoDone}/{task.pomoEstimate}
                                            {task.category && ` · ${task.category}`}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                                        background: p.bg, color: p.color
                                    }}>
                                        {p.label}
                                    </span>
                                    {isActive && (
                                        <span style={{
                                            fontSize: "0.65rem", padding: "2px 7px", borderRadius: 6,
                                            background: `${accent}20`, color: accent
                                        }}>
                                            ACTIVE
                                        </span>
                                    )}
                                    <button onClick={() => deleteTask.mutate(task.id)}
                                        style={{
                                            background: "none", border: "none", color: "rgba(232,226,217,0.2)",
                                            cursor: "pointer", fontSize: "0.9rem", padding: 4
                                        }}>
                                        ×
                                    </button>
                                </div>
                            );
                        })}

                        {/* Completed tasks */}
                        {completedTasks.length > 0 && (
                            <details style={{ marginTop: 8 }}>
                                <summary style={{
                                    fontSize: "0.78rem", color: "rgba(232,226,217,0.3)",
                                    cursor: "pointer", padding: "6px 0", userSelect: "none"
                                }}>
                                    ✓ {completedTasks.length} task đã xong
                                </summary>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                                    {completedTasks.map(task => (
                                        <div key={task.id} style={{
                                            display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
                                            borderRadius: 10, opacity: 0.4,
                                        }}>
                                            <input type="checkbox" checked onChange={() => toggleTask.mutate({ id: task.id, completed: false })}
                                                style={{ accentColor: "#7ec8c8", width: 16, height: 16, cursor: "pointer" }} />
                                            <span style={{ fontSize: "0.85rem", textDecoration: "line-through" }}>{task.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            </main>

            {/* ── Sidebar (Music) ── */}
            <aside style={S.sidebar}>
                {/* Music Section */}
                <div style={{ ...S.sideSection, flex: 1 }}>
                    <div style={S.sectionTitle}>🎵 Lofi Radio</div>

                    {/* YouTube Player */}
                    {activeMusicId ? (
                        <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 16, aspectRatio: "16/9" }}>
                            <iframe
                                width="100%" height="100%"
                                src={`https://www.youtube.com/embed/${activeMusicId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                allowFullScreen
                                style={{ border: "none", display: "block" }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            aspectRatio: "16/9", borderRadius: 14, border: "1px dashed rgba(255,255,255,0.1)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            gap: 8, marginBottom: 16, color: "rgba(232,226,217,0.3)",
                        }}>
                            <div style={{ fontSize: "2rem" }}>🎵</div>
                            <div style={{ fontSize: "0.78rem" }}>Chọn playlist để phát nhạc</div>
                        </div>
                    )}

                    {/* Playlists */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                        {playlists.map(pl => (
                            <button key={pl.id} onClick={() => { setCurrentPlaylist(pl); setCustomYtId(""); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                                    borderRadius: 12, border: `1px solid ${currentPlaylist?.id === pl.id ? "#7ec8c840" : "rgba(255,255,255,0.06)"}`,
                                    background: currentPlaylist?.id === pl.id ? "rgba(126,200,200,0.08)" : "rgba(255,255,255,0.02)",
                                    cursor: "pointer", textAlign: "left",
                                }}>
                                <span style={{ fontSize: "1.2rem" }}>{pl.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.82rem", color: "#e8e2d9", fontWeight: 500 }}>{pl.name}</div>
                                </div>
                                {currentPlaylist?.id === pl.id && (
                                    <span style={{ fontSize: "0.65rem", color: "#7ec8c8" }}>▶</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Custom URL */}
                    {showCustomInput ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <input value={customUrl} onChange={e => setCustomUrl(e.target.value)}
                                placeholder="Paste YouTube URL..."
                                style={{ ...S.input, fontSize: "0.8rem" }} />
                            <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={handleCustomUrl} style={{ ...S.btn("#7ec8c8", "#0d0f14"), flex: 1 }}>
                                    Phát
                                </button>
                                <button onClick={() => setShowCustomInput(false)}
                                    style={{ ...S.btn("rgba(255,255,255,0.06)", "rgba(232,226,217,0.5)") }}>
                                    Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowCustomInput(true)}
                            style={{
                                width: "100%", padding: "9px", borderRadius: 10,
                                border: "1px dashed rgba(255,255,255,0.1)",
                                background: "transparent", color: "rgba(232,226,217,0.4)",
                                cursor: "pointer", fontSize: "0.78rem",
                            }}>
                            + Custom YouTube URL
                        </button>
                    )}
                </div>

                {/* Stats Section */}
                <div style={S.sideSection}>
                    <div style={S.sectionTitle}>📊 Hôm nay</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                            { label: "Pomodoros", value: pomoCount, icon: "🍅", color: "#e8a87c" },
                            { label: "Tasks xong", value: completedTasks.length, icon: "✅", color: "#7ec8c8" },
                            { label: "Focus time", value: `${Math.round(pomoCount * 25 / 60 * 10) / 10}h`, icon: "⏱", color: "#a8d8a8" },
                            { label: "Tasks còn", value: pendingTasks.length, icon: "📋", color: "#e8a87c" },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px 14px",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}>
                                <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>{stat.icon}</div>
                                <div style={{ fontFamily: "Lora, serif", fontSize: "1.4rem", color: stat.color, fontWeight: 600 }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: "0.65rem", color: "rgba(232,226,217,0.35)", marginTop: 2 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Session info */}
                <div style={{ ...S.sideSection, borderBottom: "none" }}>
                    <div style={S.sectionTitle}>💡 Tips</div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(232,226,217,0.4)", lineHeight: 1.7 }}>
                        Nhấn vào task để chọn làm, rồi bấm Start timer.<br />
                        Sau 4 pomodoros, nghỉ dài 15 phút.
                    </div>
                </div>
            </aside>
        </div>
    );
}
