
const Spinner = () => {
  return (
    <div className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-red-600 rounded-full dark:text-red-500" role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner