import { useDispatch, useSelector } from "react-redux";
import { setUserEmail, setUserPassword } from "../../features/login/loginSlice";
import { login } from "../../api/auth";
import { setRefreshToken, setToken } from "../../utils/utlisToken";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.login.userEmail);
  const password = useSelector((state) => state.login.userPassword);
  const handleEmail = (email) => {
    dispatch(setUserEmail(email));
  };
  const handlePassword = (password) => {
    dispatch(setUserPassword(password));
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = renderEmailValidationResult();

    if (res === "poprawny email") {
      const payload = {
        email: email,
        password: password,
      };

      try {
        const response = await login(payload);
        setToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        navigate("/", { replace: true });
        location.reload();
      } catch (err) {
        if (err.response) {
          setError("Nieprawidłowe dane logowania.");
          setIsValidEmail(false);
          setIsValidPassword(false);
        } else if (err.request) {
          setError("Błąd sieci. Nie udało się połączyć z serwerem.");
          setIsValidEmail(true);
          setIsValidPassword(true);
        } else {
          setError("Wystąpił nieoczekiwany błąd.");
          setIsValidEmail(true);
          setIsValidPassword(true);
        }
      }
    } else {
      setError("Wprowadź poprawny email.");
      setIsValidEmail(false);
    }
  }

  function renderEmailValidationResult() {
    let msg = "";
    const rgExp =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (rgExp.test(email)) {
      msg = "poprawny email";
    } else if (email === "") {
      msg = "wprowadź email";
    } else if (!rgExp.test(email)) {
      msg = "niepoprawny email";
    } else {
      msg = "";
    }
    return msg;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-10 col-md-8 col-lg-6 col-xxl-4">
        {/* title */}
        <h1 className="mt-4 text-center">Logowanie do OxyTimer</h1>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="signin-card mt-4 p-4 border rounded"
          noValidate>
          {/* Email */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input
                type="email"
                className={`form-control ${!isValidEmail ? "is-invalid" : ""}`}
                placeholder="nazwa@przyklad.com"
                value={email}
                onChange={(e) => {
                  setError("");
                  setIsValidEmail(true);
                  handleEmail(e.target.value);
                }}
              />
            </div>
          </div>
          {/* Password */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">Hasło</label>
            <div className="col-sm-10">
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${
                    !isValidPassword ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => {
                    setError("");
                    setIsValidPassword(true);
                    handlePassword(e.target.value);
                  }}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={togglePasswordVisibility}>
                  <i
                    className={
                      showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                    }></i>
                </button>
              </div>
            </div>
          </div>
          {/* Login feedback */}
          {error && (
            <p className="text-center" style={{ color: "red" }}>
              {error}
            </p>
          )}

          {/* Submit button */}
          <div className={`row ${error === "" ? "mt-5" : ""}`}>
            <div className="col-sm d-flex justify-content-center">
              <button type="submit" className="btn btn-secondary">
                Zaloguj się
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
