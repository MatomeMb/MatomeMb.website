
const commitments = [
  {
    title: "No tracking",
    body: "No analytics scripts, no cookies, no fingerprinting, no third-party pixels. This site makes exactly two classes of external request: font files from Google Fonts, and (on the home page) a read-only call to the public GitHub API to list repositories.",
  },
  {
    title: "No data collection",
    body: "There is no backend. Nothing you view or type is transmitted anywhere for storage. The contact form composes a message inside your own email client via a mailto: link — it never posts to a server.",
  },
  {
    title: "No accounts, no secrets",
    body: "The site is a fully static build served by GitHub Pages. There are no logins, no sessions and no server-side state to breach.",
  },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 py-14">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy</h1>
        <p className="leading-relaxed text-gray-600">
          Privacy here is not a policy — it is an architecture. The site cannot leak your data
          because it never has your data.
        </p>
      </header>

      <ul className="space-y-6">
        {commitments.map((item) => (
          <li key={item.title} className="border-l-2 border-gray-200 pl-5">
            <h2 className="font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-1 leading-relaxed text-gray-600">{item.body}</p>
          </li>
        ))}
      </ul>

      <footer className="border-t border-gray-200 pt-6 text-sm text-gray-500">
        Last updated July 2026. Questions:{" "}
        <a href="mailto:matomepontso@gmail.com" className="text-blue-600 hover:underline">
          matomepontso@gmail.com
        </a>
      </footer>
    </div>
  );
}
