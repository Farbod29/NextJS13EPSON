import ThermalPrinter from './components/ThermalPrinter';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        EPSON Thermal Printer Demo
      </h1>
      <ThermalPrinter />
    </main>
  );
}
