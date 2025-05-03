import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col  bg-gray-800 justify-between">
      {/* Navbar */}
      
      <div className="navbar my-2 flex space-x-2 bg-base-100 shadow-sm">
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 6h16M4 18h16"></path> </svg>
    </button>
  </div>
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
    </button>
  </div>
</div>
      
      
      {/* <nav className="fixed-top  bg-amber-400 flex ">
        <ul className="flex  m-2 space-x-2">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Search</Link></li>
        </ul>
      </nav> */}

      {/* Page Content */}
      <main className="flex text-center  bg-blue-950 mt-3 h-[324px] ">
      <div className="card w-96 mt-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">DaisyUI Card</h2>
          <p>Beautiful components, powered by Tailwind.</p>
        </div>
      </div>
      <div className="card w-96 mt-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">DaisyUI Card</h2>
          <p>Beautiful components, powered by Tailwind.</p>
        </div>
      </div>
      <div className="card w-96 mt-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">DaisyUI Card</h2>
          <p>Beautiful components, powered by Tailwind.</p>
        </div>
      </div>

    
    
    
    
        <Outlet /> {/* This renders child routes */}
    
    
    
    
      </main>

      {/* Footer */}
      <footer className="bg-gray-900">
        <p>© 2025 My Website</p>
      </footer>
    </div>
  );
};

export default Layout;
