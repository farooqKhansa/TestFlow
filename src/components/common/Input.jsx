export function Input({ label, error, className = '', ...props }) {
  return <div className="w-full"><label className="block text-sm font-medium mb-2">{label}</label><input className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${error ? 'border-red-500' : ''} ${className}`} {...props} />{error && <p className="text-red-600 text-sm mt-1">{error}</p>}</div>;
}
