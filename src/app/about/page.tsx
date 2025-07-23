export default function AboutPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">About Travelytics</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-lg">
          At Travelytics, our goal is to simplify your travel planning experience by combining smart technology with real-time weather data.
          Whether you're planning a weekend getaway or a cross-country adventure, we provide the insights you need to make the best decisions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why Travelytics?</h2>
        <ul className="list-disc pl-6 text-lg space-y-2">
          <li> Integrated weather data to help you avoid surprises</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Meet the Team</h2>
        <p className="text-lg mb-2">
          We’re a team of students passionate about travel, technology, and building useful tools. Travelytics was created as a part of our software engineering project course.
        </p>
        <ul className="list-disc pl-6 text-lg space-y-1">
          <li><strong>Carter Jones</strong> – XXXXXX</li>
          <li><strong>Alex Chen</strong> – XXXX(PM)</li>
          <li><strong>Daniel Shi</strong> – XXXXXXX</li>
          <li><strong>Ayden Badyal</strong> – XXXXXXX</li>
        </ul>
      </section>
    </main>
  );
}
