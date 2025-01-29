import { useState } from 'react';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
      <nav className="mt-4 relative max-w-5xl w-full bg-black text-white border border-neutral-700 rounded-[1rem] mx-2 py-2.5 md:flex md:items-center md:justify-between md:py-0 md:px-4 md:mx-auto">
        <div className="px-4 md:px-0 flex justify-between items-center">
          {/* Logo */}
          <div>
            <a
              className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
              href="/"
              aria-label="Preline"
            >
              WebLift
            </a>
          </div>
          {/* End Logo */}

          <div className="md:hidden">
            {/* Toggle Button */}
            <button
              type="button"
              onClick={toggleNav}
              className="flex justify-center items-center size-6 border border-gray-200 text-white rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
              aria-expanded={isNavOpen}
              aria-controls="navbar"
              aria-label="Toggle navigation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible Navigation */}
        <div
          id="navbar"
          className={`${isNavOpen ? 'block' : 'hidden'} md:flex md:items-center md:justify-between`}
        >
        <a className="py-0.5 mx-1 md:py-3 px-4 md:px-1 border-s-2 md:border-s-0 md:border-b-2 border-gray-100 font-medium text-gray-100 focus:outline-none" href="#" aria-current="page">Home</a>
        <a className="py-0.5 mx-1 md:py-3 px-4 md:px-1 border-s-2 md:border-s-0 md:border-b-2 border-transparent text-gray-500 hover:text-gray-100 focus:outline-none" href="/deploy">Deploy</a>
        <a className="py-0.5 mx-1 md:py-3 px-4 md:px-1 border-s-2 md:border-s-0 md:border-b-2 border-transparent text-gray-500 hover:text-gray-100 focus:outline-none" href="#">Account</a>
          {/* Add navigation items here */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
