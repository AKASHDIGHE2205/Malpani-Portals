import { Store, Building2, Package, TrendingUp, BarChart3, Activity } from 'lucide-react';

const Home = () => {
  const modules = [
    {
      title: "Store Module",
      description: "Handle all store-related activities including file records, inventory tracking, and transaction entries with accuracy and ease.",
      link: "#",
      linkText: "Access Module →",
      icon: Store,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      hoverBg: "group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50",
      linkColor: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
    },
    {
      title: "Property Management",
      description: "Maintain and organize all records related to property sales and purchases. Keep track of ownership, deals, and documentation in one place.",
      link: "#",
      linkText: "Access Module →",
      icon: Building2,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      hoverBg: "group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50",
      linkColor: "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300",
    },
    {
      title: "Post Module",
      description: "Track and manage all inward and outward courier entries. Ensure smooth handling of postal records and delivery logs.",
      link: "#",
      linkText: "Access Module →",
      icon: Package,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      hoverBg: "group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50",
      linkColor: "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300",
    },
  ];

  const features = [
    "Centralized management of store, property, and courier data",
    "Seamless tracking of transactions and record entries",
    "Efficient handling of property and asset lifecycle",
    "Secure, role-based visibility for all users",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-6 md:p-10 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Section with Gradient Background */}
        <div className="relative mb-12 mt-2 overflow-hidden rounded-2xl p-8 md:p-10 shadow-xl shadow-blue-500/10">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
          <div className="relative ">{/* z-10 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wider uppercase mb-4">
              <Activity className="w-3.5 h-3.5" />
              Platform Overview
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Welcome to Malpani Business Portal
            </h1>
            <p className="mt-4 max-w-3xl leading-relaxed">
              A centralized platform to efficiently manage your business operations across multiple modules.
              <br />
              Select a module below to get started.
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-48 h-48 rounded-full blur-3xl"></div>
        </div>

        {/* Module Cards Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Modules</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((mod, index) => {
              const IconComponent = mod.icon;
              return (
                <div
                  key={index}
                  className={`relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden hover:-translate-y-1`}
                >
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mod.gradient}`}></div>

                  <div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mod.bgGradient} border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-5 transition-all duration-300 ${mod.hoverBg}`}>
                      <IconComponent className={`w-7 h-7 ${mod.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-all duration-300"
                    >
                      {mod.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 dark:from-blue-400/10 dark:to-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wider uppercase mb-4">
                <TrendingUp className="w-3.5 h-3.5" />
                Advanced Analytics
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Data-Driven Decision Making
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Leverage intelligent analytics to convert raw data into meaningful insights. Monitor performance across all modules with automated reporting, detect anomalies instantly, and drive informed decision-making with confidence.
              </p>
              <ul className="space-y-4">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300 group">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-base">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block lg:w-2/5">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl h-full min-h-[300px] w-full overflow-hidden border border-blue-100/50 dark:border-gray-700/50 shadow-inner">
                <img
                  src="https://employment-social-affairs.ec.europa.eu/sites/default/files/styles/oe_theme_ratio_3_2_medium/public/2025-08/AdobeStock_1357126576.jpeg?h=caf26d13&itok=NG1yp8uT"
                  alt="Analytics Dashboard"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;