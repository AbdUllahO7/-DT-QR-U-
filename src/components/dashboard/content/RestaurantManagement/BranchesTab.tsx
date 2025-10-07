import React from 'react';
import { BranchCard } from './BranchCard';

interface RestaurantBranchDropdownItem {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  branchTag: string;
}

interface BranchesTabProps {
  branches: RestaurantBranchDropdownItem[];
  loading: boolean;
}

export const BranchesTab: React.FC<BranchesTabProps> = ({ branches, loading }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
        {branches.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No branches found.
          </div>
        )}
      </div>
    </div>
  );
};