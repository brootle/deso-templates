import 'normalize.css';
import './App.css';

import { useState, useEffect, useRef } from "react"
import { identity } from "@deso-core/identity"

import {
  getSingleProfile,
  createSubmitPostTransaction,
  avatarUrl,
  timestampToDate
} from './utils/deso-api'


function App() {
  const isRunned = useRef(false);

  const APP_NAME = 'DeSo Template App by @brootle' // aka MEMO for derived keys

  const [loggedUserPublicKey, setLoggedUserPublicKey] = useState(undefined);  
  const [loggedUserProfile, setLoggedUserProfile] = useState(undefined);  
  const [postText, setPostText] = useState('');
  const [recentPost, setRecentPost] = useState(undefined);

  const [altLoggedUsers, setAltLoggedUsers] = useState(undefined)

  const [showSwitchUserMenu, setShowSwitchUserMenu] = useState(undefined);  

  const [loading, setLoading] = useState(false);   

  const switchUsersEl = useRef(null);

  const useOnClickOutside = (ref, handler) => {
      useEffect(
        () => {
          const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            //console.log("event.target: ", event.target)
            if (!ref.current || ref.current.contains(event.target)) {
              return;
            }       
            handler(event);
          };
          document.addEventListener("mousedown", listener);
          document.addEventListener("touchstart", listener);
          return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
          };
        },
        [ref, handler]
      );
  }    

  useOnClickOutside(switchUsersEl, () => setShowSwitchUserMenu(false));  

  const handleSwitchUserMenuToggle = () => {
    if(!showSwitchUserMenu){
      setShowSwitchUserMenu(true)
    } else {
      setShowSwitchUserMenu(false)
    }
  }


  const updateLoggedUserProfile = async (publicKey) => {

    if(!publicKey){
      setLoggedUserProfile(undefined)
      return;
    }

    try {

      let settings = {
          PublicKeyBase58Check: publicKey
      }    
          
      const result = await getSingleProfile(settings)    
      let { Profile, error } = result

      if(error){
          console.log("error: ", error)
          setLoggedUserProfile(undefined)
      }  

      if(Profile){
        console.log("Loaded Profile: ", Profile)
        setLoggedUserProfile(Profile)
      }

    } catch (error) {
      console.log("Error: ", error)
    }   
  }


  const makeNewPost = async () => {

    setLoading(true)

    try {

      let settings = {
        UpdaterPublicKeyBase58Check: loggedUserPublicKey,
        Body: postText,
        MinFeeRateNanosPerKB: 1500
      }    
          
      const result = await createSubmitPostTransaction(settings)    
      let {error, TransactionHex} = result
      console.log("createSubmitPostTransaction result: ", result)

      if(error){
          console.log("error: ", error)
      }

      if(TransactionHex){
        const signedTransaction = await identity.signTx(TransactionHex)
        console.log("identity.signTx result: ", signedTransaction)

        const submittedTransaction = await identity.submitTx(signedTransaction)
        console.log("identity.submitTx result: ", submittedTransaction)

        let {PostEntryResponse} = submittedTransaction
        if(PostEntryResponse){
          setRecentPost(PostEntryResponse)
        }

      }      

      setLoading(false)

    } catch (error) {
      console.log("Error: ", error)
      setLoading(false)
    }   
  }
  

  const hasAltUsers = (obj) => {
    return Object.keys(obj).length > 0;
  }  


  useEffect(() => {

    // used this solution to prevent this code from running twice on app load
    // https://stackoverflow.com/a/72953313/6261255
    if(isRunned.current) return;
    isRunned.current = true;
  
    identity.configure({
      spendingLimitOptions: {
        // NOTE: this value is in Deso nanos, so 1 Deso * 1e9
        GlobalDESOLimit: 0.1 * 1e9, // 1 Deso
        //IsUnlimited: true, // be careful, this cancels all limits and grants unlimted transactions types and number of transactions that can be signed and submitted by the app
        // https://github.com/deso-protocol/core/blob/a836e4d2e92f59f7570c7a00f82a3107ec80dd02/lib/network.go#L244
        TransactionCountLimitMap: {
          // BASIC_TRANSFER: 'UNLIMITED', // 2 basic transfer transactions are authorized
          SUBMIT_POST: 'UNLIMITED', // 4 submit post transactions are authorized
          // UPDATE_PROFILE: 'UNLIMITED',
          // LIKE: 'UNLIMITED',
          // FOLLOW: 'UNLIMITED',
          // CREATE_POST_ASSOCIATION: 'UNLIMITED'
        },

        // need to add extra map https://github.com/deso-protocol/deso-workspace/blob/48c338918ffeb94809e64ad4be6eba9e27c90259/libs/identity/src/lib/permissions-utils.spec.ts#L140
        // permisions for assiciation transactions
        // AssociationLimitMap: [
        //   {
        //     AssociationClass: 'Post',
        //     AppScopeType: 'Any',
        //     AssociationOperation: 'Any',
        //     OpCount: 'UNLIMITED',
        //   },
        // ],        
      },
    
      // This will be associated with all of the derived keys that your application
      // authorizes.
      appName: APP_NAME,
    })
    
    identity.subscribe((state) => {

      const {currentUser, alternateUsers, event} = state;
      console.log("state: ", state)

      // SUBSCRIBE
      // LOGIN_START
      // AUTHORIZE_DERIVED_KEY_START
      // AUTHORIZE_DERIVED_KEY_END
      // LOGIN_END
      // LOGOUT_START
      // LOGOUT_END
      switch (event) {
        case 'SUBSCRIBE':
          // there can be logged user already when app loads
          setLoggedUserPublicKey(currentUser?.publicKey)
          console.log("update user profile to ", currentUser?.publicKey)
          updateLoggedUserProfile(currentUser?.publicKey)

          // set list of alternative logged users, so we can switch between them
          setAltLoggedUsers(alternateUsers)
          break;    
        case 'LOGIN_START':
          // 
          break;      
        case 'LOGIN_END':
          // 
          setLoggedUserPublicKey(currentUser?.publicKey)
          console.log("update user profile to ", currentUser?.publicKey)
          updateLoggedUserProfile(currentUser?.publicKey)

          // set list of alternative logged users, so we can switch between them
          setAltLoggedUsers(alternateUsers)             
          break;   
        case 'CHANGE_ACTIVE_USER':
          // 
          setLoggedUserPublicKey(currentUser?.publicKey)
          console.log("update user profile to ", currentUser?.publicKey)
          updateLoggedUserProfile(currentUser?.publicKey)

          // set list of alternative logged users, so we can switch between them
          setAltLoggedUsers(alternateUsers)          
          break;             
        case 'AUTHORIZE_DERIVED_KEY_START':
          // 
          break;   
        case 'AUTHORIZE_DERIVED_KEY_END':
          // 
          break;                                                
        case 'LOGOUT_START':
          //     
          break;         
        case 'LOGOUT_END':
          // 
          setLoggedUserPublicKey(currentUser?.publicKey)
          console.log("update user profile to ", currentUser?.publicKey)
          updateLoggedUserProfile(currentUser?.publicKey)

          // set list of alternative logged users, so we can switch between them
          setAltLoggedUsers(alternateUsers)             
          break;        
        default:
          console.log(`Event: ${event}.`);
      }      
    });    

    
  }, [])  
 
  return (
    <div className="App">

      <header className='headerContainer'>

        <div className='headerLeft'>

          { loggedUserProfile && 
            <div className='avatarContainer'>
              <a className='avatar' 
                style={  {backgroundImage: `url(${avatarUrl(loggedUserProfile)})`} }
                href={`https://www.gemstori.com/@${loggedUserProfile?.Username}`}
                target="_blank"
                rel="noreferrer"
                title={`${loggedUserProfile?.Username}`}
              >
              </a>
            </div>
          }

          {
            loggedUserPublicKey && !loggedUserProfile &&
            <div className='avatarContainer'>
              <a className='avatar' 
                style={  {backgroundImage: `url(https://node.deso.org/assets/img/default_profile_pic.png)`} }
                href={`https://www.openprosper.com/pk/${loggedUserPublicKey}`}
                target="_blank"                
                rel="noreferrer"
                title={`${loggedUserPublicKey}`}
              >
              </a>
            </div>            
          }

          <div className='manageUsersContainer'>

            <div onClick={() => identity.login()} className="manageUserButton" title='Add user' role="button">
              <svg viewBox="0 0 24 24" className='userMenuIcon'>
                <path
                  d="M3 19c.691-2.307 2.47-3 6.5-3 4.03 0 5.809.693 6.5 3"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <path
                  d="M13 9.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  stroke="white"
                  strokeWidth={2}
                />
                <path
                  d="M15 6h6M18 3v6"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>              
            </div>

            {
              altLoggedUsers && hasAltUsers(altLoggedUsers) &&
                <div ref={switchUsersEl} onClick={() => handleSwitchUserMenuToggle()} className="manageUserButton" title='Switch user' role="button">
                  <svg viewBox="0 0 24 24" className='userMenuIcon'>
                    <path
                      d="M15.631 7.155a2.5 2.5 0 1 1 0 4.69M3 19c.691-2.307 2.47-3 6.5-3 4.03 0 5.809.693 6.5 3M17 15c2.403.095 3.53.638 4 2"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                    <path
                      d="M13 9.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      stroke="white"
                      strokeWidth={2}
                    />
                  </svg>

                  {
                    showSwitchUserMenu && 
                    <div className='altUsersContainer'>                  
                      {altLoggedUsers && Object.keys(altLoggedUsers).map((key, index) => {
                        return (
                          <div key={index}>
                            <button className='altUserBtn' onClick={() => identity.setActiveUser(key)}

                              style={ 
                                {backgroundImage: `url(https://node.deso.org/api/v0/get-single-profile-picture/${key}?fallback=https://node.deso.org/assets/img/default_profile_pic.png)`}
                              }        
                            >
                              
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  }
                </div>
            }  
            
          </div>             
        </div>

        <div className='headerCenter'>

        </div>

        <div className='headerRight'>


          <div className='authContainer'>
            { loggedUserPublicKey
              ?<button onClick={() => identity.logout()}>Log out</button> 
              :<button onClick={() => identity.login()}>Log in</button>
            }                      
          </div>
        </div>        
 
      </header>

      <main className='mainContainer'>

        <div className='instructionsContainer'>
          <h1>[ DeSo Template App ]</h1>
          <p>
            ✔ This Template DeSo App can authorise user with Derived Keys.            
          </p>
          <p>
            ✔ Load user profile to get username and profile image
          </p>
          <p>
            ✔ Switch between authorised users.
          </p>
          <p>
            ✔ Create and Submit Post Transaction
          </p>          
        </div>

        {
          loggedUserPublicKey &&
          <div className='inputContainer'>
            <textarea disabled={loading} value={postText} onChange={(event) => setPostText(event.target.value)} placeholder={`Write some epic post to DeSo as ${loggedUserProfile?.Username || loggedUserPublicKey}`} />  
            <button disabled={loading || !postText} onClick={makeNewPost}>Post to DeSo</button>  
          </div>
        }

        { 
          recentPost &&
          <div className='outputContainer'>
            <div>Post by: {recentPost?.ProfileEntryResponse?.Username || recentPost?.PosterPublicKeyBase58Check}</div>
            <div>Post hash: {recentPost?.PostHashHex}</div>
            <div>Post date: {timestampToDate(recentPost?.TimestampNanos)}</div>
            <div>Post text: {recentPost?.Body}</div>            
          </div>
        }

      </main>

      <footer className='footerContainer'>
        <div className='footerLeft'>
          <div className='madeByMessage'>
            Designed by <a href='https://www.gemstori.com/@brootle' target="_blank" rel="noreferrer">brootle</a>
          </div>
        </div>
        <div className='footerRight'>
          {loading && <span>Processing...</span>}
        </div>
      </footer>

    </div>
  );
}

export default App;
