import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rank to PNG file mapping
const rankToPngFile = {
  SSS: "sss.png", // SSS special trophy
  SS: "ss.png", // SS special trophy
  AAA: "aaa.png", // AAA special trophy
  AA: "aa.png", // AA special trophy
  S: "s.png", // S rank
  A: "a.png", // A rank
  B: "b.png", // B rank
  C: "c.png", // C rank
  D: "d.png", // D rank
};

async function loadRankPng(rank) {
  const fileName = rankToPngFile[rank] || "5.png"; // Default to D rank
  try {
    const filePath = join(__dirname, "..", "ass", fileName);
    const pngBase64 = await readFile(filePath, 'base64');
    return `data:image/png;base64,${pngBase64}`;
  } catch (error) {
    console.error(`Failed to load PNG for rank ${rank}:`, error);
    return null;
  }
}

export async function generateTrophySVG(trophies, options) {
  const {
    theme = "flat",
    column = 6,
    margin_w = 5,
    margin_h = 5,
    no_bg = false,
    no_frame = false,
    rank,
    title,
    hide_rank = false,
  } = options;

  let filteredTrophies = [...trophies];
  if (rank) {
    const ranks = rank.split(",").map((r) => r.trim());
    const excludeRanks = ranks
      .filter((r) => r.startsWith("-"))
      .map((r) => r.substring(1));
    const includeRanks = ranks.filter((r) => !r.startsWith("-"));

    if (excludeRanks.length > 0) {
      filteredTrophies = filteredTrophies.filter(
        (t) => !excludeRanks.includes(t.rank)
      );
    } else if (includeRanks.length > 0) {
      filteredTrophies = filteredTrophies.filter((t) =>
        includeRanks.includes(t.rank)
      );
    }
  }

  if (title) {
    const titles = title.split(",").map((t) => t.trim());
    const excludeTitles = titles
      .filter((t) => t.startsWith("-"))
      .map((t) => t.substring(1));
    const includeTitles = titles.filter((t) => !t.startsWith("-"));

    if (excludeTitles.length > 0) {
      filteredTrophies = filteredTrophies.filter(
        (t) => !excludeTitles.includes(t.name)
      );
    } else if (includeTitles.length > 0) {
      filteredTrophies = filteredTrophies.filter((t) =>
        includeTitles.includes(t.name)
      );
    }
  }

  const cols = parseInt(column) || 3;
  const marginW = parseInt(margin_w) || 5;
  const marginH = parseInt(margin_h) || 5;

  const trophyWidth = 140;
  const trophyHeight = 160;
  const titleBarHeight = 20;
  const iconSize = 150;
  const iconGap = -25;
  const nameGap = -22;
  const progressGap = 5;
  const pointsGap = 13;

  const rows = Math.ceil(filteredTrophies.length / cols);
  const totalWidth =
    (trophyWidth + marginW) * Math.min(cols, filteredTrophies.length) - marginW;
  const totalHeight = (trophyHeight + marginH) * rows - marginH;

  const themeStyles = {
    flat: {
      shadow: "",
      border: "#e1e4e8",
      text: "#24292e",
      bg: "#ffffff",
      titleBg: "#f6f8fa",
      progressBg: "#e1e4e8",
    },
    dark: {
      shadow: "",
      border: "#30363d",
      text: "#c9d1d9",
      bg: "#0d1117",
      titleBg: "#161b22",
      progressBg: "#21262d",
    },
    radical: {
      shadow: "drop-shadow(0 0 10px rgba(255,0,255,0.3))",
      border: "#ff006e",
      text: "#fe428e",
      bg: "#141321",
      titleBg: "#1f1d2e",
      progressBg: "#2d2b3e",
    },
    gruvbox: {
      shadow: "",
      border: "#d65d0e",
      text: "#ebdbb2",
      bg: "#282828",
      titleBg: "#3c3836",
      progressBg: "#504945",
    },
    onedark: {
      shadow: "",
      border: "#4c566a",
      text: "#abb2bf",
      bg: "#282c34",
      titleBg: "#21252b",
      progressBg: "#3e4451",
    },
    dracula: {
      shadow: "",
      border: "#6272a4",
      text: "#f8f8f2",
      bg: "#282a36",
      titleBg: "#44475a",
      progressBg: "#6272a4",
    },
  };

  const style = themeStyles[theme] || themeStyles.flat;
  const actualBg = (no_bg === "true" || no_bg === true) ? "transparent" : style.bg;

  let svgContent = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${
      (no_bg === "true" || no_bg === true)
        ? ""
        : `<rect width="${totalWidth}" height="${totalHeight}" fill="${actualBg}"/>`
    }
    <style>
      .trophy-card { filter: ${style.shadow}; }
      .trophy-title { font: 300 11px 'Segoe UI', Arial, sans-serif; fill: ${style.text}; opacity: 0.85; letter-spacing: 0.5px; }
      .trophy-rank-title { font: 300 11px 'Segoe UI', Arial, sans-serif; fill: ${style.text}; opacity: 0.75; }
      .trophy-points { font: 13px 'Segoe UI', Arial, sans-serif; fill: ${style.text}; opacity: 0.55; }
    </style>`;

  // Load all trophy SVGs
  for (let i = 0; i < filteredTrophies.length; i++) {
    const trophy = filteredTrophies[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (trophyWidth + marginW);
    const y = row * (trophyHeight + marginH);

    const rankColors = {
      SSS: "#FFD700",
      SS: "#FFA500",
      AAA: "#FF1744",
      AA: "#d9d9d9",
      S: "#FF6347",
      A: "#4169E1",
      B: "#32CD32",
      C: "#3e692a",
      D: "#808080",
    };

    // Trophy category colors for title bar (matching actual trophy PNG colors)
    const categoryColors = {
      "Stars": "#4169E1",        
      "Commits": "#E91E63",      
      "Issues": "#4169E1",       
      "Pull Requests": "#E91E63", 
      "Followers": "#4169E1",   
      "Repositories": "#d9d9d9",  
      "Experience": "#3e692a"   
    };

    const rankColor = rankColors[trophy.rank] || "#808080";
    const categoryColor = categoryColors[trophy.name] || rankColor;

    const progressBarWidth = 115;
    const progressBarHeight = 4;
    const progressWidth = (trophy.progress / 100) * progressBarWidth;

    const points = Math.round(trophy.progress);

    // Load trophy PNG from file
    const rankPngData = await loadRankPng(trophy.rank);

    const iconX = (trophyWidth - iconSize) / 2;
    const iconY = titleBarHeight + iconGap;
    const nameY = iconY + iconSize + nameGap;
    const progressY = nameY + progressGap;
    const pointsY = progressY + progressBarHeight + pointsGap;

    // Create trophy icon using PNG
    const trophyIcon = rankPngData ? 
      `<image x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" href="${rankPngData}" preserveAspectRatio="xMidYMid meet"/>` :
      `<rect x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" fill="${rankColor}" opacity="0.3"/>`;

    const rankTextX = trophyWidth / 2;
    const rankTextY = iconY + iconSize / 2 + 6;
    const rankCircle = hide_rank ? '' : `<circle cx="${rankTextX}" cy="${
      rankTextY - 6
    }" r="8" fill="white" opacity="0.95" stroke="#cccccc" stroke-width="1"/>`;
    const rankText = hide_rank ? '' : `<text x="${rankTextX}" y="${rankTextY}" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle" font-family="Arial, sans-serif">${trophy.rank}</text>`;

    svgContent += `
    <g class="trophy-card" transform="translate(${x}, ${y})">
      ${
        no_frame !== "true"
          ? `
        <rect width="${trophyWidth}" height="${trophyHeight}" fill="${(no_bg === "true" || no_bg === true) ? "transparent" : actualBg}" stroke="${style.border}" stroke-width="2"/>
        <g fill="${actualBg}">
          <circle cx="15" cy="0" r="4"/>
          <circle cx="40" cy="0" r="4"/>
          <circle cx="65" cy="0" r="4"/>
          <circle cx="90" cy="0" r="4"/>
          <circle cx="115" cy="0" r="4"/>
          <circle cx="140" cy="0" r="4"/>
          <circle cx="15" cy="${trophyHeight}" r="4"/>
          <circle cx="40" cy="${trophyHeight}" r="4"/>
          <circle cx="65" cy="${trophyHeight}" r="4"/>
          <circle cx="90" cy="${trophyHeight}" r="4"/>
          <circle cx="115" cy="${trophyHeight}" r="4"/>
          <circle cx="140" cy="${trophyHeight}" r="4"/>
          <circle cx="0" cy="25" r="4"/>
          <circle cx="0" cy="50" r="4"/>
          <circle cx="0" cy="75" r="4"/>
          <circle cx="0" cy="100" r="4"/>
          <circle cx="0" cy="125" r="4"/>
          <circle cx="0" cy="150" r="4"/>
          <circle cx="0" cy="175" r="4"/>
          <circle cx="${trophyWidth}" cy="25" r="4"/>
          <circle cx="${trophyWidth}" cy="50" r="4"/>
          <circle cx="${trophyWidth}" cy="75" r="4"/>
          <circle cx="${trophyWidth}" cy="100" r="4"/>
          <circle cx="${trophyWidth}" cy="125" r="4"/>
          <circle cx="${trophyWidth}" cy="150" r="4"/>
          <circle cx="${trophyWidth}" cy="175" r="4"/>
        </g>
      `
          : ""
      }
      <rect x="0" y="0" width="${trophyWidth}" height="${titleBarHeight}" fill="${categoryColor}"/>
      <text class="trophy-title" x="${trophyWidth / 2}" y="${
        titleBarHeight / 2 + 4
      }" text-anchor="middle" fill="#ffffff" font-weight="600">${trophy.name.toUpperCase()}</text>
      ${trophyIcon}
      ${rankCircle}
      ${rankText}
      <text class="trophy-rank-title" x="${
        trophyWidth / 2
      }" y="${nameY}" text-anchor="middle">${trophy.title}</text>
      <text class="trophy-points" x="${
        trophyWidth / 2
      }" y="${pointsY}" text-anchor="middle">${points} pt</text>
      <rect x="${
        (trophyWidth - progressBarWidth) / 2
      }" y="${progressY}" width="${progressBarWidth}" height="${progressBarHeight}" fill="${style.progressBg}"/>
      <rect x="${
        (trophyWidth - progressBarWidth) / 2
      }" y="${progressY}" width="${progressWidth}" height="${progressBarHeight}" fill="${rankColor}" opacity="0.8"/>
    </g>`;
  }

  svgContent += "</svg>";
  return svgContent;
}
