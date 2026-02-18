import { useUser } from "../context/AuthContext";

const Dashboard = () => {
  const user = useUser();

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <h1 className="text-xl">
          /dashboard - Welcome {user?.name}
          <br />
        </h1>
      </div>
    </>
  );
};

export default Dashboard;
