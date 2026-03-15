import { useTranslation } from 'react-i18next';
import swapImg from '../assets/Swap-infographic.png';
export default function Swap() {
  const { t } = useTranslation();
  return (
    <div style={{ background: '#080808', minHeight: '100vh', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#e8e0d0' }}>
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4af37', marginBottom: '1rem' }}>Bonding Curve AMM</div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 400, color: '#f0e8d0', letterSpacing: '0.1em', margin: 0 }}>{t('swap.title')}</h1>
      </div>
      <div style={{ maxWidth: '820px', margin: '4rem auto', padding: '0 2rem 6rem' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.9, color: '#9a9288', fontStyle: 'italic', textAlign: 'center', marginBottom: '3rem' }}>{t('swap.body')}</p>
        <img src={swapImg} alt='Swapp AMM' style={{ width: '100%', display: 'block', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} />
      </div>
    </div>
  );
}
