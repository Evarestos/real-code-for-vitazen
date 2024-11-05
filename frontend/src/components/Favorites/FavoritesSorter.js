import React from 'react';

const FavoritesSorter = ({ sortBy, setSortBy }) => {
  return (
    <div className="favorites-sorter">
      <label>Ταξινόμηση κατά:</label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="dateAdded">Ημερομηνία προσθήκης</option>
        <option value="title">Τίτλος</option>
      </select>
    </div>
  );
};

export default FavoritesSorter;
