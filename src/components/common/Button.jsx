export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = { primary: 'bg-purple-600 text-white hover:bg-purple-700', secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700', danger: 'bg-red-600 text-white hover:bg-red-700', success: 'bg-green-600 text-white hover:bg-green-700' };
  const sizes = { sm: 'px-3 py-1 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };
  return <button className={`font-medium rounded-lg transition-all cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}
