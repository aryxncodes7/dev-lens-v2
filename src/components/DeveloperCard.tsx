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
  const { user, repos, starsCount, topLanguage, memberSince, rank, summary } = data;

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
          <div className="px-3.5 py-2 border border-[var(--border)] text-[10px] font-bold rounded-lg uppercase tracking-wider text-[var(--text)] bg-[var(--surface-alt)] select-none">
            🎨 LANGUAGE: {topLanguage.toUpperCase()}
          </div>
          {repos[0]?.language && (
            <div className="px-3.5 py-2 border border-[var(--border)] text-[10px] font-bold rounded-lg uppercase tracking-wider text-[var(--text)] bg-[var(--surface-alt)] select-none">
              🚀 ACTIVE IN {repos[0].language.toUpperCase()}
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
