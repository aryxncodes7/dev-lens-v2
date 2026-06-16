export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubRepository {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  description: string | null;
}

export interface AnalyzerResult {
  user: GithubUser;
  repos: GithubRepository[];
  starsCount: number;
  score: number;
  topLanguage: string;
  memberSince: number;
  rank: string;
  summary: string;
}

export interface DeveloperState {
  username: string;
  isLoading: boolean;
  error: string | null;
  data: AnalyzerResult | null;
}
