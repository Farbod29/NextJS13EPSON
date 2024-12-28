'use client';

import { useState, useRef } from 'react';

declare global {
  interface Window {
    epson: any;
  }
}

export default function ThermalPrinter() {
  const [printerIPAddress, setPrinterIPAddress] = useState('192.168.2.104');
  const [printerPort, setPrinterPort] = useState('8008');
  const [textToPrint, setTextToPrint] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');

  const ePosDevice = useRef<any>();
  const printer = useRef<any>();

  const STATUS_CONNECTED = 'Connected';

  const connect = () => {
    setConnectionStatus('Connecting ...');

    if (!printerIPAddress) {
      setConnectionStatus('Type the printer IP address');
      return;
    }
    if (!printerPort) {
      setConnectionStatus('Type the printer port');
      return;
    }

    let ePosDev = new window.epson.ePOSDevice();
    ePosDevice.current = ePosDev;

    ePosDev.connect(printerIPAddress, printerPort, (data: string) => {
      if (data === 'OK') {
        ePosDev.createDevice(
          'local_printer',
          ePosDev.DEVICE_TYPE_PRINTER,
          { crypto: true, buffer: false },
          (devobj: any, retcode: string) => {
            if (retcode === 'OK') {
              printer.current = devobj;
              setConnectionStatus(STATUS_CONNECTED);
            } else {
              throw retcode;
            }
          }
        );
      } else {
        throw data;
      }
    });
  };

  const print = (text: string) => {
    let prn = printer.current;
    if (!prn) {
      alert('Not connected to printer');
      return;
    }

    prn.addText(text);
    prn.addFeedLine(5);
    prn.addCut(prn.CUT_FEED);

    prn.send();
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <input
        className="border p-2 rounded"
        placeholder="192.168.2.104"
        value={printerIPAddress}
        onChange={(e) => setPrinterIPAddress(e.currentTarget.value)}
      />
      <input
        className="border p-2 rounded"
        placeholder="Printer Port"
        value={printerPort}
        onChange={(e) => setPrinterPort(e.currentTarget.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        disabled={connectionStatus === STATUS_CONNECTED}
        onClick={() => connect()}
      >
        Connect
      </button>
      <span className="text-sm text-gray-600">{connectionStatus}</span>
      <hr />
      <textarea
        className="border p-2 rounded"
        rows={3}
        placeholder="Text to print"
        value={textToPrint}
        onChange={(e) => setTextToPrint(e.currentTarget.value)}
      />
      <button
        className="bg-green-500 text-white p-2 rounded disabled:bg-gray-300"
        disabled={connectionStatus !== STATUS_CONNECTED}
        onClick={() => print(textToPrint)}
      >
        Print
      </button>
    </div>
  );
}
