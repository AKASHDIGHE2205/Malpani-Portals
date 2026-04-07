const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 px-2 py-4 md:pl-10 md:py-2">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-slate-100 leading-tight">
              Welcome to <span className="text-orange-600 dark:text-orange-500">Malpani Group</span>
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 dark:text-slate-300">
              Malpani Group is a diversified business conglomerate with interests in Renewable Energy, FMCG, Real Estate, Hospitality, and Amusement Parks. Headquartered in Sangamner, we've played a key role in its transformation into a modern industrial hub. With a legacy of trust, social commitment, and innovation, we continue to create value across sectors while staying rooted in our values.
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
              <a
                href="https://malpani.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white font-medium py-2 px-4 md:py-3 md:px-6 rounded-lg transition duration-300 text-center text-sm md:text-base"
              >
                Explore Our Services
              </a>

              <a
                href="https://malpani.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-blue-600 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium py-2 px-4 md:py-3 md:px-6 rounded-lg transition duration-300 text-center text-sm md:text-base"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            {/* Slider */}
            <div data-hs-carousel='{
              "loadingClasses": "opacity-0",
              "dotsItemClasses": "hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 size-2 md:size-3 border border-gray-400 rounded-full cursor-pointer dark:border-slate-600 dark:hs-carousel-active:bg-blue-500 dark:hs-carousel-active:border-blue-500",
              "isAutoPlay": true
            }' className="relative">
              <div className="hs-carousel relative overflow-hidden w-full min-h-64 md:min-h-96 bg-white dark:bg-slate-800 rounded-lg">
                <div className="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
                  <div className="hs-carousel-slide">
                    <div className="flex justify-center h-full bg-gray-100 dark:bg-slate-900">
                      <img
                        src="https://i.ytimg.com/vi/lHnio5PKEdM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC0LK4Wf3ADwyv9Q6Ubaz3sK3V8gQ"
                        alt="Modern business building"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="hs-carousel-slide">
                    <div className="flex justify-center h-full bg-gray-200 dark:bg-slate-800">
                      <img
                        src="https://lh6.googleusercontent.com/proxy/rSngaOEOSWWUfItEOeoWHj8cnfFBOIyEJ8YUY1X1k1TiyU70MGSCSIkGwHY4zW_jQ6sBWdTZaHP0oTFIbMSGJczfOtmv4Q"
                        alt="Modern business building"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="hs-carousel-slide">
                    <div className="flex justify-center h-full bg-gray-300 dark:bg-slate-700">
                      <img
                        src="https://sargammart.com/wp-content/uploads/2024/05/sargam-rahuri-1024x576.jpeg"
                        alt="Modern business building"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="hs-carousel-slide">
                    <div className="flex justify-center h-full bg-gray-300 dark:bg-slate-700">
                      <img
                        src="https://sargammart.com/wp-content/uploads/2024/05/sargam-rahuri-1024x576.jpeg"
                        alt="Modern business building"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="hs-carousel-prev hs-carousel-disabled:opacity-50 hs-carousel-disabled:pointer-events-none absolute inset-y-0 start-0 inline-flex justify-center items-center w-8 md:w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-s-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
                <span className="text-xl md:text-2xl" aria-hidden="true">
                  <svg className="shrink-0 size-4 md:size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                </span>
                <span className="sr-only">Previous</span>
              </button>
              <button type="button" className="hs-carousel-next hs-carousel-disabled:opacity-50 hs-carousel-disabled:pointer-events-none absolute inset-y-0 end-0 inline-flex justify-center items-center w-8 md:w-11.5 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-hidden focus:bg-gray-800/10 rounded-e-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10">
                <span className="sr-only">Next</span>
                <span className="text-xl md:text-2xl" aria-hidden="true">
                  <svg className="shrink-0 size-4 md:size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </span>
              </button>

              <div className="hs-carousel-pagination flex justify-center absolute bottom-2 md:bottom-3 start-0 end-0 flex gap-x-1 md:gap-x-2"></div>
            </div>
            {/* End Slider */}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-8 md:py-16 hidden">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-slate-100 mb-4">Our Services</h2>
          <p className="text-base md:text-lg text-center text-gray-600 dark:text-slate-300 mb-8 md:mb-12 max-w-3xl mx-auto">
            Malpani Group delivers excellence across diverse sectors, providing quality products and experiences to our customers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Real Estate */}
            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md dark:shadow-slate-900 hover:shadow-lg dark:hover:shadow-slate-700 transition duration-300 border border-gray-200 dark:border-slate-700">
              <div className="text-blue-600 dark:text-blue-400 mb-3 md:mb-4">
                <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">Real Estate</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-300">Premium residential and commercial properties developed with innovative design and sustainable practices.</p>
            </div>

            {/* Super Shops */}
            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-md dark:shadow-slate-900 hover:shadow-lg dark:hover:shadow-slate-700 transition duration-300 border border-gray-200 dark:border-slate-700">
              <div className="text-blue-600 dark:text-blue-400 mb-3 md:mb-4">
                <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">Super Shops</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-300">Modern retail supermarkets offering a wide range of products with exceptional customer service and convenience.</p>
            </div>

            {/* FMCG */}
            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-md dark:shadow-slate-900 hover:shadow-lg dark:hover:shadow-slate-700 transition duration-300 border border-gray-200 dark:border-slate-700">
              <div className="text-blue-600 dark:text-blue-400 mb-3 md:mb-4">
                <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">FMCG</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-300">Fast-moving consumer goods that meet the daily needs of households with quality and affordability.</p>
            </div>

            {/* Water Parks */}
            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-md dark:shadow-slate-900 hover:shadow-lg dark:hover:shadow-slate-700 transition duration-300 border border-gray-200 dark:border-slate-700">
              <div className="text-blue-600 dark:text-blue-400 mb-3 md:mb-4">
                <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62z" />
                  <circle cx="9" cy="13" r="1" />
                  <circle cx="15" cy="13" r="1" />
                  <path d="M18 11.03C17.52 8.18 15.04 6 12.05 6c-3.03 0-6.29 2.51-6.03 6.45 2.47-1.01 4.33-3.21 4.86-5.89 1.31 2.63 4 4.44 7.12 4.47z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">Water Parks</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-300">Exciting and safe water-based entertainment destinations for families and thrill-seekers alike.</p>
            </div>

            {/* Skincare */}
            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-md dark:shadow-slate-900 hover:shadow-lg dark:hover:shadow-slate-700 transition duration-300 border border-gray-200 dark:border-slate-700">
              <div className="text-blue-600 dark:text-blue-400 mb-3 md:mb-4">
                <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5 .53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">Skincare</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-300">Premium skincare products formulated with natural ingredients for healthy and radiant skin.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;