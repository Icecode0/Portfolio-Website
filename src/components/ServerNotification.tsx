'use client';

interface ServerNotificationProps {
  message: string;
}

export default function ServerNotification({ message }: ServerNotificationProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-red-900/90 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-red-700">
        <p className="text-white text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
}