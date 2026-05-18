/* Screens 5-8 */

const { ICONS, Avatar, ScreenHeader, Money, CountUp, avatarColor } = window.SS;

// ─────────────────────────────────────────────────────────
// SCREEN 5 — Choose split mode
// ─────────────────────────────────────────────────────────
function ScreenSplitMode({ state, set, onContinue, onBack, currency }) {
  const subtotal = state.items.reduce((s, i) => s + i.price, 0);
  const total = subtotal + state.tax + state.tip;
  const equalShare = state.people.length ? total / state.people.length : 0;

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll">
        <ScreenHeader eyebrow="Step 4 · Method" title="How are you splitting?" sub="Pick equal for speed — or item-level for fairness." onBack={onBack} />

        <ModeCard
          selected={state.splitMode === 'equal'}
          onClick={() => set({ splitMode: 'equal' })}
          icon={ICONS.divide}
          title="Split equally"
          description="Total bill divided evenly across everyone."
          stat={<><CountUp value={equalShare} currency={currency} /> <span style={{ color: 'var(--ink-3)', fontWeight: 500, fontSize: 14 }}>per person</span></>}
        />
        <div style={{ height: 12 }}/>
        <ModeCard
          selected={state.splitMode === 'items'}
          onClick={() => set({ splitMode: 'items' })}
          icon={ICONS.spark}
          title="Split by items"
          description="Each person pays for what they consumed. Tax & tip shared."
          stat={<span style={{ color: 'var(--ink-3)', fontSize: 14, fontWeight: 500 }}>Item-level fairness</span>}
        />
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onContinue}>Continue {ICONS.arrow}</button>
      </div>
    </div>
  );
}

