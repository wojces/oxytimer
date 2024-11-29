import Offcanvas from "react-bootstrap/Offcanvas";
import ListGroup from "react-bootstrap/ListGroup";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setShowSidebar, setCurrentView } from "../../features/app/appSlice";
import { setIsLoggedIn } from "../../features/login/loginSlice";
import { removeRefreshToken, removeToken } from "../../utils/utlisToken";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.app.showSidebar);
  const handleClose = () => dispatch(setShowSidebar(false));
  const navigate = useNavigate();
  const handleView = (view) => {
    dispatch(setCurrentView(view));
    handleClose();
  };
  const handleLogout = () => {
    dispatch(setIsLoggedIn(false));
    handleView("Login");
    removeToken();
    removeRefreshToken();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} className="bg-dark-subtle">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>OxyTimer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            <ListGroup.Item
              as={Link}
              to="/tables"
              action
              variant="secondary"
              onClick={() => handleView("TableList")}>
              Lista akcji
            </ListGroup.Item>
            <ListGroup.Item
              as={Link}
              to="/tables/new"
              action
              variant="secondary"
              onClick={() => handleView("NewTable")}>
              Dodaj akcję
            </ListGroup.Item>
            <ListGroup.Item
              as={Link}
              to="/rescuers"
              action
              variant="secondary"
              onClick={() => handleView("RescuersList")}>
              Ratownicy
            </ListGroup.Item>
            <ListGroup.Item
              as={Link}
              to="/user"
              action
              variant="secondary"
              onClick={() => handleView("UserData")}>
              Moje dane
            </ListGroup.Item>
            <ListGroup.Item action variant="secondary" onClick={handleLogout}>
              Wyloguj
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
