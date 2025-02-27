import RecruiterAuth from "./RecruiterAuth";
import RecruiterHomeHeader from "./RecruiterHomeHeader";
import RecruiterHomeFooter from "./RecruiterHomeFooter";
const RecruiterLogin = () =>{
    return(
        <div>
            <RecruiterHomeHeader/>
            <RecruiterAuth/>
            <RecruiterHomeFooter/>
        </div>
    );
};
export default RecruiterLogin;
