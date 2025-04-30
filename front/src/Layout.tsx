import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col  bg-gray-800 justify-between">
      {/* Navbar */}
      <nav className="fixed-top  bg-amber-400 flex ">
        <ul className="flex  m-2 space-x-2">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search">Search</Link></li>
        </ul>
      </nav>

      {/* Page Content */}
      <main className="flex mt-3 h-[324px] ">
        <h3>heloooo fdslkfjsdl</h3>
        <h3>heloooo fdslkfjsdl</h3>
        <h3>heloooo fdslkfjsdl</h3>
        <h3>heloooo fdslkfjsdl</h3>
        <h3>heloooo fdslkfjsdl</h3>
        <h3>heloooo fdslkfjsdl</h3>
        <h3>heloooo fdslkfjsdl</h3>
        <h3>heloooo fdslkfjsdl</h3>
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
