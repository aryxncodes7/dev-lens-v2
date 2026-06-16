import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { DeveloperCard } from "./components/DeveloperCard";
import { BanterCard } from "./components/BanterCard";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { PRESET_DEVELOPERS } from "./presets";
import { AnalyzerResult, DeveloperState } from "./types";
import { Sparkles, HelpCircle, Moon, Sun, ArrowRight, UserPlus, UserMinus, RefreshCw } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isCompare, setIsCompare] = useState<boolean>(false);

  // Developer States
  const [dev1, setDev1] = useState<DeveloperState>({
    username: "",
    isLoading: false,
    error: null,
    data: null,
  });

  const [dev2, setDev2] = useState<DeveloperState>({
    username: "",
    isLoading: false,
    error: null,
    data: null,
  });

  // Custom user inputs before search
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  // Sync theme with document class or attribute
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  // Handle Fetching
  const fetchDeveloperData = async (
    username: string, 
    setDev: Dispatch<SetStateAction<DeveloperState>>
  ) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setDev((prev) => ({ ...prev, isLoading: true, error: null }));

    // Check if preset matches (case insensitive check for instantaneous load)
    const presetKey = trimmed.toLowerCase();
    if (PRESET_DEVELOPERS[presetKey]) {
      // Simulate real short latency for beautiful UI loading cue
      setTimeout(() => {
        setDev({
          username: trimmed,
          isLoading: false,
          error: null,
          data: PRESET_DEVELOPERS[presetKey],
        });
      }, 400);
      return;
    }

    try {
      // Fetch GitHub User details
      const userRes = await fetch(`https://api.github.com/users/${trimmed}`);
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error("GITHUB USER NOT FOUND");
        } else if (userRes.status === 403) {
          throw new Error("GITHUB API RATE LIMIT EXCEEDED. TRY PRESETS BELOW.");
        } else {
          throw new Error(`CONNECTION ISSUE (${userRes.statusText})`);
        }
      }
      const user = await userRes.json();

      // Fetch Repository list
      const reposRes = await fetch(`https://api.github.com/users/${trimmed}/repos?per_page=100&sort=stars`);
      if (!reposRes.ok) {
        throw new Error("UNABLE TO LOCATE REPOSITORIES");
      }
      const repos = await reposRes.json();

      // Sum star metrics
      const starsCount = (repos || []).reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
      const score = starsCount * 2 + user.public_repos * 5 + user.followers * 10;

      // Classicate top programming language
      const langs: Record<string, number> = {};
      (repos || []).forEach((r: any) => {
        if (r.language) {
          langs[r.language] = (langs[r.language] || 0) + 1;
        }
      });
      const topLanguage = Object.keys(langs).reduce((a, b) => (langs[a] > langs[b] ? a : b), "N/A");
      const memberSince = new Date(user.created_at).getFullYear();

      // Generate visual badges and custom rating descriptors
      let rank = "Apprentice";
      let summary = `JUST STARTING OUT IN ${topLanguage ? topLanguage.toUpperCase() : "DEV"}, FOCUSING ON FRONTEND AND BASICS.`;

      if (score > 100) {
        rank = "Rising Star";
        summary = `MAKING SIGNIFICANT WAVES IN ${topLanguage.toUpperCase()} SCENE WITH GROWING REPOSITORY CODEBASES.`;
      }
      if (score > 500) {
        rank = "Professional";
        summary = `A SEASONED ${topLanguage.toUpperCase()} VETERAN PRODUCING ROBUST, COMPREHENSIVE REPOSITORIES.`;
      }
      if (score > 2000) {
        rank = "Master Elite";
        summary = `A HEAVYWEIGHT CODER RECOGNIZED WORLDWIDE AS AN AUTHORITY IN ${topLanguage.toUpperCase()}.`;
      }

      // Format parsed repositories
      const structuredRepos = (repos || []).slice(0, 3).map((r: any) => ({
        id: r.id,
        name: r.name,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        language: r.language,
        forks_count: r.forks_count,
        description: r.description
      }));

      const payload: AnalyzerResult = {
        user: {
          login: user.login,
          id: user.id,
          avatar_url: user.avatar_url,
          html_url: user.html_url,
          name: user.name,
          bio: user.bio,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          created_at: user.created_at
        },
        repos: structuredRepos,
        starsCount,
        score,
        topLanguage,
        memberSince,
        rank,
        summary
      };

      setDev({
        username: trimmed,
        isLoading: false,
        error: null,
        data: payload
      });
    } catch (err: any) {
      setDev({
        username: trimmed,
        isLoading: false,
        error: err.message || "UNABLE TO RESOLVE DEV PROFILE",
        data: null
      });
    }
  };

  const handleApplyPreset = (key: string, selector: 1 | 2) => {
    const preset = PRESET_DEVELOPERS[key];
    if (selector === 1) {
      setInput1(preset.user.login);
      setDev1({
        username: preset.user.login,
        isLoading: false,
        error: null,
        data: preset
      });
    } else {
      setInput2(preset.user.login);
      setDev2({
        username: preset.user.login,
        isLoading: false,
        error: null,
        data: preset
      });
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col min-h-screen">
        
        {/* HEADER BRANDING */}
        <header className="flex justify-between items-end mb-12 border-b border-[var(--border)] pb-8">
          <div className="flex flex-col">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-3px] sm:tracking-[-4px] leading-[0.8] uppercase select-none">
              DEV<span className="text-[var(--accent)]">LENS</span>
            </h1>
            <p className="text-[10px] font-bold tracking-[3px] text-[var(--text-muted)] uppercase mt-4">
              GitHub Profile Analyzer
            </p>
          </div>
          
          {/* THEME SWITCHER */}
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-alt)] flex items-center justify-center transition-all duration-200 select-none text-[var(--text)] text-lg cursor-pointer"
            title="Toggle theme mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>
        </header>

        {/* CONTROLS BAR */}
        <section className="bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-10 rounded-3xl mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* FIRST DEVELOPER INPUT */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-2.5">
                <input 
                  type="text" 
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchDeveloperData(input1, setDev1);
                  }}
                  placeholder="USERNAME"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] focus:border-zinc-500 focus:outline-none text-[var(--text)] px-4 py-3.5 font-bold transition-all duration-200 uppercase tracking-widest text-xs rounded-xl"
                />
                <button 
                  onClick={() => fetchDeveloperData(input1, setDev1)}
                  disabled={dev1.isLoading}
                  className="px-6 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 text-white font-bold uppercase text-xs tracking-[2px] rounded-xl transition-all duration-200 flex items-center gap-2 select-none shrink-0"
                >
                  ANALYZE <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SECOND DEVELOPER INPUT (COMPARE) */}
            <div className="flex flex-col gap-3">
              {isCompare ? (
                <div className="flex gap-2.5">
                  <input 
                    type="text" 
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") fetchDeveloperData(input2, setDev2);
                    }}
                    placeholder="COMPARE WITH USERNAME"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] focus:border-zinc-500 focus:outline-none text-[var(--text)] px-4 py-3.5 font-bold transition-all duration-200 uppercase tracking-widest text-xs rounded-xl"
                  />
                  <button 
                    onClick={() => fetchDeveloperData(input2, setDev2)}
                    disabled={dev2.isLoading}
                    className="px-6 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 text-white font-bold uppercase text-xs tracking-[2px] rounded-xl transition-all duration-200 flex items-center gap-2 select-none shrink-0"
                  >
                    COMPARE
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCompare(true)}
                  className="w-full h-full min-h-[48px] bg-[var(--surface-alt)] hover:bg-[var(--surface)] text-zinc-400 hover:text-[var(--text)] border border-dashed border-[var(--border)] rounded-xl font-bold uppercase text-xs tracking-[2px] transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> ENABLE COMPARISON
                </button>
              )}
            </div>

          </div>

          {isCompare && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsCompare(false)}
                className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-[2px] flex items-center gap-1.5 select-none transition duration-150 cursor-pointer"
              >
                <UserMinus className="w-3.5 h-3.5" /> REMOVE COMPARATIVE VIEW
              </button>
            </div>
          )}
        </section>

        {/* PRIMARY DASHBOARD LAYOUT GRID */}
        <main className={`grid gap-12 flex-grow ${isCompare ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto w-full"}`}>
          
          {/* DEVELOPER 1 VIEW */}
          <div className="h-full">
            {dev1.isLoading ? (
              <SkeletonLoader />
            ) : dev1.error ? (
              <div className="border border-red-500/20 bg-red-500/5 p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[400px]">
                <HelpCircle className="w-12 h-12 text-red-500 mb-3 animate-bounce" />
                <h3 className="font-extrabold text-red-500 tracking-wider text-xl uppercase mb-1">DATA FLOW PAUSED</h3>
                <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-4">{dev1.error}</p>
                <button 
                  onClick={() => fetchDeveloperData(dev1.username, setDev1)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-[900] uppercase tracking-widest rounded-lg transition"
                >
                  RETRY CONNECTION
                </button>
              </div>
            ) : dev1.data ? (
              <DeveloperCard data={dev1.data} id="view1" />
            ) : (
              <div className="border border-dashed border-[var(--border)] rounded-2xl p-10 text-center flex items-center justify-center min-h-[400px]">
                <p className="text-[var(--text-muted)] font-medium text-sm tracking-wide">
                  Enter a GitHub username above to search and analyze.
                </p>
              </div>
            )}
          </div>

          {/* DEVELOPER 2 VIEW */}
          {isCompare && (
            <div className="h-full">
              {dev2.isLoading ? (
                <SkeletonLoader />
              ) : dev2.error ? (
                <div className="border border-red-500/20 bg-red-500/5 p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[400px]">
                  <HelpCircle className="w-12 h-12 text-red-500 mb-3 animate-bounce" />
                  <h3 className="font-extrabold text-red-500 tracking-wider text-xl uppercase mb-1">DATA FLOW PAUSED</h3>
                  <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-4">{dev2.error}</p>
                  <button 
                    onClick={() => fetchDeveloperData(dev2.username, setDev2)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-[900] uppercase tracking-widest rounded-lg transition"
                  >
                    RETRY CONNECTION
                  </button>
                </div>
              ) : dev2.data ? (
                <DeveloperCard data={dev2.data} id="view2" />
              ) : (
                <div className="border border-dashed border-[var(--border)] rounded-2xl p-10 text-center flex items-center justify-center min-h-[400px]">
                  <p className="text-[var(--text-muted)] font-medium text-sm tracking-wide">
                    Enter another username above to compare with the first profile.
                  </p>
                </div>
              )}
            </div>
          )}

        </main>

        {/* BANTER SKEWED BOARD */}
        {isCompare && dev1.data && dev2.data && (
          <BanterCard dev1={dev1.data} dev2={dev2.data} />
        )}

        {/* METADATA FOOTER */}
        <footer className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-[2px] text-[var(--text-muted)] uppercase gap-4">
          <div>
            POWERED BY PUBLIC API DATA
          </div>
          <div>
            CREATED BY ARYAN RAJ
          </div>
        </footer>

      </div>
    </div>
  );
}
