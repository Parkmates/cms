import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRCodeScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        scannerRef.current.id,
        { fps: 10, qrbox: 250 },
        false
      );

      html5QrcodeScanner.render(onScanSuccess, (errorMessage) => {
        console.error(`Error scanning QR code: ${errorMessage}`);
      });

      // Clean up function to stop scanning when component unmounts
      return () => {
        html5QrcodeScanner.clear().catch((error) => {
          console.error(`Error stopping scanner: ${error}`);
        });
      };
    }
  }, [onScanSuccess]);

  return (
    <div
      id="scanner"
      ref={scannerRef}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Scanner will be rendered inside this div */}
    </div>
  );
};

export default QRCodeScanner;
