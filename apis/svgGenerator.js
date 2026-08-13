import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rank to SVG file mapping
const rankToSvgFile = {
  'SSS': 'sss.svg', // SSS special trophy
  'SS': 'ss.svg', // SS special trophy
  'S': '1.svg', // Gold
  'A': '3.svg', // A rank
  'B': '2.svg', // B rank
  'C': '4.svg', // C rank
  'D': '5.svg', // D rank
};

async function loadRankSvg(rank) {
  const fileName = rankToSvgFile[rank] || '5.svg'; // Default to D rank
  try {
    const filePath = join(__dirname, '..', 'ass', fileName);
    const svgContent = await readFile(filePath, 'utf-8');
    return svgContent;
  } catch (error) {
    console.error(`Failed to load SVG for rank ${rank}:`, error);
    return '<svg width="120" height="160" xmlns="http://www.w3.org/2000/svg"></svg>';
  }
}

export async function generateTrophySVG(trophies, options) {
  const {
    theme = 'flat',
    column = 6,
    margin_w = 5,
    margin_h = 5,
    no_bg = false,
    no_frame = false,
    rank,
    title,
  } = options;

  let filteredTrophies = [...trophies];
  if (rank) {
    const ranks = rank.split(',').map((r) => r.trim());
    const excludeRanks = ranks.filter((r) => r.startsWith('-')).map((r) =>
      r.substring(1)
    );
    const includeRanks = ranks.filter((r) => !r.startsWith('-'));

    if (excludeRanks.length > 0) {
      filteredTrophies = filteredTrophies.filter((t) =>
        !excludeRanks.includes(t.rank)
      );
    } else if (includeRanks.length > 0) {
      filteredTrophies = filteredTrophies.filter((t) =>
        includeRanks.includes(t.rank)
      );
    }
  }

  if (title) {
    const titles = title.split(',').map((t) => t.trim());
    const excludeTitles = titles.filter((t) => t.startsWith('-')).map((t) =>
      t.substring(1)
    );
    const includeTitles = titles.filter((t) => !t.startsWith('-'));

    if (excludeTitles.length > 0) {
      filteredTrophies = filteredTrophies.filter((t) =>
        !excludeTitles.includes(t.name)
      );
    } else if (includeTitles.length > 0) {
      filteredTrophies = filteredTrophies.filter((t) =>
        includeTitles.includes(t.name)
      );
    }
  }

  const cols = parseInt(column) || 6;
  const marginW = parseInt(margin_w) || 5;
  const marginH = parseInt(margin_h) || 5;

  const trophyWidth = 152;
  const trophyHeight = 162;
  const titleBarHeight = 20;
  const iconSize = 110;
  const iconGap = 2;
  const nameGap = 3;
  const progressGap = 3;
  const pointsGap = 8;

  const rows = Math.ceil(filteredTrophies.length / cols);
  const totalWidth =
    (trophyWidth + marginW) * Math.min(cols, filteredTrophies.length) - marginW;
  const totalHeight = (trophyHeight + marginH) * rows - marginH;

  const themeStyles = {
    flat: {
      shadow: '',
      border: '#e1e4e8',
      text: '#24292e',
      bg: '#ffffff',
      titleBg: '#f6f8fa',
      progressBg: '#e1e4e8',
    },
    dark: {
      shadow: '',
      border: '#30363d',
      text: '#c9d1d9',
      bg: '#0d1117',
      titleBg: '#161b22',
      progressBg: '#21262d',
    },
    radical: {
      shadow: 'drop-shadow(0 0 10px rgba(255,0,255,0.3))',
      border: '#ff006e',
      text: '#fe428e',
      bg: '#141321',
      titleBg: '#1f1d2e',
      progressBg: '#2d2b3e',
    },
    gruvbox: {
      shadow: '',
      border: '#d65d0e',
      text: '#ebdbb2',
      bg: '#282828',
      titleBg: '#3c3836',
      progressBg: '#504945',
    },
    onedark: {
      shadow: '',
      border: '#4c566a',
      text: '#abb2bf',
      bg: '#282c34',
      titleBg: '#21252b',
      progressBg: '#3e4451',
    },
    dracula: {
      shadow: '',
      border: '#6272a4',
      text: '#f8f8f2',
      bg: '#282a36',
      titleBg: '#44475a',
      progressBg: '#6272a4',
    },
  };

  const style = themeStyles[theme] || themeStyles.flat;
  const actualBg = no_bg === 'true' ? 'transparent' : style.bg;

  let svgContent =
    `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${
      no_bg === 'true'
        ? ''
        : `<rect width="${totalWidth}" height="${totalHeight}" fill="${actualBg}"/>`
    }
    <style>
      .trophy-card { filter: ${style.shadow}; }
      .trophy-title { font: 500 10px 'Segoe UI', Arial, sans-serif; fill: ${style.text}; opacity: 0.85; letter-spacing: 0.4px; }
      .trophy-rank-title { font: 500 12px 'Segoe UI', Arial, sans-serif; fill: ${style.text}; opacity: 0.75; }
      .trophy-points { font: 9px 'Segoe UI', Arial, sans-serif; fill: ${style.text}; opacity: 0.55; }
    </style>`;

  // Load all trophy SVGs
  for (let i = 0; i < filteredTrophies.length; i++) {
    const trophy = filteredTrophies[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (trophyWidth + marginW);
    const y = row * (trophyHeight + marginH);

    const rankColors = {
      'SSS': '#FFD700',
      'SS': '#FFA500',
      'S': '#FF6347',
      'A': '#4169E1',
      'B': '#32CD32',
      'C': '#90EE90',
      'D': '#808080',
    };

    const rankColor = rankColors[trophy.rank] || '#808080';

    const progressBarWidth = 115;
    const progressBarHeight = 4;
    const progressWidth = (trophy.progress / 100) * progressBarWidth;

    const points = Math.round(trophy.progress);

    // Load trophy SVG from file
    const rankSvg = await loadRankSvg(trophy.rank);

    // Extract SVG content
    const svgContentMatch = rankSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    const innerSvgContent = svgContentMatch ? svgContentMatch[1] : rankSvg;

    const iconX = (trophyWidth - iconSize) / 2;
    const iconY = titleBarHeight + iconGap;
    const nameY = iconY + iconSize + nameGap;
    const progressY = nameY + progressGap;
    const pointsY = progressY + progressBarHeight + pointsGap;

    const iconZoom = 1.8;
    const vbSize = 1500 / iconZoom;
    const vbOffset = (1500 - vbSize) / 2;

    const trophyIcon =
      `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${vbOffset} ${vbOffset} ${vbSize} ${vbSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${innerSvgContent}</svg>`;

    const rankTextX = trophyWidth / 2;
    const rankTextY = iconY + (iconSize / 2) + 6;
    const rankCircle = `<circle cx="${rankTextX}" cy="${
      rankTextY - 6
    }" r="8" fill="white" opacity="0.95" stroke="#cccccc" stroke-width="1"/>`;
    const rankText =
      `<text x="${rankTextX}" y="${rankTextY}" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle" font-family="Arial, sans-serif">${trophy.rank}</text>`;

    svgContent += `
    <g class="trophy-card" transform="translate(${x}, ${y})">
      ${
      no_frame !== 'true'
        ? `
        <rect width="${trophyWidth}" height="${trophyHeight}" fill="${actualBg}" stroke="${style.border}" stroke-width="2"/>
        <g fill="${actualBg}">
          <circle cx="10" cy="0" r="4"/>
          <circle cx="30" cy="0" r="4"/>
          <circle cx="50" cy="0" r="4"/>
          <circle cx="70" cy="0" r="4"/>
          <circle cx="90" cy="0" r="4"/>
          <circle cx="110" cy="0" r="4"/>
          <circle cx="130" cy="0" r="4"/>
          <circle cx="10" cy="${trophyHeight}" r="4"/>
          <circle cx="30" cy="${trophyHeight}" r="4"/>
          <circle cx="50" cy="${trophyHeight}" r="4"/>
          <circle cx="70" cy="${trophyHeight}" r="4"/>
          <circle cx="90" cy="${trophyHeight}" r="4"/>
          <circle cx="110" cy="${trophyHeight}" r="4"/>
          <circle cx="130" cy="${trophyHeight}" r="4"/>
          <circle cx="0" cy="20" r="4"/>
          <circle cx="0" cy="40" r="4"/>
          <circle cx="0" cy="60" r="4"/>
          <circle cx="0" cy="80" r="4"/>
          <circle cx="0" cy="100" r="4"/>
          <circle cx="0" cy="120" r="4"/>
          <circle cx="0" cy="140" r="4"/>
          <circle cx="${trophyWidth}" cy="20" r="4"/>
          <circle cx="${trophyWidth}" cy="40" r="4"/>
          <circle cx="${trophyWidth}" cy="60" r="4"/>
          <circle cx="${trophyWidth}" cy="80" r="4"/>
          <circle cx="${trophyWidth}" cy="100" r="4"/>
          <circle cx="${trophyWidth}" cy="120" r="4"/>
          <circle cx="${trophyWidth}" cy="140" r="4"/>
        </g>
      `
        : ''
    }
      <rect x="0" y="0" width="${trophyWidth}" height="${titleBarHeight}" fill="${style.titleBg}"/>
      <text class="trophy-title" x="${trophyWidth / 2}" y="${
      titleBarHeight / 2 + 4
    }" text-anchor="middle">${trophy.name.toUpperCase()}</text>
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

  svgContent += '</svg>';
  return svgContent;
}
