import React from 'react';

const ContentFilters = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleCreatorChange = (e) => {
    onFilterChange({ creator: e.target.value });
  };

  const handleTagChange = (e) => {
    const tags = Array.from(e.target.selectedOptions, option => option.value);
    onFilterChange({ tags });
  };

  return (
    <div className="content-filters">
      <select value={filters.category} onChange={handleCategoryChange}>
        <option value="">Όλες οι κατηγορίες</option>
        <option value="psychotherapy">Ψυχοθεραπεία</option>
        <option value="fitness">Γυμναστική</option>
        <option value="nutrition">Διατροφή</option>
        <option value="general">Γενικά</option>
      </select>

      <input
        type="text"
        placeholder="Αναζήτηση δημιουργού"
        value={filters.creator}
        onChange={handleCreatorChange}
      />

      <select multiple value={filters.tags} onChange={handleTagChange}>
        <option value="stress">Άγχος</option>
        <option value="depression">Κατάθλιψη</option>
        <option value="exercise">Άσκηση</option>
        <option value="diet">Διατροφή</option>
        {/* Προσθέστε περισσότερα tags εδώ */}
      </select>
    </div>
  );
};

export default ContentFilters;
