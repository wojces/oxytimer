import { useEffect, useState } from "react";
import { User } from "../../model/user";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../features/user/userSlice";
import EditPasswordModal from "./EditPasswordModal";

export default function UserData() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [editPasswordModal, setEditPasswordModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const user = new User(userData.user);

  return (
    <div className="container-sm text-center mt-5">
      <EditPasswordModal
        modalIsVisible={editPasswordModal}
        closeModal={() => setEditPasswordModal(false)}
      />
      <h1>Moje dane</h1>
      <button
        type="button"
        className="btn btn-outline-secondary my-2"
        onClick={() => {
          setEditPasswordModal(true);
        }}>
        Ustaw nowe hasło
      </button>
      <form className="signin-card mt-4 p-4 border rounded" noValidate>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={user.email}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Imie</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={user.firstName}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Nazwisko</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={user.lastName}
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Dodany</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              disabled
              defaultValue={dayjs(user.createdAt).format(
                "DD" + "." + "MM" + "." + "YYYY"
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
