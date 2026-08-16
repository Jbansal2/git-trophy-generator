import { fetchAllGitHubStats } from "./githubGraphQL.js";

/**
 * Get rank title based on category and rank
 */
function getRankTitle(rank, category) {
  const titles = {
    Stars: {
      SSS: "Legendary Project",
      SS: "Superstar",
      AAA: "Ultra Star",
      AA: "Mega Star",
      S: "Acclaimed",
      A: "Popular",
      B: "Rising Star",
      C: "Emerging",
      D: "Rookie",
    },
    Commits: {
      SSS: "Relentless Coder",
      SS: "Commit Machine",
      AAA: "Code Warrior",
      AA: "Code Master",
      S: "Committer",
      A: "Dedicated",
      B: "Consistent",
      C: "Active",
      D: "Rookie",
    },
    Issues: {
      SSS: "Bug Slayer",
      SS: "Guardian",
      AAA: "Bug Hunter",
      AA: "Issue Solver",
      S: "Fixer",
      A: "Debugger",
      B: "Investigator",
      C: "Reporter",
      D: "Rookie",
    },
    "Pull Requests": {
      SSS: "Integration Legend",
      SS: "Merge Master",
      AAA: "PR Champion",
      AA: "Merge Expert",
      S: "Merger",
      A: "Collaborator",
      B: "Contributor",
      C: "Helper",
      D: "Rookie",
    },
    Followers: {
      SSS: "Celebrity",
      SS: "Icon",
      AAA: "Influencer Elite",
      AA: "Rising Star",
      S: "Community Leader",
      A: "Influencer",
      B: "Rising Voice",
      C: "Known",
      D: "Rookie",
    },
    Repositories: {
      SSS: "Empire Builder",
      SS: "Founder",
      AAA: "Repository King",
      AA: "Project Master",
      S: "Architect",
      A: "Creator",
      B: "Builder",
      C: "Starter",
      D: "Rookie",
    },
    Experience: {
      SSS: "Legend",
      SS: "Master",
      AAA: "Ancient One",
      AA: "Elder",
      S: "Veteran",
      A: "Journeyman",
      B: "Apprentice",
      C: "Learner",
      D: "Rookie",
    },
  };

  return titles[category]?.[rank] || "Rookie";
}

/**
 * Calculate rank based on value
 */
function calculateRank(value, thresholds, category) {
  let rankData;

  if (value >= thresholds.SSS) {
    rankData = { rank: "SSS", next: null, progress: 100, title: "" };
  } else if (value >= thresholds.SS) {
    rankData = {
      rank: "SS",
      next: thresholds.SSS,
      progress:
        ((value - thresholds.SS) / (thresholds.SSS - thresholds.SS)) * 100,
      title: "",
    };
  } else if (value >= thresholds.AAA) {
    rankData = {
      rank: "AAA",
      next: thresholds.SS,
      progress:
        ((value - thresholds.AAA) / (thresholds.SS - thresholds.AAA)) * 100,
      title: "",
    };
  } else if (value >= thresholds.AA) {
    rankData = {
      rank: "AA",
      next: thresholds.AAA,
      progress:
        ((value - thresholds.AA) / (thresholds.AAA - thresholds.AA)) * 100,
      title: "",
    };
  } else if (value >= thresholds.S) {
    rankData = {
      rank: "S",
      next: thresholds.AA,
      progress: ((value - thresholds.S) / (thresholds.AA - thresholds.S)) * 100,
      title: "",
    };
  } else if (value >= thresholds.A) {
    rankData = {
      rank: "A",
      next: thresholds.S,
      progress: ((value - thresholds.A) / (thresholds.S - thresholds.A)) * 100,
      title: "",
    };
  } else if (value >= thresholds.B) {
    rankData = {
      rank: "B",
      next: thresholds.A,
      progress: ((value - thresholds.B) / (thresholds.A - thresholds.B)) * 100,
      title: "",
    };
  } else if (value >= thresholds.C) {
    rankData = {
      rank: "C",
      next: thresholds.B,
      progress: ((value - thresholds.C) / (thresholds.B - thresholds.C)) * 100,
      title: "",
    };
  } else if (value >= thresholds.D) {
    rankData = {
      rank: "D",
      next: thresholds.C,
      progress: ((value - thresholds.D) / (thresholds.C - thresholds.D)) * 100,
      title: "",
    };
  } else {
    rankData = {
      rank: "D",
      next: thresholds.D,
      progress: (value / thresholds.D) * 100,
      title: "",
    };
  }

  rankData.title = getRankTitle(rankData.rank, category);
  return rankData;
}

/**
 * Generate trophies based on actual stats from GraphQL
 */
