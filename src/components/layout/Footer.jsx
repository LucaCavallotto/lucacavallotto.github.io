import SocialLinks from './SocialLinks.jsx';

export default function Footer() {
  return (
    <footer>
      <div className="footer-wrap">
        <SocialLinks showLabels />
        <p>© {new Date().getFullYear()} Luca Cavallotto · All rights reserved.</p>
      </div>
    </footer>
  );
}
