import * as React from 'react';
import './sass/css/loginForm.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../containers/redux/store.hooks';
import { login } from '../containers/redux/actionCreators';
import { API_DEV } from '../containers/C_apiUrl';

export interface LoginValidationError { 
  errorMessage : string
  success : boolean
}

export function LoginForm () {
  const [submit, setSubmit] = React.useState(false)
  const [validationErr, setValidationErr] = React.useState<LoginValidationError>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch() // typed dispatch 

  const handleSubmit = (event : React.FormEvent) => { 
    event.preventDefault()
    setSubmit(true)
    console.log("submitted")
  }

  const handleGoogleOauth = (event : React.MouseEvent) => {
    // NOT DONE
    event.preventDefault()
    window.location.replace(API_DEV.oauth.google.url)
  }

  // JWT login logic
  React.useEffect(()=> {
    const email = document.getElementById("email") as HTMLInputElement
    const password = document.getElementById("password") as HTMLInputElement
    const abortController = new AbortController()

    if (submit) { 
      // HTTP POST request
      fetch(API_DEV.login, {
        method: 'POST', 
        body: JSON.stringify({
          email : email.value, 
          password : password.value
        }), 
        headers : { 'Content-Type' : 'application/json' },
        signal : abortController.signal
      }).then(async (res) => {
        if (res.status === 201) {return res.json()} // password correct, login success
        if (res.status === 401) { // password incorrect
          const error = await res.json() // get error object from server
          setValidationErr(error) 
        }
      }).then((data)=> {
        console.log(data) // data object includes success property(set by server)
        if (data.success) {
          alert("login success")  
          // Get server response, set login Redux state
          dispatch(login(data._doc.email)) // server response object when success
          navigate('/')
        }
      }).catch((err) => {
        console.log(err)
      })
    }

  // cleanup
  return () => abortController.abort()
  }, [submit, navigate, dispatch])

  return (
    <div className='loginComponent'>
  
      <div className="loginPromotionContainer">
        <h2>Welcome back!</h2>
        <p>Find your paw-sibility here.</p>
        <img src={"https://i.ibb.co/bvCbscp/paw-login.webp"} width='200' alt='pawcon logo'/>
      </div>

      <div className="loginContainer">
        <form 
            className='loginForm'
            onSubmit={handleSubmit}>
          <label htmlFor="email">
            {/* add validaiton failure style */}
            <input 
              className={
                validationErr 
                  ? validationErr.errorMessage.includes("email")
                  ? 'emailError' : ''
                  : '' }
              type='email' 
              name='email'
              id='email'      
              placeholder='Eamil address'
              required />
          </label>
          <label htmlFor="password">
            <input 
              className={
                validationErr 
                  ? validationErr.errorMessage.includes("password")
                  ? 'passwordError' : ''
                  : '' }
              type='password'  
              name='password'
              id='password'      
              placeholder='Password'
              required />
          </label>
          {/* validation message */}
          <span style={validationErr && {"color": "darkred" , "fontWeight" : "bold"}}>
            {validationErr ? validationErr.errorMessage : "Please login first"}
          </span>
          {/* FIX : once form submitted, resubmission not possible e */}
          <button className='loginBtn' type='submit'>Login</button>
        </form>

        <ul className="oAuthContainer">
          <li className='title'>Login with</li>
          <ul className='oAuths'>
            <li>
              {/* FIX : add redux login status logic here, 
              NOTE : should redirect to Google Oauth */}
              <img
                onClick={handleGoogleOauth}  
                src={"https://i.ibb.co/m997sdM/google-logo.webp"} 
                alt="google logo" 
                id='googleLogo'
                loading='lazy' />
            </li>
            <li>
              {/* fix link later */}
              <a href="www.github.com" className='githubLogin'>
                <img  src={"https://i.ibb.co/jzGQ70Z/github-logo.webp"} 
                      alt="github logo" 
                      id='githubLogo'
                      loading='lazy' />
              </a>
            </li>
          </ul>
        </ul>
        <Link to={`/signup`} className='signupLink'><i><u>Not signed up yet?</u></i></Link>
      </div>
    </div>
  );
}