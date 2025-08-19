'use client';

interface PingEffectProps {
  size?: number;
  duration?: number;
}

export default function PingEffect({ size = 48, duration = 2 }: PingEffectProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size,
          height: size,
          animation: `ping ${duration}s cubic-bezier(0, 0, 0.2, 1) infinite`,
          backgroundColor: 'rgba(255, 255, 0, 0.3)',
        }}
      />
    </div>
  );
}