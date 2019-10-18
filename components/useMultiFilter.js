import React from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'load':
      return action.filterProps.reduce((filters, filterProp) => {
        const filterItems = [
          ...new Set(action.items.map(i => i[filterProp.prop])),
        ].map(i => ({
          name: i,
          selected: false,
        }))
        filters[filterProp.prop] = filterItems
        return filters
      }, {})
    case 'toggle':
      return {
        ...state,
        [action.prop]: state[action.prop].map(i => {
          if (i.name === action.item) {
            return {
              ...i,
              selected: !i.selected,
            }
          }
          return i
        }),
      }
    default:
      throw new Error()
  }
}

const useMultiFilter = (items, filterProps) => {
  const [filterState, dispatch] = React.useReducer(reducer, {})
  React.useLayoutEffect(() => {
    dispatch({ type: 'load', items, filterProps })
  }, [])

  function handleChange(item, prop) {
    dispatch({ type: 'toggle', item, prop })
  }

  let result = [...items]
  filterProps.forEach(filterProp => {
    if (
      filterState[filterProp.prop] &&
      filterState[filterProp.prop].some(p => p.selected)
    ) {
      result = result.filter(i => {
        const item = filterState[filterProp.prop].find(
          p => p.name === i[filterProp.prop],
        )
        return item.selected === null ? true : item.selected
      })
    }
  })

  return [
    result,
    () => (
      <div className="filters">
        {filterProps.map(filterProp => (
          <div key={filterProp.prop}>
            {filterProp.prop}:
            <Filter
              items={filterState[filterProp.prop]}
              onChange={item => handleChange(item, filterProp.prop)}
            />
          </div>
        ))}
        <style jsx>{`
          .filters {
            position: sticky;
            top: 0;
            background: white;
          }
        `}</style>
      </div>
    ),
  ]
}

const Filter = ({ items = [], onChange }) => {
  return items.map(item => (
    <label className="checkbox" key={item.name}>
      <input
        type="checkbox"
        name={item.name}
        value={item.name}
        checked={item.selected}
        onChange={() => onChange(item.name)}
      />
      <span className="overlay">{item.name}</span>

      <style jsx>{`
        .checkbox {
          display: inline-block;
          position: relative;
          margin: 5px;
        }
        .checkbox input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox .overlay {
          display: inline-block;
          padding: 5px;
          background-color: transparent;
          border-radius: 8px;
          border: 1px solid var(--filter-check-background);
          color: --filter-color;
          cursor: pointer;
        }

        .checkbox .icon {
          color: white;
          display: none;
        }

        .checkbox input:checked ~ .overlay {
          color: --filter-check-color;
          background-color: var(--filter-check-background);
          border-radius: 8px;
        }

        .checkbox input:checked ~ .overlay .icon {
          display: block;
        }
      `}</style>
    </label>
  ))
}

export default useMultiFilter
