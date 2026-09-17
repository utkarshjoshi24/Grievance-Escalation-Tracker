import React, { useState } from 'react';
import { useGrievances } from '../../context/GrievanceContext';
import { CATEGORIES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import clsx from 'clsx';

export const HierarchyConfigPage = () => {
  const { hierarchy, updateCategoryHierarchy } = useGrievances();

  const [activeCategory, setActiveCategory] = useState('Academic');
  const [currentLevels, setCurrentLevels] = useState(() => hierarchy['Academic'] || []);
  const [isSaved, setIsSaved] = useState(false);

  const handleCategoryTabChange = (cat) => {
    setActiveCategory(cat);
    setCurrentLevels(hierarchy[cat] || []);
    setIsSaved(false);
  };

  const handleLevelFieldChange = (index, field, value) => {
    setCurrentLevels((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'slaHours' ? Number(value) : value,
      };
      return updated;
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    updateCategoryHierarchy(activeCategory, currentLevels);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 font-semibold">
              Administrative Matrix Config
            </span>
            <span className="text-xs font-mono text-outline">Engine SLA Rulebook</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
            Category Escalation Hierarchy Configuration
          </h1>
          <p className="text-xs text-outline font-mono">
            Define multi-tier resolution paths, designate officers, and configure strict SLA breach limits per category.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon="save"
          onClick={handleSave}
        >
          Save Hierarchy Rules
        </Button>
      </div>

      {isSaved && (
        <Alert type="success" onClose={() => setIsSaved(false)}>
          Escalation hierarchy and SLA thresholds for <strong>{activeCategory}</strong> updated successfully across the system.
        </Alert>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/[0.06]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryTabChange(cat)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all',
              activeCategory === cat
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-inner-keylight shadow-glow-electric/20'
                : 'bg-surface-container text-outline hover:text-on-surface hover:bg-surface-container-high'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hierarchy Flow Visualizer Banner */}
      <Card className="p-6 bg-surface-container border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-on-surface">
            Active Escalation Chain: <span className="text-primary">{activeCategory}</span>
          </h3>
          <span className="text-xs font-mono text-outline">
            {currentLevels.length} Administrative Tiers Configured
          </span>
        </div>

        {/* Chain Steps visual connector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentLevels.map((lvl, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-container-high/70 border border-white/[0.06] relative group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-surface-container-highest flex items-center justify-center font-mono text-xs font-bold text-primary">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                  {lvl.slaHours}h SLA
                </span>
              </div>
              <h4 className="text-xs font-semibold text-on-surface line-clamp-1">{lvl.roleName}</h4>
              <p className="text-[11px] text-outline font-mono truncate">{lvl.designatedPerson}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Tier Editors */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-on-surface tracking-tight">
          Configure Tier Authorities & SLA Thresholds
        </h3>

        <div className="space-y-4">
          {currentLevels.map((lvl, index) => (
            <Card
              key={index}
              className="p-6 bg-surface-container-low border-white/[0.08] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono font-bold text-sm">
                    T{lvl.level || index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">
                      Tier {lvl.level || index + 1}: {lvl.roleName}
                    </h4>
                    <span className="text-[11px] text-outline font-mono">
                      {index === 0
                        ? 'Initial intake & first-response resolver'
                        : index === currentLevels.length - 1
                        ? 'Apex tribunal authority (Final SLA boundary)'
                        : 'Intermediate departmental escalation'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-outline">SLA Window:</span>
                  <select
                    value={lvl.slaHours}
                    onChange={(e) => handleLevelFieldChange(index, 'slaHours', e.target.value)}
                    className="bg-surface-container-high border border-outline-variant/60 text-xs font-mono text-primary rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours</option>
                    <option value={72}>72 Hours</option>
                    <option value={96}>96 Hours</option>
                    <option value={120}>120 Hours</option>
                  </select>
                </div>
              </div>

              {/* Field Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Official Role / Position Title"
                  value={lvl.roleName}
                  onChange={(e) => handleLevelFieldChange(index, 'roleName', e.target.value)}
                  icon="badge"
                  required
                />
                <Input
                  label="Designated Person"
                  value={lvl.designatedPerson}
                  onChange={(e) => handleLevelFieldChange(index, 'designatedPerson', e.target.value)}
                  icon="person"
                  required
                />
                <Input
                  label="Official Institutional Email"
                  type="email"
                  value={lvl.email}
                  onChange={(e) => handleLevelFieldChange(index, 'email', e.target.value)}
                  icon="mail"
                  required
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="p-6 rounded-2xl bg-surface-container border border-white/[0.08] flex items-center justify-between">
        <span className="text-xs text-outline font-mono">
          All changes apply immediately to new grievance dispatches.
        </span>
        <Button
          variant="primary"
          size="lg"
          icon="check_circle"
          onClick={handleSave}
        >
          Save Configuration for {activeCategory}
        </Button>
      </div>
    </div>
  );
};

export default HierarchyConfigPage;
