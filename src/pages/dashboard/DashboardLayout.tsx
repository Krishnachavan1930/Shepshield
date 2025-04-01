import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  Home,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
  FileUp,
  Search,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authService } from "@/services/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const ProfileWithModal = ({ doctorProfile, isModalOpen, setIsModalOpen }) => {
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={handleOpenModal}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={doctorProfile.avatar} />
          <AvatarFallback>
            {doctorProfile.name?.substring(0, 2) || "JD"}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm hidden lg:inline-block">
          {doctorProfile.name}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Doctor Profile</h2>
              <Button
                variant="outline"
                className="bg-cyan-500 text-white hover:bg-cyan-600"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={doctorProfile.avatar}
                  alt={doctorProfile.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold">{doctorProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doctorProfile.role}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> {doctorProfile.email}
                </p>
                <p>
                  <strong>Department:</strong> {doctorProfile.department}
                </p>
                <p>
                  <strong>Phone:</strong> {doctorProfile.phone}
                </p>
                <p>
                  <strong>Bio:</strong> {doctorProfile.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};



const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>({
    name: '',
    department: '',
    role : "",
    phone : "",
    bio : "",
    avatar:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&auto=format&fit=crop",
  });

  useEffect(() => {
    // Fetch the current user when the component mounts
    const fetchCurrentUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        console.log(response);
        // Assuming the response is the user object, otherwise adjust accordingly
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Optionally handle the error (e.g., set default user, show a message, etc.)
      }
    };

    fetchCurrentUser();
  }, []);
  const doctorProfile = {
    name: user.name || "Not logged in",
    role: user.role || "N/A",
    email: user.email || "N/A",
    department: user.department || "N/A",
    phone: user.phone || "N/A",
    bio: user.bio || "N/A",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&auto=format&fit=crop",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    setOpen(false);
    setSearchActive(false);
  }, [location.pathname]);

  // Handle menu animation
  useEffect(() => {
    if (!sheetRef.current) return;

    if (open) {
      sheetRef.current.style.display = "block";
      setTimeout(() => {
        if (sheetRef.current) {
          sheetRef.current.style.transform = "translateX(0)";
        }
      }, 10);
    } else {
      if (sheetRef.current) {
        sheetRef.current.style.transform = "translateX(-100%)";
        setTimeout(() => {
          if (sheetRef.current) {
            sheetRef.current.style.display = "none";
          }
        }, 300);
      }
    }
  }, [open]);

  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      label: "Patient Records",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/patients",
    },
    {
      label: "Upload Reports",
      icon: <FileUp className="h-5 w-5" />,
      path: "/dashboard/upload",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/dashboard/analytics",
    },
    {
      label: "Sepsis Monitoring",
      icon: <Activity className="h-5 w-5" />,
      path: "/dashboard/monitoring",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/settings",
    },
    {
      label: "Help & Support",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/dashboard/help",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="container-wide h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="lg:hidden" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <div
                ref={sheetRef}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg p-0"
                style={{
                  display: "none",
                  transform: "translateX(-100%)",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="p-6 border-b h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <Link to="/" className="text-xl font-bold text-primary">
                      SepShield
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <Avatar>
                      <AvatarImage src={doctorProfile.avatar} />
                      <AvatarFallback>
                        {user.name?.substring(0, 2) || "JD"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.name || "Dr. John Doe"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.department || "Infectious Disease"}
                      </p>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full",
                          location.pathname === item.path ||
                            (item.path !== "/dashboard" &&
                              location.pathname.startsWith(item.path))
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </Sheet>

            <Link
              to="/"
              className="text-xl font-bold text-primary hidden lg:flex"
            >
              SepShield
            </Link>
          </div>

          {/* <div className={`${searchActive ? 'flex' : 'hidden'} lg:flex items-center max-w-sm w-full relative`}>
            <Search className="absolute left-3 text-muted-foreground h-4 w-4" />
            <input 
              type="search" 
              placeholder="Search patients, reports..." 
              className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchActive && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden absolute right-1" 
                onClick={() => setSearchActive(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div> */}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground lg:hidden"
              onClick={() => setSearchActive(!searchActive)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={fetchNotifications}
        >
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <div key={index} className="p-2 border-b">
              {notif.message}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No new notifications</p>
        )}
      </PopoverContent>
    </Popover> */}

            {/* <Button variant="ghost" size="icon" className="text-muted-foreground hidden sm:flex">
              <MessageSquare className="h-5 w-5" />
            </Button> */}

            <ProfileWithModal
              doctorProfile={doctorProfile}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden lg:block w-64 bg-white border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <div className="p-6">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium w-full",
                    location.pathname === item.path ||
                      (item.path !== "/dashboard" &&
                        location.pathname.startsWith(item.path))
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="container-wide mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
