import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRescuers } from "../../features/rescuers/rescuerSlice";
import dayjs from "dayjs";
import { Rescuer } from "../../model/rescuer";
import AddRescuerModal from "./AddRescuerModal";
import EditRescuerModal from "./EditRescuerModal";
import DeleteRescuerModal from "./DeleteRescuerModal";

export default function RescuersList() {
  const dispatch = useDispatch();
  const rescuers = useSelector((state) => state.rescuer.rescuers);
  const [selectedRescuer, setSelectedRescuer] = useState({});
  const [selectedRescuerId, setSelectedRescuerId] = useState({});
  const [addRescuerModal, setAddRescuerModal] = useState(false);
  const [editRescuerModal, setEditRescuerModal] = useState(false);
  const [deleteRescuerModal, setDeleteRescuerModal] = useState(false);

  useEffect(() => {
    dispatch(fetchRescuers());
  }, []);

  function findRescuerById(id) {
    return rescuers.find((resc) => resc.id_rescuer == id);
  }

  const tableRow = rescuers.map((resc, index) => {
    const rescuer = new Rescuer(resc);

    return (
      <tr key={rescuer.idRescuer}>
        <th scope="row">{index + 1}</th>
        <td>{rescuer.firstName}</td>
        <td>{rescuer.lastName}</td>
        <td>{rescuer.location}</td>
        <td>{rescuer.unit}</td>
        <td>{rescuer.commanderFirstName + " " + rescuer.commanderLastName}</td>
        <td>{rescuer.inPressure}</td>
        <td>
          {dayjs(rescuer.createdAt).format("DD" + "." + "MM" + "." + "YYYY")}
        </td>
        <td
          onClick={() => {
            setSelectedRescuerId(rescuer.idRescuer);
            setSelectedRescuer(findRescuerById(rescuer.idRescuer));
            setEditRescuerModal(true);
          }}>
          <i className="bi bi-pencil"></i>
        </td>
        <td
          onClick={() => {
            setSelectedRescuerId(rescuer.idRescuer);
            setSelectedRescuer(findRescuerById(rescuer.idRescuer));
            setDeleteRescuerModal(true);
          }}>
          <i className="bi bi-x-circle"></i>
        </td>
      </tr>
    );
  });

  return (
    <div className="container-sm text-center mt-5">
      <AddRescuerModal
        modalIsVisible={addRescuerModal}
        closeModal={() => {
          setAddRescuerModal(false);
          dispatch(fetchRescuers());
        }}
      />
      {editRescuerModal && (
        <EditRescuerModal
          modalIsVisible={editRescuerModal}
          closeModal={() => {
            setSelectedRescuerId("");
            setSelectedRescuer({});
            setEditRescuerModal(false);
            dispatch(fetchRescuers());
          }}
          editedRescuer={selectedRescuer}
          rescuerId={selectedRescuerId}
        />
      )}

      <DeleteRescuerModal
        modalIsVisible={deleteRescuerModal}
        closeModal={() => {
          setSelectedRescuerId("");
          setSelectedRescuer({});
          setDeleteRescuerModal(false);
          dispatch(fetchRescuers());
        }}
        deletedRescuer={selectedRescuer}
        rescuerId={selectedRescuerId}
      />

      <h1>Lista ratowników</h1>
      <button
        type="button"
        className="btn btn-outline-secondary my-2"
        onClick={() => {
          setAddRescuerModal(true);
        }}>
        Dodaj Ratownika
      </button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Imię</th>
            <th scope="col">Nazwisko</th>
            <th scope="col">Lokalizacja</th>
            <th scope="col">Jednostka</th>
            <th scope="col">Dowódca</th>
            <th scope="col">Ciśnienie IN</th>
            <th scope="col">Data dodania</th>
            <th scope="col">Edytuj</th>
            <th scope="col">Usuń</th>
          </tr>
        </thead>
        <tbody>{tableRow}</tbody>
      </table>
    </div>
  );
}
