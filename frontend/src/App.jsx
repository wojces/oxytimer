import "./app.css";
import Navbar from "./containers/navbar/Navbar";
import Sidebar from "./containers/sidebar/Sidebar";
import Table from "./containers/table/Table";
import NewTable from "./containers/table/NewTable";
import Login from "./containers/login/Login";
import RescuersList from "./containers/rescuers/RescuersList";
import TableList from "./containers/table/TableList";
import UserData from "./containers/user/UserData";
import StartPage from "./containers/app/StartPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoggedIn } from "./features/login/loginSlice";
import { setCurrentView } from "./features/app/appSlice";
import { getToken } from "./utils/utlisToken";

export default function App() {
  const dispatch = useDispatch();

  const action = useSelector((state) => state.table.table.name);
  const loggedIn = useSelector((state) => state.login.isLoggedIn);

  let tokenData = getToken().token;

  useEffect(() => {
    if (tokenData !== null) {
      dispatch(setIsLoggedIn(true));
      dispatch(setCurrentView("NewTable"));
    } else {
      dispatch(setIsLoggedIn(false));
      dispatch(setCurrentView("Login"));
    }

    if (action && tokenData) {
      dispatch(setCurrentView("Table"));
    } else if (!action && tokenData) {
      dispatch(setCurrentView("NewTable"));
    }
  }, [tokenData]);

  return (
    <>
      <header className="sticky-top">
        <Navbar />
      </header>
      <main className="mb-4">
        <ToastContainer />
        {loggedIn && <Sidebar />}
        {!loggedIn && (
          <Routes>
            <Route path="*" element={<Login />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
        {loggedIn && (
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/tables">
              <Route index element={<TableList />} />
              <Route path=":id" element={<Table />} />
              <Route path="new" element={<NewTable />} />
            </Route>
            <Route path="/rescuers" element={<RescuersList />} />
            <Route path="/user" element={<UserData />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        )}
      </main>
      <footer></footer>
    </>
  );
}
