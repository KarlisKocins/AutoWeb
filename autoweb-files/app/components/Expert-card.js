export default function ExpertCard({ icon, title, description }) {
  return (
    <div className="expert-card">
      <div className="expert-icon-container">
        <div className="expert-icon">{icon}</div>
      </div>
      <h3 className="expert-title">{title}</h3>
      <div className="expert-divider"></div>
      <p className="expert-description">{description}</p>
    </div>
  );
}
