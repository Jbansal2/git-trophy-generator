const TROPHY_API_BASE_URL = "http://localhost:3001/trophy";

function TrophyCard({ item, index, activeTheme, username }) {
  const realTrophySvg = `${TROPHY_API_BASE_URL}?username=${username || 'torvalds'}&theme=flat&rank=${item.rank}&title=${item.name}&column=1&margin_w=0&margin_h=0&no_bg=true`;

  return (
    <div 
      className="trophy-card" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0',
        width: '100%',
        maxWidth: '180px'
      }} 
      data-testid={`preview-trophy-card-${index}`}
    >
      <img 
        src={realTrophySvg}
        alt={`${item.rank} rank ${item.name} trophy`}
        style={{ 
          width: '100%', 
          height: '220px',
          maxWidth: '180px',
          objectFit: 'contain',
          objectPosition: 'center'
        }}
        onLoad={(e) => {
          console.log(`✅ Trophy loaded: ${item.name} (${item.rank})`);
        }}
        onError={(e) => {
          console.error(`❌ Trophy failed: ${item.name} (${item.rank})`);
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

export default TrophyCard;
