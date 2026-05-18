/* Screens 1-4 */

const { ICONS, Avatar, ScreenHeader, Money, CountUp } = window.SS;

// ─────────────────────────────────────────────────────────
// SCREEN 1 — Welcome / Login
// ─────────────────────────────────────────────────────────
function ScreenWelcome({ onContinue, currency }) {
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const canContinue = email.length > 2;

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll" style={{ paddingTop: 72 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Instrument Serif', serif", fontSize: 34, lineHeight: 1,
          marginBottom: 24,
          boxShadow: '0 8px 24px -6px color-mix(in oklab, var(--accent) 60%, transparent)',
        }}>S</div>
        <div className="eyebrow">SplitSecond</div>
        <h1 className="screen-title" style={{ fontSize: 40 }}>
          Splitting<br/>the bill should<br/>take a <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>second.</em>
        </h1>
        <p className="screen-sub" style={{ marginTop: 12, marginBottom: 28 }}>
          One app for receipt scanning, item allocation, and instant settlement across the EU.
        </p>

        <div style={{
          display: 'flex', background: 'var(--bg-sunk)', padding: 4, borderRadius: 999,
          marginBottom: 16,
        }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, height: 38, border: 'none', borderRadius: 999,
              background: mode === m ? 'var(--bg-elev)' : 'transparent',
              color: mode === m ? 'var(--ink)' : 'var(--ink-3)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.18s',
            }}>{m === 'login' ? 'Log in' : 'Create account'}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mode === 'signup' && (
            <input className="input" placeholder="Full name" />
          )}
          <input className="input" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        {mode === 'signup' && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Toggle label="Link payment method" defaultChecked />
            <Toggle label="Enable Face ID for payments" defaultChecked />
          </div>
        )}

        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.4 }}>
          Secured by PSD2 Open Banking & Strong Customer Authentication. By continuing you agree to our terms.
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" disabled={!canContinue} onClick={onContinue}>
          {mode === 'login' ? 'Log in' : 'Create account'} {ICONS.arrow}
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, defaultChecked }) {
  const [on, setOn] = React.useState(!!defaultChecked);
  return (
    <button onClick={() => setOn(!on)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '12px 16px', borderRadius: 14,
      background: 'var(--bg-elev)', border: '1px solid var(--line)',
      cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
      color: 'var(--ink)', textAlign: 'left',
    }}>
      <span>{label}</span>
      <span style={{
        width: 36, height: 22, borderRadius: 12,
        background: on ? 'var(--accent)' : 'var(--line-2)',
        position: 'relative', transition: 'background 0.2s',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: on ? 16 : 2,
          width: 18, height: 18, borderRadius: 9, background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }}/>
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// SCREEN 2 — Start a Split (with radar)
// ─────────────────────────────────────────────────────────
const PEOPLE_POOL = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Sam', 'Morgan', 'Riley', 'Quinn', 'Jamie', 'Drew', 'Robin', 'Avery'];

function ScreenStart({ state, set, onContinue, onBack }) {
  const [scanning, setScanning] = React.useState(false);
  const [discovered, setDiscovered] = React.useState(state.nearbyJoined || state.people.length > 1);

  const startScan = () => {
    setScanning(true);
    const delay = 1400 + Math.random() * 900;
    setTimeout(() => {
      const shuffled = [...PEOPLE_POOL].sort(() => Math.random() - 0.5);
      const count = 2 + Math.floor(Math.random() * 3); // 2-4
      const picked = shuffled.slice(0, count);
      set({ people: ['You', ...picked], nfcCount: count, nearbyJoined: true });
      setDiscovered(true);
      setScanning(false);
    }, delay);
  };

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll">
        <ScreenHeader eyebrow="Step 1 · Group" title="Start a split." sub="Set the scene, then let nearby phones join the session." onBack={onBack} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <input className="input" placeholder="Occasion (e.g. Friday dinner)" value={state.occasion} onChange={e => set({ occasion: e.target.value })} />
          <input className="input" placeholder="Group name" value={state.group} onChange={e => set({ group: e.target.value })} />
        </div>

        <Radar scanning={scanning} discovered={discovered} people={state.people} onTap={startScan} />

        {discovered && (
          <div style={{ marginTop: 18, animation: 'fadeUp 0.4s ease' }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>{state.people.filter(p => p.trim()).length} splitting · {state.nfcCount} joined via NFC</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.people.map((p, i) => {
                const isYou = i === 0;
                const isManual = !isYou && i > (state.nfcCount || 0);
                return (
                  <div key={i} className="item-row" style={{ animation: `fadeUp 0.4s ease ${i * 0.08}s both`, borderColor: isYou ? 'var(--accent)' : undefined }}>
                    <Avatar name={p || '?'} idx={i} />
                    {isManual ? (
                      <input
                        value={p}
                        autoFocus={!p}
                        onChange={e => {
                          const next = [...state.people];
                          next[i] = e.target.value;
                          set({ people: next });
                        }}
                        placeholder="Name"
                        style={{
                          flex: 1, border: 'none', background: 'transparent', outline: 'none',
                          font: '600 15px inherit', color: 'var(--ink)',
                        }}
                      />
                    ) : (
                      <div style={{ flex: 1, fontWeight: 600 }}>{p}</div>
                    )}
                    {isYou ? (
                      <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>you</div>
                    ) : isManual ? (
                      <button onClick={() => set({ people: state.people.filter((_, j) => j !== i) })} style={{
                        border: 'none', background: 'transparent', color: 'var(--ink-3)',
                        cursor: 'pointer', padding: 4, fontSize: 18,
                      }}>×</button>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--good)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--good)' }}/>
                        nearby
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() => set({ people: [...state.people, ''] })}
                className="btn btn-secondary btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: 4 }}
              >
                {ICONS.plus} Add manually
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onContinue} disabled={!discovered}>
          Continue {ICONS.arrow}
        </button>
      </div>
    </div>
  );
}

function Radar({ scanning, discovered, people, onTap }) {
  return (
    <div onClick={!scanning && !discovered ? onTap : undefined} style={{
      position: 'relative', height: 220,
      background: 'var(--bg-elev)', border: '1px solid var(--line)',
      borderRadius: 22, overflow: 'hidden',
      cursor: !scanning && !discovered ? 'pointer' : 'default',
    }}>
      {/* Concentric rings */}
      {[0.4, 0.65, 0.9].map((r, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 200 * r, height: 200 * r,
          marginLeft: -100 * r, marginTop: -100 * r,
          border: '1px solid var(--line-2)', borderRadius: '50%',
        }}/>
      ))}
      {/* Center beacon */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 36, height: 36, marginLeft: -18, marginTop: -18,
        borderRadius: '50%', background: 'var(--accent)',
        boxShadow: '0 4px 16px -2px color-mix(in oklab, var(--accent) 50%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 14,
      }}>You</div>
      {/* Pulse rings when scanning */}
      {scanning && [0, 0.6, 1.2].map((d, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 36, height: 36, marginLeft: -18, marginTop: -18,
          borderRadius: '50%',
          border: '2px solid var(--accent)',
          animation: `pulse-ring 1.8s ease-out ${d}s infinite`,
        }}/>
      ))}
      {/* Discovered avatars positioned around (skip 'You' at index 0) */}
      {discovered && people.slice(1).map((p, idx) => {
        const i = idx + 1;
        const others = people.length - 1;
        const angle = (idx / Math.max(1, others)) * Math.PI * 2 + Math.PI / 4;
        const radius = 78;
        return (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(${Math.cos(angle) * radius - 18}px, ${Math.sin(angle) * radius - 18}px)`,
            animation: `fadeUp 0.4s ease ${idx * 0.1}s both`,
          }}>
            <Avatar name={p} idx={i} ring />
          </div>
        );
      })}
      {/* Status label */}
      <div style={{
        position: 'absolute', bottom: 14, left: 0, right: 0,
        textAlign: 'center', fontSize: 13, fontWeight: 600,
        color: 'var(--ink-2)',
      }}>
        {scanning ? 'Scanning nearby devices…' : discovered ? `${people.length - 1} people joined via NFC` : 'Tap to discover nearby people'}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCREEN 3 — Receipt scan
// ─────────────────────────────────────────────────────────
const ITEM_POOL = [
  { name: 'Ribeye Steak', price: 38.00 },
  { name: 'Caesar Salad', price: 14.50 },
  { name: 'Iced Tea', price: 4.00 },
  { name: 'Sparkling Water', price: 6.00 },
  { name: 'Lava Cake', price: 12.00 },
  { name: 'Truffle Pasta', price: 22.50 },
  { name: 'Margherita Pizza', price: 16.00 },
  { name: 'House Burger', price: 18.50 },
  { name: 'Tiramisu', price: 9.50 },
  { name: 'Espresso', price: 3.50 },
  { name: 'House Red (glass)', price: 8.00 },
  { name: 'Aperol Spritz', price: 11.00 },
  { name: 'Bruschetta', price: 7.50 },
  { name: 'Calamari Fritti', price: 13.00 },
  { name: 'Risotto Funghi', price: 19.50 },
  { name: 'Grilled Salmon', price: 26.00 },
];

function ScreenReceipt({ state, set, onContinue, onBack, currency }) {
  const [scanning, setScanning] = React.useState(false);
  const [scanned, setScanned] = React.useState(state.items.length > 0);
  const [revealCount, setRevealCount] = React.useState(scanned ? 99 : 0);

  const startScan = () => {
    setScanning(true);
    const delay = 1400 + Math.random() * 900;
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      const shuffled = [...ITEM_POOL].sort(() => Math.random() - 0.5);
      const count = 4 + Math.floor(Math.random() * 3); // 4-6 items
      const items = shuffled.slice(0, count);
      const subtotal = items.reduce((s, i) => s + i.price, 0);
      const tax = +(subtotal * (0.08 + Math.random() * 0.04)).toFixed(2); // 8-12%
      set({ items, tax, tip: 0 });
      items.forEach((_, i) => {
        setTimeout(() => setRevealCount(c => Math.max(c, i + 1)), i * 180);
      });
    }, delay);
  };

  const updateItem = (i, field, val) => {
    const items = [...state.items];
    items[i] = { ...items[i], [field]: field === 'price' ? Number(val) || 0 : val };
    set({ items });
  };
  const removeItem = (i) => set({ items: state.items.filter((_, j) => j !== i) });
  const addItem = () => {
    set({ items: [...state.items, { name: '', price: 0 }] });
    setRevealCount(c => c + 1);
  };

  const subtotal = state.items.reduce((s, i) => s + i.price, 0);
  const total = subtotal + state.tax + state.tip;

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll">
        <ScreenHeader eyebrow="Step 2 · Receipt" title="Capture the bill." sub="Scan the receipt to extract items, tax, and tip automatically." onBack={onBack} />

        {!scanned ? (
          <ScannerCard scanning={scanning} onScan={startScan} />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {state.items.map((item, i) => (
                <ReceiptRow key={i} item={item} hidden={i >= revealCount} currency={currency}
                  onChange={(field, val) => updateItem(i, field, val)} onRemove={() => removeItem(i)} />
              ))}
              <button onClick={addItem} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 6 }}>
                {ICONS.plus} Add item
              </button>
            </div>

            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Tax</span>
                <CurrencyInput value={state.tax} onChange={v => set({ tax: v })} currency={currency} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Tip</span>
                <CurrencyInput value={state.tip} onChange={v => set({ tip: v })} currency={currency} />
              </div>
            </div>

            <div className="card" style={{ background: 'var(--bg-sunk)', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, color: 'var(--ink-2)' }}>
                <span>Subtotal</span><Money value={subtotal} currency={currency} weight={500}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12, color: 'var(--ink-2)' }}>
                <span>Tax + tip</span><Money value={state.tax + state.tip} currency={currency} weight={500}/>
              </div>
              <div style={{ height: 1, background: 'var(--line-2)', margin: '0 -2px 12px' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, letterSpacing: '-0.02em' }}>
                  <Money value={total} currency={currency} weight={400} />
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onContinue} disabled={!scanned}>
          Continue {ICONS.arrow}
        </button>
      </div>
    </div>
  );
}

function ScannerCard({ scanning, onScan }) {
  return (
    <div onClick={!scanning ? onScan : undefined} style={{
      height: 320, borderRadius: 22, overflow: 'hidden',
      background: 'linear-gradient(140deg, #1a1a1a, #0a0a0a)',
      position: 'relative', cursor: scanning ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Receipt mock */}
      <div style={{
        width: 180, height: 240, background: '#f8f5ee',
        borderRadius: 4, padding: 18,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
        transform: 'rotate(-3deg)',
        opacity: scanning ? 1 : 0.7,
        transition: 'opacity 0.3s',
        position: 'relative',
      }}>
        <div className="t-mono" style={{ fontSize: 8, color: '#222', textAlign: 'center', marginBottom: 10 }}>★ BISTRO 27 ★</div>
        {[40, 60, 50, 70, 45, 55, 80].map((w, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 6,
          }}>
            <div className="skeleton" style={{ width: w + '%', height: 5, background: '#ddd6c5' }}/>
            <div className="skeleton" style={{ width: 18, height: 5, background: '#ddd6c5' }}/>
          </div>
        ))}
      </div>
      {/* Corner brackets */}
      {[[8,8],[null,8,8,null],[8,null,null,8],[null,null,8,8]].map((pos, i) => {
        const [t,r,b,l] = pos;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', top: t, right: r, bottom: b, left: l, width: 24, height: 3, background: '#fff' }}/>
            <div style={{ position: 'absolute', top: t, right: r, bottom: b, left: l, width: 3, height: 24, background: '#fff' }}/>
          </React.Fragment>
        );
      })}
      {/* Scan line */}
      {scanning && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, color-mix(in oklab, var(--accent) 70%, transparent))',
          animation: 'scan-line 1.5s ease-in-out infinite',
        }}/>
      )}
      {/* Label */}
      <div style={{
        position: 'absolute', bottom: 16, left: 0, right: 0,
        textAlign: 'center', color: '#fff',
        fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
      }}>
        {scanning ? 'Reading receipt…' : 'Tap to scan receipt'}
      </div>
    </div>
  );
}

function ReceiptRow({ item, hidden, onChange, onRemove, currency }) {
  if (hidden) return <div style={{ height: 52 }}/>;
  return (
    <div className="item-row" style={{ animation: 'count-in 0.4s ease both' }}>
      <input
        value={item.name}
        onChange={e => onChange('name', e.target.value)}
        placeholder="Item"
        style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          font: '600 15px inherit', color: 'var(--ink)',
        }}
      />
      <CurrencyInput value={item.price} onChange={v => onChange('price', v)} currency={currency} compact />
      <button onClick={onRemove} style={{
        border: 'none', background: 'transparent', color: 'var(--ink-3)',
        cursor: 'pointer', padding: 4, fontSize: 18,
      }}>×</button>
    </div>
  );
}

function CurrencyInput({ value, onChange, currency = '€', compact }) {
  const [focused, setFocused] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const display = focused ? draft : (Number(value) === 0 ? '' : Number(value).toFixed(2));
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      background: compact ? 'transparent' : 'var(--bg-sunk)',
      borderRadius: 8, padding: compact ? 0 : '6px 10px',
      width: compact ? 'auto' : 100,
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-3)' }}>{currency}</span>
      <input
        type="text" inputMode="decimal"
        value={display}
        placeholder="0.00"
        onFocus={() => { setFocused(true); setDraft(Number(value) === 0 ? '' : String(value)); }}
        onBlur={() => setFocused(false)}
        onChange={e => {
          const v = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
          setDraft(v);
          const n = parseFloat(v);
          onChange(isNaN(n) ? 0 : n);
        }}
        style={{
          width: compact ? 60 : '100%', border: 'none', background: 'transparent', outline: 'none',
          font: '600 15px inherit', color: 'var(--ink)', textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCREEN 4 — People (combined into Start in our flow, but kept for direct add)
// ─────────────────────────────────────────────────────────
function ScreenPeople({ state, set, onContinue, onBack }) {
  const addPerson = () => set({ people: [...state.people, ''] });
  const update = (i, name) => {
    const p = [...state.people];
    p[i] = name;
    set({ people: p });
  };
  const remove = (i) => set({ people: state.people.filter((_, j) => j !== i) });

  const valid = state.people.filter(p => p.trim()).length;

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll">
        <ScreenHeader eyebrow="Step 3 · People" title="Who's splitting?" sub="The group from nearby — edit, add, or remove anyone." onBack={onBack} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.people.map((p, i) => (
            <div key={i} className="item-row">
              <Avatar name={p || '?'} idx={i} />
              <input
                value={p}
                onChange={e => update(i, e.target.value)}
                placeholder={`Person ${i + 1}`}
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none',
                  font: '600 15px inherit', color: 'var(--ink)',
                }}
              />
              {state.people.length > 1 && (
                <button onClick={() => remove(i)} style={{
                  border: 'none', background: 'transparent', color: 'var(--ink-3)',
                  cursor: 'pointer', padding: 4, fontSize: 18,
                }}>×</button>
              )}
            </div>
          ))}
          <button onClick={addPerson} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 6 }}>
            {ICONS.plus} Add person
          </button>
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onContinue} disabled={valid < 2}>
          Continue with {valid} {valid === 1 ? 'person' : 'people'} {ICONS.arrow}
        </button>
      </div>
    </div>
  );
}

window.SSScreens1 = { ScreenWelcome, ScreenStart, ScreenReceipt, ScreenPeople };
