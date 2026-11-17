(() => {
  const BASE = location.hostname === 'dellmodrun.github.io' ? '/Vamend' : '';
  const X_URL = 'https://x.com/vamendlaunch';
  const CONFIG_URL = 'https://snwthyespgghvvlktyyu.supabase.co/storage/v1/object/public/vamend-config/ca.json';
  const segments = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const path = segments.at(-1);
  const page = segments.includes('market') ? 'market' : ['markets', 'protection', 'compare', 'developers', 'docs', 'launch'].includes(path) ? path : 'home';
  const nav = [
    ['home', '⌂', 'Overview'], ['markets', '≋', 'Markets'], ['protection', '◇', 'Protection'],
    ['compare', '⇄', 'Compare'], ['developers', '◎', 'Developers'], ['docs', '≡', 'Docs']
  ];
  const pageNames = { home: 'Overview', markets: 'Same-name markets', protection: 'Protection mechanics', compare: 'Developer comparison', developers: 'For developers', docs: 'Documentation', launch: 'Launch protected token', market: '$MOON market' };
  const route = key => key === 'home' ? `${BASE}/` : `${BASE}/${key}/`;
  const navHtml = nav.map(([key, icon, label]) => `<a class="nav-link ${page === key ? 'active' : ''}" href="${route(key)}"><span class="nav-icon">${icon}</span><span class="nav-label">${label}</span></a>`).join('');

  const rules = `<div class="right-card"><div class="right-card-head"><small>PROTECTION RULES</small><strong>What Vamend enforces.</strong></div><div class="rule-list">
    <div class="rule"><span class="rule-num">01</span><div><strong>Every clone, one market</strong><p>Same-name tokens are grouped so the market compares developers side by side.</p></div></div>
    <div class="rule"><span class="rule-num">02</span><div><strong>2–10% supply lock</strong><p>Developers lock a visible share of supply and sell options against it.</p></div></div>
    <div class="rule"><span class="rule-num">03</span><div><strong>Verified dump, lose the lock</strong><p>An oracle-attested developer sale before expiry moves locked supply into forfeiture claims.</p></div></div>
    <div class="rule"><span class="rule-num">04</span><div><strong>Buyback route is pending</strong><p>Premium-funded market buybacks remain disabled until the DEX execution path is audited.</p></div></div>
  </div></div>`;

  const rightRail = `<aside class="right-rail"><div class="right-rail-inner">
    <div class="right-card ca-card"><div class="ca-line"><span>VAMEND CA</span><b data-live-ca>TBA</b></div><div class="coming">The Vamend token has not launched. Ignore any address claiming to be official.</div></div>
    ${rules}<a class="x-button" href="${X_URL}" target="_blank" rel="noreferrer"><span class="x-mark">𝕏</span><span>Follow @vamendlaunch</span></a>
    <div class="disclaimer">Solana Mainnet interface. Protocol transactions activate only after the verified Mainnet program is published. Options and token markets involve risk.</div>
  </div></aside>`;

  const shell = content => `<div class="shell">
    <aside class="left-rail"><a class="brand" href="${BASE}/"><img src="${BASE}/assets/vamend-logo.png" alt="Vamend logo"><span class="brand-copy"><span class="brand-word">VAMEND</span><span class="brand-tag">VAMPIRE PROTECTION</span></span></a><nav class="nav">${navHtml}</nav><div class="rail-actions"><a class="primary-button rail-launch" href="${route('launch')}">＋ Launch token</a><button class="wallet-button" type="button" data-wallet-connect>Connect wallet</button></div><div class="rail-note"><strong>Stop feeding vampires.</strong><span>Same name · every launch</span></div></aside>
    <main class="main"><header class="topbar"><span class="topbar-title"><a class="mobile-brand" href="${BASE}/"><img src="${BASE}/assets/vamend-logo.png" alt="Vamend"></a><span class="page-name">${pageNames[page]}</span></span><span class="status-row"><span class="status-pill">CA <b data-live-ca>TBA</b></span><button class="wallet-button top-wallet" type="button" data-wallet-connect>Connect wallet</button></span></header>${content}<footer class="site-footer"><span>© 2026 Vamend</span><nav><a href="${route('docs')}#risk">Risk</a><a href="${route('docs')}">Docs</a><a href="${X_URL}" target="_blank" rel="noreferrer">𝕏</a></nav><p>Vamend makes developer commitments visible. It does not guarantee token price, liquidity or returns.</p></footer></main>${rightRail}
  </div><nav class="mobile-nav">${[['home','Overview'],['markets','Markets'],['launch','Launch'],['docs','Docs'],['developers','Dev']].map(([key,label]) => `<a class="${page === key ? 'active' : ''}" href="${route(key)}">${label}</a>`).join('')}</nav><div class="modal-backdrop" data-wallet-modal hidden><div class="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-title"><button class="modal-close" type="button" data-modal-close aria-label="Close wallet dialog">×</button><span class="eyebrow">SOLANA WALLET</span><h2 id="wallet-title">Choose your wallet</h2><p data-wallet-message>Vamend only requests permission to view your public address.</p><div class="wallet-list"><button type="button" data-wallet-provider="phantom"><img class="wallet-logo phantom" src="${BASE}/assets/wallets/phantom.svg" alt="Phantom logo"><span><b>Phantom</b><small data-detected="phantom">Check installation</small></span><i>→</i></button><button type="button" data-wallet-provider="solflare"><img class="wallet-logo solflare" src="${BASE}/assets/wallets/solflare.svg" alt="Solflare logo"><span><b>Solflare</b><small data-detected="solflare">Check installation</small></span><i>→</i></button><button type="button" data-wallet-provider="backpack"><img class="wallet-logo backpack" src="${BASE}/assets/wallets/backpack.svg" alt="Backpack logo"><span><b>Backpack</b><small data-detected="backpack">Check installation</small></span><i>→</i></button></div><div class="wallet-install"><a href="https://phantom.app/" target="_blank" rel="noreferrer">Phantom ↗</a><a href="https://solflare.com/" target="_blank" rel="noreferrer">Solflare ↗</a><a href="https://backpack.app/" target="_blank" rel="noreferrer">Backpack ↗</a></div><button class="disconnect-button" type="button" data-wallet-disconnect hidden>Disconnect wallet</button><small class="seed-warning">Vamend never asks for your seed phrase.</small></div></div>`;

  const officialCard = `<div class="official-token"><div class="official-rank">★</div><img src="${BASE}/assets/vamend-logo.png" alt="Vamend"><div class="official-copy"><span><b>Vamend</b><i>OFFICIAL</i><i>PINNED</i></span><p>The verified protocol token. Contract address will appear here first.</p></div><div class="official-ca"><span>CONTRACT ADDRESS</span><b data-live-ca>TBA</b><button type="button" data-copy-ca disabled>Copy</button></div></div>`;

  const compareTable = `<div class="compare-card"><div class="compare-title"><strong>$MOON — same-name launches</strong><span><span class="demo-badge">EXAMPLE MARKET</span> <a class="table-link" href="${BASE}/market/moon/">Open market →</a></span></div><div class="table-wrap"><table>
    <thead><tr><th>Developer</th><th>Supply lock</th><th>Options</th><th>Dev sales</th><th>Status</th></tr></thead><tbody>
    <tr><td><span class="dev"><span class="avatar">A</span>Developer A</span></td><td class="lock">10% locked</td><td>Live</td><td>None</td><td class="lock">Protected</td></tr>
    <tr><td><span class="dev"><span class="avatar">B</span>Developer B</span></td><td class="lock">4% locked</td><td>Live</td><td>None</td><td class="lock">Protected</td></tr>
    <tr><td><span class="dev"><span class="avatar">C</span>Developer C</span></td><td class="unlocked">0% unlocked</td><td>—</td><td>Visible</td><td class="unlocked">Unprotected</td></tr>
  </tbody></table></div></div>`;

  const home = `<section class="hero"><div class="eyebrow">Vampire protection for memecoins</div><h1>Same name.<br>Every launch.<br><em>No place to hide.</em></h1><p class="hero-copy">Vamend groups every token issued under the same name onto one page, so the market can compare the developers behind each meme side by side — including supply locks, option coverage and developer sales.</p><div class="hero-actions"><a class="primary-button" href="${route('markets')}">Compare launches →</a><a class="secondary-button" href="${route('protection')}">How protection works</a></div><div class="hero-foot"><span>Transparent developer commitments</span><span>Solana-native markets</span><span>Token not launched</span></div></section>
    <section class="section"><div class="grid-4"><div class="metric"><div class="metric-label">Developer lock</div><div class="metric-value">2–10%</div><div class="metric-note">of total supply</div></div><div class="metric"><div class="metric-label">Option fee</div><div class="metric-value">10%</div><div class="metric-note">of strike price</div></div><div class="metric"><div class="metric-label">Early dev dump</div><div class="metric-value">Forfeit</div><div class="metric-note">locked supply</div></div><div class="metric"><div class="metric-label">Vamend token</div><div class="metric-value">TBA</div><div class="metric-note">not launched</div></div></div></section>
    <section class="section"><div class="section-heading"><div><h2>Protection, built into the launch.</h2><p>Not a badge. A visible economic commitment.</p></div></div><div class="steps">
      <article class="step"><span class="step-number">01</span><span class="step-icon">≋</span><h3>Group every clone</h3><p>Every same-name token appears on a single comparison page. The meme stays familiar; developer behavior becomes legible.</p></article>
      <article class="step"><span class="step-number">02</span><span class="step-icon">◇</span><h3>Lock developer supply</h3><p>Developers commit 2% to 10% of supply inside the Vamend contract and sell options backed by that lock.</p></article>
      <article class="step"><span class="step-number">03</span><span class="step-icon">↑</span><h3>Exercise above strike</h3><p>If market price clears the strike, holders exercise and acquire the developer's locked tokens at the strike price.</p></article>
      <article class="step"><span class="step-number">04</span><span class="step-icon">↺</span><h3>Forfeit or buy back</h3><p>An early developer sale forfeits locked supply. Once the lock sells out, option fees flow into market buybacks.</p></article>
    </div></section><section class="section"><div class="section-heading"><div><h2>One meme. Comparable developers.</h2><p>Unprotected launches remain visible and are clearly labeled.</p></div></div>${compareTable}</section>`;

  const markets = `<section class="page-hero"><div class="eyebrow">Same-name markets</div><h1>Compare the people<br>behind the meme.</h1><p>Vamend does not hide duplicate names. It groups them. Every developer, lock, option market and sale history sits in the same view.</p><div class="notice">Live markets are coming soon. The rows below demonstrate how protected and unprotected launches will be displayed.</div></section><section class="section"><div class="section-heading"><div><h2>Verified and pinned</h2><p>The official Vamend token always stays above community markets.</p></div></div>${officialCard}</section><section class="section"><div class="market-tools"><label><span>⌕</span><input type="search" placeholder="Search token name, ticker or developer" data-market-search></label><div><button class="active" data-market-filter="all">All</button><button data-market-filter="protected">Protected</button><button data-market-filter="unprotected">Unprotected</button></div></div><div class="section-heading"><div><h2>Market comparison</h2><p>Sort by protection, lock size, developer behavior and option coverage.</p></div></div><div data-market-results>${compareTable}</div><div class="empty-state" data-market-empty hidden><b>No matching markets</b><p>Try another name, ticker or protection filter.</p></div></section><section class="section"><div class="stack"><article class="info-card"><span class="kicker">WHY GROUP BY NAME?</span><h3>Attention belongs to the meme. Accountability belongs to the developer.</h3><p>Instead of letting each clone manufacture a separate narrative, Vamend gives the market one place to compare who locked supply, who offered protection and who stayed exposed.</p></article></div></section>`;

  const protection = `<section class="page-hero"><div class="eyebrow">Protection mechanics</div><h1>Downside defined.<br>Developer behavior priced.</h1><p>Vamend turns a developer's supply commitment into transparent option coverage. The lock, strike, expiry and sales are visible before the market decides.</p></section><section class="section"><div class="steps">
    <article class="step"><span class="step-number">01</span><span class="step-icon">%</span><h3>Lock 2%–10%</h3><p>The developer selects a visible supply commitment and deposits those tokens into the Vamend contract.</p></article><article class="step"><span class="step-number">02</span><span class="step-icon">10</span><h3>Pay 10% of strike</h3><p>Each option costs 10% of its strike price. Strike levels follow the same style of bonding curve used for pump.fun issuance.</p></article><article class="step"><span class="step-number">03</span><span class="step-icon">↗</span><h3>Exercise when price clears</h3><p>If token price rises above strike, the holder can buy locked developer tokens at that strike.</p></article><article class="step"><span class="step-number">04</span><span class="step-icon">×</span><h3>Maximum loss is the fee</h3><p>If price never reaches strike, the option expires and the holder loses only the option premium.</p></article>
    </div></section><section class="section"><div class="section-heading"><div><h2>Option economics</h2><p>A simple example, not a live quote.</p></div></div><div class="formula">Strike price: <b>1.00 SOL</b><br>Option fee: <b>0.10 SOL</b> (10% of strike)<br>Market above strike: <b>exercise at 1.00 SOL</b><br>Market below strike at expiry: <b>maximum loss = 0.10 SOL</b></div></section><section class="section"><div class="stack"><article class="info-card"><span class="kicker">EARLY SALE PENALTY</span><h3>If the developer dumps, option holders take the lock.</h3><p>If a protected developer sells before expiry, the remaining locked supply is forfeited to option holders. The protection is tied to observable behavior, not a promise.</p></article><article class="info-card"><span class="kicker">AFTER SELL-OUT</span><h3>Option fees turn into market buybacks.</h3><p>Once the locked allocation has sold out, accumulated option fees are used to buy the token on the open market.</p></article></div></section>`;

  const compare = `<section class="page-hero"><div class="eyebrow">Developer comparison</div><h1>A meme can repeat.<br>The record cannot.</h1><p>Compare supply commitments and developer behavior before choosing which version of a meme deserves liquidity.</p></section><section class="section">${compareTable}</section><section class="section"><div class="grid-4"><div class="metric"><div class="metric-label">Identity</div><div class="metric-value">Public</div><div class="metric-note">developer profile</div></div><div class="metric"><div class="metric-label">Lock</div><div class="metric-value">Visible</div><div class="metric-note">contract verified</div></div><div class="metric"><div class="metric-label">Sales</div><div class="metric-value">Tracked</div><div class="metric-note">before expiry</div></div><div class="metric"><div class="metric-label">Unprotected</div><div class="metric-value">Labeled</div><div class="metric-note">never hidden</div></div></div></section>`;

  const developers = `<section class="page-hero"><div class="eyebrow">For developers</div><h1>Put supply behind<br>your conviction.</h1><p>Give the market a verifiable commitment: lock a defined share of supply, publish the option terms and let your behavior compete beside every same-name launch.</p><div class="notice">Mainnet registration opens after the verified program address is published. Follow @vamendlaunch for the official activation notice.</div></section><section class="section"><div class="steps"><article class="step"><span class="step-number">01</span><span class="step-icon">ID</span><h3>Register the launch</h3><p>Connect the token, developer identity and same-name market group.</p></article><article class="step"><span class="step-number">02</span><span class="step-icon">%</span><h3>Choose the lock</h3><p>Commit between 2% and 10% of supply to the protection contract.</p></article><article class="step"><span class="step-number">03</span><span class="step-icon">◇</span><h3>Publish options</h3><p>Set expiry and expose strike levels along the launch curve.</p></article><article class="step"><span class="step-number">04</span><span class="step-icon">◎</span><h3>Build a clean record</h3><p>Keep the commitment, avoid early sales and let the public record compound.</p></article></div></section><section class="section"><a class="primary-button" href="${X_URL}" target="_blank" rel="noreferrer">Follow launch updates on 𝕏 →</a></section>`;

  const learn = `<section class="page-hero"><div class="eyebrow">How Vamend works</div><h1>Protection without<br>hiding the risk.</h1><p>Vamend makes developer commitments comparable. It does not guarantee price, liquidity, option exercise or developer quality.</p></section><section class="section"><div class="stack">
    <article class="info-card"><span class="kicker">WHAT IS THE VAMPIRE PROBLEM?</span><h3>Copies siphon attention while developer quality stays opaque.</h3><p>Multiple tokens can launch under the same meme name. Without a shared market view, traders compare hype instead of commitments. Vamend places every version together.</p></article><article class="info-card"><span class="kicker">WHAT DOES “PROTECTED” MEAN?</span><h3>A supply lock backs visible option terms.</h3><p>A protected label means the developer locked supply in the Vamend contract and accepted the stated rules. An unlocked token remains listed as unprotected.</p></article><article class="info-card"><span class="kicker">WHAT HAPPENS IF THE DEVELOPER SELLS?</span><h3>The remaining lock is forfeited.</h3><p>If a protected developer sells before expiry, locked supply is confiscated for option holders according to the contract rules.</p></article><article class="info-card"><span class="kicker">IS PROFIT GUARANTEED?</span><h3>No.</h3><p>Options can expire worthless, tokens can lose value and liquidity can disappear. The maximum option loss described here is the premium; token and market risks remain.</p></article>
  </div></section>`;

  const launch = `<section class="page-hero"><div class="eyebrow">Protected registration studio · Solana Mainnet</div><h1>Register with<br>skin in the game.</h1><p>Register an existing Solana mint, lock developer supply and open its same-name protection market.</p><div class="notice">Mainnet release interface. Wallet connection and on-chain reads use Solana Mainnet. Registration remains locked until the verified Vamend Program ID is deployed and published.</div></section><section class="section launch-workspace"><div class="launch-progress"><span class="active">1 · Mint</span><span>2 · Protection</span><span>3 · Market</span><span>4 · Sign</span></div><form class="launch-form" data-launch-form novalidate>
    <fieldset><legend><span>01</span> Token identity</legend><div class="identity-grid"><label class="upload-zone" data-upload-zone><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-token-image><span class="upload-preview" data-upload-preview><b>＋</b><strong>Optional local preview</strong><small>The on-chain mint remains the source of truth for metadata.</small></span></label><div class="form-grid"><label><span>Canonical meme name *</span><input type="text" name="name" placeholder="moon" maxlength="32" required data-token-name><small><i data-name-count>0</i>/32</small></label><label><span>Ticker</span><input type="text" name="ticker" placeholder="MOON" maxlength="10" data-token-ticker><small><i data-ticker-count>0</i>/10</small></label><label class="wide"><span>Profile note</span><textarea name="description" placeholder="Optional note for your local review." maxlength="280" data-token-description></textarea><small><i data-description-count>0</i>/280</small></label></div></div></fieldset>
    <fieldset><legend><span>02</span> Existing mint</legend><div class="form-grid"><label class="wide"><span>Solana mint address *</span><input type="text" name="mintAddress" placeholder="Enter the SPL or Token-2022 mint" minlength="32" maxlength="44" required data-mint-address></label><label><span>Registration method</span><select name="method"><option selected>Register existing mint</option></select></label><label><span>Network</span><input value="Solana Mainnet" disabled></label></div></fieldset>
    <fieldset><legend><span>03</span> Developer protection</legend><div class="range-card"><div class="range-head"><div><b>Supply committed to Vamend</b><p>Locked supply backs the option market.</p></div><strong data-lock-value>6%</strong></div><input type="range" min="2" max="10" value="6" step="1" data-lock-range><div class="range-labels"><span>2% minimum</span><span>10% maximum</span></div></div><div class="form-grid protection-fields"><label><span>Option expiry</span><select name="expiry" data-expiry><option>7 days</option><option selected>14 days</option><option>30 days</option><option>90 days</option></select></label><label><span>Strike ladder</span><select name="ladder"><option selected>Bonding curve · standard</option><option>Bonding curve · concentrated</option></select></label></div><div class="commitment-warning"><b>Early-sale condition</b><p>If the protected developer wallet sells before expiry, remaining locked supply is forfeited to eligible option holders.</p></div></fieldset>
    <fieldset><legend><span>04</span> Review and sign</legend><div class="review-card"><div class="review-token"><span class="mini-token" data-review-image>?</span><div><b data-review-name>Unnamed token</b><small data-review-ticker>$TICKER</small></div><span class="demo-badge">MAINNET</span></div><div class="review-grid"><div><span>Same-name market</span><b data-review-market>Created after validation</b></div><div><span>Supply lock</span><b data-review-lock>6%</b></div><div><span>Option premium</span><b>10% of strike</b></div><div><span>Expiry</span><b data-review-expiry>14 days</b></div><div><span>Protocol fee</span><b>0 SOL</b></div><div><span>Network</span><b>Solana Mainnet</b></div></div></div><label class="terms-check"><input type="checkbox" data-terms><span>I understand that token launches and options involve risk, and that Vamend protection does not guarantee price or liquidity.</span></label><div class="validation-message" data-validation-message>Enter the canonical name and mint, then accept the risk acknowledgement.</div><button class="primary-button full-button" type="button" data-review-launch>Review Mainnet registration</button><p class="form-help">The client checks mint supply and token ownership, simulates the transaction and asks your wallet to sign only after the verified Mainnet program is active.</p></fieldset>
  </form><aside class="launch-side"><div class="right-card ca-card"><div class="ca-line"><span>MAINNET PROGRAM</span><b data-protocol-status>CHECKING</b></div><div class="coming">Transactions remain disabled until the verified Mainnet Program ID is published in the network configuration.</div></div><div class="cost-card"><h3>Transaction contents</h3><div><span>Existing mint</span><b>Verified on-chain</b></div><div><span>Vamend lock</span><b data-side-lock>6% supply</b></div><div><span>Same-name market</span><b>Created if absent</b></div><div><span>Preflight</span><b>Required</b></div></div><div class="checklist-card"><h3>Before you register</h3><p>✓ Mint and supply are read on-chain</p><p>✓ Developer token balance is verified</p><p>✓ Same-name tokens share one PDA</p><p>✓ Early sales can trigger forfeiture</p></div></aside></section>`;

  const docs = `<section class="page-hero"><div class="eyebrow">Vamend documentation</div><h1>The protocol,<br>without the fog.</h1><p>Reference material for traders, option holders and developers. Contract addresses, audits and SDK links will appear here when released.</p></section><section class="section"><div class="docs-layout"><nav class="docs-nav"><a href="#overview">Overview</a><a href="#lifecycle">Launch lifecycle</a><a href="#options">Options</a><a href="#penalty">Dev-sale penalty</a><a href="#buybacks">Buybacks</a><a href="#status">Status labels</a><a href="#risk">Risks</a></nav><div class="docs-content"><article id="overview"><span class="kicker">01 · OVERVIEW</span><h2>One market page per meme name</h2><p>All tokens using the same name are grouped together. The page compares developer identity, supply lock, option availability, expiry and observed developer sales.</p></article><article id="lifecycle"><span class="kicker">02 · LAUNCH LIFECYCLE</span><h2>Register, lock, publish, monitor</h2><p>A developer registers a launch, locks 2%–10% of supply in the Vamend contract and publishes option terms. Vamend monitors the protected wallet through expiry.</p></article><article id="options"><span class="kicker">03 · OPTIONS</span><h2>Premium equals 10% of strike</h2><p>Strike levels follow the launch bonding curve. Above strike, holders may exercise into locked developer tokens. Below strike at expiry, the premium is the option holder's maximum option loss.</p></article><article id="penalty"><span class="kicker">04 · DEV-SALE PENALTY</span><h2>Sell early, forfeit the lock</h2><p>If the protected developer sells before expiry, remaining locked supply is distributed to eligible option holders under the contract rules.</p></article><article id="buybacks"><span class="kicker">05 · BUYBACKS</span><h2>Fees recycle into demand</h2><p>After the locked allocation sells out, accumulated option premiums are used to buy the token in the market.</p></article><article id="status"><span class="kicker">06 · STATUS LABELS</span><h2>Protected is specific, not promotional</h2><p><b>Protected</b> means an active verified lock. <b>Unprotected</b> means no verified lock. <b>Forfeited</b> means the early-sale condition triggered. <b>Expired</b> means the option window ended.</p></article><article id="risk"><span class="kicker">07 · RISKS</span><h2>Protection does not guarantee price</h2><p>Tokens can lose value, liquidity can disappear and options can expire worthless. Vamend exposes commitments; it does not remove market risk.</p></article></div></div></section>`;

  const market = `<section class="market-head"><div><span class="eyebrow">EXAMPLE SAME-NAME MARKET</span><div class="token-title"><span class="token-orb">M</span><div><h1>$MOON</h1><p>3 launches · Solana</p></div></div></div><div class="market-price"><span>REFERENCE PRICE</span><b>$0.000042</b><em>+18.4%</em></div></section><section class="section pinned-compact">${officialCard}</section><section class="section"><div class="chart-card"><div class="chart-toolbar"><span>Price / bonding curve</span><div><button class="active">1H</button><button>1D</button><button>1W</button><button>ALL</button></div></div><svg class="market-chart" viewBox="0 0 720 230" role="img" aria-label="Example market price chart"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a00" stop-opacity=".38"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></linearGradient></defs><path class="grid-line" d="M0 55H720M0 115H720M0 175H720"/><path fill="url(#area)" d="M0 202L0 180L55 167L110 174L165 142L220 151L275 118L330 126L385 91L440 102L495 72L550 82L605 43L660 58L720 22L720 202Z"/><path class="price-line" d="M0 180L55 167L110 174L165 142L220 151L275 118L330 126L385 91L440 102L495 72L550 82L605 43L660 58L720 22"/></svg><div class="chart-caption"><span>Example data</span><span>Not a live quote</span></div></div></section><section class="section"><div class="section-heading"><div><h2>Developer launches</h2><p>Same meme, different commitments.</p></div></div>${compareTable}</section><section class="section"><div class="section-heading"><div><h2>Option ladder</h2><p>Premium is 10% of strike. Example values only.</p></div></div><div class="option-grid"><article><span>STRIKE</span><b>0.50 SOL</b><p>Premium 0.05 SOL</p><button data-trade-disabled>Buy option</button></article><article class="featured"><span>STRIKE</span><b>1.00 SOL</b><p>Premium 0.10 SOL</p><button data-trade-disabled>Buy option</button></article><article><span>STRIKE</span><b>2.00 SOL</b><p>Premium 0.20 SOL</p><button data-trade-disabled>Buy option</button></article></div></section><section class="section"><div class="activity-list"><div><span>Developer A</span><b class="lock">10% lock active</b><time>Expires in 13d 08h</time></div><div><span>Protected wallet</span><b>No sales detected</b><time>Checked 18s ago</time></div><div><span>Buyback reserve</span><b>0.00 SOL</b><time>Activates after sell-out</time></div></div></section>`;

  const pages = { home, markets, protection, compare, developers, docs, launch, market };
  document.title = `${pageNames[page]} — Vamend`;
  document.getElementById('app').innerHTML = shell(pages[page]);

  let connectedAddress = '';
  let tokenImage = null;
  const modal = document.querySelector('[data-wallet-modal]');
  const walletMessage = document.querySelector('[data-wallet-message]');
  const walletButtons = () => [...document.querySelectorAll('[data-wallet-connect]')];
  const refreshProviderState = async () => {
    const wallets = await window.VamendProtocol?.listWallets?.().catch(() => []) || [];
    ['phantom', 'solflare', 'backpack'].forEach(name => {
      const label = document.querySelector(`[data-detected="${name}"]`);
      if (label) label.textContent = wallets.some(wallet => wallet.name.toLowerCase().includes(name)) ? 'Detected' : 'Not installed';
    });
  };
  const showModal = () => { refreshProviderState(); modal.hidden = false; document.body.style.overflow = 'hidden'; };
  const hideModal = () => { modal.hidden = true; document.body.style.overflow = ''; };
  const updateWallet = address => {
    connectedAddress = address;
    const short = `${address.slice(0, 4)}…${address.slice(-4)}`;
    walletButtons().forEach(button => button.textContent = short);
    const disconnect = document.querySelector('[data-wallet-disconnect]');
    if (disconnect) disconnect.hidden = false;
  };
  const connectWallet = async name => {
    try {
      const state = await window.VamendProtocol.connect(name);
      if (state.address) updateWallet(state.address);
      hideModal();
    } catch (error) {
      walletMessage.textContent = error?.message || 'The wallet connection was cancelled.';
    }
  };
  const disconnectWallet = async () => {
    try { await window.VamendProtocol?.disconnect?.(); } catch {}
    connectedAddress = '';
    walletButtons().forEach(button => button.textContent = button.classList.contains('top-wallet') ? 'Connect wallet' : 'Connect wallet');
    document.querySelector('[data-wallet-disconnect]').hidden = true;
    walletMessage.textContent = 'Wallet disconnected. Choose a wallet to reconnect.';
  };
  walletButtons().forEach(button => button.addEventListener('click', showModal));
  document.querySelectorAll('[data-wallet-provider]').forEach(button => button.addEventListener('click', () => connectWallet(button.dataset.walletProvider)));
  document.querySelector('[data-wallet-disconnect]')?.addEventListener('click', disconnectWallet);
  document.querySelector('[data-modal-close]')?.addEventListener('click', hideModal);
  modal?.addEventListener('click', event => { if (event.target === modal) hideModal(); });
  window.VamendProtocol?.subscribe?.(state => {
    if (state.address) updateWallet(state.address);
    else if (connectedAddress) {
      connectedAddress = '';
      walletButtons().forEach(button => button.textContent = 'Connect wallet');
    }
  });

  const updateLaunchReview = () => {
    const name = document.querySelector('[data-token-name]')?.value.trim() || '';
    const ticker = document.querySelector('[data-token-ticker]')?.value.trim().toUpperCase() || '';
    const lock = document.querySelector('[data-lock-range]')?.value || '6';
    const expiry = document.querySelector('[data-expiry]')?.value || '14 days';
    document.querySelector('[data-review-name]')?.replaceChildren(document.createTextNode(name || 'Unnamed token'));
    document.querySelector('[data-review-ticker]')?.replaceChildren(document.createTextNode(ticker ? `$${ticker}` : '$TICKER'));
    document.querySelector('[data-review-market]')?.replaceChildren(document.createTextNode(name ? `${name} same-name group` : 'Created after validation'));
    document.querySelector('[data-review-lock]')?.replaceChildren(document.createTextNode(`${lock}%`));
    document.querySelector('[data-review-expiry]')?.replaceChildren(document.createTextNode(expiry));
    document.querySelector('[data-lock-value]')?.replaceChildren(document.createTextNode(`${lock}%`));
    document.querySelector('[data-side-lock]')?.replaceChildren(document.createTextNode(`${lock}% supply`));
  };
  const bindCounter = (selector, countSelector, transform = value => value) => {
    const input = document.querySelector(selector); const count = document.querySelector(countSelector);
    input?.addEventListener('input', () => { input.value = transform(input.value); if (count) count.textContent = input.value.length; updateLaunchReview(); });
  };
  bindCounter('[data-token-name]', '[data-name-count]');
  bindCounter('[data-token-ticker]', '[data-ticker-count]', value => value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
  bindCounter('[data-token-description]', '[data-description-count]');
  document.querySelector('[data-lock-range]')?.addEventListener('input', updateLaunchReview);
  document.querySelector('[data-expiry]')?.addEventListener('change', updateLaunchReview);
  const processImage = file => {
    const message = document.querySelector('[data-validation-message]');
    if (!file || !/^image\/(png|jpeg|webp|gif)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      if (message) message.textContent = 'Use a PNG, JPG, GIF or WebP image smaller than 5 MB.';
      return;
    }
    tokenImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      const preview = document.querySelector('[data-upload-preview]');
      if (preview) preview.innerHTML = `<img src="${reader.result}" alt="Token preview"><strong>${file.name}</strong><small>Click or drop another image to replace</small>`;
      const mini = document.querySelector('[data-review-image]');
      if (mini) { mini.textContent = ''; mini.style.backgroundImage = `url(${reader.result})`; }
    };
    reader.readAsDataURL(file);
  };
  const imageInput = document.querySelector('[data-token-image]');
  imageInput?.addEventListener('change', () => processImage(imageInput.files?.[0]));
  const uploadZone = document.querySelector('[data-upload-zone]');
  ['dragenter','dragover'].forEach(type => uploadZone?.addEventListener(type, event => { event.preventDefault(); uploadZone.classList.add('dragging'); }));
  ['dragleave','drop'].forEach(type => uploadZone?.addEventListener(type, event => { event.preventDefault(); uploadZone.classList.remove('dragging'); }));
  uploadZone?.addEventListener('drop', event => processImage(event.dataTransfer?.files?.[0]));
  document.querySelector('[data-review-launch]')?.addEventListener('click', async event => {
    const form = document.querySelector('[data-launch-form]'); const message = document.querySelector('[data-validation-message]');
    const valid = form?.checkValidity() && document.querySelector('[data-terms]')?.checked;
    if (!valid) { form?.reportValidity(); message.textContent = 'Enter a valid canonical name and mint address, then accept the risk acknowledgement.'; message.classList.add('error'); return; }
    if (!connectedAddress) { walletMessage.textContent = 'Choose a wallet to review the launch transaction.'; showModal(); return; }
    const button = event.currentTarget;
    button.disabled = true;
    message.textContent = 'Checking the program, mint and wallet balance…';
    message.classList.remove('error', 'success');
    try {
      const status = await window.VamendProtocol.protocolStatus();
      if (!status.deployed || !status.transactionsEnabled) throw new Error('The verified Vamend Mainnet program is awaiting activation. No wallet request was sent.');
      const expiryText = document.querySelector('[data-expiry]')?.value || '14 days';
      const result = await window.VamendProtocol.registerExistingMint({
        canonicalName: document.querySelector('[data-token-name]').value,
        mintAddress: document.querySelector('[data-mint-address]').value,
        lockBps: Number(document.querySelector('[data-lock-range]').value) * 100,
        expiryDays: Number.parseInt(expiryText, 10),
      });
      message.textContent = `Protection registered. Transaction: ${result.signature || 'confirmed by wallet'}`;
      message.classList.add('success');
    } catch (error) {
      message.textContent = error?.message || 'The registration transaction failed before confirmation.';
      message.classList.add('error');
    } finally {
      button.disabled = false;
    }
  });
  const updateProtocolStatus = async () => {
    const badge = document.querySelector('[data-protocol-status]');
    if (!badge) return;
    try {
      const status = await window.VamendProtocol.protocolStatus();
      badge.textContent = status.deployed ? 'LIVE' : 'AWAITING DEPLOY';
    } catch { badge.textContent = 'RPC UNAVAILABLE'; }
  };
  updateProtocolStatus();
  updateLaunchReview();

  const marketSearch = document.querySelector('[data-market-search]');
  const marketResults = document.querySelector('[data-market-results]');
  const marketEmpty = document.querySelector('[data-market-empty]');
  let marketFilter = 'all';
  const updateMarkets = () => {
    const query = marketSearch?.value.trim().toLowerCase() || '';
    const visible = (!query || '$moon developer a developer b developer c'.includes(query)) && ['all','protected','unprotected'].includes(marketFilter);
    if (marketResults) marketResults.hidden = !visible;
    if (marketEmpty) marketEmpty.hidden = visible;
  };
  marketSearch?.addEventListener('input', updateMarkets);
  document.querySelectorAll('[data-market-filter]').forEach(button => button.addEventListener('click', () => {
    marketFilter = button.dataset.marketFilter;
    document.querySelectorAll('[data-market-filter]').forEach(item => item.classList.toggle('active', item === button));
    updateMarkets();
  }));

  const isSolanaAddress = value => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value || '');
  const renderCa = value => {
    const valid = isSolanaAddress(value);
    document.querySelectorAll('[data-live-ca]').forEach(element => element.textContent = valid ? `${value.slice(0, 4)}…${value.slice(-4)}` : 'TBA');
    document.querySelectorAll('[data-copy-ca]').forEach(button => { button.disabled = !valid; button.dataset.ca = valid ? value : ''; });
  };
  const fetchCa = async () => {
    try {
      const response = await fetch(`${CONFIG_URL}?t=${Date.now()}`, { cache: 'no-store' });
      const config = await response.json();
      renderCa(config?.contract_address || 'tba');
    } catch { renderCa('tba'); }
  };
  document.querySelectorAll('[data-copy-ca]').forEach(button => button.addEventListener('click', async () => { if (button.dataset.ca) await navigator.clipboard.writeText(button.dataset.ca); }));
  fetchCa();
  window.setInterval(fetchCa, 1000);

  document.querySelectorAll('[data-trade-disabled]').forEach(button => button.addEventListener('click', () => {
    walletMessage.textContent = connectedAddress ? 'Trading opens after the verified Vamend contracts are published.' : 'Choose a Solana wallet first. Trading opens after contracts are published.';
    showModal();
  }));
})();
