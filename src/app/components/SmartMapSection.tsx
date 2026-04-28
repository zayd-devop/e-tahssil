import React from 'react';
import { SmartMap } from './SmartMap';
import { UrgentActions } from './UrgentActions';

interface SmartMapSectionProps {}

export function SmartMapSection({}: SmartMapSectionProps = {}) {
  const language = 'ar';
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Smart Dispatch Map - 2/3 width */}
      <div className="lg:col-span-2">
        <SmartMap />
      </div>
      
      {/* Urgent Actions - 1/3 width */}
      <div className="lg:col-span-1">
        <UrgentActions />
      </div>
    </div>
  );
}
