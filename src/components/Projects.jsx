import { useRef, useState } from "react";
import TiltCard from "./TiltCard";
import { useMotion } from "./motion-context";
import { usePortfolioContent } from "../use-portfolio-content";

export default function Projects() {
  const { content } = usePortfolioContent();
  const projects = content.projects;
  const [featured, setFeatured] = useState(2);
  const gallery = useRef(null);
  const { paused } = useMotion();
  const active = Math.min(featured, Math.max(projects.length - 1, 0));
  const project = projects[active];
  const previous = () => setFeatured((active - 1 + projects.length) % projects.length);
  const next = () => setFeatured((active + 1) % projects.length);
  const showPreview = (index) => {
    setFeatured(index);
    gallery.current?.focus({ preventScroll: true });
    gallery.current?.scrollIntoView({ behavior: paused ? "auto" : "smooth", block: "center" });
  };

  if (!projects.length) return null;

  return (
    <section id="projects" className="adri-projects" aria-labelledby="projects-title">
      <h2 id="projects-title" className="adri-display-heading reveal-3d">Selected Work</h2>
      <div className="adri-project-grid">
        {projects.map((item, index) => (
          <div className="reveal-3d" key={item.title} style={{ "--reveal-delay": `${index * 60}ms` }}>
            <TiltCard as="article" className="adri-project-card" intensity={4}>
              <span className="adri-project-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul className="adri-project-tech" aria-label={`${item.title} technologies`}>{item.techStack.map((tech) => <li key={tech}>{tech}</li>)}</ul>
              <div className="adri-project-links">
                {item.link && item.link !== "#" && <a className="adri-text-link" href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title} live demo`}>View project ↗</a>}
                {item.github && item.github !== "#" && <a className="adri-code-link" href={item.github} target="_blank" rel="noopener noreferrer" aria-label={`View ${item.title} source code`}>Code</a>}
                {item.link === "#" && item.github === "#" && <span>Coming soon</span>}
                {!item.link && !item.github && <button type="button" className="adri-text-link" onClick={() => showPreview(index)}>View preview ↓</button>}
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
      <div ref={gallery} tabIndex={-1} className="adri-gallery reveal-3d" role="region" aria-roledescription="carousel" aria-label="Project previews">
          <div className="adri-gallery-image" role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${projects.length}: ${project.title}`}>
          <img src={project.image} alt={`${project.title} preview`} width="960" height="540" loading="lazy" />
        </div>
        <div className="adri-gallery-controls">
          <p aria-live="polite" aria-atomic="true"><span className="gallery-counter">{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>{project.title}</p>
          <div><button type="button" onClick={previous} aria-label="Previous project preview">←</button><button type="button" onClick={next} aria-label="Next project preview">→</button></div>
        </div>
      </div>
    </section>
  );
}
