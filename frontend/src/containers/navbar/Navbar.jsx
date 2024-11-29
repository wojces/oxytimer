import "./navbar.css";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { setShowSidebar, setCurrentView } from "../../features/app/appSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const handleShow = () => dispatch(setShowSidebar(true));
  const loggedIn = useSelector((state) => state.login.isLoggedIn);
  const action = useSelector((state) => state.table.table.name);
  const actionId = useSelector((state) => state.table.table.idTable);
  const view = useSelector((state) => state.app.currentView);
  const navigate = useNavigate();

  const handleView = (view) => {
    dispatch(setCurrentView(view));
  };

  return (
    <div>
      <nav className="navbar bg-dark bg-body-secondary" data-bs-theme="dark">
        <div className="container-fluid d-flex flex-row justify-content-start">
          <div className="hamburger-button">
            {loggedIn && (
              <Button variant="secondary" onClick={handleShow}>
                <span className="navbar-toggler-icon"></span>
              </Button>
            )}
          </div>
          <a className="navbar-brand" onClick={() => navigate("/")}>
            OxyTimer
          </a>
          <div className="action">
            {loggedIn && view != "NewTable" && !action && (
              <Button
                as={Link}
                to="/tables/new"
                variant="outline-secondary"
                size="sm"
                onClick={() => handleView("NewTable")}>
                Dodaj nową akcję +
              </Button>
            )}
            {loggedIn && action && (
              <Button
                as={Link}
                to={`/tables/${actionId}`}
                variant="outline-secondary"
                size="sm"
                onClick={() => handleView("Table")}>
                {action}
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
