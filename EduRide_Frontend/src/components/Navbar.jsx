import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex gap-6">
      <Link to="/" className="font-semibold hover:underline">
        Home
      </Link>
      <Link to="/about" className="hover:underline">
        About
      </Link>
      <Link to="/help" className="hover:underline">
        HelpMe
      </Link>
    </nav>
  )
}
