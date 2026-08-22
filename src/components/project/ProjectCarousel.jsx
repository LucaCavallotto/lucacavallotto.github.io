import { useCarousel } from '../../hooks/useCarousel.js';
import { useSwipe } from '../../hooks/useSwipe.js';
import Icon from '../layout/Icon.jsx';
import ProjectCard from './ProjectCard.jsx';

/**
 * Featured projects slider.
 *
 * @param {{ projects: any[], actions?: React.ReactNode }} props
 * `actions` renders on the right of the control bar (the View All Projects CTA).
 */
export default function ProjectCarousel({ projects, actions }) {
  const {
    index,
    pageCount,
    trackStyle,
    goTo,
    next,
    prev,
    manuallyPaused,
    toggleManualPause,
    hoverHandlers,
  } = useCarousel(projects.length);

  const swipeHandlers = useSwipe(next, prev);

  if (!projects.length) return null;

  return (
    <div {...hoverHandlers}>
      <div className="carousel-outer" style={{ marginTop: '2rem' }}>
        <div
          className="custom-slider"
          {...swipeHandlers}
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured projects"
        >
          <div className="custom-slider-track" style={trackStyle}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} headingLevel={3} />
            ))}
          </div>
        </div>

        {pageCount > 1 ? (
          <div className="carousel-indicators">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                className={i === index ? 'active' : undefined}
                aria-label={`Go to slide ${i + 1} of ${pageCount}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="cta-wrap">
        <div className="u-flex u-items-center u-gap-md">
          <button
            className="carousel-ctrl"
            type="button"
            onClick={toggleManualPause}
            aria-label={manuallyPaused ? 'Start automatic slideshow' : 'Pause automatic slideshow'}
          >
            <span className="carousel-ctrl-icon">
              <Icon name={manuallyPaused ? 'play' : 'pause'} />
            </span>
          </button>

          <div className="carousel-cta-arrows">
            <button
              className="carousel-ctrl"
              type="button"
              onClick={() => prev()}
              aria-label="Previous project"
            >
              <span className="carousel-ctrl-icon">
                <Icon name="arrow-left" />
              </span>
            </button>
            <button
              className="carousel-ctrl"
              type="button"
              onClick={() => next()}
              aria-label="Next project"
            >
              <span className="carousel-ctrl-icon">
                <Icon name="arrow-right" />
              </span>
            </button>
          </div>
        </div>

        {actions}
      </div>
    </div>
  );
}
