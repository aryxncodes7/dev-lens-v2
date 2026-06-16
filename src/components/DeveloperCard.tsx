import { motion } from "motion/react";
import { 
  Star, 
  ArrowUpRight, 
  BookMarked
} from "lucide-react";
import { AnalyzerResult } from "../types";

interface DeveloperCardProps {
  data: AnalyzerResult;
  id?: string;
}

export function DeveloperCard({ data, id }: DeveloperCardProps) {
  const { user, repos, starsCount, topLanguage, memberSince, rank, summary, languageStats } = data;
  // Determine active language from the top 3 repositories (most common language)
  const topThreeLangs = repos.slice(0, 3).map((r) => r.language).filter(Boolean);
  let activeLanguage: string | null = null;
  if (topThreeLangs.length > 0) {
    const counts = topThreeLangs.reduce((acc: Record<string, number>, l: string) => {
      acc[l] = (acc[l] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    activeLanguage = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }
  const chartSize = 132;
  const strokeWidth = 16;
  const radius = (chartSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalLanguageCount = languageStats.reduce((sum, stat) => sum + stat.count, 0) || 1;
  let cumulativeOffset = 0;
  const donutSegments = languageStats.map((stat) => {
    const length = (stat.count / totalLanguageCount) * circumference;
    const offset = cumulativeOffset;
    cumulativeOffset += length;
    return { ...stat, length, offset };
  });

  // Extract first name for main headline, full name for badge
  const fullName = (user.name || user.login).trim();
  const firstName = fullName.split(" ")[0].toUpperCase();
  const displayName = firstName;

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 25 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col bg-[var(--surface)] border border-[var(--border)] p-8 sm:p-10 md:p-12 rounded-3xl h-full shadow-xl transition-all duration-300 hover:border-zinc-700/60"
    >
      {/* Identity Block */}
      <div className="mb-8">
        <span className="text-[9px] font-bold tracking-[2.5px] text-[var(--text-muted)] uppercase mb-4 block select-none">
          IDENTITY PROFILE
        </span>
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <img 
            src={user.avatar_url} 
            alt={displayName} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-zinc-700 object-cover shrink-0 select-none pointer-events-none filter grayscale hover:grayscale-0 transition duration-300" 
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-1.5px] sm:tracking-[-2px] uppercase leading-[0.95] text-[var(--text)] name">
              {displayName}
            </h2>
            <div className="flex items-center gap-3 flex-wrap mt-3.5">
              <a 
                href={user.html_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[var(--text-muted)] hover:text-[var(--text)] font-semibold text-xs uppercase tracking-widest inline-flex items-center gap-1.5 transition duration-200 border-b border-transparent hover:border-current"
              >
                @{user.login.toUpperCase()} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="px-3 py-1.5 border border-[var(--border)] text-[10px] font-bold rounded-full uppercase tracking-wider text-[var(--text)] bg-[var(--surface-alt)] select-none">
                {fullName}
              </span>
            </div>
            <p className="text-sm md:text-base text-[var(--text-muted)] mt-5 leading-relaxed font-light italic">
              {user.bio || "No custom status bio registered on GitHub."}
            </p>
          </div>
        </div>
      </div>

      {/* Developer Rating Block */}
      <div className="mb-10">
        <span className="text-[9px] font-bold tracking-[2.5px] text-[var(--text-muted)] uppercase mb-3 block select-none">
          CLASSIFICATION
        </span>
        <div>
          <div className="text-3xl md:text-4xl font-light italic text-[var(--text)] opacity-95">
            {rank}
          </div>
          <div className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mt-2 leading-relaxed">
            {summary}
          </div>
        </div>
      </div>

      {/* Stats Block */}
      <div className="mb-10">
        <span className="text-[9px] font-bold tracking-[2.5px] text-[var(--text-muted)] uppercase mb-5 block select-none">
          PERFORMANCE METRICS
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl md:text-[36px] font-black tracking-tight text-[var(--text)] leading-none stat-num">
              {user.public_repos}
            </span>
            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-2.5">
              REPOSITORIES
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl md:text-[36px] font-black tracking-tight text-[var(--text)] leading-none stat-num">
              {user.followers >= 1000 ? `${(user.followers / 1000).toFixed(1)}K` : user.followers}
            </span>
            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-2.5">
              FOLLOWERS
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl md:text-[36px] font-black tracking-tight text-[var(--text)] leading-none stat-num">
              {user.following >= 1000 ? `${(user.following / 1000).toFixed(1)}K` : user.following}
            </span>
            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-2.5">
              FOLLOWING
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl md:text-[36px] font-black tracking-tight text-[var(--text)] leading-none stat-num">
              {starsCount >= 1000 ? `${(starsCount / 1000).toFixed(1)}K` : starsCount}
            </span>
            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-2.5">
              TOTAL STARS
            </span>
          </div>
        </div>
      </div>

      {/* Language Distribution */}
      <div className="mb-10">
        <span className="text-[9px] font-bold tracking-[2.5px] text-[var(--text-muted)] uppercase mb-5 block select-none">
          LANGUAGE DISTRIBUTION
        </span>
        {languageStats.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6 items-center">
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 132 132" className="w-full h-full">
                  <circle cx="66" cy="66" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
                  {donutSegments.map((segment) => (
                    <circle
                      key={segment.language}
                      cx="66"
                      cy="66"
                      r={radius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                      strokeDashoffset={circumference - segment.offset}
                      strokeLinecap="butt"
                      transform="rotate(-90 66 66)"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase tracking-[2px] text-[var(--text-muted)]">TOP</span>
                  <span className="mt-1 text-sm font-black uppercase tracking-[1px] text-[var(--text)]">{topLanguage === "N/A" ? "N/A" : topLanguage}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {languageStats.map((stat) => (
                <div key={stat.language} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                    <span className="truncate font-bold text-xs uppercase tracking-[1px] text-[var(--text)]">{stat.language}</span>
                  </div>
                  <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">{stat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">No repository language data available yet.</p>
        )}
      </div>

      {/* Top Repositories */}
      <div className="mb-10 flex-grow">
        <span className="text-[9px] font-bold tracking-[2.5px] text-[var(--text-muted)] uppercase mb-4 block select-none">
          PROJECT FOCUS
        </span>
        <div className="space-y-1 max-w-xl">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex justify-between items-center py-3 border-b border-[var(--border)] last:border-0 text-[var(--text)] hover:text-zinc-300 transition-colors duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <BookMarked className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="font-bold text-sm tracking-tight truncate uppercase">{repo.name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded text-xs text-[var(--text-muted)] font-black">
                  <Star className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{repo.stargazers_count}</span>
                </div>
              </a>
            ))
          ) : (
            <p className="text-[var(--text-muted)] text-sm italic tracking-wide">
              NO PUBLIC REPOSITORIES DETECTED.
            </p>
          )}
        </div>
      </div>

      {/* Metas / Tech stack */}
      <div>
        <span className="text-[9px] font-bold tracking-[2.5px] text-[var(--text-muted)] uppercase mb-4 block select-none">
          ENVIRONMENT METRICS
        </span>
        <div className="flex gap-2.5 flex-wrap">
          {activeLanguage && (
            <div className="px-3.5 py-2 border border-[var(--border)] text-[10px] font-bold rounded-lg uppercase tracking-wider text-[var(--text)] bg-[var(--surface-alt)] select-none">
              🚀 ACTIVE IN {activeLanguage.toUpperCase()}
            </div>
          )}
          <div className="px-3.5 py-2 border border-[var(--border)] text-[10px] font-bold rounded-lg uppercase tracking-wider text-[var(--text)] bg-[var(--surface-alt)] select-none">
            📅 MEMBER: SINCE {memberSince}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
