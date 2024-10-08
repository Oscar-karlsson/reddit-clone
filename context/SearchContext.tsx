'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context state
type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availableTags: string[];
  setAvailableTags: (tags: string[]) => void;
};

// Create the context with a default value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create a provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, availableTags, setAvailableTags }}>
      {children}
    </SearchContext.Provider>
  );
};

// Create a custom hook to access the context in other components
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
