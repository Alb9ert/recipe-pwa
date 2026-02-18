import LoginForm from "../components/forms/LoginForm";

import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="mt-28 w-full flex items-center gap-y-5 flex-col">
      <LoginForm />
      <p>
        Don't have an account?
        <Link to="/signup" className="ml-1 font-bold">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
