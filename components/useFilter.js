import React from 'react'

const useFilter = items => {
  const [selected, setSelected] = React.useState(items[0])
  function handleChange(item) {
    const newSelected = [...selected]
    const index = newSelected.indexOf(item)
    if (index != -1) {
      newSelected.splice(index, 1)
    } else {
      newSelected.push(item)
    }

    if (newSelected.length === 0) {
      setSelected(items)
    } else {
      setSelected(newSelected)
    }
  }
  return [
    selected,
    ({ title }) => (
      <div>
        {title}:
        <Filter items={items} selected={selected} onChange={setSelected} />
      </div>
    ),
  ]
}

const Filter = ({ items, selected, onChange }) => {
  return (
    <select value={selected} onChange={e => onChange(e.target.value)}>
      {items.map(i => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  )
}

export default useFilter
