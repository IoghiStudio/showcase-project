import Link from 'next/link';
import './MenuFooter.scss';

export const MenuFooter = () => {
  return (
    <div className="menu-footer">
      <div className="menu-footer__title">VideoWorkers.com</div>

      <div className="menu-footer__text">&copy; 2023 Dimanolo AG</div>

      <div className="menu-footer__social">
        <Link href={'https://www.facebook.com/videoworkers'} className="menu-footer__icon menu-footer__icon--fb"/>
        <Link href={'https://www.instagram.com/videoworkers.official/'} className="menu-footer__icon menu-footer__icon--ig"/>
        <Link href={'https://www.linkedin.com/company/videoworkers/'} className="menu-footer__icon menu-footer__icon--li"/>
        <Link href={'https://youtube.com/@videoworkers'} className="menu-footer__icon menu-footer__icon--yt"/>
      </div>
    </div>
  )
}
