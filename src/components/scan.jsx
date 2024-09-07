import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { CircularProgress } from "@nextui-org/react";

const QRScannerComponent = () => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScan, setIsLoadingScan] = useState(false);

  const getUserList = async (qrData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users?role=${qrData}`);
      const data = await response.json();
      if (data) setIsSuccess(true);
      setIsLoading(false);
      console.log(qrData, data, "<<<< dari component");
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      async (result) => {
        setIsLoadingScan(true);
        const qrData = result.data; // ambil data hasil scan
        setScanResult(qrData);
        if (qrData) await getUserList(qrData); // panggil fungsi dengan data hasil scan
        setIsLoadingScan(false);
      },
      {
        highlightScanRegion: true, // aktifin highlight
      }
    );

    qrScanner.start();
    return () => {
      qrScanner.stop(); // berentiin scanner
    };
  }, []);

  const removeHighlight = () => {
    // hapus elemen highlight kalo ada
    const highlightElement = document.querySelector(".scan-region-highlight");
    if (highlightElement) {
      highlightElement.remove();
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-4">
      <video ref={videoRef} style={{ width: "100%" }}></video>
      {isLoadingScan && (
        <p className="flex items-center gap-2">
          <CircularProgress color="default" size="sm" aria-label="Loading..." />{" "}
          Scanning... <span className="text-green-500">Please wait</span>
        </p>
      )}
      {!isLoadingScan && scanResult && (
        <p>
          Result: <span className="text-green-500">{scanResult}</span>
        </p>
      )}
      {isLoading && (
        <p className="flex items-center gap-2">
          <CircularProgress color="default" size="sm" aria-label="Loading..." />
          <span className="text-green-500">
            Fetching user list, please wait
          </span>
        </p>
      )}
      {!isLoading && isSuccess && (
        <p>
          Status: <span className="text-green-500">Berhasil hit API</span>
        </p>
      )}
    </div>
  );
};

export default QRScannerComponent;
