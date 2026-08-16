import { useMemo, useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Github,
  Layers3,
  Menu,
  Share2,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import "@/App.css";
import TrophyCard from "@/components/TrophyCard";

const presets = ["torvalds", "gaearon", "sindresorhus"];
const REPOSITORY_URL = "https://github.com/Jbansal2/git-trophy-generator";
const TROPHY_API_BASE_URL = "http://localhost:3001/trophy";
const TROPHY_ASSET_BASE_URL = TROPHY_API_BASE_URL.replace("/trophy", "/ass");
console.log('Trophy API Base URL:', TROPHY_API_BASE_URL);
const themes = [
  { name: "Cyberpunk", color: "#00ff66" },
  { name: "Dracula", color: "#a855f7" },
  { name: "Nord", color: "#67e8f9" },
  { name: "Obsidian", color: "#fbbf24" },
];
const categories = ["All trophies", "Stars", "Commits", "Issues", "Pull Requests", "Followers", "Repositories", "Experience"];
// Trophy categories that map to backend data
const trophyCategories = {
  "Stars": { icon: "⭐", color: "#FFD700" },
  "Commits": { icon: "💻", color: "#C0C0C0" }, 
  "Issues": { icon: "🔧", color: "#28A745" },
  "Pull Requests": { icon: "🔀", color: "#6F42C1" },
  "Followers": { icon: "👥", color: "#CD7F32" },
  "Repositories": { icon: "📦", color: "#DDA0DD" },
  "Experience": { icon: "🎖️", color: "#87CEEB" }
};
const faqs = [
  ["Is this connected to GitHub?", "Yes. The generator loads live trophy SVGs from our local Git Trophy API for any GitHub username you enter. The neon cards below showcase the rank system visually."],
  ["Can I add the trophies to my README?", "Absolutely! Copy the generated Markdown or HTML snippet and paste it directly into your GitHub profile README, website, or portfolio."],
  ["Can I customize the themes?", "Choose from available themes like Cyberpunk, Dracula, Nord, and Obsidian. Each theme gives your trophy wall a distinct personality and color scheme."],
  ["What API features are available?", "The backend provides live trophy generation, health checking, rate limit monitoring, and supports multiple themes and filtering options. Perfect for integration into your projects."],
];
const showcaseTrophies = [
  { rank: "TOP", label: "ULTIMATE", title: "Completionist", icon: "🏆", stat: "All SSS Ranks", detail: "Ultimate achievement", accent: "rainbow", category: "Ultimate", isSpecial: true },
  { rank: "SSS", label: "LEGENDARY", title: "Legendary Project", icon: "⭐", stat: "100,000+ stars", detail: "SSS rank threshold", accent: "gold", category: "Stars" },
  { rank: "SS", label: "MYTHIC", title: "Commit Machine", icon: "💻", stat: "10,000+ commits", detail: "SS rank threshold", accent: "silver", category: "Commits" },
  { rank: "AAA", label: "ULTRA", title: "Ultra Star", icon: "⭐", stat: "30,000+ stars", detail: "AAA rank threshold", accent: "gold", category: "Stars" },
  { rank: "AA", label: "MEGA", title: "Code Master", icon: "💻", stat: "6,000+ commits", detail: "AA rank threshold", accent: "silver", category: "Commits" },
  { rank: "S", label: "EPIC", title: "Fixer", icon: "🔧", stat: "200+ issues", detail: "S rank threshold", accent: "bronze", category: "Issues" },
  { rank: "A", label: "RARE", title: "Collaborator", icon: "🔀", stat: "75+ pull requests", detail: "A rank threshold", accent: "purple", category: "Pull Requests" },
  { rank: "B", label: "UNCOMMON", title: "Rising Voice", icon: "👥", stat: "50+ followers", detail: "B rank threshold", accent: "cyan", category: "Followers" },
  { rank: "C", label: "COMMON", title: "Starter", icon: "📦", stat: "5+ repositories", detail: "C rank threshold", accent: "green", category: "Repositories" },
  { rank: "D", label: "ROOKIE", title: "Rookie", icon: "🎖️", stat: "1+ year experience", detail: "D rank threshold", accent: "amber", category: "Experience" },
];

const rankToPngFile = {
  TOP: "top.png",
  SSS: "sss.png",
  SS: "ss.png",
  AAA: "aaa.png",
  AA: "aa.png",
  S: "s.png",
  A: "a.png",
  B: "b.png",
  C: "c.png",
  D: "d.png",
};

function getTrophyPngUrl(rank) {
  const fileName = rankToPngFile[rank] || "5.png";
  return `${TROPHY_ASSET_BASE_URL}/${fileName}`;
}

function Logo() {
  return (
    <a className="brand" href="#top" data-testid="brand-home-link" aria-label="GitTrophy home">
      <span className="brand-mark"><Trophy size={18} strokeWidth={2.5} /></span>
      <span>Git<span className="brand-accent">Trophy</span><sup>.io</sup></span>
    </a>
  );
}

function TrophyMiniCard({ item, index, activeTheme, username }) {
  // Use transparent background for mini cards to make them look like PNG
  const realTrophySvg = `${TROPHY_API_BASE_URL}?username=${username || 'torvalds'}&theme=flat&rank=${item.rank}&title=&hide_rank=true&column=1&margin_w=0&margin_h=0&no_bg=true`;

  return (
    <div className="trophy-svg-only" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0',
      width: '100%',
      maxWidth: '140px'
    }} data-testid={`preview-trophy-card-${index}`}>
      <img 
        src={realTrophySvg}
        alt={`${item.rank} rank ${item.name} trophy`}
        style={{ 
          width: '100%', 
          height: 'auto',
          maxWidth: '140px',
          objectFit: 'contain',
          objectPosition: 'center'
        }}
        onLoad={(e) => {
          console.log(`✅ Mini trophy loaded: ${item.name} (${item.rank})`);
        }}
        onError={(e) => {
          console.error(`❌ Mini trophy failed: ${item.name} (${item.rank})`);
          
          // Fallback to main trophy wall
          const fallbackUrl = `${TROPHY_API_BASE_URL}?username=${username || 'torvalds'}&theme=flat&column=7&margin_w=0&margin_h=0`;
          e.target.src = fallbackUrl;
          e.target.style.width = '630px';
          e.target.style.height = '100px';
          e.target.style.objectFit = 'none';
          e.target.style.objectPosition = `${index * -90}px 0px`;
        }}
      />
    </div>
  );
}

