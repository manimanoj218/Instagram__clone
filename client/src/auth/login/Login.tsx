import { useState,Dispatch } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginState,LoginError } from "./Login.types";
import { formValidate } from "./Login.formValidate";
import { signin } from "../../services/auth/auth.services";
import { useDispatch } from "react-redux";
import { AuthAction } from "../../store/types/authReducer.types";
import { AuthResponse } from "../../services/auth/auth.services.types";
import { useIsMountedRef } from "../../utils/custom-hooks/useIsMountedRef";

import Input from "../../utils/form/Input/Input";

import "../auth.css";

const Login = () => {

    const isMountedRef = useIsMountedRef();
    
    const [state,setState] = useState<LoginState>({
        emailOrUsername:"",
        password:""
    });

    const [error,setError] = useState<LoginError>({
        emailOrUsername:false,
        password:false,
        disabled:true,
    });

    const [togglePassword,setTogglePassword] = useState<boolean>(false);
    const [feedback,setFeedback] = useState<string>("");

    const dispatch = useDispatch<Dispatch<AuthAction>>();
    const navigate = useNavigate();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        if(!isMountedRef.current) return; 
        const {value,name} = e.target;
        formValidate({...state,[name]:value},setError);
        setState( state => ({...state,[name]:value}) );
    }

    const handleSubmit = async(e:React.SyntheticEvent) => {
        if(!isMountedRef.current) return; 
        e.preventDefault();
        const res = await signin(state);
        if("token" in res){
           return loggedIn(res)
        }
        setFeedback(res.message)
    }

    function loggedIn(res:AuthResponse):void{
        const {token,login,user} = res;
        localStorage.setItem("token",JSON.stringify({token,login}));
        dispatch({type:"LOGIN",payload:{token,login,user}});
        setFeedback("");
        navigate("/");
    }

    return (
        <div className="auth__container">
            
            <form className="section1" onSubmit={handleSubmit}>
                <div className="insta__logo"></div>
                <p className="signup__title">Sign up to see photos and videos from your friends.</p>
                <Input type="text" name="emailOrUsername" value={state.emailOrUsername} error={error.emailOrUsername} onChange={handleChange} placeholder="Email or username"/>
                <Input type={togglePassword ? "text" : "password"} togglePassword={togglePassword} setTogglePassword={setTogglePassword} name="password" value={state.password} error={error.password} onChange={handleChange} placeholder="Password"/>
                <input type="submit" className="submit__btn" disabled={error.disabled} value="Log In"/>
                <small className="form__feedback">{feedback}</small>
            </form>

            <div className="section2">
                <p className="section2__title">Don't have an account? <Link to="/signup" className="section2__title__Link">Sign up</Link></p>
            </div>

        </div>
    );
};

export default Login;