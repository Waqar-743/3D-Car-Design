import PanoramicViewer from "./components/PanoramicViewer";

function App() {
  return (
    <div className="h-screen w-screen bg-charcoal overflow-hidden">
      {/* 3D WebGL Car Configurator - Full Screen */}
      <PanoramicViewer
        initialCar="mclaren-mcl38"
        onCarSelect={(carId: string) => console.log(`Selected: ${carId}`)}
      />
    </div>
  );
}

export default App;
