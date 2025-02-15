/* eslint-disable no-unused-vars */
import react, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const loginUser = async (data) => {
    data.role = role;

    axios
      .post("http://localhost:3000/login", data, {withCredentials: true})
      .then((res) => {
		localStorage.setItem("user", JSON.stringify	(res.data.user));
		navigate("/faculty");
      })
      .catch((err) => {
        console.log(err);
      });
	
  };

  return (
    <section>
      <div>
        <div>
          <div>
            <h1>Sign in to your Account</h1>
            {error && <div role="alert">{error}</div>}
            <form onSubmit={handleSubmit(loginUser)}>
              <div>
                <label>Your email</label>
                <input {...register("email", { required: true })} type="text" />
              </div>
              <div>
                <label>Your password</label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                />
              </div>
              <div>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  onChange={() => setRole("student")}
                />{" "}
                Student
                <input
                  type="radio"
                  name="role"
                  value="faculty"
                  onChange={() => setRole("faculty")}
                />{" "}
                Faculty
              </div>
              <button type="submit">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
