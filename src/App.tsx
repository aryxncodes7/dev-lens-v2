import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { DeveloperCard } from "./components/DeveloperCard";
import { BanterCard } from "./components/BanterCard";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { PRESET_DEVELOPERS } from "./presets";
import { AnalyzerResult, DeveloperState } from "./types";
import { Sparkles, HelpCircle, Moon, Sun, ArrowRight, UserPlus, UserMinus, RefreshCw } from "lucide-react";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  C: "#9c27b0",
  Python: "#34a853",
  CSS: "#264de4",
  HTML: "#e34f26",
  Rust: "#dea584",
  Go: "#00add8",
  Shell: "#44b700",
  Ruby: "#cc342d",
  PHP: "#777bb4",
  Java: "#b07219",
  "C++": "#f34b7d",
  Other: "#6b7280"
};

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isCompare, setIsCompare] = useState<boolean>(false);
  const [repoSort, setRepoSort] = useState<"composite" | "popularity" | "activity">("composite");

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

      // Fetch Repository list (fetch many and sort client-side according to selected method)
      const reposRes = await fetch(`https://api.github.com/users/${trimmed}/repos?per_page=100`);
      if (!reposRes.ok) {
        throw new Error("UNABLE TO LOCATE REPOSITORIES");
      }
      const repos = await reposRes.json();

      // Sum star metrics
      const starsCount = (repos || []).reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
      const score = starsCount * 2 + user.public_repos * 5 + user.followers * 10;

      // Classify top programming language
      const langs: Record<string, number> = {};
      (repos || []).forEach((r: any) => {
        if (r.language) {
          langs[r.language] = (langs[r.language] || 0) + 1;
        }
      });
      const topLanguage = Object.keys(langs).reduce((a, b) => (langs[a] > langs[b] ? a : b), "N/A");
      const memberSince = new Date(user.created_at).getFullYear();

      const languageCounts: Record<string, number> = {};
      let languageTotal = 0;
      (repos || []).forEach((r: any) => {
        if (r.language) {
          languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
          languageTotal += 1;
        }
      });

      const languageEntries = Object.entries(languageCounts).sort(([, a], [, b]) => b - a);
      const languageGroups = languageEntries.length > 5
        ? [...languageEntries.slice(0, 4), ["Other", languageEntries.slice(4).reduce((sum, [, count]) => sum + count, 0)]]
        : languageEntries;

      let percentSum = 0;
      const languageStats = languageGroups.map(([language, count], index) => {
        const percentage = index === languageGroups.length - 1
          ? Math.max(0, 100 - percentSum)
          : Math.round((count / languageTotal) * 100);

        percentSum += percentage;
        return {
          language,
          count,
          percentage,
          color: LANGUAGE_COLORS[language] ?? LANGUAGE_COLORS.Other
        };
      });

      // Compute per-repo composite/activity scores to choose top repos
      const now = Date.now();
      const scoredRepos = (repos || []).map((r: any) => {
        const stars = r.stargazers_count || 0;
        const forks = r.forks_count || 0;
        const pushedAt = r.pushed_at ? new Date(r.pushed_at).getTime() : 0;
        const daysSince = pushedAt ? (now - pushedAt) / (1000 * 60 * 60 * 24) : Infinity;
        const recencyScore = Math.max(0, 1 - daysSince / 365); // 1 for very recent, 0 after a year
        const composite = (stars * 0.4) + (forks * 0.4) + (recencyScore * 100 * 0.2); // scale recency to 0-100
        return { ...r, _composite: composite, _pushedAt: pushedAt };
      });

      // Sort according to current repoSort selection
      let sortedRepos: any[] = [];
      if (repoSort === "popularity") {
        sortedRepos = scoredRepos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
      } else if (repoSort === "activity") {
        sortedRepos = scoredRepos.sort((a, b) => (b._pushedAt || 0) - (a._pushedAt || 0));
      } else {
        sortedRepos = scoredRepos.sort((a, b) => (b._composite || 0) - (a._composite || 0));
      }

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
      const structuredRepos = (sortedRepos || []).slice(0, 3).map((r: any) => ({
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
        languageStats,
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

  const isSelfComparison = (candidate: string) => {
    const baseUsername = dev1.username.trim().toLowerCase();
    return baseUsername && baseUsername === candidate.trim().toLowerCase();
  };

  const handleCompareFetch = () => {
    const trimmed = input2.trim();
    if (!trimmed) return;
    // clear previous error and show loading immediately
    setDev2((prev) => ({ ...prev, username: trimmed, isLoading: true, error: null }));

    if (isSelfComparison(trimmed)) {
      setDev2({
        username: trimmed,
        isLoading: false,
        error: "CANNOT COMPARE THE SAME USER TO THEMSELVES. ENTER A DIFFERENT USERNAME.",
        data: null
      });
      return;
    }

    fetchDeveloperData(trimmed, setDev2);
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
            <a href="/" className="inline-block no-underline">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-3px] sm:tracking-[-4px] leading-[0.8] uppercase select-none">
                DEV<span className="text-[var(--accent)]">LENS</span>
              </h1>
            </a>
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
                      if (e.key === "Enter") handleCompareFetch();
                    }}
                    placeholder="COMPARE WITH USERNAME"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] focus:border-zinc-500 focus:outline-none text-[var(--text)] px-4 py-3.5 font-bold transition-all duration-200 uppercase tracking-widest text-xs rounded-xl"
                  />
                  <button 
                    onClick={handleCompareFetch}
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

            {/* Repo sort toggle: Composite (smart), Popularity (stars), Activity (last pushed) */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--text-muted)]">Repo View:</span>
              <div className="inline-flex rounded-lg overflow-hidden border border-[var(--border)]">
                <button onClick={() => { setRepoSort("composite"); if (dev1.username) fetchDeveloperData(dev1.username, setDev1); if (isCompare && dev2.username) fetchDeveloperData(dev2.username, setDev2); }}
                  className={`px-3 py-1 text-xs font-bold ${repoSort === "composite" ? "bg-[var(--surface-alt)]" : "bg-[var(--surface)]"}`}>
                  Smart
                </button>
                <button onClick={() => { setRepoSort("popularity"); if (dev1.username) fetchDeveloperData(dev1.username, setDev1); if (isCompare && dev2.username) fetchDeveloperData(dev2.username, setDev2); }}
                  className={`px-3 py-1 text-xs font-bold ${repoSort === "popularity" ? "bg-[var(--surface-alt)]" : "bg-[var(--surface)]"}`}>
                  Popularity
                </button>
                <button onClick={() => { setRepoSort("activity"); if (dev1.username) fetchDeveloperData(dev1.username, setDev1); if (isCompare && dev2.username) fetchDeveloperData(dev2.username, setDev2); }}
                  className={`px-3 py-1 text-xs font-bold ${repoSort === "activity" ? "bg-[var(--surface-alt)]" : "bg-[var(--surface)]"}`}>
                  Activity
                </button>
              </div>
              <span className="text-xs text-[var(--text-muted)]">(Smart = composite of stars, forks, recent pushes)</span>
            </div>
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
                  Start exploring - Enter a GitHub username to discover their development profile.
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
                    onClick={handleCompareFetch}
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
                    Add another developer name to compare their profiles side-by-side.
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
