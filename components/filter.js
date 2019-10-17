import React from 'react'

const Filter = ({ items, selectedItem, onChange }) => {
  return (
    <select value={selectedItem} onChange={e => onChange(e.target.value)}>
      {items.map(i => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  )
}

export default Filter
