import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SearchFiltersProps {
  breeds: string[];
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  ageRange: { min?: number; max?: number };
  onAgeRangeChange: (range: { min?: number; max?: number }) => void;
}

export default function SearchFilters({
  breeds,
  selectedBreeds,
  onBreedsChange,
  sortOrder,
  onSortOrderChange,
  ageRange,
  onAgeRangeChange,
}: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Breed
        </label>
        <select
          multiple
          value={selectedBreeds}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, (option) => option.value);
            onBreedsChange(values);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sort Order
        </label>
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
            className="appearance-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min="0"
            placeholder="Min age"
            value={ageRange.min || ''}
            onChange={(e) =>
              onAgeRangeChange({ ...ageRange, min: parseInt(e.target.value) || undefined })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="number"
            min="0"
            placeholder="Max age"
            value={ageRange.max || ''}
            onChange={(e) =>
              onAgeRangeChange({ ...ageRange, max: parseInt(e.target.value) || undefined })
            }
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}