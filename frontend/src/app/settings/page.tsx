"use client";

import { useState, useEffect } from "react";
import { Save, ShieldAlert, KeyRound, Radio, Sliders, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [realmUrl, setRealmUrl] = useState("http://localhost:8080/realms/sentinelos");
  const [clientId, setClientId] = useState("sentinel-frontend");
  const [clientSecret, setClientSecret] = useState("sentinel-frontend-secret-key-mock");
  const [envName, setEnvName] = useState("Production");
  const [gatewayUrl, setGatewayUrl] = useState("http://localhost:8000/api/v1");
  const [modelName, setModelName] = useState("gemini-2.5-pro");
  
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load from localStorage if exists
  useEffect(() => {
    const savedRealm = localStorage.getItem("settings_realmUrl");
    const savedClientId = localStorage.getItem("settings_clientId");
    const savedSecret = localStorage.getItem("settings_clientSecret");
    const savedEnv = localStorage.getItem("settings_envName");
    const savedGateway = localStorage.getItem("settings_gatewayUrl");
    const savedModel = localStorage.getItem("settings_modelName");

    if (savedRealm) setRealmUrl(savedRealm);
    if (savedClientId) setClientId(savedClientId);
    if (savedSecret) setClientSecret(savedSecret);
    if (savedEnv) setEnvName(savedEnv);
    if (savedGateway) setGatewayUrl(savedGateway);
    if (savedModel) setModelName(savedModel);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      localStorage.setItem("settings_realmUrl", realmUrl);
      localStorage.setItem("settings_clientId", clientId);
      localStorage.setItem("settings_clientSecret", clientSecret);
      localStorage.setItem("settings_envName", envName);
      localStorage.setItem("settings_gatewayUrl", gatewayUrl);
      localStorage.setItem("settings_modelName", modelName);

      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/80 px-4 py-3 text-sm text-emerald-200 shadow-glow backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Configure system variables, SSO parameters, and AI model weights.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SSO Connection Settings */}
        <div className="glass-panel p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <KeyRound size={20} />
              <h3 className="text-base font-bold text-white">OIDC Identity Provider</h3>
            </div>
            
            <div className="space-y-2 flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Realm URL</label>
              <input
                type="url"
                value={realmUrl}
                onChange={(e) => setRealmUrl(e.target.value)}
                className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Client ID</label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Client Secret</label>
              <input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Environment Settings */}
        <div className="glass-panel p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-pink-400">
              <Radio size={20} />
              <h3 className="text-base font-bold text-white">System Telemetry</h3>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-xs text-gray-400 font-medium">Environment</label>
              <select
                value={envName}
                onChange={(e) => setEnvName(e.target.value)}
                className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white outline-none focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
              >
                <option value="Production" className="bg-background">Production</option>
                <option value="Staging" className="bg-background">Staging</option>
                <option value="Development" className="bg-background">Development</option>
              </select>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-xs text-gray-400 font-medium">API Gateway URL</label>
              <input
                type="url"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
                className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white outline-none focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* AI Model Parameters */}
        <div className="glass-panel p-6 space-y-6 flex flex-col justify-between md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Sliders size={20} />
              <h3 className="text-base font-bold text-white">AI Agent Parameters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="text-xs text-gray-400 font-medium">Active Gemini Model</label>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  <option value="gemini-2.5-pro" className="bg-background">Gemini 2.5 Pro</option>
                  <option value="gemini-2.5-flash" className="bg-background">Gemini 2.5 Flash</option>
                  <option value="gemini-2.5-flash-lite" className="bg-background">Gemini 2.5 Flash Lite</option>
                </select>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-xs text-gray-400 font-medium">Security Clearance Level</label>
                <input
                  type="text"
                  readOnly
                  value="Level 5 (System Administrator)"
                  className="h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-amber-400/10 bg-amber-500/5 p-4 text-xs text-amber-300 mt-4">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <p>
              Modifying active SSO configurations or changing system environment mappings requires administrative privilege escalation and will trigger an audit trail record.
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 px-6 text-sm font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={16} />
              )}
              Save Configuration Profile
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
