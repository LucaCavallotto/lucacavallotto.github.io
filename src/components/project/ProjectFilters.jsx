import { useId, useState } from 'react';
import Icon from '../layout/Icon.jsx';
import { SORT_OPTIONS } from '../../lib/constants.js';

/**
 * Search box, three selects and sort order.
 *
 * The panel used Bootstrap's collapse plugin; it is React state now. Every
 * select also got a real <label> — previously they only had aria-label, and
 * the search input had no accessible name at all.
 *
 * @param {{ filters: object, options: object, onChange: (patch: object) => void, onClear: () => void, hasActiveFilters: boolean, resultCount: number }} props
 */
export default function ProjectFilters({
  filters,
  options,
  onChange,
  onClear,
  hasActiveFilters,
  resultCount,
}) {
  const [open, setOpen] = useState(hasActiveFilters);
  const panelId = useId();

  const selects = [
    { key: 'tag', label: 'Label', all: 'All Labels', values: options.tags },
    { key: 'language', label: 'Language', all: 'All Languages', values: options.languages },
    { key: 'year', label: 'Year', all: 'All Years', values: options.years },
  ];

  return (
    <div className="projects-toolbar" style={{ marginBottom: '3rem' }}>
      <div className="toolbar-row">
        <div className="search-input-wrapper">
          <label className="visually-hidden" htmlFor={`${panelId}-search`}>
            Search projects
          </label>
          <input
            id={`${panelId}-search`}
            type="search"
            className="form-control glass-input"
            placeholder="Search projects..."
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
          />
          {filters.query ? (
            <button
              type="button"
              className="search-clear-btn"
              aria-label="Clear search"
              onClick={() => onChange({ query: '' })}
            >
              <Icon name="x" size={18} />
            </button>
          ) : null}
        </div>

        <button
          className="glass-btn"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <Icon name="sliders" size={18} /> Filters
        </button>
      </div>

      <div id={panelId} className={`filter-panel ${open ? 'is-open' : ''}`.trim()}>
        <div>
          <div className="filter-panel-inner">
            <div className="grid grid-filters">
              {selects.map(({ key, label, all, values }) => (
                <div key={key}>
                  <label className="visually-hidden" htmlFor={`${panelId}-${key}`}>
                    Filter by {label}
                  </label>
                  <select
                    id={`${panelId}-${key}`}
                    className="form-select glass-select"
                    value={filters[key]}
                    onChange={(e) => {
                      onChange({ [key]: e.target.value });
                      e.target.blur();
                    }}
                  >
                    <option value="">{all}</option>
                    {values.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="visually-hidden" htmlFor={`${panelId}-sort`}>
                  Sort by
                </label>
                <select
                  id={`${panelId}-sort`}
                  className="form-select glass-select"
                  value={filters.sort}
                  onChange={(e) => {
                    onChange({ sort: e.target.value });
                    e.target.blur();
                  }}
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters ? (
              <div className="u-flex u-justify-center" style={{ paddingTop: '1rem' }}>
                <button type="button" className="glass-btn btn-pill" onClick={onClear}>
                  <Icon name="x-circle" size={16} /> Clear Filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Announces how the list changed after a filter or search edit. */}
      <p className="visually-hidden" role="status">
        {resultCount} {resultCount === 1 ? 'project' : 'projects'} found
      </p>
    </div>
  );
}
