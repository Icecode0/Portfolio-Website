import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">About Me</h1>
          <div className="w-24 h-1 bg-ice-blue mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <div className="w-full md:w-1/3">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-800 border-2 border-ice-blue">
              <Image
                src="/HeadShot.jpg"
                alt="Ice's Profile Picture"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-ice-blue">The Journey</h2>
            <p className="text-gray-300 mb-4">
              I'm Ice, a full stack developer, systems architect, and lifelong gamer who started building software out of necessity, not theory. 
              My first app wasn't for a class or a portfolio piece — it was a Flutter mobile app I built on the railroad while working as a project manager.
            </p>
            <p className="text-gray-300 mb-4">
              The goal was simple: eliminate paperwork and make inspections smarter. My app let crews input track inspection data in the field, 
              automatically stored it by section of track, and displayed results on a Google Maps overlay showing what was in or out of FRA compliance. 
              I automated the process so that even someone with limited knowledge could walk into the field and know exactly what was safe and what needed attention.
            </p>
            <p className="text-gray-300">
              I went further by designing an Arduino device that rolled down the track, measured rail gage, uploaded the data automatically, 
              and flagged weak spots before they became serious problems. That was the moment I realized the power of code: turning hours of paperwork, 
              guesswork, and manual labor into a process that was faster, safer, and more reliable.
            </p>
          </div>
        </div>

        {/* What I Do Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-ice-blue">Technical Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Full Stack Development",
                description: "10+ years experience with Python, Dart, JavaScript, and more, building everything from automation scripts to complex web applications."
              },
              {
                title: "Game Development & Modding",
                description: "Creating multiplayer game mechanics in Unity and Unreal, plus developing modding pipelines for large-scale game server deployments."
              },
              {
                title: "Community Tools",
                description: "Building Discord bots and server management platforms that power gaming communities of 10k+ people."
              },
              {
                title: "System Architecture",
                description: "Designing scalable systems and infrastructure that handle real-world demands while maintaining performance and reliability."
              }
            ].map((item) => (
              <div key={item.title} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Touch */}
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-ice-blue">Beyond the Code</h2>
          <p className="text-gray-300 mb-4">
            I'm a dad, a gamer, and a builder at heart. Running gaming communities taught me more about people than any class ever could. 
            I understand what players want because I live it myself, and that perspective drives how I approach design, performance, and user experience.
          </p>
          <p className="text-gray-300 mb-4">
            Whether I'm optimizing a backend service at midnight, designing a UI that feels natural, or messing with a 3D model in Blender, 
            my approach is the same: work hard, solve problems, and make it better than it was yesterday.
          </p>
          <p className="text-gray-300">
            I carry the same grit I learned in blue-collar work into development, and I believe in creating things that last, things that scale, 
            and things that actually matter.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Build Something Amazing?</h2>
          <p className="text-ice-blue font-semibold mb-8">
            I build systems, communities, and experiences that bring people together, and I take pride in solving problems others walk away from.
          </p>
          <Link 
            href="/contact" 
            className="px-8 py-3 bg-ice-blue text-gray-900 rounded-lg font-bold hover:bg-ice-blue/80 transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}