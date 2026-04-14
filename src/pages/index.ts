export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@200;300;400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #1A1714; color: #F2EDE4; font-family: 'Raleway', sans-serif; }
        .page { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
        .diamond { width: 36px; height: 36px; border: 1.5px solid #B8972E; transform: rotate(45deg); margin: 0 auto 2.5rem; }
        .title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: clamp(2.4rem, 6vw, 4.5rem); letter-spacing: 0.18em; text-transform: uppercase; line-height: 1; }
        .rule { width: 80px; height: 0.5px; background: #B8972E; margin: 1.6rem auto; }
        .tagline { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(1rem, 2.5vw, 1.35rem); color: #D4B96A; letter-spacing: 0.08em; }
        .message { margin-top: 2.8rem; font-size: 0.8rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6B6157; }
      `}</style>
      <div className="page">
        <div className="diamond" />
        <h1 className="title">Musée-Crosdale</h1>
        <div className="rule" />
        <p className="tagline">A new experience is being prepared for you</p>
        <p className="message">Our gallery opens soon</p>
      </div>
    </>
  )
}