function ModeCard({ selected, onClick, icon, title, description, stat }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      padding: 18, borderRadius: 22,
      background: selected ? 'color-mix(in oklab, var(--accent) 8%, var(--bg-elev))' : 'var(--bg-elev)',
      border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
      cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)',
      transition: 'all 0.18s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: selected ? 'var(--accent)' : 'var(--bg-sunk)',
          color: selected ? '#fff' : 'var(--ink-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <div style={{ fontWeight: 700, fontSize: 17 }}>{title}</div>
        <div style={{ flex: 1 }}/>
        <div style={{
          width: 22, height: 22, borderRadius: 11,
          border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--line-2)'}`,
          background: selected ? 'var(--accent)' : 'transparent',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{selected && ICONS.check}</div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.4, marginBottom: 10 }}>{description}</div>
      <div style={{ fontSize: 22, fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.02em' }}>{stat}</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// SCREEN 6 — Assign Items
// ─────────────────────────────────────────────────────────
function ScreenAssign({ state, set, onContinue, onBack, currency }) {
  const validPeople = state.people.filter(p => p.trim());
  const allLines = [
    ...state.items,
    ...(state.tax > 0 ? [{ name: 'Tax', price: state.tax, shared: true }] : []),
    ...(state.tip > 0 ? [{ name: 'Tip', price: state.tip, shared: true }] : []),
  ];

  const togglePerson = (itemName, person) => {
    const cur = state.assignments[itemName] || [];
    const next = cur.includes(person) ? cur.filter(p => p !== person) : [...cur, person];
    set({ assignments: { ...state.assignments, [itemName]: next } });
  };

  const allAssigned = allLines.every(l => (state.assignments[l.name] || []).length > 0);

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll">
        <ScreenHeader eyebrow="Step 5 · Assign" title="Tap to claim." sub="Tap each item to assign people. Shared items split automatically." onBack={onBack} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allLines.map((line, i) => {
            const assigned = state.assignments[line.name] || [];
            const perPerson = assigned.length ? line.price / assigned.length : line.price;
            return (
              <div key={line.name} className="card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{line.name} {line.shared && <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>· shared</span>}</div>
                    {assigned.length > 0 && (
                      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                        <Money value={perPerson} currency={currency} weight={600} /> / person · {assigned.length} {assigned.length === 1 ? 'person' : 'people'}
                      </div>
                    )}
                  </div>
                  <Money value={line.price} currency={currency} weight={600} size="16px" />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {validPeople.map((p, pi) => {
                    const on = assigned.includes(p);
                    return (
                      <button key={p} onClick={() => togglePerson(line.name, p)} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px 5px 5px', borderRadius: 999,
                        border: `1px solid ${on ? 'transparent' : 'var(--line-2)'}`,
                        background: on ? avatarColor(p, pi) : 'transparent',
                        color: on ? '#fff' : 'var(--ink-2)',
                        cursor: 'pointer', fontFamily: 'inherit',
                        fontSize: 13, fontWeight: 600,
                        transition: 'all 0.15s',
                      }}>
                        <Avatar name={p} idx={pi} size={22} />
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onContinue} disabled={!allAssigned}>
          {allAssigned ? 'See summary' : 'Assign every item'} {ICONS.arrow}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCREEN 7 — Summary
// ─────────────────────────────────────────────────────────
function ScreenSummary({ state, set, onContinue, onBack, currency }) {
  const validPeople = state.people.filter(p => p.trim());
  const subtotal = state.items.reduce((s, i) => s + i.price, 0);
  const total = subtotal + state.tax + state.tip;

  // Calculate per-person totals
  const totals = {};
  validPeople.forEach(p => totals[p] = 0);
  if (state.splitMode === 'equal') {
    const each = total / validPeople.length;
    validPeople.forEach(p => totals[p] = each);
  } else {
    const allLines = [
      ...state.items,
      ...(state.tax > 0 ? [{ name: 'Tax', price: state.tax }] : []),
      ...(state.tip > 0 ? [{ name: 'Tip', price: state.tip }] : []),
    ];
    allLines.forEach(line => {
      const assigned = state.assignments[line.name] || [];
      if (assigned.length) {
        const per = line.price / assigned.length;
        assigned.forEach(p => totals[p] += per);
      }
    });
  }

  React.useEffect(() => {
    if (!state.payer && validPeople.length) set({ payer: validPeople[0] });
  }, []);

  const settlements = state.payer ? validPeople
    .filter(p => p !== state.payer && totals[p] > 0.005)
    .map(p => ({ from: p, to: state.payer, amount: totals[p] })) : [];

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll">
        <ScreenHeader eyebrow="Step 6 · Summary" title="The maths." sub="Here's who owes what." onBack={onBack} />

        {/* Big total */}
        <div style={{
          background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 22, padding: 22, marginBottom: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 160, height: 160,
            borderRadius: '50%', background: 'var(--accent)', opacity: 0.4, filter: 'blur(40px)',
          }}/>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>Total bill</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, lineHeight: 1, letterSpacing: '-0.03em' }}>
            <CountUp value={total} currency={currency} />
          </div>
          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.7, display: 'flex', justifyContent: 'space-between' }}>
            <span>{validPeople.length} people · {state.splitMode === 'equal' ? 'Equal split' : 'Item split'}</span>
            <span>{state.occasion || 'Group payment'}</span>
          </div>
        </div>

        {/* Per-person */}
        <div className="eyebrow" style={{ marginBottom: 10 }}>Per person</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          {validPeople.map((p, i) => (
            <div key={p} className="item-row" style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
              <Avatar name={p} idx={i} />
              <div style={{ flex: 1, fontWeight: 600 }}>{p} {p === state.payer && <span className="chip" style={{ marginLeft: 6, fontSize: 10, padding: '2px 8px' }}>Paid bill</span>}</div>
              <Money value={totals[p]} currency={currency} weight={700} size="16px" />
            </div>
          ))}
        </div>

        {/* Payer selection */}
        <div className="eyebrow" style={{ marginBottom: 10 }}>Who paid the bill upfront?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
          {validPeople.map((p, pi) => (
            <button key={p} onClick={() => set({ payer: p })} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px 5px 5px', borderRadius: 999,
              border: `1px solid ${state.payer === p ? 'var(--accent)' : 'var(--line-2)'}`,
              background: state.payer === p ? 'color-mix(in oklab, var(--accent) 12%, var(--bg-elev))' : 'var(--bg-elev)',
              color: state.payer === p ? 'var(--accent)' : 'var(--ink-2)',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            }}>
              <Avatar name={p} idx={pi} size={22} />
              {p}
            </button>
          ))}
        </div>

        {/* Settlements */}
        {settlements.length > 0 && (
          <>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Settlements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {settlements.map((s, i) => (
                <div key={i} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, animation: `fadeUp 0.4s ease ${0.3 + i * 0.08}s both` }}>
                  <Avatar name={s.from} idx={validPeople.indexOf(s.from)} size={32} />
                  <span style={{ color: 'var(--ink-3)' }}>→</span>
                  <Avatar name={s.to} idx={validPeople.indexOf(s.to)} size={32} />
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)' }}>
                    <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{s.from}</span> pays <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{s.to}</span>
                  </div>
                  <Money value={s.amount} currency={currency} weight={700} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onContinue}>
          Settle with SEPA Instant {ICONS.arrow}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCREEN 8 — Confirm Payment with Face ID
// ─────────────────────────────────────────────────────────
function ScreenConfirm({ state, set, onRestart, onBack, currency }) {
  const [phase, setPhase] = React.useState('review'); // review | auth | settling | done
  const validPeople = state.people.filter(p => p.trim());
  const subtotal = state.items.reduce((s, i) => s + i.price, 0);
  const total = subtotal + state.tax + state.tip;

  const totals = {};
  validPeople.forEach(p => totals[p] = 0);
  if (state.splitMode === 'equal') {
    const each = total / validPeople.length;
    validPeople.forEach(p => totals[p] = each);
  } else {
    const allLines = [
      ...state.items,
      ...(state.tax > 0 ? [{ name: 'Tax', price: state.tax }] : []),
      ...(state.tip > 0 ? [{ name: 'Tip', price: state.tip }] : []),
    ];
    allLines.forEach(line => {
      const assigned = state.assignments[line.name] || [];
      if (assigned.length) {
        const per = line.price / assigned.length;
        assigned.forEach(p => totals[p] += per);
      }
    });
  }
  const settlements = state.payer ? validPeople
    .filter(p => p !== state.payer && totals[p] > 0.005)
    .map(p => ({ from: p, to: state.payer, amount: totals[p] })) : [];

  const startAuth = () => {
    setPhase('auth');
    const authMs = 900 + Math.random() * 700;       // 0.9–1.6s
    const settleMs = 1100 + Math.random() * 900;    // 1.1–2.0s
    setTimeout(() => setPhase('settling'), authMs);
    setTimeout(() => setPhase('done'), authMs + settleMs);
  };

  if (phase === 'auth' || phase === 'settling') {
    return (
      <div className="ss-screen" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
        <div className="ss-screen-scroll" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 22px' }}>
          <FaceIDAnim done={phase === 'settling'} />
          <div style={{ marginTop: 28, fontFamily: "'Instrument Serif', serif", fontSize: 28, letterSpacing: '-0.02em' }}>
            {phase === 'auth' ? 'Verifying Face ID' : 'Settling via SEPA Instant'}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.6 }}>
            {phase === 'auth' ? 'Strong Customer Authentication (PSD2)' : 'Real-time euro transfer · under 10 seconds'}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="ss-screen">
        <div className="ss-screen-scroll" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 22px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 40,
            background: 'var(--good)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'fadeUp 0.5s ease',
            boxShadow: '0 8px 24px -6px color-mix(in oklab, var(--good) 60%, transparent)',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M9 18l6 6 12-14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease 0.15s both' }}>
            <div className="eyebrow">Complete</div>
            <h1 className="screen-title" style={{ fontSize: 32, marginTop: 6 }}>Settled in 3.2s</h1>
            <p className="screen-sub" style={{ marginBottom: 28 }}>
              Funds moved to {state.payer}'s account via SEPA Instant.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'fadeUp 0.5s ease 0.3s both' }}>
            {settlements.map((s, i) => (
              <div key={i} className="item-row">
                <Avatar name={s.from} idx={validPeople.indexOf(s.from)} size={32} />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{s.from}</span> → <span style={{ fontWeight: 600 }}>{s.to}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Money value={s.amount} currency={currency} weight={700} />
                  <span style={{ color: 'var(--good)' }}>{ICONS.check}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 28 }}/>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>
            Authorised via Face ID · PSD2 SCA<br/>
            Reference SS-{Date.now().toString().slice(-8)}
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={onRestart}>Start a new split</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ss-screen">
      <div className="ss-screen-scroll">
        <ScreenHeader eyebrow="Step 7 · Confirm" title="Settle the bill." sub="Authorize the transfer with Face ID. Settlement is instant via SEPA." onBack={onBack} />

        <div style={{
          background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 22, padding: 22, marginBottom: 14,
        }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>To {state.payer}</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1 }}>
            <Money value={settlements.reduce((s, x) => s + x.amount, 0)} currency={currency} weight={400} />
          </div>
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6, display: 'flex', justifyContent: 'space-between' }}>
            <span>{settlements.length} {settlements.length === 1 ? 'transfer' : 'transfers'}</span>
            <span>SEPA Instant</span>
          </div>
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>Payment method</div>
        <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #1a1a1a, #444)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {ICONS.card}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Revolut · ••2148</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>EU IBAN · SEPA-enabled</div>
          </div>
          <span className="chip" style={{ background: 'color-mix(in oklab, var(--good) 15%, transparent)', color: 'var(--good)' }}>{ICONS.check} Linked</span>
        </div>

        <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>
          By confirming, you authorize SplitSecond to initiate the transfer under PSD2 Strong Customer Authentication.
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={startAuth}>
          {ICONS.faceid} Authorize with Face ID
        </button>
      </div>
    </div>
  );
}

