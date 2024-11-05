import React from 'react';

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-tabs">
      <button
        className={selectedCategory === null ? 'active' : ''}
        onClick={() => onSelectCategory(null)}
      >
        Όλες
      </button>
      {categories.map(category => (
        <button
          key={category._id}
          className={selectedCategory === category._id ? 'active' : ''}
          onClick={() => onSelectCategory(category._id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
