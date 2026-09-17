import React, { useState } from 'react';
import { useGrievances } from '../../context/GrievanceContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const AdminSettingsPage = () => {
  const { resetToFactoryDefaults } = useGrievances();
  const [isSaved, setIsSaved] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const [settings, setSettings] = useState({
    universityName: 'Apex Institute of Technology & Research',
    ombudsmanEmail: 'ombudsman@university.edu',
    autoEscalateCronInterval: 'Every 15 Minutes',
    slaGraceHours: '4',
    enableAnonymousShield: true,
    enableEmailDispatches: true,
    enableSmsAlerts: false,
    retentionDays: '730',
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo grievances and hierarchy configurations to factory defaults?')) {
      resetToFactoryDefaults();
      setResetMessage('Mock data restored to initial demo state.');
      setTimeout(() => setResetMessage(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Institutional Settings & System Configuration
          </h1>
          <p className="text-xs text-outline font-mono mt-0.5">
            SLA engine parameters, security policies, and factory data management
          </p>
        </div>

        <Button variant="primary" size="md" icon="save" onClick={handleSave}>
          Save Settings
        </Button>
      </div>

      {isSaved && (
        <Alert type="success" onClose={() => setIsSaved(false)}>
          Institutional settings and SLA engine parameters saved successfully.
        </Alert>
      )}

      {resetMessage && (
        <Alert type="info" onClose={() => setResetMessage(null)}>
          {resetMessage}
        </Alert>
      )}

      {/* 1. General Institutional Info */}
      <Card className="p-6 bg-surface-container border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-on-surface tracking-tight">
          General Institutional Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Institution / University Name"
            value={settings.universityName}
            onChange={(e) => setSettings({ ...settings, universityName: e.target.value })}
            icon="school"
          />
          <Input
            label="Apex Ombudsman Office Email"
            type="email"
            value={settings.ombudsmanEmail}
            onChange={(e) => setSettings({ ...settings, ombudsmanEmail: e.target.value })}
            icon="mail"
          />
        </div>
      </Card>

      {/* 2. SLA Engine Configuration */}
      <Card className="p-6 bg-surface-container border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-on-surface tracking-tight">
          SLA Auto-Escalation Engine Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="SLA Compliance Check Interval"
            value={settings.autoEscalateCronInterval}
            onChange={(e) => setSettings({ ...settings, autoEscalateCronInterval: e.target.value })}
            icon="timer"
            helperText="Frequency at which background engine evaluates active deadlines."
          />
          <Input
            label="Grace Period (Hours) before Escalation"
            value={settings.slaGraceHours}
            onChange={(e) => setSettings({ ...settings, slaGraceHours: e.target.value })}
            icon="hourglass_empty"
            helperText="Buffer window granted to authorities before auto-escalation trigger."
          />
        </div>

        <div className="pt-2 space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high/60 border border-white/[0.04] cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableAnonymousShield}
              onChange={(e) => setSettings({ ...settings, enableAnonymousShield: e.target.checked })}
              className="w-4 h-4 rounded text-primary"
            />
            <div>
              <span className="text-xs font-semibold text-on-surface">
                Enable Zero-Knowledge Student Anonymity Shield
              </span>
              <p className="text-[11px] text-outline">
                Allows students to lodge tickets without attaching Roll Number / Email.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high/60 border border-white/[0.04] cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableEmailDispatches}
              onChange={(e) => setSettings({ ...settings, enableEmailDispatches: e.target.checked })}
              className="w-4 h-4 rounded text-primary"
            />
            <div>
              <span className="text-xs font-semibold text-on-surface">
                Automated SMTP Email Dispatch to Authorities on Escalation
              </span>
              <p className="text-[11px] text-outline">
                Sends high-priority notifications whenever a ticket moves up a tier.
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* 3. Demo Data Management / Factory Reset */}
      <Card className="p-6 bg-surface-container border-red-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-400 tracking-tight">
              Reset Demo State / Factory Defaults
            </h3>
            <p className="text-xs text-outline mt-0.5">
              Restore initial pre-seeded test grievances, notifications, and tier hierarchies.
            </p>
          </div>
          <Button variant="danger" size="sm" icon="restart_alt" onClick={handleResetData}>
            Reset Mock Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
