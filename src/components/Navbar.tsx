
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, Leaf } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-800">
              Eco<span className="text-primary">Share</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
              }
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/how-it-works" 
              className={({isActive}) => 
                isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
              }
            >
              How It Works
            </NavLink>
            <NavLink 
              to="/features" 
              className={({isActive}) => 
                isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
              }
            >
              Features
            </NavLink>
            <NavLink 
              to="/get-involved" 
              className={({isActive}) => 
                isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
              }
            >
              Get Involved
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({isActive}) => 
                isActive ? "text-primary font-medium" : "text-gray-600 hover:text-primary"
              }
            >
              Contact
            </NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  isActive ? "text-primary font-medium px-2 py-1" : "text-gray-600 hover:text-primary px-2 py-1"
                }
                onClick={closeMenu}
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/how-it-works" 
                className={({isActive}) => 
                  isActive ? "text-primary font-medium px-2 py-1" : "text-gray-600 hover:text-primary px-2 py-1"
                }
                onClick={closeMenu}
              >
                How It Works
              </NavLink>
              <NavLink 
                to="/features" 
                className={({isActive}) => 
                  isActive ? "text-primary font-medium px-2 py-1" : "text-gray-600 hover:text-primary px-2 py-1"
                }
                onClick={closeMenu}
              >
                Features
              </NavLink>
              <NavLink 
                to="/get-involved" 
                className={({isActive}) => 
                  isActive ? "text-primary font-medium px-2 py-1" : "text-gray-600 hover:text-primary px-2 py-1"
                }
                onClick={closeMenu}
              >
                Get Involved
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({isActive}) => 
                  isActive ? "text-primary font-medium px-2 py-1" : "text-gray-600 hover:text-primary px-2 py-1"
                }
                onClick={closeMenu}
              >
                Contact
              </NavLink>
              <div className="flex space-x-3 pt-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                  Login
                </Button>
                <Button size="sm" className="flex-1 rounded-full bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
