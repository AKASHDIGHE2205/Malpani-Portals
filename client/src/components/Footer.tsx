
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div>
      <footer className="relative overflow-hidden dark:bg-slate-800 bg-slate-200 p-4 text-center">
        <h1 className="text-sm text-slate-700 dark:text-slate-300">
          © Malpani Group {currentYear}. All Rights Reserved.
        </h1>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
          For more info about us:{" "}
          <a
            href="https://malpani.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            https://malpani.com/
          </a>
        </p>
      </footer>
    </div>

  )
}

export default Footer