import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Terminal } from 'lucide-react';

function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [logs, setLogs] = useState([
    '> SYSTEM INITIALIZED...',
    '> MATRIX COUNTDOWN v2.0',
    '> READY FOR INPUT',
  ]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            addLog('> COUNTDOWN COMPLETED!');
            addLog('> ALERT: TIME EXPIRED');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleStart = () => {
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setIsRunning(true);
      addLog(`> COUNTDOWN STARTED: ${minutes}m ${seconds}s`);
      addLog('> TIMER ACTIVE...');
    } else {
      addLog('> ERROR: INVALID TIME INPUT');
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog('> COUNTDOWN STOPPED');
    addLog('> SYSTEM ON STANDBY');
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setInputMinutes('');
    setInputSeconds('');
    addLog('> SYSTEM RESET');
    addLog('> READY FOR NEW INPUT');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = time > 0 ? (time / (parseInt(inputMinutes || 0) * 60 + parseInt(inputSeconds || 0))) * 100 : 0;

  return (
    <div className="min-h-screen bg-matrix-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Terminal className="w-8 h-8 text-matrix-green matrix-flicker" />
            <h1 className="text-4xl md:text-5xl font-bold matrix-glow">MATRIX_COUNTDOWN.exe</h1>
          </div>
          <p className="text-matrix-green/70 text-sm">{'>'} TERMINAL INTERFACE v2.0</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-matrix-green matrix-border p-6 rounded-lg bg-matrix-dark/50">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-matrix-green/30">
              <div className="w-3 h-3 bg-matrix-green rounded-full matrix-flicker"></div>
              <span className="text-sm">TIMER_CONTROL.SYS</span>
            </div>

            <div className="mb-8">
              <div className="text-center mb-4">
                <div className="text-7xl md:text-8xl font-bold matrix-glow tracking-wider">
                  {formatTime(time)}
                </div>
                <div className="mt-2 text-xs text-matrix-green/60">MM:SS</div>
              </div>
              
              {time > 0 && (
                <div className="w-full h-2 bg-matrix-dark border border-matrix-green/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-matrix-green transition-all duration-1000 matrix-glow"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-2 text-matrix-green/70">
                  {'>'} INPUT_TIME:
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="MIN"
                      value={inputMinutes}
                      onChange={(e) => setInputMinutes(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-matrix-dark border-2 border-matrix-green/50 text-matrix-green px-4 py-3 rounded focus:outline-none focus:border-matrix-green focus:matrix-border disabled:opacity-50 disabled:cursor-not-allowed font-mono text-lg"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="SEC"
                      value={inputSeconds}
                      onChange={(e) => setInputSeconds(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-matrix-dark border-2 border-matrix-green/50 text-matrix-green px-4 py-3 rounded focus:outline-none focus:border-matrix-green focus:matrix-border disabled:opacity-50 disabled:cursor-not-allowed font-mono text-lg"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleStart}
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 bg-matrix-dark border-2 border-matrix-green text-matrix-green px-4 py-3 rounded hover:bg-matrix-green hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:matrix-border font-bold"
                >
                  <Play className="w-5 h-5" />
                  START
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isRunning}
                  className="flex items-center justify-center gap-2 bg-matrix-dark border-2 border-matrix-green text-matrix-green px-4 py-3 rounded hover:bg-matrix-green hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:matrix-border font-bold"
                >
                  <Square className="w-5 h-5" />
                  STOP
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-matrix-dark border-2 border-matrix-green text-matrix-green px-4 py-3 rounded hover:bg-matrix-green hover:text-black transition-all hover:matrix-border font-bold"
                >
                  <RotateCcw className="w-5 h-5" />
                  RESET
                </button>
              </div>
            </div>
          </div>

          <div className="border-2 border-matrix-green matrix-border p-6 rounded-lg bg-matrix-dark/50">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-matrix-green/30">
              <div className="w-3 h-3 bg-matrix-green rounded-full matrix-flicker"></div>
              <span className="text-sm">SYSTEM_LOG.TXT</span>
            </div>

            <div className="h-96 overflow-y-auto space-y-1 text-sm scrollbar-thin">
              {logs.map((log, index) => (
                <div key={index} className="text-matrix-green/90 hover:text-matrix-green hover:bg-matrix-green/10 px-2 py-1 rounded transition-colors">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            <div className="mt-4 pt-4 border-t border-matrix-green/30">
              <div className="flex items-center gap-2 text-xs text-matrix-green/50">
                <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse"></div>
                <span>SYSTEM ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-matrix-green/40">
          <p>{'>'} POWERED BY MATRIX_OS | ALL SYSTEMS OPERATIONAL</p>
        </div>
      </div>
    </div>
  );
}

export default App;