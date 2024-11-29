import "./start-page.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-fluid text-center mt-5">
      <h1 id="title">OxyTimer</h1>
      <ul id="links-list">
        <li className="link-card">
          <Link to={"/tables"} className="link">
            <h3 className="link-item">Lista akcji</h3>
            <p className="link-item">
              Zobacz listę akcji lub kontynuuj rozpoczętą akcję
            </p>
          </Link>
        </li>
        <li className="link-card">
          <Link to={"/tables/new"} className="link">
            <h3 className="link-item">Nowa akcja</h3>
            <p className="link-item">Utwórz nową akcję</p>
          </Link>
        </li>
        <li className="link-card">
          <Link to={"/rescuers"} className="link">
            <h3 className="link-item">Lista ratowników</h3>
            <p className="link-item">Dodaj, edytuj lub usuń ratownika</p>
          </Link>
        </li>
        <li className="link-card">
          <Link to={"/user"} className="link">
            <h3 className="link-item">Moje dane</h3>
            <p className="link-item">Zobacz swoje dane lub zmień hasło</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
