import React from 'react';

const FavoritesGrouping = ({ groupBy, setGroupBy }) => {
  return (
    <div className="favorites-grouping">
      <label>Ομαδοποίηση κατά:</label>
      <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
        <option value="none">Χωρίς ομαδοποίηση</option>
        <option value="category">Κατηγορία</option>
        <option value="creator">Δημιουργός</option>
      </select>
    </div>
  );
};

export default FavoritesGrouping;