function FaceIDAnim({ done }) {
  return (
    <div style={{
      width: 120, height: 120, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Brackets */}
      {[[0,0],[null,0,0,null],[0,null,null,0],[null,null,0,0]].map((pos, i) => {
        const [t,r,b,l] = pos;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', top: t, right: r, bottom: b, left: l, width: 22, height: 3, background: done ? 'var(--good)' : 'var(--accent)', borderRadius: 2, transition: 'background 0.4s' }}/>
            <div style={{ position: 'absolute', top: t, right: r, bottom: b, left: l, width: 3, height: 22, background: done ? 'var(--good)' : 'var(--accent)', borderRadius: 2, transition: 'background 0.4s' }}/>
          </React.Fragment>
        );
      })}
      {/* Face icon */}
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ color: done ? 'var(--good)' : '#fff', transition: 'color 0.4s' }}>
        <circle cx="22" cy="24" r="2" fill="currentColor"/>
        <circle cx="38" cy="24" r="2" fill="currentColor"/>
        <path d="M30 22v8l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 38c2 2 5 3 8 3s6-1 8-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* Scan line */}
      {!done && (
        <div style={{
          position: 'absolute', left: 6, right: 6, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          animation: 'scan-line 1.4s ease-in-out infinite',
          top: '50%',
        }}/>
      )}
    </div>
  );
}

window.SSScreens2 = { ScreenSplitMode, ScreenAssign, ScreenSummary, ScreenConfirm };
