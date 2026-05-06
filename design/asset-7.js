// App entry — wires the design canvas with 3 artboards and a Tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "focused": "all",
  "showA": true,
  "showB": true,
  "showC": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const all = [
    { id: 'a', label: 'A · Editorial Pulse', show: tweaks.showA, Comp: window.DirectionA, w: 1280, h: 880 },
    { id: 'b', label: 'B · Mission Control', show: tweaks.showB, Comp: window.DirectionB, w: 1440, h: 880 },
    { id: 'c', label: 'C · Stage Energy',   show: tweaks.showC, Comp: window.DirectionC, w: 1320, h: 920 },
  ];
  const visible = all.filter(a => a.show && (tweaks.focused === 'all' || tweaks.focused === a.id));

  return (
    <>
      <DesignCanvas>
        <DCSection id="dashboards" title="PRESSKIT.PRO — Dashboard redesign" subtitle="3 direcciones para el dashboard del artista">
          {visible.map(a => (
            <DCArtboard key={a.id} id={a.id} label={a.label} width={a.w} height={a.h}>
              <a.Comp />
            </DCArtboard>
          ))}
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Foco" />
        <TweakRadio label="Mostrar" value={tweaks.focused}
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
            { value: 'c', label: 'C' },
          ]}
          onChange={v => setTweak('focused', v)} />
        <TweakSection label="Visibles" />
        <TweakToggle label="A · Editorial Pulse" value={tweaks.showA} onChange={v => setTweak('showA', v)} />
        <TweakToggle label="B · Mission Control" value={tweaks.showB} onChange={v => setTweak('showB', v)} />
        <TweakToggle label="C · Stage Energy"    value={tweaks.showC} onChange={v => setTweak('showC', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
