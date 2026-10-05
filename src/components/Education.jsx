import { useRef, useState } from "react";
import { FaBookOpen, FaGraduationCap } from "react-icons/fa";
import TiltCard from "./TiltCard";
import "./education.css";
import { usePortfolioContent } from "../use-portfolio-content";

export default function Education() {
  const { content } = usePortfolioContent();
  const education = content.education;
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef([]);
  const defaultLabels = { btech: "B.Tech", bcom: "B.Com", "higher-secondary": "12th", secondary: "10th" };
  const labels = education.map(item => item.label || defaultLabels[item.id] || item.degree);
  const active = Math.min(selected, Math.max(education.length - 1, 0));
  const item = education[active];

  const navigateTabs = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % education.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + education.length) % education.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = education.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  if (!education.length) return null;

  return (
    <section id="education" className="education-section" aria-labelledby="education-title">
      <div className="education-shell">
        <div className="education-heading reveal-3d">
          <div className="education-heading-copy">
            <p className="adri-eyebrow">ACADEMIC BACKGROUND</p>
            <h2 id="education-title">My Education</h2>
          </div>
          <span className="education-chapter" aria-hidden="true">LEARN. BUILD. GROW.</span>
        </div>

        <div className="education-display reveal-3d">
          <div className="education-tabs" role="tablist" aria-label="Choose a qualification">
            {education.map((qualification, index) => (
              <button
                key={qualification.id}
                ref={(element) => { tabRefs.current[index] = element; }}
                type="button"
                role="tab"
                id={`education-tab-${qualification.id}`}
                aria-controls={`education-panel-${qualification.id}`}
                aria-selected={active === index}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => navigateTabs(event, index)}
              >
                <span>{labels[index]}</span>
                <span className="education-tab-year">{qualification.end.value.slice(0, 4)}</span>
              </button>
            ))}
          </div>
          <div className="education-panel-stack">
            <TiltCard className="education-card" intensity={4}>
              {education.map((qualification, index) => (
                <div key={qualification.id} role="tabpanel" id={`education-panel-${qualification.id}`} aria-labelledby={`education-tab-${qualification.id}`} hidden={active !== index} tabIndex={0} className="education-panel depth-layer">
                  <div className="education-card-copy">
                    <p className="education-dates"><time dateTime={qualification.start.value}>{qualification.start.label}</time><span aria-hidden="true"> — </span><span className="sr-only"> to </span><time dateTime={qualification.end.value}>{qualification.end.label}</time></p>
                    <h3>{qualification.degree}</h3>
                    {qualification.field && <p className="education-field">{qualification.field}</p>}
                    <p className="education-institution">{qualification.institution}</p>
                    <div className="education-card-footer">
                      <span className="education-level">{qualification.level}</span>
                      {qualification.cgpa && <p className="education-grade"><span>CGPA</span><strong>{qualification.cgpa}<small> / 10</small></strong></p>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="education-seal depth-layer" aria-hidden="true">
                <div className="education-seal-art"><span /><span />{item.cgpa ? <FaGraduationCap /> : <FaBookOpen />}</div>
                <span className="education-seal-label">{labels[active]}</span>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
