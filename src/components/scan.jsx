import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const QRScannerComponent = () => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        setScanResult(result.data); // Ambil data hasil scan
        qrScanner.stop(); // Berhenti scan setelah berhasil
        removeHighlight(); // Hapus highlight setelah scan selesai
      },
      {
        onDecodeError: (error) => console.error("QR Code Scan Error:", error),
        highlightScanRegion: true, // Highlight aktif saat scanning
      }
    );

    qrScanner.start();

    return () => {
      qrScanner.stop(); // Pastikan scanner berhenti ketika komponen dilepas
    };
  }, []);

  const removeHighlight = () => {
    // Cari dan hapus elemen highlight jika ada
    const highlightElement = document.querySelector(".scan-region-highlight");
    if (highlightElement) {
      highlightElement.remove();
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }}></video>
      {scanResult && <p>Hasil QR Code: {scanResult}</p>}
    </div>
  );
};

export default QRScannerComponent;
