import { useEffect, useState } from 'react';
import MarqueeModule from 'react-fast-marquee';

const Marquee = MarqueeModule?.default || MarqueeModule;

const MarqueeText = ({
  text,
  className = '',
  width = '100%',
  speed = 20,
  pauseMs = 2000,
}) => {
  const [play, setPlay] = useState(true);

  useEffect(() => {
    setPlay(true);
  }, [text, width, speed, pauseMs]);

  if (!text) return null;

  const handleCycleComplete = () => {
    setPlay(false);
    window.setTimeout(() => setPlay(true), pauseMs);
  };

  return (
    <Marquee
      speed={speed}
      gradient={false}
      pauseOnHover={false}
      pauseOnClick={false}
      autoFill={false}
      play={play}
      onCycleComplete={handleCycleComplete}
      className="overflow-hidden"
      style={{ width, maxWidth: width }}
    >
      <span className={className}>{text}</span>
    </Marquee>
  );
};

export default MarqueeText;