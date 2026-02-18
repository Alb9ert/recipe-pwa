import { Link } from "react-router-dom";

import SignupForm from "../components/forms/SignupForm";

const Signup = () => {
  return (
    <div className="mt-28 w-full flex flex-col items-center justify-center">
      <SignupForm />
      <div className="justify-center flex mt-8">
        <p>Already have an account?</p>
        <Link to="/login" className="ml-1 font-bold">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
