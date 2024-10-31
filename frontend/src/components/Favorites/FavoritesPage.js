import React, { useState, useMemo } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import ContentGrid from '../ContentLibrary/ContentGrid';
import FavoritesFilters from './FavoritesFilters';
import FavoritesSorter from './FavoritesSorter';
import FavoritesGrouping from './FavoritesGrouping';

const FavoritesPage = () => {
  const { data: favorites, isLoading, isError } = useFavorites();
  const [filters, setFilters] = useState({ category: '', searchTerm: '' });
  const [sortBy, setSortBy] = useState('dateAdded');
  const [groupBy, setGroupBy] = useState('none');

  const filteredAndSortedFavorites = useMemo(() => {
    if (!favorites) return [];

    let result = favorites.filter(favorite => 
      (filters.category === '' || favorite.category === filters.category) &&
      (filters.searchTerm === '' || favorite.title.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    );

    result.sort((a, b) => {
      if (sortBy === 'dateAdded') return new Date(b.dateAdded) - new Date(a.dateAdded);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [favorites, filters, sortBy]);

  const groupedFavorites = useMemo(() => {
    if (groupBy === 'none') return { 'All Favorites': filteredAndSortedFavorites };

    return filteredAndSortedFavorites.reduce((acc, favorite) => {
      const key = groupBy === 'category' ? favorite.category : favorite[groupBy];
      if (!acc[key]) acc[key] = [];
      acc[key].push(favorite);
      return acc;
    }, {});
  }, [filteredAndSortedFavorites, groupBy]);

  if (isLoading) return <div>Φόρτωση αγαπημένων...</div>;
  if (isError) return <div>Σφάλμα κατά τη φόρτωση των αγαπημένων.</div>;

  return (
    <div className="favorites-page">
      <h1>Τα Αγαπημένα μου</h1>
      <FavoritesFilters filters={filters} setFilters={setFilters} />
      <FavoritesSorter sortBy={sortBy} setSortBy={setSortBy} />
      <FavoritesGrouping groupBy={groupBy} setGroupBy={setGroupBy} />
      
      {Object.entries(groupedFavorites).map(([group, groupFavorites]) => (
        <div key={group}>
          <h2>{group}</h2>
          <ContentGrid content={groupFavorites} />
        </div>
      ))}
    </div>
  );
};

export default FavoritesPage;
