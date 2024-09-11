import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { CircularProgress } from "@nextui-org/react";

const QRScannerComponent = ({ actions }) => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScan, setIsLoadingScan] = useState(false);
  const [apiCalled, setApiCalled] = useState(false);

  const checkInOut = async (qrData) => {
    try {
      setIsLoading(true);
      const trxid = String(qrData);
      const response = await fetch(`/api/trx/${trxid}/${actions}`, {
        method: "PUT",
      });
      const data = await response.json();
      if (data) {
        setIsSuccess(true);
        setApiCalled(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      async (result) => {
        if (!apiCalled) {
          setIsLoadingScan(true);
          const qrData = result.data;
          setScanResult(qrData);
          if (result) {
            await checkInOut(qrData);
            // qrScanner.stop();
            // onClose();
          }
          setIsLoadingScan(false);
        }
      },
      {
        highlightScanRegion: true,
      }
    );

    qrScanner.start();
    return () => {
      // qrScanner.stop();
    };
  }, [apiCalled]);

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
          Status: <span className="text-green-500">Success</span>
        </p>
      )}
    </div>
  );
};

export default QRScannerComponent;
