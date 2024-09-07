import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const QRScannerComponent = () => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState(null);

  const getUserList = async (qrData) => {
    try {
      // const response = await fetch(
      //   `/api/users?role=user&scanResult=${encodeURIComponent(qrData)}`
      // );
      // const data = await response.json();
      console.log(qrData, "<<<< dari component");
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      async (result) => {
        const qrData = result.data; // ambil data hasil scan
        setScanResult(qrData);
        await getUserList(qrData); // panggil fungsi dengan data hasil scan
        qrScanner.stop(); // berhenti scan kalo udah berhasil
        removeHighlight(); // hapus highlight kalo udah selesai
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
      {scanResult && (
        <p>
          trx id: <span className="text-green-500">{scanResult}</span>
        </p>
      )}
    </div>
  );
};

export default QRScannerComponent;

// import React, { useEffect, useRef, useState } from "react";
// import QrScanner from "qr-scanner";

// const QRScannerComponent = () => {
//   const videoRef = useRef(null);
//   const [scanResult, setScanResult] = useState(null);
//   const [isSuccess, setIsSuccess] = useState(false); // Untuk mengontrol status berhasil atau gagal

//   const getUserList = async (qrData) => {
//     try {
//       const response = await fetch(
//         `/api/users?role=user&scanResult=${encodeURIComponent(qrData)}`
//       );
//       const data = await response.json();
//       console.log(data, "<<<< dari component");
//       setIsSuccess(true); // Set status berhasil
//     } catch (error) {
//       console.error("Error fetching user list:", error);
//       setIsSuccess(false); // Set status gagal
//     }
//   };

//   useEffect(() => {
//     const qrScanner = new QrScanner(
//       videoRef.current,
//       async (result) => {
//         const qrData = result.data; // ambil data hasil scan
//         setScanResult(qrData);
//         await getUserList(qrData); // panggil fungsi dengan data hasil scan
//         qrScanner.stop(); // berhenti scan kalo udah berhasil
//         removeHighlight(); // hapus highlight kalo udah selesai
//       },
//       {
//         highlightScanRegion: true, // aktifin highlight
//       }
//     );

//     qrScanner.start();
//     return () => {
//       qrScanner.stop(); // berentiin scanner
//     };
//   }, []);

//   const removeHighlight = () => {
//     // hapus elemen highlight kalo ada
//     const highlightElement = document.querySelector(".scan-region-highlight");
//     if (highlightElement) {
//       highlightElement.remove();
//     }
//   };

//   return (
//     <div className="mb-4 flex flex-col gap-4">
//       {!isSuccess && !scanResult && (
//         <video ref={videoRef} style={{ width: "100%" }}></video>
//       )}
//       {isSuccess && <p className="text-green-500">Berhasil!</p>}
//       {!isSuccess && scanResult && (
//         <p>
//           trx id: <span className="text-green-500">{scanResult}</span>
//         </p>
//       )}
//     </div>
//   );
// };

// export default QRScannerComponent;
