import React from 'react'

const useMultiFilter = items => {
  const [selected, setSelected] = React.useState(items)
  function handleChange(item) {
    const newSelected = [...selected]
    const index = newSelected.indexOf(item)
    if (index != -1) {
      newSelected.splice(index, 1)
    } else {
      newSelected.push(item)
    }

    // if (newSelected.length === 0) {
    //   setSelected(items)
    // } else {
    setSelected(newSelected)
    // }
  }
  return [
    selected,
    ({ title }) => (
      <div>
        {title}:
        <Filter items={items} selected={selected} onChange={handleChange} />
      </div>
    ),
  ]
}

const Filter = ({ items, selected, onChange }) => {
  return items.map(item => (
    <label>
      <input
        type="checkbox"
        name={item}
        value={item}
        checked={selected.includes(item)}
        onChange={() => onChange(item)}
      />
      {item}
    </label>
  ))
}

export default useMultiFilter
