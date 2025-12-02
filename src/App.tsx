import PanoramicViewer from "./components/PanoramicViewer";

function App() {
  return (
    <div className="h-screen w-screen bg-charcoal overflow-hidden">
      {/* 3D WebGL Car Configurator - Full Screen */}
      <PanoramicViewer
        initialCar="mclaren-mcl38"
        onCarSelect={(carId) => console.log(`Selected: ${carId}`)}
        onPriceClick={(price) => console.log(`Price: ${price}`)}
      />
    </div>
  );
}

export default App;
