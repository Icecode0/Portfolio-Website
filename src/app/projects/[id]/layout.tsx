export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="py-8">
          <a href="/projects" className="text-ice-blue hover:underline mb-8 inline-block">
            ← Back to Projects
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
