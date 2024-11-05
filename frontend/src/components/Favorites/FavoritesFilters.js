import React from 'react';

const FavoritesFilters = ({ filters, setFilters }) => {
  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  return (
    <div className="favorites-filters">
      <select value={filters.category} onChange={handleCategoryChange}>
        <option value="">Όλες οι κατηγορίες</option>
        <option value="psychotherapy">Ψυχοθεραπεία</option>
        <option value="fitness">Γυμναστική</option>
        <option value="nutrition">Διατροφή</option>
        <option value="general">Γενικά</option>
      </select>
      <input
        type="text"
        placeholder="Αναζήτηση στα αγαπημένα"
        value={filters.searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default FavoritesFilters;
