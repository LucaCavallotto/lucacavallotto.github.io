import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/layout/Reveal.jsx';
import SocialLinks from '../components/layout/SocialLinks.jsx';
import ProjectCard from '../components/project/ProjectCard.jsx';
import ProjectCarousel from '../components/project/ProjectCarousel.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useTypingEffect } from '../hooks/useTypingEffect.js';
import phrases from '../data/phrases.json';
import projects from '../data/projects.json';
import { getFeaturedProjects, getProjectOfTheDay } from '../lib/projects.js';

export default function Home() {
  useDocumentTitle('Home');

  const typedText = useTypingEffect(phrases);

  // Both rotate once a day from the same seed, so they never collide.
  const projectOfTheDay = useMemo(() => getProjectOfTheDay(projects), []);
  const featured = useMemo(() => getFeaturedProjects(projects), []);

  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-hero-inner">
          <h1 className="main-title" id="hero-title">
            Luca Cavallotto
          </h1>

          <p className="subtitle-typing">
            {/* aria-live would re-announce on every keystroke; the phrases are
                decorative, so the accessible summary lives in the meta description. */}
            <span aria-hidden="true">{typedText}</span>
            <span className="visually-hidden">
              MSc student in Artificial Intelligence and Data Analytics
            </span>
          </p>

          <SocialLinks
            style={{ justifyContent: 'center', marginTop: '1.5rem', gap: '1.5rem' }}
          />
        </div>
      </section>

      <Reveal as="section" className="home-section" aria-labelledby="about-title">
        <div className="home-section-inner">
          <p className="eyebrow">About</p>
          <h2 className="home-section-title" id="about-title">
            Personal Description
          </h2>
          <p className="home-section-body">
            <strong>MSc Student</strong> in <strong>Artificial Intelligence</strong> and{' '}
            <strong>Data Analytics</strong> at <strong>Politecnico di Torino</strong>, with a{' '}
            <strong>Bachelor&rsquo;s Degree</strong> in <strong>Computer Science</strong> (101/110)
            from the University of Turin. My roots in the field stem from a technical diploma at
            ITIS G.B. Pininfarina, which allowed me to build a solid technical foundation in the
            sector since high school.
            <br />
            Passionate about <strong>technology</strong>, <strong>video editing</strong>,{' '}
            <strong>motorsport</strong>, and <strong>running</strong>, I bring the same
            determination to my work that I do to the track.
          </p>
          <div className="cta-wrap">
            <Link to="/skills" className="btn-outline-custom">
              View My Skills →
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="home-section" aria-labelledby="featured-title">
        <div className="home-section-inner">
          <div className="grid grid-featured">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="home-section-title" id="featured-title">
                Projects
              </h2>
              <p className="home-section-body" style={{ marginTop: '1rem' }}>
                Here are some of my personal projects. Check out the project of the day, browse
                through some other casual projects below, or click to see all projects.
              </p>
            </div>

            {projectOfTheDay ? (
              <ProjectCard project={projectOfTheDay} isProjectOfTheDay headingLevel={3} />
            ) : null}
          </div>

          <ProjectCarousel
            projects={featured}
            actions={
              <Link to="/projects" className="btn-outline-custom">
                View All Projects →
              </Link>
            }
          />
        </div>
      </Reveal>
    </>
  );
}
