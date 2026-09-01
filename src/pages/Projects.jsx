import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Reveal from '../components/layout/Reveal.jsx';
import ProjectCard from '../components/project/ProjectCard.jsx';
import ProjectFilters from '../components/project/ProjectFilters.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import projects from '../data/projects.json';
import {
  filterAndSortProjects,
  getFilterOptions,
  getProjectOfTheDay,
  groupProjects,
} from '../lib/projects.js';

const DEFAULTS = { query: '', tag: '', language: '', year: '', sort: 'name' };
/** Shorter query-string keys, so a shared URL stays readable. */
const PARAM_KEYS = { query: 'q', tag: 'tag', language: 'lang', year: 'year', sort: 'sort' };

export default function Projects() {
  useDocumentTitle('Projects');

  // Filters live in the URL rather than in component state: they survive
  // opening a project and coming back, and the filtered view is shareable.
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = Object.fromEntries(
    Object.entries(PARAM_KEYS).map(([key, param]) => [key, searchParams.get(param) ?? DEFAULTS[key]])
  );

  const updateFilters = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      const param = PARAM_KEYS[key];
      if (!value || value === DEFAULTS[key]) next.delete(param);
      else next.set(param, value);
    });
    setSearchParams(next, { replace: true });
  };

  const options = useMemo(() => getFilterOptions(projects), []);
  const projectOfTheDay = useMemo(() => getProjectOfTheDay(projects), []);

  const visible = useMemo(() => filterAndSortProjects(projects, filters), [filters]);
  const groups = useMemo(() => groupProjects(visible, filters.sort), [visible, filters.sort]);

  const hasActiveFilters = Object.keys(DEFAULTS).some(
    (key) => filters[key] !== DEFAULTS[key]
  );

  const renderCard = (project, headingLevel) => (
    <Reveal key={project.id}>
      <ProjectCard
        project={project}
        isProjectOfTheDay={project.id === projectOfTheDay?.id}
        headingLevel={headingLevel}
      />
    </Reveal>
  );

  return (
    <section className="container">
      <header className="hero u-text-center">
        <p className="eyebrow">Portfolio</p>
        <h1 className="home-section-title" style={{ marginBottom: '1rem' }}>
          Projects
        </h1>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Explore my personal projects on GitHub.
        </p>
      </header>

      <ProjectFilters
        filters={filters}
        options={options}
        onChange={updateFilters}
        onClear={() => setSearchParams(new URLSearchParams(), { replace: true })}
        hasActiveFilters={hasActiveFilters}
        resultCount={visible.length}
      />

      {visible.length === 0 ? (
        <p className="empty-state">No projects found.</p>
      ) : groups ? (
        groups.map(({ key, projects: groupProjectsList }) => (
          <section className="project-group" key={key} aria-labelledby={`group-${key}`}>
            <h2 className="year-header" id={`group-${key}`}>
              {key}
            </h2>
            <div className="grid grid-projects">
              {groupProjectsList.map((project) => renderCard(project, 3))}
            </div>
          </section>
        ))
      ) : (
        <div className="grid grid-projects">{visible.map((project) => renderCard(project, 2))}</div>
      )}
    </section>
  );
}
