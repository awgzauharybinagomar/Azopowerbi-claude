// Entry — mounts the three dashboard variations into the design canvas.

function App() {
  return (
    <DesignCanvas defaultZoom={0.55}>
      <DCSection
        id="powerbi-redesign"
        title="SK Melikai · Dashboard Redesigns"
        subtitle="Three directions for the Power BI report — modernized native, editorial, and operations console."
      >
        <DCArtboard id="v1" label="01 · Modernized Power BI" width={1440} height={900}>
          <V1_Dashboard/>
        </DCArtboard>
        <DCArtboard id="v2" label="02 · Editorial Report" width={1440} height={900}>
          <V2_Dashboard/>
        </DCArtboard>
        <DCArtboard id="v3" label="03 · Operations Console" width={1440} height={900}>
          <V3_Dashboard/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
