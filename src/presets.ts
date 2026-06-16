import { AnalyzerResult } from "./types";

export const PRESET_DEVELOPERS: Record<string, AnalyzerResult> = {
  torvalds: {
    user: {
      login: "torvalds",
      id: 1024,
      avatar_url: "https://avatars.githubusercontent.com/u/1024?v=4",
      html_url: "https://github.com/torvalds",
      name: "Linus Torvalds",
      bio: "The creator of Linux and Git.",
      public_repos: 7,
      followers: 215000,
      following: 0,
      created_at: "2011-09-03T15:26:12Z"
    },
    repos: [
      {
        id: 2325298,
        name: "linux",
        html_url: "https://github.com/torvalds/linux",
        stargazers_count: 175000,
        language: "C",
        forks_count: 53000,
        description: "Linux kernel source tree"
      },
      {
        id: 123456,
        name: "subsurface-tracker",
        html_url: "https://github.com/torvalds/subsurface-tracker",
        stargazers_count: 2400,
        language: "C",
        forks_count: 500,
        description: "Subsurface dive log tracker"
      },
      {
        id: 789101,
        name: "pesconvert",
        html_url: "https://github.com/torvalds/pesconvert",
        stargazers_count: 850,
        language: "C",
        forks_count: 120,
        description: "Converts embroidery files"
      }
    ],
    starsCount: 178250,
    score: (178250 * 2) + (7 * 5) + (215000 * 10),
    topLanguage: "C",
    languageStats: [
      { language: "C", count: 3, percentage: 100, color: "#5896dc" }
    ],
    memberSince: 2011,
    rank: "Master Elite",
    summary: "Master Elite: A heavyweight C contributor recognized by the global community."
  },
  gaearon: {
    user: {
      login: "gaearon",
      id: 810438,
      avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4",
      html_url: "https://github.com/gaearon",
      name: "Dan Abramov",
      bio: "Co-author of Redux, Create React App, and React core team member.",
      public_repos: 260,
      followers: 88000,
      following: 180,
      created_at: "2011-05-25T11:39:12Z"
    },
    repos: [
      {
        id: 38902509,
        name: "redux",
        html_url: "https://github.com/reduxjs/redux",
        stargazers_count: 61000,
        language: "TypeScript",
        forks_count: 15400,
        description: "Predictable state container for JavaScript apps"
      },
      {
        id: 554302,
        name: "normalizr",
        html_url: "https://github.com/paularmstrong/normalizr",
        stargazers_count: 21000,
        language: "JavaScript",
        forks_count: 1100,
        description: "Normalizes nested JSON according to a schema"
      },
      {
        id: 991823,
        name: "react-hot-loader",
        html_url: "https://github.com/gaearon/react-hot-loader",
        stargazers_count: 11800,
        language: "JavaScript",
        forks_count: 980,
        description: "Tweak React components in real time."
      }
    ],
    starsCount: 93800,
    score: (93800 * 2) + (260 * 5) + (88000 * 10),
    topLanguage: "JavaScript",
    languageStats: [
      { language: "JavaScript", count: 2, percentage: 67, color: "#f7df1e" },
      { language: "TypeScript", count: 1, percentage: 33, color: "#2f74c0" }
    ],
    memberSince: 2011,
    rank: "Master Elite",
    summary: "Master Elite: A heavyweight JavaScript contributor recognized by the community."
  },
  yyx990803: {
    user: {
      login: "yyx990803",
      id: 499550,
      avatar_url: "https://avatars.githubusercontent.com/u/499550?v=4",
      html_url: "https://github.com/yyx990803",
      name: "Evan You",
      bio: "Creator of Vue.js, Vite, and Rolldown. Independent open source developer.",
      public_repos: 184,
      followers: 104000,
      following: 95,
      created_at: "2010-11-28T01:31:12Z"
    },
    repos: [
      {
        id: 11730342,
        name: "vue",
        html_url: "https://github.com/vuejs/vue",
        stargazers_count: 206000,
        language: "TypeScript",
        forks_count: 31000,
        description: "The Progressive JavaScript Framework"
      },
      {
        id: 251640523,
        name: "vite",
        html_url: "https://github.com/vitejs/vite",
        stargazers_count: 67300,
        language: "TypeScript",
        forks_count: 11200,
        description: "Next generation frontend tooling."
      },
      {
        id: 123490,
        name: "vue-cli",
        html_url: "https://github.com/vuejs/vue-cli",
        stargazers_count: 29000,
        language: "JavaScript",
        forks_count: 5600,
        description: "Standard Tooling for Vue.js Development"
      }
    ],
    starsCount: 302300,
    score: (302300 * 2) + (184 * 5) + (104000 * 10),
    topLanguage: "TypeScript",
    languageStats: [
      { language: "TypeScript", count: 2, percentage: 67, color: "#2f74c0" },
      { language: "JavaScript", count: 1, percentage: 33, color: "#f7df1e" }
    ],
    memberSince: 2010,
    rank: "Master Elite",
    summary: "Master Elite: A heavyweight TypeScript contributor recognized by the community."
  }
};
