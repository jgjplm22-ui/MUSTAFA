import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw, Volume2, VolumeX, Zap, AlertCircle } from 'lucide-react';

interface Props {
  onScanSuccess: (decodedText: string) => void;
  isAr?: boolean;
}

export const CameraBarcodeScanner: React.FC<Props> = ({ onScanSuccess, isAr = true }) => {
  const scannerContainerId = 'html5qr-code-scanner-element';
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const lastScannedTimeRef = useRef<number>(0);

  // Play crisp supermarket scanner beep sound via Web Audio API
  const playCashierBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1750, audioCtx.currentTime); // Supermarket beep pitch
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);

      // Trigger haptic vibration if available
      if (navigator.vibrate) {
        navigator.vibrate(80);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const startScanner = async (cameraId?: string) => {
    setCameraError(null);
    try {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch {
          // Ignore stop errors
        }
      }

      const scanner = new Html5Qrcode(scannerContainerId, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.ITF,
        ],
        verbose: false,
      });
      html5QrCodeRef.current = scanner;

      const cameraConfig = cameraId
        ? { deviceId: { exact: cameraId } }
        : { facingMode: 'environment' };

      await scanner.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            return {
              width: Math.floor(minEdge * 0.85),
              height: Math.floor(minEdge * 0.45),
            };
          },
          aspectRatio: 1.5,
        },
        (decodedText) => {
          // Throttle scans to avoid duplicate rapid triggers within 1.2s for same code
          const now = Date.now();
          if (now - lastScannedTimeRef.current > 1200) {
            lastScannedTimeRef.current = now;
            playCashierBeep();
            onScanSuccess(decodedText);
          }
        },
        () => {
          // Frame without barcode detected, ignore
        }
      );

      setIsScanning(true);
    } catch (err: unknown) {
      console.warn('Camera barcode scanner error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('Permission') || errMsg.includes('NotAllowedError')) {
        setCameraError(
          isAr
            ? 'يرجى السماح بصلاحية الكاميرا في المتصفح لمسح الباركود'
            : 'Please grant camera permissions in your browser to scan barcodes'
        );
      } else {
        setCameraError(
          isAr
            ? 'تعذر تشغيل الكاميرا. يمكنك استخدام البحث السريع برقم الباركود أدناه.'
            : 'Camera not available. You can type or scan using a USB barcode gun.'
        );
      }
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch {
        // Ignore stop error
      }
      setIsScanning(false);
    }
  };

  // Get list of cameras on mount and auto-start
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices.map((d) => ({ id: d.id, label: d.label || `Camera ${d.id}` })));
          // Prefer back camera if available
          const backCam = devices.find((d) =>
            d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment')
          );
          const initialId = backCam ? backCam.id : devices[0].id;
          setSelectedCameraId(initialId);
          startScanner(initialId);
        } else {
          startScanner();
        }
      })
      .catch(() => {
        // Fallback directly to start with facingMode
        startScanner();
      });

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex flex-col rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-lg">
      {/* Scanner Control Toolbar */}
      <div className="px-3 py-2 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white">
            {isAr ? 'كاميرا المسح الضوئي المباشرة' : 'Live Camera Scanner'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg transition-colors ${
              soundEnabled ? 'text-amber-400 bg-amber-950/50' : 'text-stone-400 hover:text-white'
            }`}
            title={soundEnabled ? (isAr ? 'صوت الكاشير مفعل' : 'Sound ON') : (isAr ? 'الصوت مغلق' : 'Sound OFF')}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Camera switcher if multiple */}
          {cameras.length > 1 && (
            <button
              type="button"
              onClick={() => {
                const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
                const nextIndex = (currentIndex + 1) % cameras.length;
                const nextId = cameras[nextIndex].id;
                setSelectedCameraId(nextId);
                startScanner(nextId);
              }}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg flex items-center gap-1"
              title={isAr ? 'تبديل الكاميرا' : 'Switch Camera'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">{isAr ? 'تبديل' : 'Flip'}</span>
            </button>
          )}

          {/* Start/Stop Camera Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isScanning) {
                stopScanner();
              } else {
                startScanner(selectedCameraId);
              }
            }}
            className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
          >
            {isScanning ? (
              <>
                <CameraOff className="w-3.5 h-3.5 text-rose-400" />
                <span>{isAr ? 'إيقاف' : 'Stop'}</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'تشغيل' : 'Start'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Viewfinder Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
        {/* html5-qrcode mounts here */}
        <div id={scannerContainerId} className="w-full h-full object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />

        {/* Viewfinder Target Overlays when scanning */}
        {isScanning && !cameraError && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
            {/* Target Box with Corner Marks */}
            <div className="relative w-64 h-32 sm:w-72 sm:h-36 border-2 border-amber-400/80 rounded-2xl shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center justify-center overflow-hidden">
              {/* Animated Red Laser Scanning Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-[bounce_2s_infinite]" />

              {/* Center Guidance Text */}
              <span className="text-[11px] font-bold text-amber-200/90 bg-black/60 px-2 py-0.5 rounded-full shadow-sm">
                {isAr ? 'وجّه خطوط الباركود داخل هذا الإطار' : 'Align barcode in frame'}
              </span>
            </div>
          </div>
        )}

        {/* Camera Permission / Error Fallback */}
        {cameraError && (
          <div className="absolute inset-0 bg-stone-900/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-stone-200 font-bold max-w-xs leading-relaxed">
              {cameraError}
            </p>
            <button
              type="button"
              onClick={() => startScanner(selectedCameraId)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              {isAr ? 'إعادة محاولة فتح الكاميرا' : 'Retry Camera'}
            </button>
          </div>
        )}
      </div>

      {/* Helpful tip footer */}
      <div className="px-3 py-1.5 bg-stone-900/90 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{isAr ? 'مسح فوري للأكواد: EAN-13, Code 128, QR' : 'Fast Barcode & QR Detection'}</span>
        </span>
        <span className="text-emerald-400 font-bold">
          {isAr ? 'صوت الكاشير مفعّل 🔔' : 'Cashier Beep Ready'}
        </span>
      </div>
    </div>
  );
};
