import React from 'react'
import { firstBy } from 'thenby'
import produce from 'immer'

function reducer(state, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'load':
        action.filterProps.forEach(filterProp => {
          const filterItems = [
            ...new Set(action.items.map(i => i[filterProp.prop])),
          ].map(i => ({
            name: i,
            selected: false,
          }))
          filterItems.sort(firstBy('name'))
          draft[filterProp.prop] = filterItems
        })
        break
      case 'toggle':
        const item = draft[action.prop].find(i => i.name === action.item)
        item.selected = !item.selected
        break
      default:
        return draft
    }
  })
}

const useMultiFilter = (items, filterProps) => {
  const [state, dispatch] = React.useReducer(reducer, {})
  React.useEffect(() => {
    dispatch({ type: 'load', items, filterProps })
  }, [])

  let result = [...items]
  filterProps.forEach(filterProp => {
    if (
      state[filterProp.prop] &&
      state[filterProp.prop].some(p => p.selected)
    ) {
      result = result.filter(i => {
        const item = state[filterProp.prop].find(
          p => p.name === i[filterProp.prop],
        )
        return item.selected === null ? true : item.selected
      })
    }
  })

  return [
    result,
    () =>
      FilterList({
        state: state,
        props: filterProps,
        dispatch: dispatch,
      }),
  ]
}

const FilterList = ({ state, props = [], dispatch }) => {
  function handleChange(item, prop) {
    dispatch({ type: 'toggle', item, prop })
  }
  return (
    <div className="filters">
      {props.map(filterProp => (
        <div key={filterProp.prop}>
          <div>{filterProp.title || filterProp.prop}</div>
          <div className="filter">
            <Filter
              items={state[filterProp.prop]}
              onChange={item => handleChange(item, filterProp.prop)}
            />
          </div>
        </div>
      ))}
      <style jsx>{`
        .filters {
          position: sticky;
          top: 0;
          background: white;
          padding: 5px;
        }

        .filter {
          white-space: nowrap;
          overflow: auto;
        }
      `}</style>
    </div>
  )
}

const Filter = React.memo(({ items = [], onChange }) => {
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
})

export default useMultiFilter
