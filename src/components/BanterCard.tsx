import { motion } from "motion/react";
import { AnalyzerResult } from "../types";

interface BanterCardProps {
  dev1: AnalyzerResult;
  dev2: AnalyzerResult;
}

export function BanterCard({ dev1, dev2 }: BanterCardProps) {
  const name1 = (dev1.user.name || dev1.user.login).trim();
  const name2 = (dev2.user.name || dev2.user.login).trim();

  const getBanterMessage = () => {
    if (dev1.score > dev2.score) {
      const diff = dev1.score - dev2.score;
      if (dev1.user.public_repos < dev2.user.public_repos) {
        return `${name1} leads overall by ${diff} profile points, even with fewer repositories than ${name2}.`;
      }
      if (dev1.user.public_repos > dev2.user.public_repos) {
        return `${name1} leads overall by ${diff} profile points and also owns more repositories than ${name2}.`;
      }
      return `${name1} leads overall by ${diff} profile points.`;
    } else if (dev2.score > dev1.score) {
      const diff = dev2.score - dev1.score;
      if (dev2.user.public_repos < dev1.user.public_repos) {
        return `${name2} leads overall by ${diff} profile points, despite having fewer repositories than ${name1}.`;
      }
      if (dev2.user.public_repos > dev1.user.public_repos) {
        return `${name2} leads overall by ${diff} profile points and also owns more repositories than ${name1}.`;
      }
      return `${name2} leads overall by ${diff} profile points.`;
    } else if (dev1.user.public_repos > dev2.user.public_repos) {
      const diff = dev1.user.public_repos - dev2.user.public_repos;
      return `${name1} has a larger codebase catalog, out-pacing ${name2} by ${diff} public repositories.`;
    } else if (dev2.user.public_repos > dev1.user.public_repos) {
      const diff = dev2.user.public_repos - dev1.user.public_repos;
      return `${name2} has a larger codebase catalog, out-pacing ${name1} by ${diff} public repositories.`;
    } else if (dev1.starsCount > dev2.starsCount) {
      return `${name1} holds greater community validation with higher total project stars than ${name2}.`;
    } else if (dev2.starsCount > dev1.starsCount) {
      return `${name2} holds greater community validation with higher total project stars than ${name1}.`;
    } else if (dev1.user.followers > dev2.user.followers) {
      const diff = dev1.user.followers - dev2.user.followers;
      return `${name1} has stronger social momentum with ${diff} more followers than ${name2}.`;
    } else if (dev2.user.followers > dev1.user.followers) {
      const diff = dev2.user.followers - dev1.user.followers;
      return `${name2} has stronger social momentum with ${diff} more followers than ${name1}.`;
    } else {
      return `Both developers exhibit an identical balance of repositories, stars, and followers.`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="border border-[var(--border)] bg-[var(--surface-alt)]/40 rounded-xl p-6 mt-12 w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5 font-sans text-xs md:text-sm text-center text-[var(--text-muted)] tracking-wide"
    >
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[var(--text)] select-none">
        <span>METRIC INSIGHT:</span>
      </div>
      <div>
        {getBanterMessage()}
      </div>
    </motion.div>
  );
}
