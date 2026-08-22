import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import Icon from '../components/layout/Icon.jsx';
import ProjectLinks from '../components/project/ProjectLinks.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import projects from '../data/projects.json';
import { formatReleaseDate, projectIcon } from '../lib/projects.js';

/** Label for the back button, based on where the visitor came from. */
function backLabel(path) {
  if (path.startsWith('/skills')) return 'Back to Skills';
  if (path.startsWith('/projects')) return 'Back to Projects';
  if (path === '/') return 'Back to Home';
  return 'Back to Projects';
}

export default function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();
  const project = projects.find((p) => p.id === id);

  useDocumentTitle(project?.title);

  // Deep links to a removed project fall back to the full list, as before.
  if (!project) return <Navigate to="/projects" replace />;

  const backTo = location.state?.from ?? '/projects';

  const meta = [
    ['Tag', project.tag],
    ['Language', project.language],
    ['Release Date', formatReleaseDate(project.release_date)],
  ].filter(([, value]) => Boolean(value));

  return (
    <section
      className="container project-detail-page"
      style={{ paddingTop: '5rem', paddingBottom: '5rem', maxWidth: '800px' }}
    >
      <Link to={backTo} className="glass-btn btn-pill">
        <Icon name="arrow-left" size={18} /> {backLabel(backTo)}
      </Link>

      <header style={{ marginTop: '3rem' }}>
        <div className="project-detail-title-row">
          <div className="project-detail-icon" aria-hidden="true">
            {projectIcon(project)}
          </div>
          <h1 className="project-detail-title">{project.title}</h1>
        </div>

        {meta.length ? (
          <dl className="project-detail-meta">
            {meta.map(([label, value]) => (
              <div key={label}>
                <dt className="u-inline">
                  <strong>{label}:</strong>
                </dt>{' '}
                <dd className="u-inline">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      <div className="project-detail-body">
        <p>{project.description_long || project.description_short}</p>
      </div>

      <ProjectLinks
        links={project.links}
        projectTitle={project.title}
        className="project-detail-links"
      />
    </section>
  );
}
