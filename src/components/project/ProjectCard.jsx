import { Link, useLocation } from 'react-router-dom';
import { projectIcon } from '../../lib/projects.js';
import ProjectLinks from './ProjectLinks.jsx';

/**
 * A single project card.
 *
 * The original card was a <div> with a click handler, so keyboard and screen
 * reader users could not open it at all. Here the title holds a real <Link>
 * that is stretched over the whole card, which keeps the big click target
 * while giving the card one proper, announceable destination. The external
 * links sit above the overlay so they stay independently clickable.
 *
 * @param {{ project: any, isProjectOfTheDay?: boolean, headingLevel?: 2|3|4 }} props
 */
export default function ProjectCard({ project, isProjectOfTheDay = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const location = useLocation();

  return (
    <article className={`carousel-project-card ${isProjectOfTheDay ? 'potd-card' : ''}`.trim()}>
      {project.tag ? <span className="carousel-card-tag">{project.tag}</span> : null}

      <div className="carousel-card-header">
        <div className="card-icon-wrap">
          <div className="card-icon" aria-hidden="true">
            {projectIcon(project)}
          </div>
        </div>
        <Heading className="carousel-card-title">
          <Link
            to={`/project/${project.id}`}
            // Keep the query string so filters survive the round trip.
            state={{ from: `${location.pathname}${location.search}` }}
            className="card-link-overlay"
          >
            {isProjectOfTheDay ? <span className="visually-hidden">Project of the day: </span> : null}
            {project.title}
          </Link>
        </Heading>
      </div>

      <p className="carousel-card-desc">{project.description_short}</p>

      <ProjectLinks
        links={project.links}
        projectTitle={project.title}
        className="carousel-card-links"
      />
    </article>
  );
}