// Helper function to get CSS class based on rank
function getRankColorClass(rank) {
  const colorMap = {
    'SSS': 'gold',
    'SS': 'gold', 
    'S': 'gold',
    'A': 'purple',
    'B': 'cyan',
    'C': 'green',
    'D': 'amber'
  };
  return colorMap[rank] || 'amber';
}

function Generator() {
  const [username, setUsername] = useState("");
  const [draft, setDraft] = useState("");
  const [theme, setTheme] = useState(themes[0]);
  const [category, setCategory] = useState(categories[0]);
  const [copied, setCopied] = useState(false);
  const [liveImageError, setLiveImageError] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [realTrophies, setRealTrophies] = useState([]);
  const [trophyError, setTrophyError] = useState(null);
  
  // Filter trophies based on selected category
  const visibleTrophies = category === categories[0] ? 
    realTrophies : 
    realTrophies.filter((trophy) => trophy.name === category);

  const codeSnippet = useMemo(() => `![GitHub trophies for @${username}](${TROPHY_API_BASE_URL}?username=${encodeURIComponent(username)}&theme=${theme.name.toLowerCase()})`, [username, theme]);
  const liveTrophyUrl = useMemo(() => `${TROPHY_API_BASE_URL}?username=${encodeURIComponent(username)}&theme=${theme.name.toLowerCase()}&column=7&margin_w=6&margin_h=6&no_bg=false`, [username, theme]);

  // Fetch real trophy data from backend
  const fetchTrophyData = async (usernameToFetch) => {
    try {
      const response = await fetch(`${TROPHY_API_BASE_URL.replace('/trophy', '/api/trophies')}?username=${encodeURIComponent(usernameToFetch)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch trophy data: ${response.status}`);
      }
      const trophyData = await response.json();
      return trophyData;
    } catch (error) {
      console.error("Error fetching trophy data:", error);
      throw error;
    }
  };

  // Load default trophy data on component mount for demo
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const healthResponse = await fetch(TROPHY_API_BASE_URL.replace('/trophy', '/health'));
        if (healthResponse.ok) {
          setApiStatus("online");
          // Get rate limit info
          try {
            const rateLimitResponse = await fetch(TROPHY_API_BASE_URL.replace('/trophy', '/api/rate-limit'));
            if (rateLimitResponse.ok) {
              const rateLimitData = await rateLimitResponse.json();
              setRateLimitInfo(rateLimitData);
            }
          } catch (error) {
            console.log("Rate limit info not available");
          }
        } else {
          setApiStatus("offline");
        }
      } catch (error) {
        setApiStatus("offline");
      }
    };

    // Only check API health on mount, don't load any default data
    checkApiHealth();
  }, []);

  const loadPreset = async (presetUsername) => {
    setDraft(presetUsername);
    setIsLoading(true);
    setLiveImageError(false);
    setTrophyError(null);
    setUsername(presetUsername);
    
    try {
      const apiUrl = `${TROPHY_API_BASE_URL.replace('/trophy', '/api/trophy-data')}?username=${encodeURIComponent(presetUsername)}`;
      console.log('Fetching preset trophy data from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.trophies) {
          setRealTrophies(data.trophies);
          setTrophyError(null);
        } else {
          throw new Error(data.error || "Failed to load trophy data");
        }
      } else {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching preset trophy data:", error);
      setTrophyError(`Failed to connect to API: ${error.message}`);
      
      // Fallback to mock data
      const mockTrophies = Object.keys(trophyCategories).map((name, index) => ({
        name,
        rank: ['S', 'A', 'B', 'S', 'A', 'C', 'B'][index] || 'B',
        title: `${name} ${['Master', 'Expert', 'Specialist', 'Collector', 'Leader', 'Builder', 'Legend'][index] || 'User'}`,
        value: [1250, 2847, 156, 384, 89, 23, 3.2][index] || Math.floor(Math.random() * 1000),
        progress: Math.floor(Math.random() * 100),
        color: trophyCategories[name].color,
        icon: trophyCategories[name].icon
      }));
      setRealTrophies(mockTrophies);
    }
    
    setIsLoading(false);
  };

  const generate = async (event) => {
    event?.preventDefault();
    const next = draft.trim().replace(/^@/, "");
    
    if (!next) {
      alert("Please enter a GitHub username!");
      return;
    }
    
    setIsLoading(true);
    setLiveImageError(false);
    setTrophyError(null);
    setUsername(next);
    
    try {
      // Fetch real trophy data from backend API
      const apiUrl = `${TROPHY_API_BASE_URL.replace('/trophy', '/api/trophy-data')}?username=${encodeURIComponent(next)}`;
      console.log('Fetching trophy data from:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Trophy data received:', data);
        
        if (data.success && data.trophies) {
          setRealTrophies(data.trophies);
          setTrophyError(null);
        } else {
          throw new Error(data.error || "Failed to load trophy data");
        }
      } else {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching trophy data:", error);
      setTrophyError(`Failed to connect to API: ${error.message}. Backend server might not be running on port 3001.`);
      
      // Fallback to mock data
      const mockTrophies = Object.keys(trophyCategories).map((name, index) => ({
        name,
        rank: ['S', 'A', 'B', 'S', 'A', 'C', 'B'][index] || 'B',
        title: `${name} ${['Master', 'Expert', 'Specialist', 'Collector', 'Leader', 'Builder', 'Legend'][index] || 'User'}`,
        value: [1250, 2847, 156, 384, 89, 23, 3.2][index] || Math.floor(Math.random() * 1000),
        progress: Math.floor(Math.random() * 100),
        color: trophyCategories[name].color,
        icon: trophyCategories[name].icon
      }));
      setRealTrophies(mockTrophies);
    }
    
    setIsLoading(false);
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  // Test API connectivity
  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${TROPHY_API_BASE_URL}?username=torvalds`);
      if (response.ok) {
        setApiStatus("online");
        alert("✅ API Connection Test Successful!");
      } else {
        setApiStatus("offline");
        alert("❌ API Connection Failed - Check if backend server is running on localhost:5000");
      }
    } catch (error) {
      setApiStatus("offline");
      alert("❌ Cannot connect to API - Make sure backend server is running on localhost:5000");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSvg = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="250"><rect width="100%" height="100%" fill="#121520"/><text x="40" y="68" fill="${theme.color}" font-family="monospace" font-size="22">GITTROPHY // @${username}</text><text x="40" y="125" fill="#f8fafc" font-family="sans-serif" font-size="42">LEGENDARY CONTRIBUTOR</text><text x="40" y="180" fill="#94a3b8" font-family="monospace" font-size="18">2,847 commits  ·  384 PRs  ·  146 day streak</text></svg>`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    link.download = `${username}-gittrophy.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const share = async () => {
    const shareData = { title: `GitTrophy for @${username}`, text: `Check out @${username}'s GitHub trophies`, url: window.location.href };
    if (navigator.share) await navigator.share(shareData);
    else await copyMarkdown();
  };

  return (
    <section className="generator-section section-shell" id="generator" data-testid="generator-section">
      <div className="section-kicker"><span>02</span><span className="kicker-line" /> Live generator</div>
      <div className="section-heading generator-heading">
        <div><h2>Make your GitHub<br /><em>legendary.</em></h2></div>
        <p>Type a username. Pick a vibe. Get a trophy wall worthy of your contribution graph.</p>
      </div>

      <div className="generator-window" data-testid="trophy-generator-window">
            <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span className="window-title"><span className="live-dot" /> preview.gittrophy.io</span><span className="window-status">LIVE API</span></div>
        <div className="generator-body">
          <aside className="generator-controls">
            <div className="control-label">GitHub username</div>
            <form onSubmit={generate} className="username-form">
              <span className="input-prefix">@</span>
              <input data-testid="generator-username-input" aria-label="GitHub username" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="your-username" />
              <button className={`icon-submit ${isLoading ? 'loading' : ''}`} data-testid="generator-submit-button" type="submit" aria-label="Generate trophies" disabled={isLoading}>
                {isLoading ? <div className="spinner-small"></div> : <ArrowRight size={18} />}
              </button>
            </form>

            <div className="control-label theme-label">Choose a theme</div>
            <div className="theme-list">{themes.map((item) => <button type="button" key={item.name} data-testid={`theme-${item.name.toLowerCase()}-button`} className={`theme-button ${theme.name === item.name ? "selected" : ""}`} onClick={() => setTheme(item)}><span style={{ background: item.color }} />{item.name}{theme.name === item.name && <Check size={14} />}</button>)}</div>
            <div className="control-label category-label">Filter trophies</div>
            <div className="category-list">{categories.map((item) => <button type="button" key={item} data-testid={`category-${item.toLowerCase().replaceAll(" ", "-")}-button`} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
          </aside>

            <div className="trophy-preview" style={{ "--theme-color": theme.color }}>
            <div className="preview-heading"><div><span className="eyebrow">TROPHY WALL / {category.toUpperCase()}</span><h3>@{username || "username"}</h3></div></div>
            <div className="profile-strip"><div className="avatar">{(username || "US").slice(0, 2).toUpperCase()}</div><div><strong>{username || "username"}</strong><span>live GitHub trophy profile</span></div><div className="profile-stats"><span><b>API</b> connected</span><span><b>SVG</b> generated</span><span><b>LIVE</b> now</span></div></div>
            
            {trophyError && (
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '6px',
                padding: '12px',
                margin: '12px 0',
                fontSize: '14px',
                color: '#856404'
              }}>
                ⚠️ {trophyError}
              </div>
            )}
            
            <div className="live-api-preview" data-testid="live-api-preview">
              <div className="live-api-heading">
                <span>
                  <span className={`live-dot ${apiStatus}`} /> LIVE TROPHY API ({apiStatus.toUpperCase()})
                </span>
                <a href={liveTrophyUrl} target="_blank" rel="noreferrer" data-testid="live-api-image-link">
                  open SVG <ExternalLink size={12} />
                </a>
              </div>
              {rateLimitInfo && (
                <div className="api-info-box">
                  <span>Rate Limit: {rateLimitInfo.remaining || 'N/A'}/{rateLimitInfo.limit || 'N/A'} requests/hour</span>
                  {rateLimitInfo.hasToken && <span>✅ Authenticated</span>}
                </div>
              )}
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <span>Generating trophies...</span>
                </div>
              ) : liveImageError ? (
                <div className="live-api-error" data-testid="live-api-error">
                  Live trophy image could not load right now. Your rank cards are still available below.
                </div>
              ) : username ? (
                <div className="live-api-preview-scroll">
                  <img 
                    src={liveTrophyUrl} 
                    alt={`Live GitHub trophies for ${username}`} 
                    data-testid="live-api-trophy-image" 
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      border: '1px solid #e1e4e8',
                      borderRadius: '8px',
                      background: '#ffffff',
                      objectFit: 'contain'
                    }}
                    onError={() => setLiveImageError(true)} 
                  />
                </div>
              ) : (
                <div className="live-api-placeholder" style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#666',
                  border: '2px dashed #ddd',
                  borderRadius: '8px'
                }}>
                  <Trophy size={32} style={{opacity: 0.3, marginBottom: '12px'}} />
                  <div>Enter a GitHub username to generate trophies</div>
                </div>
              )}
            </div>
            
            {realTrophies.length > 0 ? (
              <div className="trophy-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '12px',
                justifyItems: 'center',
                alignItems: 'start',
                padding: '20px 10px',
                maxWidth: '100%',
                width: '100%'
              }}>
                {/* Show filtered trophies based on category selection */}
                {visibleTrophies.map((item, index) => <TrophyMiniCard key={item.name} item={item} index={index} activeTheme={theme} username={username} />)}
              </div>
            ) : username ? (
              <div className="trophy-grid-placeholder" style={{
                padding: '20px',
                textAlign: 'center', 
                color: '#666',
                background: '#f8f9fa',
                borderRadius: '6px',
                margin: '12px 0'
              }}>
                {isLoading ? 'Loading trophies...' : 'No trophy data available'}
              </div>
            ) : null}
            
            {username && (
              <>
                <div className="snippet-box"><div className="snippet-head"><span>README SNIPPET</span><button type="button" data-testid="copy-markdown-button" onClick={copyMarkdown}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy Markdown"}</button></div><code>{codeSnippet}</code></div>
                <div className="export-actions">
                  <button type="button" data-testid="download-svg-button" className="export-primary" onClick={downloadSvg}>
                    <Download size={15} /> Download SVG
                  </button>
                  <button type="button" data-testid="share-trophy-button" className="export-secondary" onClick={share}>
                    <Share2 size={15} /> Share trophy
                  </button>
                  <button type="button" data-testid="test-api-button" className="export-secondary" onClick={testApiConnection} disabled={isLoading}>
                    <Zap size={15} /> Test API Connection
                  </button>
                  <span className="render-note">
                    <span className={`live-dot ${apiStatus}`} /> live render ({apiStatus})
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return <div className="faq-list" data-testid="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${open === index ? "open" : ""}`} key={question}><button type="button" data-testid={`faq-question-${index + 1}`} onClick={() => setOpen(open === index ? -1 : index)}><span>{question}</span><ChevronDown size={18} /></button>{open === index && <p data-testid={`faq-answer-${index + 1}`}>{answer}</p>}</div>)}</div>;
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollToGenerator = () => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="site-shell" id="top">
      <div className="noise" />
      <header className="navbar section-shell" data-testid="site-navbar">
        <Logo />
        <nav className={mobileOpen ? "nav-links mobile-open" : "nav-links"} data-testid="main-navigation"><a href="#generator" data-testid="nav-generator-link">Generator</a><a href="#showcase" data-testid="nav-showcase-link">Showcase</a><a href="#how-it-works" data-testid="nav-how-it-works-link">How it works</a><a href="#faq" data-testid="nav-faq-link">FAQ</a></nav>
        <div className="nav-actions"><span className="live-status"><span className="live-dot" /> all systems live</span><a className="github-link" href={REPOSITORY_URL} target="_blank" rel="noreferrer" data-testid="nav-github-link"><Github size={17} /> GitHub <ExternalLink size={13} /></a><button className="mobile-toggle" type="button" data-testid="mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </header>

      <main>
        <section className="hero section-shell" data-testid="hero-section">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="kicker-line" /> the internet&apos;s favorite bragging rights <Sparkles size={15} /></div>
            <h1>Turn your commits<br />into <span>trophies.</span></h1>
            <p className="hero-subtitle">A little neon, a lot of open source. Create a profile trophy wall that says more than a green contribution graph ever could.</p>
            <div className="hero-actions"><button className="primary-cta" data-testid="hero-generate-button" type="button" onClick={scrollToGenerator}>Generate my trophies <ArrowRight size={18} /></button><a className="secondary-cta" href={REPOSITORY_URL} target="_blank" rel="noreferrer" data-testid="hero-view-github-link"><Github size={17} /> View on GitHub</a></div>
            <div className="hero-proof"><div className="avatar-stack"><span>TV</span><span>GH</span><span>SK</span><span>+</span></div><p><strong>12,486</strong> developers<br /><span>already showing off</span></p></div>
          </div>
          <div className="hero-visual" data-testid="hero-trophy-preview">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-terminal"><div className="terminal-top"><span><i /><i /><i /></span><small>trophy-wall.svg</small><span className="terminal-live">● LIVE</span></div><div className="terminal-content"><div className="terminal-comment">// generating legendary stats for <span>@octocat</span></div><div className="terminal-title">YOUR CONTRIBUTION<br /><b>HAS ENTERED THE<br /><em>HALL OF FAME</em></b></div><div className="terminal-trophy"><div className="trophy-shape"><Trophy size={68} strokeWidth={1.2} /></div><div><small>OVERALL RANK</small><strong>S<span>/</span>99</strong></div></div><div className="terminal-stats"><span>2,847 <small>commits</small></span><span>384 <small>PRs</small></span><span>12.8K <small>stars</small></span></div></div></div><div className="floating-tag tag-rank"><span>✦</span> S RANK</div><div className="floating-tag tag-streak">◈ 146 DAY STREAK</div><div className="scroll-cue"><ArrowDown size={14} /> scroll to explore</div>
          </div>
        </section>

        <div className="ticker"><div className="ticker-track"><span>COMMIT</span><b>✦</b><span>CONTRIBUTE</span><b>✦</b><span>CONQUER</span><b>✦</b><span>COMMIT</span><b>✦</b><span>CONTRIBUTE</span><b>✦</b><span>CONQUER</span><b>✦</b></div></div>
        <Generator />

        <section className="showcase-section section-shell" id="showcase" data-testid="showcase-section">
          <div className="section-kicker"><span>03</span><span className="kicker-line" /> Hall of fame</div>
          <div className="section-heading"><h2>Not all trophies<br /><em>are created equal.</em></h2><p>Every contribution tells a story. Browse the trophy wall by rank, from rare wins to legendary status.</p></div>
          <div className="ranks-table">
            <div className="table-header">
              <div>RANK</div>
              <div>TROPHY</div>
              <div>TITLE</div>
              <div>ACHIEVEMENT</div>
              <div>PERCENTILE</div>
            </div>
            {showcaseTrophies.map((card) => (
              <div className={`table-row ${card.isSpecial ? 'special-top' : ''}`} key={card.rank} data-testid={`showcase-${card.rank.toLowerCase()}-trophy-card`}>
                <div className="table-cell rank-cell">
                  <span className={`rank-badge ${card.isSpecial ? 'top-badge' : ''}`}>{card.rank}</span>
                  <span className="rank-label">{card.label}</span>
                </div>
                <div className={`table-cell trophy-cell ${card.isSpecial ? 'top-trophy' : ''}`}>
                  <img 
                    src={getTrophyPngUrl(card.rank)} 
                    alt={`${card.rank} rank trophy`} 
                    onError={(e) => { e.currentTarget.src = getTrophyPngUrl("D"); }} 
                  />
                </div>
                <div className="table-cell title-cell">
                  {card.title}
                </div>
                <div className="table-cell stat-cell">
                  {card.stat}
                </div>
                <div className="table-cell detail-cell">
                  {card.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="how-section section-shell" id="how-it-works" data-testid="how-it-works-section"><div className="section-kicker"><span>04</span><span className="kicker-line" /> Three clicks, max</div><div className="section-heading"><h2>From graph to<br /><em>glory.</em></h2><p>No setup. No OAuth dance. Just your username and a little well-earned recognition.</p></div><div className="steps"><div className="step"><div className="step-number">01</div><div className="step-icon"><Github /></div><h3>Enter your username</h3><p>We start with the handle that has been doing the heavy lifting.</p></div><div className="step"><div className="step-number">02</div><div className="step-icon"><Layers3 /></div><h3>Pick your trophy vibe</h3><p>Choose a theme that feels like you. Loud, calm, or somewhere in between.</p></div><div className="step"><div className="step-number">03</div><div className="step-icon"><Zap /></div><h3>Show the receipts</h3><p>Copy the snippet, export the SVG, and let your README do the talking.</p></div></div></section>

        <section className="social-section section-shell" data-testid="social-proof-section"><div className="quote-mark">“</div><blockquote>Finally, a contribution graph<br />with some <em>personality.</em></blockquote><div className="quote-author"><div className="author-avatar">MN</div><div><strong>Maya N.</strong><span>Maintainer, tinyhttp</span></div><span className="quote-stars">★★★★★</span></div></section>

        <section className="faq-section section-shell" id="faq" data-testid="faq-section"><div className="section-heading faq-heading"><div><div className="section-kicker"><span>05</span><span className="kicker-line" /> Good to know</div><h2>Questions,<br /><em>answered.</em></h2></div><p>Everything you need to know before you put your open source era on display.</p></div><FAQ /></section>
      </main>

      <footer className="footer section-shell" data-testid="site-footer"><div className="footer-top"><Logo /><div className="footer-links"><a href="#generator" data-testid="footer-generator-link">Generator</a><a href="#showcase" data-testid="footer-showcase-link">Showcase</a><a href={REPOSITORY_URL} target="_blank" rel="noreferrer" data-testid="footer-github-link">GitHub <ExternalLink size={13} /></a></div><button className="back-top" type="button" data-testid="back-to-top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>back to top <ArrowDown size={15} /></button></div><div className="footer-wordmark">SHIP <span>WITH</span> PRIDE.</div><div className="footer-bottom"><span>© 2025 GitTrophy.io</span><span>Built for the open source obsessed <span className="green-dot" /></span><span>v1.0.0 / demo</span></div></footer>
    </div>
  );
}

export default App;