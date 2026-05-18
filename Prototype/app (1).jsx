/* SplitSecond app shell */

const { ICONS } = window.SS;
const { ScreenWelcome, ScreenStart, ScreenReceipt, ScreenPeople } = window.SSScreens1;
const { ScreenSplitMode, ScreenAssign, ScreenSummary, ScreenConfirm } = window.SSScreens2;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#6948e0",
  "currency": "€",
  "showFrame": true
}/*EDITMODE-END*/;

const ACCENT_SOFTS = {
  '#6948e0': '#efeafd',
  '#2c9461': '#e6f4ed',
  '#d49234': '#fbf1de',
  '#d05a3a': '#fbe9e3',
};

const STEPS = [
  'welcome',  // 1
  'start',    // 2
  'receipt',  // 3
  'people',   // 4
  'mode',     // 5
  'assign',   // 6
  'summary',  // 7
  'confirm',  // 8
];

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stepIdx, setStepIdx] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  const [state, setState] = React.useState({
    user: { name: '', email: '' },
    occasion: 'Friday Dinner',
    group: 'The Crew',
    people: ['You'],
    nfcCount: 0,
    nearbyJoined: false,
    items: [],
    tax: 0,
    tip: 0,
    splitMode: 'items',
    assignments: {},
    payer: '',
  });
  const set = React.useCallback((patch) => setState(s => ({ ...s, ...patch })), []);

  // Apply theme + accent to root
  React.useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    document.documentElement.style.setProperty('--accent-soft',
      tweaks.theme === 'dark'
        ? `color-mix(in oklab, ${tweaks.accent} 22%, var(--bg-elev))`
        : (ACCENT_SOFTS[tweaks.accent] || `color-mix(in oklab, ${tweaks.accent} 12%, white)`)
    );
  }, [tweaks.theme, tweaks.accent]);

  const go = (delta) => {
    const target = stepIdx + delta;
    if (target < 0 || target >= STEPS.length) return;
    // Skip 'people' (handled in 'start') and skip 'assign' if equal split
    let next = target;
    if (STEPS[next] === 'people') next += delta; // skip
    if (STEPS[next] === 'assign' && state.splitMode === 'equal') next += delta;
    if (next < 0) next = 0;
    if (next >= STEPS.length) next = STEPS.length - 1;
    setDirection(delta);
    setStepIdx(next);
  };

  const restart = () => {
    setState({
      user: { name: '', email: '' },
      occasion: 'Friday Dinner', group: 'The Crew',
      people: ['You'], nfcCount: 0, nearbyJoined: false,
      items: [], tax: 0, tip: 0,
      splitMode: 'items', assignments: {}, payer: '',
    });
    setStepIdx(0);
  };

  const screen = STEPS[stepIdx];
  const screenProps = { state, set, currency: tweaks.currency, onContinue: () => go(1), onBack: stepIdx > 0 ? () => go(-1) : null };

  // Step labels (1-indexed for data-screen-label)
  const labelMap = {
    welcome: '01 Welcome', start: '02 Start', receipt: '03 Receipt',
    people: '04 People', mode: '05 Mode', assign: '06 Assign',
    summary: '07 Summary', confirm: '08 Confirm',
  };

  // The "current step number" shown in step bar (welcome=0, then 1..7)
  const stepBarCurrent = stepIdx; // 0..7
  const stepBarTotal = 7; // hide welcome from progress

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div className="phone-stage">
        <PhoneFrame showFrame={tweaks.showFrame} dark={tweaks.theme === 'dark'}>
          {/* Playful progress bar */}
          {stepIdx > 0 && (
            <div className="progress-wrap">
              <div className="progress-meta">
                <span className="label">{labelMap[screen]}</span>
                <span>{stepBarCurrent} of {stepBarTotal}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(stepBarCurrent / stepBarTotal) * 100}%` }}/>
              </div>
            </div>
          )}

          {/* Active screen with transition */}
          <div key={screen} data-screen-label={labelMap[screen]} style={{
            position: 'absolute', inset: 0,
            animation: `slideIn-${direction > 0 ? 'r' : 'l'} 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both`,
          }}>
            {screen === 'welcome' && <ScreenWelcome {...screenProps} />}
            {screen === 'start' && <ScreenStart {...screenProps} />}
            {screen === 'receipt' && <ScreenReceipt {...screenProps} />}
            {screen === 'people' && <ScreenPeople {...screenProps} />}
            {screen === 'mode' && <ScreenSplitMode {...screenProps} />}
            {screen === 'assign' && <ScreenAssign {...screenProps} />}
            {screen === 'summary' && <ScreenSummary {...screenProps} />}
            {screen === 'confirm' && <ScreenConfirm {...screenProps} onRestart={restart} />}
          </div>
        </PhoneFrame>
        </div>

        {/* Side hint */}
        <div style={{
          position: 'fixed', bottom: 24, left: 24,
          fontSize: 11, fontFamily: "'Geist Mono', ui-monospace, monospace",
          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em',
        }}>
          SplitSecond · MVP prototype
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Theme">
          <TweakRadio label="Mode" value={tweaks.theme} onChange={v => setTweak('theme', v)} options={['light', 'dark']}/>
        </TweakSection>
        <TweakSection label="Accent">
          <TweakColor label="Color" value={tweaks.accent} onChange={v => setTweak('accent', v)} options={['#6948e0', '#2c9461', '#d49234', '#d05a3a']}/>
        </TweakSection>
        <TweakSection label="Currency">
          <TweakRadio label="Symbol" value={tweaks.currency} onChange={v => setTweak('currency', v)} options={['€', '$', '£']}/>
        </TweakSection>
        <TweakSection label="Frame">
          <TweakToggle label="Show iPhone frame" value={tweaks.showFrame} onChange={v => setTweak('showFrame', v)} />
        </TweakSection>
        <TweakSection label="Jump to step">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {STEPS.map((s, i) => (
              <button key={s} onClick={() => { setDirection(i > stepIdx ? 1 : -1); setStepIdx(i); }} style={{
                padding: '8px 4px', borderRadius: 8,
                background: stepIdx === i ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                color: stepIdx === i ? '#fff' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'inherit', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                textTransform: 'capitalize',
              }}>{s}</button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function PhoneFrame({ children, showFrame, dark }) {
  if (!showFrame) {
    return (
      <div style={{
        width: 402, height: 874, borderRadius: 32, overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
        {children}
      </div>
    );
  }
  return (
    <div style={{
      width: 402, height: 874, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 2px rgba(255,255,255,0.04)',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }} />
      {/* status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40, padding: '21px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 54 }}>
        <span style={{ fontWeight: 600, fontSize: 16, color: dark ? '#fff' : '#000' }}>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: dark ? '#fff' : '#000' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4"/><rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor"/></svg>
        </div>
      </div>
      {/* content */}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 139, height: 5, borderRadius: 100, zIndex: 60,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
      }} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
