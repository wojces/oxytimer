import { useState } from "react";
import { setCurrentView } from "../../features/app/appSlice";
import { fetchSingleTable } from "../../features/table/tableSlice";
import { useDispatch } from "react-redux";
import { createTable } from "../../api/table";
import { useNavigate } from "react-router-dom";

export default function NewTable() {
  const dispatch = useDispatch();
  const [newTable, setNewTable] = useState({
    name: "",
    location: "",
  });
  const navigate = useNavigate();

  function inputsValidCheck() {
    if (newTable.name.trim() === "" || newTable.location.trim() === "")
      return true;
  }

  async function postData() {
    if (inputsValidCheck()) return;

    const response = await createTable(newTable);
    dispatch(fetchSingleTable(response.data.idTable));
    {
      response.status == 200 &&
        dispatch(setCurrentView("Table")) &&
        navigate(`/tables/${response.data.idTable}`);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    postData();
  }

  return (
    <div className="container-sm mt-5 text-center">
      <h1>Dodaj nową akcję</h1>
      <form
        onSubmit={handleSubmit}
        className="signin-card mt-4 p-4 border rounded"
        noValidate>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Nazwa</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              value={newTable.name}
              onChange={(e) =>
                setNewTable({ ...newTable, name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Lokalizacja</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              value={newTable.location}
              onChange={(e) =>
                setNewTable({ ...newTable, location: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row ">
          <div className="col-sm d-flex justify-content-center">
            <button type="submit" className="btn btn-secondary">
              Dodaj akcję
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
