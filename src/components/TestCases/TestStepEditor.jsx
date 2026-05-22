import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';

export function TestStepEditor({ steps, onChange, onAddStep, onRemoveStep }) {
  const [draggedStep, setDraggedStep] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedStep(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedStep !== null && draggedStep !== targetIndex) {
      const newSteps = [...steps];
      const [draggedItem] = newSteps.splice(draggedStep, 1);
      newSteps.splice(targetIndex, 0, draggedItem);
      onChange(newSteps);
      setDraggedStep(null);
    }
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    onChange(newSteps);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="
              bg-slate-700 dark:bg-slate-800 rounded-lg border-2 border-slate-600
              transition-all duration-200
              ${draggedStep === index ? 'opacity-50 border-blue-500' : 'hover:border-slate-500'}
            "
          >
            <div
              className="p-4 flex items-center gap-3 cursor-move"
              onClick={() => setExpandedStep(expandedStep === index ? null : index)}
            >
              <GripVertical size={18} className="text-slate-500 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-300">
                  Step {index + 1}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {step.action || 'No action specified'}
                </div>
              </div>

              <ChevronDown
                size={18}
                className={`flex-shrink-0 text-slate-400 transition-transform ${
                  expandedStep === index ? 'rotate-180' : ''
                }`}
              />

              {steps.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveStep(index);
                  }}
                  className="p-1 hover:bg-red-900 rounded transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              )}
            </div>

            {/* Expanded View */}
            {expandedStep === index && (
              <div className="p-4 border-t border-slate-600 space-y-4 bg-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Action
                  </label>
                  <textarea
                    value={step.action}
                    onChange={(e) => handleStepChange(index, 'action', e.target.value)}
                    placeholder="What action to perform..."
                    className="
                      w-full px-3 py-2 rounded bg-slate-900
                      border border-slate-700 text-slate-100 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition-all duration-200
                    "
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Expected Result
                  </label>
                  <textarea
                    value={step.expected}
                    onChange={(e) => handleStepChange(index, 'expected', e.target.value)}
                    placeholder="What should happen..."
                    className="
                      w-full px-3 py-2 rounded bg-slate-900
                      border border-slate-700 text-slate-100 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition-all duration-200
                    "
                    rows="3"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={onAddStep}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Add Step
      </Button>
    </div>
  );
}
