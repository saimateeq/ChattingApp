import React, { useEffect, useRef, useState } from 'react'
import "../App.css"
import MainBg from '../components/MainBg'
import { child, get, getDatabase, onChildAdded, ref, set, update } from 'firebase/database'
import { initializeApp } from 'firebase/app'
const ChattingPage = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCvGukJkfLcbXAp5kSaSNYmz8o-ZQ8BJPg",
    authDomain: "chatting-app-saim.firebaseapp.com",
    databaseURL: "https://chatting-app-saim-default-rtdb.firebaseio.com",
    projectId: "chatting-app-saim",
    storageBucket: "chatting-app-saim.appspot.com",
    messagingSenderId: "152211093125",
    appId: "1:152211093125:web:78c71f80a7835ad46e1bec",
    measurementId: "G-78W952RHXM"
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const [User, setUser] = useState(JSON.parse(localStorage.getItem("UserObj")))
  const [Scroll, setScroll] = useState(false)
  const [SearchBar, setSearchBar] = useState(false)
  const [SearchNotFound, setSearchNotFound] = useState(false)
  const [SearchArray, setSearchArray] = useState([])
  const [ReceiverAcc, setReceiverAcc] = useState({})
  const [SenderChats, setSenderChats] = useState([])
  const [ReceiversChats, setReceiversChats] = useState([])
  const [ReceiverUsername, setReceiverUsername] = useState("")
  const [SenderUsername, setSenderUsername] = useState("")
  const [ReceiverIcon, setReceiverIcon] = useState("")
  const [ShowingMsgs, setShowingMsgs] = useState(false)
  const [MsginfoShow, setMsgInfoShow] = useState(false)
  const [MsgInfo, setMsgInfo] = useState({})
  const [ReceiversIndex, setReceiversIndex] = useState(-1)
  const [EdittingMsg, setEdittingMsg] = useState(false)
  const [ChattingAni, setChattingAni] = useState("max-sm:hidden")
  const [MsgsAni, setMsgsAni] = useState("")
  const SearchInp = useRef(null)
  const MsgInp = useRef(null)
  const ScrollRef = useRef(null)
  const SearchFunc = () => {
    setSearchArray([])
    setSearchNotFound(true)
    let SearchInput = SearchInp.current.value
    get(child(ref(database), "users")).then((snapshot) => {
      if (snapshot.exists()) {
        let Data = snapshot.val()
        Object.keys(Data).forEach(key => {
          let Username = key
          if (Username.substring(0, SearchInput.length) === SearchInput && Username !== User.Username) {
            setSearchArray(prevArray => [...prevArray, Data[key]])
          }
        })
      }
    })
  }
  const ChatStartFunc = (Username, index) => {
    setScroll(false)
    setSearchBar(false)
    setSearchArray([])
    setShowingMsgs(true)
    setReceiverUsername(Username)
    setReceiversIndex(index)
    const ReceiverInterval = setInterval(() => {
      get(child(ref(database), `users/${Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
          let Receiver = snapshot.val()
          let Name = Receiver.Name
          setReceiverAcc(Receiver)
          setReceiverIcon(Name.slice(0, 1))
          setReceiversChats(Receiver.Chats)
        }
      })
      if (ReceiverUsername !== Username) {
        clearInterval(ReceiverInterval)
      }
    }, 1000);
    if (window.matchMedia("(max-width: 640px)").matches) {
      setChattingAni("chatting-ani-show z-0")
      setMsgsAni("-z-10")
      setTimeout(() => {
        setChattingAni("fixed")
        setMsgsAni("hidden")
      }, 800);
    }
    setTimeout(() => {
      ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight;
    }, 1000);
    const MessagesRef = ref(database, `users/${User.Username}/Chats/${index}/Messages`);
    onChildAdded(MessagesRef, () => {
      setTimeout(() => {
        ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight;
      }, 1500);
    });
  }
  const SendMessageFunc = () => {
    const DateTime = new Date()
    let Day = DateTime.getDay()
    let Minutes = DateTime.getMinutes()
    let Hours = DateTime.getHours()
    switch (Day) {
      case 0:
        Day = 'Sunday'
        break;
      case 1:
        Day = 'Monday'
        break;
      case 2:
        Day = 'Tuesday'
        break;
      case 3:
        Day = 'Wendnesday'
        break;
      case 4:
        Day = 'Thursday'
        break;
      case 5:
        Day = 'Friday'
        break;
      case 6:
        Day = 'Saturday'
        break;
      default:
        Day = ""
        break;
    }
    SenderChats.map((value, index) => {
      if (value.Username === ReceiverAcc.Username) {
        var msgindex = 0
        if (SenderChats[index].Messages) { msgindex = SenderChats[index].Messages.length }
        set(ref(database, `users/${SenderUsername}/Chats/${index}/Messages/` + msgindex), {
          Message: MsgInp.current.value,
          type: "Send",
          SendOn: {
            day: Day,
            minutes: Minutes,
            hours: Hours,
          }
        });
      }
    })
    ReceiversChats.map((value, index) => {
      if (value.Username === SenderUsername) {
        set(ref(database, `users/${ReceiverAcc.Username}/Chats/${index}/Messages/` + ReceiversChats[index].Messages.length), {
          Message: MsgInp.current.value,
          type: "Received",
          SendOn: {
            day: Day,
            mintues: Minutes,
            hours: Hours,
          }
        });
      }
    })
    MsgInp.current.value = ""
  }
  const DltMsg = () => {
    let SenderMessages = SenderChats[ReceiversIndex].Messages
    SenderMessages.splice(MsgInfo.index, 1)
    console.log(SenderMessages, SenderUsername, ReceiversIndex);
    update(ref(database, `users/${SenderUsername}/Chats/${ReceiversIndex}`), { Messages: SenderMessages })
      .then(() => {
        console.log("Data Updated");
      }).catch((error) => {
        console.log(error);
      })
    ReceiversChats.map((value, index) => {
      if (value.Username === SenderUsername) {
        let ReceiverMessages = ReceiversChats[index].Messages
        ReceiverMessages.splice(MsgInfo.index, 1)
        console.log(ReceiverMessages, value.Username, index);
        update(ref(database, `users/${ReceiverUsername}/Chats/${index}`), { Messages: ReceiverMessages })
          .then(() => {
            setMsgInfo({})
            setMsgInfoShow(false)
          }).catch((error) => {
            console.log(error);
          })
      }
    })
  }
  const EditMsgFunc = () => {
    let SenderMsgs = SenderChats[ReceiversIndex].Messages
    SenderMsgs[MsgInfo.index].Message = MsgInp.current.value
    update(ref(database, `users/${SenderUsername}/Chats/${ReceiversIndex}`), { Messages: SenderMsgs })
      .then(() => {
        console.log("Data Updated");
      }).catch((error) => {
        console.log(error);
      })
    ReceiversChats.map((value, index) => {
      if (value.Username === SenderUsername) {
        let ReceiverMsgs = ReceiversChats[index].Messages
        ReceiverMsgs[MsgInfo.index].Message = MsgInp.current.value
        update(ref(database, `users/${ReceiverUsername}/Chats/${index}`), { Messages: ReceiverMsgs })
          .then(() => {
            setMsgInfo({})
            setEdittingMsg(false)
            MsgInp.current.value = ""
          }).catch((error) => {
            console.log(error);
          })
      }
    })
  }
  const StartNewChat = (username) => {
    if (SenderChats.every(value => value.Username !== username)) {
      var index = 0
      if (!SenderChats == []) {
        index = SenderChats.length
      }
      get(ref(database, `users/${username}`)).then((snapshot) => {
        let Receiver = snapshot.val()
        set(ref(database, `users/${SenderUsername}/Chats/` + index), {
          Username: username,
          Name: Receiver.Name
        });
      })
    }
  }
  const BackFunc = () => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      setChattingAni("chatting-ani-hide z-0")
      setMsgsAni("-z-10")
      setTimeout(() => {
        setChattingAni("max:sm-hidden")
        setMsgsAni("fixed")
        setScroll(true)
        setShowingMsgs(false)
        setReceiverUsername("")
        setReceiversIndex(-1)
        setReceiverAcc({})
        setReceiverIcon("")
        setReceiversChats([])
      }, 800);
    }
  }
  useEffect(() => {
    if (User.Chats) { setScroll(true) }
    else { setScroll(false) }
    const SenderInterval = setInterval(() => {
      get(child(ref(database), `users/${User.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
          let Sender = snapshot.val()
          setUser(Sender)
          localStorage.setItem("UserObj", JSON.stringify(Sender))
          if (Sender.Chats) {
            setSenderChats([...Sender.Chats])
          }
          setSenderUsername(Sender.Username)
        }
      })
    }, 1000);
  }, [])
  return (
    <div className='w-full h-screen'>
      <MainBg></MainBg>
      <div className='w-full px-2- flex h-full flex-row justify-between max-sm:justify-center mt-24 overflow-hidden'>
        <div className={`sm:w-1/3 w-11/12 h-3/4 bg-white flex-col gap-2 p-2 fixed ${MsgsAni} ${Scroll ? "overflow-scroll" : ""}`}>
          <h1 className='font-bold text-lg text-center'>{User.Username}
            <button onClick={() => {
              setScroll(!Scroll)
              setSearchBar(!SearchBar)
              setSearchArray([])
            }} className='float-right font-extrabold'><i className={SearchBar ? "bi bi-x-lg" : "bi bi-search"}></i></button></h1><hr />
          {SearchBar ?
            <div className='bg-gray-200 h-3/4 p-3 flex flex-col absolute w-full top-12 right-0.5 m-auto'>
              <div className='w-full flex flex-row border-2 border-black' >
                <input type="search" className='w-5/6 border-r-2 border-black p-2' placeholder='Search Username' onInput={() => {
                  setSearchArray([])
                  setSearchNotFound(false)
                }} ref={SearchInp} />
                <button className='w-1/6  text-blue-600 font-extrabold text-lg border-l-2 border-black' onClick={() => { SearchFunc() }}><i className="bi bi-search"></i></button>
              </div>
              {!SearchArray[0] ?
                <div className='flex justify-center h-1/2 m-auto items-center w-full p-2 text-center'>
                  <h1 className='font-bold text-md'>{SearchNotFound ? "No User Found For This Keyword" : "Searched Users Will Display Here"}</h1>
                </div>
                :
                <div className='border-t-2 border-white w-full flex flex-col gap-2 p-2'>
                  {SearchArray.map((value, index) => {
                    let username = value.Username
                    let char = username[0]
                    return (
                      <div key={index} className='w-full gap-3 flex flex-row p-2 bg-white justify-between'>
                        <div className='bg-green-500 border-2 border-gray-300 flex items-center justify-center shadow-sm shadow-black rounded-full w-10 h-10'>
                          <h1 className='text-white font-bold text-lg w-full text-center '>{char}</h1>
                        </div>
                        <div className='flex flex-col w-2/3'>
                          <h2 className='text-md font-bold'>{value.Username}</h2>
                          <h2 className='text-gray-500 text-sm font-semibold'>{value.Name}</h2>
                        </div>
                        <button onClick={() => {
                          ChatStartFunc(value.Username)
                          StartNewChat(value.Username)
                        }} className='text-blue-600 font-bold p-2'>Chat</button>
                      </div>
                    )
                  })}
                </div>
              }
            </div> :
            <div></div>
          }
          <h1 className='font-bold'>Messages</h1>
          {User.Chats ?
            <div className='w-full flex flex-col'>
              {User.Chats.map((value, index) => {
                let Name = value.Name
                var Messages = ""
                var MsgLastIndex = -1
                if (value.Messages) {
                  Messages = value.Messages
                  MsgLastIndex = Messages.length - 1
                }
                return (
                  <div key={index} className={`w-full gap-3 flex flex-row p-2 ${value.Username === ReceiverAcc.Username ? "bg-blue-300" : ""} `} onClick={() => {
                    ChatStartFunc(value.Username, index)
                  }} >
                    <div className='bg-green-500 border-2 border-gray-300 flex items-center justify-center shadow-sm shadow-black rounded-full w-10 h-10'>
                      <h1 className='text-white font-bold text-lg w-full text-center '>{Name.slice(0, 1)}</h1>
                    </div>
                    <div className='flex flex-col'>
                      <h2 className='text-md font-bold'>{value.Username}</h2>
                      <h2 className='text-gray-500 text-sm font-semibold'>{
                        (Messages !== "" ? (Messages[MsgLastIndex].type === "Send" ? <span>You : </span> : <span>{value.Name} :</span>) : <span></span>)}{Messages !== "" ? Messages[MsgLastIndex].Message : ""}</h2>
                    </div>
                  </div>
                )
              })}
            </div>
            : <div className='w-full m-auto text-center h-1/2 flex justify-center items-center flex-col p-5 gap-2 bg-white'>
              <h1 className='text-md text-gray-500 font-semibold'>Oops....! You have no messages search Users to chat</h1>
              <button className='text-md text-white font-bold rounded-lg bg-blue-600 p-2' onClick={() => {
                setScroll(!Scroll)
                setSearchBar(!SearchBar)
                setSearchArray([])
              }}>Search</button>
            </div>
          }
        </div>
        <div className={`w-11/12 sm:w-3/5 sm:fixed h-3/4 left-custom  bg-white ${ChattingAni}`}>
          {ShowingMsgs ?
            <div className='w-full h-full flex flex-col-reverse p-3 gap-3'>
              <div className='flex flex-row w-full text-lg'>
                <input type="text" placeholder='Type Message' className='w-5/6 p-2 border-2 border-r-0 border-black rounded-l-lg ' ref={MsgInp} />
                <button className='w-1/6 border-2 border-l-0 border-black rounded-r-lg' onClick={() => {
                  { !EdittingMsg ? SendMessageFunc() : EditMsgFunc() }
                }} >
                  <i className="bi bi-send text-2xl text-blue-600 font-extrabold"></i></button>
              </div>
              {EdittingMsg ?
                <div className='w-full flex flex-row bg-gray-300 p-5 justify-between text-lg font-semibold'>
                  <h1 >Editting Message</h1>
                  <h1 onClick={() => {
                    setEdittingMsg(false)
                    MsgInp.current.value = ""
                  }}><i className="bi bi-x-lg"></i></h1>
                </div>
                : <div></div>}
              <div className='w-full h-fit gap-1 max-h-96 overflow-y-scroll flex flex-col' ref={ScrollRef}>
                {MsginfoShow ?
                  <div className='w-1/4 h-fit p-3 flex flex-col bg-gray-300 shadow-md shadow-black gap-2 rounded-lg fixed top-1/4 left-1/2 font-bold'>
                    <h1 className='font-bold text-xl w-fit ml-auto ' onClick={() => {
                      setMsgInfoShow(false)
                      setMsgInfo({})
                    }}><i className="bi bi-x-lg"></i></h1>
                    <h1 className='text-gray-400'>
                      {`${MsgInfo.SendOn.hours} : ${MsgInfo.SendOn.minutes} ${MsgInfo.SendOn.day}`}
                    </h1><hr className='border-black' />
                    {MsgInfo.type === "Send" ?
                      <div className='flex flex-col gap-2 '>
                        <h1 className='text-green-700' onClick={() => {
                          MsgInp.current.focus()
                          MsgInp.current.value = MsgInfo.Message
                          setEdittingMsg(true)
                          setMsgInfoShow(false)
                        }}>Edit <i className="bi bi-pencil-square text-lg font-extrabold"></i></h1><hr className='border-black' />
                        <h1 className='text-red-700' onClick={() => { DltMsg() }} >Delete <i className="bi bi-trash text-lg font-extrabold"></i></h1>
                      </div>
                      :
                      <div></div>
                    }
                  </div>
                  :
                  <div></div>
                }
                {SenderChats.map((value, index) => {
                  if (value.Username === ReceiverAcc.Username) {
                    return (
                      <div>
                        {value.Messages ?
                          value.Messages.map((msg, msgindex) => {
                            return (
                              <div key={msgindex} onClick={() => {
                                setMsgInfoShow(true)
                                setMsgInfo({ ...msg, index: msgindex })
                                setReceiversIndex(index)
                              }} className={`${msg.type === "Received" ? "mr-auto rounded-r-xl  bg-gray-400" : "ml-auto bg-blue-500 rounded-l-xl"} p-2 w-fit text-white font-semibold text-md rounded-t-xl`}>
                                <h1 >{msg.Message}</h1>
                              </div>
                            )
                          })
                          : <div></div>}
                      </div>
                    )
                  }
                })}
              </div>
              <div className='w-full h-fit mb-auto flex flex-row items-center gap-3'>
                <i class="bi bi-arrow-left text-2xl font-bold text-black" onClick={() => { BackFunc() }}></i>
                <div className='bg-green-500 border-2 border-gray-300 flex items-center justify-center shadow-sm shadow-black rounded-full w-10 h-10'>
                  <h1 className='text-white font-bold text-lg w-full text-center'>{ReceiverIcon}</h1>
                </div>
                <h1 className='font-bold text-lg'>{ReceiverAcc.Name}</h1>
              </div>
            </div>
            :
            <div className='w-full p-3 h-full flex flex-col justify-center items-center'>
              <h1 className='text-5xl font-bold'><i className="bi bi-chat-left-dots"></i></h1>
              <h1 className='text-xl font-bold text-blue-600'>Your Messages</h1>
              <h1 className='text-lg font-semibold text-gray-500'>Send a messages to start a chat</h1>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ChattingPage