export async function generateTrophiesFromStats(username) {
  try {
    // Fetch all stats in one GraphQL request
    const stats = await fetchAllGitHubStats(username);

    const trophies = [];

    // Stars trophy (using real data from GraphQL)
    const starsRankData = calculateRank(
      stats.total_stars,
      {
        SSS: 100000,
        SS: 50000,
        AAA: 30000,
        AA: 20000,
        S: 10000,
        A: 2000,
        B: 400,
        C: 80,
        D: 1,
      },
      "Stars"
    );
    trophies.push({
      name: "Stars",
      rank: starsRankData.rank,
      title: starsRankData.title,
      value: stats.total_stars,
      progress: starsRankData.progress,
      next: starsRankData.next,
      color: "#FFD700",
      icon: "⭐",
    });

    // Commits trophy (real data from GraphQL)
    const commitsRankData = calculateRank(
      stats.total_commits,
      {
        SSS: 20000,
        SS: 10000,
        AAA: 7000,
        AA: 6000,
        S: 5000,
        A: 2000,
        B: 1000,
        C: 500,
        D: 100,
      },
      "Commits"
    );
    trophies.push({
      name: "Commits",
      rank: commitsRankData.rank,
      title: commitsRankData.title,
      value: stats.total_commits,
      progress: commitsRankData.progress,
      next: commitsRankData.next,
      color: "#C0C0C0",
      icon: "💻",
    });

    // Issues trophy (real data from GraphQL)
    const issuesRankData = calculateRank(
      stats.total_issues,
      {
        SSS: 1000,
        SS: 500,
        AAA: 350,
        AA: 250,
        S: 200,
        A: 100,
        B: 50,
        C: 20,
        D: 5,
      },
      "Issues"
    );
    trophies.push({
      name: "Issues",
      rank: issuesRankData.rank,
      title: issuesRankData.title,
      value: stats.total_issues,
      progress: issuesRankData.progress,
      next: issuesRankData.next,
      color: "#28A745",
      icon: "🔧",
    });

    // Pull Requests trophy (real data from GraphQL)
    const prsRankData = calculateRank(
      stats.total_prs,
      {
        SSS: 500,
        SS: 300,
        AAA: 225,
        AA: 180,
        S: 150,
        A: 75,
        B: 30,
        C: 10,
        D: 2,
      },
      "Pull Requests"
    );
    trophies.push({
      name: "Pull Requests",
      rank: prsRankData.rank,
      title: prsRankData.title,
      value: stats.total_prs,
      progress: prsRankData.progress,
      next: prsRankData.next,
      color: "#6F42C1",
      icon: "🔀",
    });

    // Followers trophy
    const followersRankData = calculateRank(
      stats.followers,
      {
        SSS: 10000,
        SS: 5000,
        AAA: 3000,
        AA: 2000,
        S: 1000,
        A: 200,
        B: 50,
        C: 10,
        D: 1,
      },
      "Followers"
    );
    trophies.push({
      name: "Followers",
      rank: followersRankData.rank,
      title: followersRankData.title,
      value: stats.followers,
      progress: followersRankData.progress,
      next: followersRankData.next,
      color: "#CD7F32",
      icon: "👥",
    });

    // Repositories trophy
    const reposRankData = calculateRank(
      stats.public_repos,
      {
        SSS: 200,
        SS: 100,
        AAA: 75,
        AA: 60,
        S: 50,
        A: 20,
        B: 10,
        C: 5,
        D: 1,
      },
      "Repositories"
    );
    trophies.push({
      name: "Repositories",
      rank: reposRankData.rank,
      title: reposRankData.title,
      value: stats.public_repos,
      progress: reposRankData.progress,
      next: reposRankData.next,
      color: "#DDA0DD",
      icon: "📦",
    });

    // Experience trophy (account age)
    const createdDate = new Date(stats.created_at);
    const now = new Date();
    const yearsOld =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const expRankData = calculateRank(
      yearsOld,
      {
        SSS: 12,
        SS: 10,
        AAA: 9,
        AA: 8.5,
        S: 8,
        A: 5,
        B: 3,
        C: 2,
        D: 1,
      },
      "Experience"
    );
    trophies.push({
      name: "Experience",
      rank: expRankData.rank,
      title: expRankData.title,
      value: Math.floor(yearsOld) + " years",
      valueNum: yearsOld,
      progress: expRankData.progress,
      next: expRankData.next,
      color: "#87CEEB",
      icon: "🎖️",
    });

    return trophies;
  } catch (error) {
    console.error(`Error generating trophies for ${username}:`, error.message);
    throw error;
  }
}

export { calculateRank, getRankTitle };
