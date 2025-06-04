import SignUp_LeftPanel from "../Components/SignUp_Components/SignUp_LeftPanel.jsx";
import SignUp_RightPanel from "../Components/SignUp_Components/SignUp_RightPanel.jsx";

const SignUpPage = () => {
  return (
    <div
      className="flex justify-center items-center p-20 bg-base-200 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden">
        <SignUp_LeftPanel />
        <SignUp_RightPanel />
      </div>
    </div>
  );
};

export default SignUpPage;
