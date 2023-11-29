import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import fetch from '../../axiosInterceptor';


const settings = ["Profile", "Logout"];

function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isManager, setIsManager] = React.useState(false);
  const date = {
    someDate: new Date().getDate(),
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigate = useNavigate();
  const navNavigate = (pageName) => {
    if (pageName === "Tasks") {
      navigate("/adminTasks");
    } else {
      navigate("/users");
    }
  };

  const authToken = localStorage.getItem('authToken');
  
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `https://localhost:7136/api/Account/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        }
      );

      if (response.ok) {
        console.log("Successful logout!");
        localStorage.clear(authToken)
        navigate("/login")
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToCreateTask = () => {
    navigate("/createTask");
  };

  React.useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('https://localhost:7136/api/Users/get_role', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        });

        if (response.ok) {
          const data = await response.text();
          setIsManager(data === 'manager');
        } else {
          console.error('Failed to fetch user role');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    if (authToken) {
      fetchUserRole();
    }
  }, [authToken]);

  const isLoggedIn = authToken !== null;

  return (
    <AppBar position="static" sx={{ backgroundColor: "rgb(177, 226, 247)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <img
              src={process.env.PUBLIC_URL + "/diadraw-logo.png"}
              alt="Logo"
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                ml: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "black",
                textDecoration: "none",
              }}
            >
              DiaDo
            </Typography>
            {isManager && (
              <Button onClick={navigateToCreateTask} sx={{ ml: 3, color:"black", fontWeight:'bold', fontSize:'1rem', borderBottom:'1px solid black', fontFamily:'monospace' }}>
                Create Task
              </Button>
            )}
            </Box>
            <Box>
            {isLoggedIn ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/2.jpg"
                    sx={{ backgroundColor: "rgb(255, 74, 47)" }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Button onClick={navigateToLogin} sx={{ ml: "auto" }}>
                Sign In
              </Button>
            )}
            </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn && (
              <>
                <Typography
                  name="someDate"
                  label="Some Date"
                  type="date"
                  defaultValue={date.someDate}
                />
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={
                        setting === "Logout" ? handleLogout : handleCloseUserMenu
                      }
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;