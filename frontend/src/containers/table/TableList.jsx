import { useEffect } from "react";
import dayjs from "dayjs";
import { MainTable } from "../../model/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchTables, fetchSingleTable } from "../../features/table/tableSlice";
import { setCurrentView } from "../../features/app/appSlice";
import { useNavigate } from "react-router-dom";

export default function TableList() {
  const dispatch = useDispatch();
  const tables = useSelector((state) => state.table.tables);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTables());
  }, []);

  const tableRow = tables.map((tab, index) => {
    const table = new MainTable(tab);

    return (
      <tr key={table.idTable} onClick={() => openTable(table.idTable)}>
        <th scope="row">{index + 1}</th>
        <td>{table.name}</td>
        <td>{table.location}</td>
        <td>
          {dayjs(table.createdAt).format("DD" + "." + "MM" + "." + "YYYY")}
        </td>
        <td>{formatFinished(table.finished)}</td>
        <td>{formatDate(table.finishedAt)}</td>
      </tr>
    );
  });

  function formatDate(date) {
    if (date.$d != "Invalid Date") {
      return dayjs(date).format("DD" + "." + "MM" + "." + "YYYY");
    } else if (date.$d == "Invalid Date") {
      return "-";
    }
  }

  function formatFinished(finishedStatus) {
    if (finishedStatus == 0) {
      return "x";
    } else if (finishedStatus == 1) {
      return "✓";
    }
  }

  async function openTable(id) {
    await dispatch(fetchSingleTable(id));
    dispatch(setCurrentView("Table"));
    navigate(`/tables/${id}`);
  }

  return (
    <div className="container-sm text-center mt-5">
      <h1>Lista akcji</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nazwa</th>
            <th scope="col">Lokalizacja</th>
            <th scope="col">Data utworzenia</th>
            <th scope="col">Zakończona</th>
            <th scope="col">Data zakończenia</th>
          </tr>
        </thead>
        <tbody>{tableRow}</tbody>
      </table>
    </div>
  );
}
