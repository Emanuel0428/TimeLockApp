import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, TestTube } from "lucide-react";
import AppMonitor from "../plugins/AppMonitor";

const PluginTest = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testCheckUsagePermission = async () => {
    try {
      addLog("Verificando permiso de Usage Stats...");
      const result = await AppMonitor.checkUsageStatsPermission();
      addLog(`✅ Resultado: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testRequestUsagePermission = async () => {
    try {
      addLog("Solicitando permiso de Usage Stats...");
      const result = await AppMonitor.requestUsageStatsPermission();
      addLog(`✅ Resultado: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testCheckOverlayPermission = async () => {
    try {
      addLog("Verificando permiso de Overlay...");
      const result = await AppMonitor.checkOverlayPermission();
      addLog(`✅ Resultado: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testRequestOverlayPermission = async () => {
    try {
      addLog("Solicitando permiso de Overlay...");
      const result = await AppMonitor.requestOverlayPermission();
      addLog(`✅ Resultado: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testGetInstalledApps = async () => {
    try {
      addLog("Obteniendo apps instaladas...");
      const result = await AppMonitor.getInstalledApps();
      addLog(`✅ Encontradas ${result.apps.length} apps`);
      addLog(`Primera app: ${JSON.stringify(result.apps[0])}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#0F172A] z-40 border-b border-white/10 safe-header">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#F8FAFC]" />
          </button>
          <h1 className="text-lg font-semibold text-[#F8FAFC]">
            Test Plugin
          </h1>
          <TestTube className="w-6 h-6 text-[#4B6FA7]" />
        </div>
      </header>

      <main className="px-4 min-h-screen bg-[#0F172A] safe-content">
        <div className="max-w-md mx-auto w-full space-y-4">
          <div className="bg-[#1E293B] rounded-2xl p-4 space-y-2">
            <h2 className="text-[#F8FAFC] font-semibold mb-3">Tests de Permisos</h2>
            
            <button
              onClick={testCheckUsagePermission}
              className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-left"
            >
              1. Check Usage Permission
            </button>
            
            <button
              onClick={testRequestUsagePermission}
              className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-left"
            >
              2. Request Usage Permission
            </button>
            
            <button
              onClick={testCheckOverlayPermission}
              className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-left"
            >
              3. Check Overlay Permission
            </button>
            
            <button
              onClick={testRequestOverlayPermission}
              className="w-full px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-left"
            >
              4. Request Overlay Permission
            </button>
            
            <button
              onClick={testGetInstalledApps}
              className="w-full px-4 py-3 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg transition-colors text-left"
            >
              5. Get Installed Apps
            </button>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-4">
            <h2 className="text-[#F8FAFC] font-semibold mb-3">Logs</h2>
            <div className="bg-[#0F172A] rounded-lg p-3 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-[#64748B] text-sm">Sin logs todavía. Presiona un botón arriba.</p>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-[#94A3B8] text-xs font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setLogs([])}
              className="mt-3 w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
            >
              Limpiar Logs
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default PluginTest;
