import React, { Component } from 'react'
import "./vendor/bootstrap/css/bootstrap.min.css"
import "./fonts/iconic/css/material-design-iconic-font.min.css"
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "./vendor/css-hamburgers/hamburgers.min.css"
import "./vendor/animate/animate.css"
import "./vendor/select2/select2.min.css"
import "./vendor/animsition/css/animsition.min.css"
import "./vendor/daterangepicker/daterangepicker.css"
import "./css/util.css"
import "./css/main.css"
import main from "./js/main.js"
import worker from './worker.js'
import WebWorker from './workerSetup'
import cog from './images/cogwheels.svg'
import GitHubButton from 'react-github-btn'
// import you from "./images/youtube_social_icon_dark.png"
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            esecret:"World is gonna end!!",
            epass:"",
            encrypt: true,
            hmac: false,
            emsg:"This is a confidential message.",
            rmsg: "",
            dpass:"",
            dmsg:"",
            dsecret:"Secret",
            msgbox:"MESSAGE *",
            btn:"Hide",
            progress:false,
            err:""
        }
      }
    componentDidMount(){
        this.worker = new WebWorker(worker);
        main()
    }
    hidemsg = (e) => {
        
        var {esecret,epass,emsg,hmac,encrypt} = this.state
        if(epass == "" && encrypt ){
            let pass = document.getElementById("password")
            pass.setCustomValidity("Please add password, else uncheck encrypted")
            return
        }
        if( !emsg.includes(" ") || (emsg.includes(" ") && emsg.split(" ")[1].length == 0)){
            let msg = document.getElementById("message")
            msg.setCustomValidity("Cover message should contain at least 2 words!")
            return
        }
        e.preventDefault();
        if(this.state.btn == "Hide"){
            let data = {}
            data["message"] = esecret
            data["key"] = epass
            if(!emsg.includes(" ")){
                emsg =  emsg+" "
            }
            data["cover"] = emsg
            this.worker.postMessage({"enc":true,data,hmac,encrypt})
            this.setState({progress:true})
            this.worker.addEventListener("message",(e) => {
                if(e.data.enc){
                    let hidden = e.data.emsg
                    this.setState({rmsg:hidden,btn:"Clear",progress:false})
                 
                }
            })
        }else{
            this.setState({btn:"Hide",rmsg:"",emsg:""})
        }
        

    }
    demsg = (e) =>{
        e.preventDefault()
        this.worker.postMessage({"enc":false,dmsg:this.state.dmsg,pass:this.state.dpass})
        this.worker.addEventListener("message",(e) => {
            if(!e.data.enc){
                this.setState({dsecret:e.data.pass})
            }
        })
    }
    copyClip = (e) => {
        e.preventDefault()
        let clip = document.getElementById("res")
        clip.select()
        clip.setSelectionRange(0, 99999);
        document.execCommand("copy")
    }
    docs = (cl) =>{
        return document.querySelector(cl)
    }
    retRes = () =>{
        return(
            <div style={{width:"inherit"}}>
                <div className="flex-sb label-input100">
                <label className="" htmlFor="res">stegcloaked message*</label>
                <button style={{width:"20px",height:"25px"}} 
                    onMouseEnter={()=> this.docs(".copy").style.opacity = 1 } 
                    onMouseLeave={()=> this.docs(".copy").style.opacity = 0} id="clip" className="m-l-10 " 
                    onClick={(e) => this.copyClip(e)}><svg aria-hidden="true"  data-prefix="far" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg>
                </button>
                  <div className="copy">
                  <span >Copy to Clipboard</span>
                  </div>
                </div>
                <div style={{marginBottom:"15px"}} className="wrap-input100 ">
                     <textarea id="res" className="input100" name="message" value={this.state.rmsg} readOnly={true}></textarea>
                    <span className="focus-input100"></span>
                </div>
                <p className="d-input100">Copy and paste this anywhere.....</p>
            </div>

        )
    }
    retBtn = () => {
        return(
            <div className="container-contact100-form-btn m-b-25">
                <button className="contact100-form-btn validate-form" onClick={(e) => this.hidemsg(e)}>
                    <span>
                        {this.state.btn}
                        <i className="zmdi zmdi-arrow-right m-l-8"></i>
                    </span>
                </button>
            </div>
        )

    }


    render(){
        return(
                <div className="container-contact100">
                     <a href="https://github.com/KuroLabs/stegcloak" className="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style={{fill:"#151513",color:"#fff",position: "absolute",top: 0,border: 0, right: 0,zIndex:1}} aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{transformOrigin: "130px 106px"}} className="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path></svg></a>
                     <div style={{position: 'relative'}} className="wrap-contact100" >
                       <div style={{position: 'absolute',top:"5px",left:"5px"}}>
                       <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-text="How to Hide Secrets in Strings— Modern Text hiding in JavaScript: https://github.com/KuroLabs/stegcloak" data-show-count="true" data-url="https://blog.bitsrc.io/how-to-hide-secrets-in-strings-modern-text-hiding-in-javascript-613a9faa5787">Tweet</a>
                        <span style={{marginLeft:"5px"}}>
                        <GitHubButton   href="https://github.com/kurolabs/stegcloak" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-icon="octicon-star" aria-label="Star kurolabs/stegcloak on GitHub">Star</GitHubButton>
                        </span>
                       </div>  
                       <form  className="contact100-form validate-form">
                            <div  style={{width:"100%",textAlign:"center"}} className="">
                                <div>
                                    <img src="https://camo.githubusercontent.com/ccd43eae8216ef432b9d07413e0f7093cfa69317/68747470733a2f2f696d6167652e666c617469636f6e2e636f6d2f69636f6e732f7376672f323833342f323833343738342e737667" alt="stegcloak"  style={{maxWidth:"100px",width:"100px"}} />
                                    <span className="p-t-15 p-l-10 steg">
                                         Steg Cloak
                                    </span>
                                </div>   
                            </div> 
                            <p className=" p-input100 text-center m-t-35"> HIDE </p>
                            <hr className="hr-input100 m-t-2"/> 
                            <div className="rs1 next">
                                <label className="fs-18 text-center p-b-11" htmlFor="first-name">Secret </label>
                                <div className="wrap-input100 validate-input">
                                    <input id="first-name" className="input100 text-center" type="password" name="first-name" placeholder="World is gonna end!!" 
                                    onChange={(e) => this.setState({esecret:e.target.value})}/>
                                    <span className="focus-input100"></span>
                                </div>
                            </div>
                            <div className="rs1 next">
                            <label className="fs-18 text-center p-b-11" htmlFor="password">PASSWORD</label>
                            <div className="wrap-input100  validate-input">
                                <input id="password"className="input100 text-center" required="required" type="text" disabled={!this.state.encrypt} name="password" placeholder="Password" 
                                 onChange={(e) => this.setState({epass:e.target.value})}/>
                                <span className="focus-input100"></span>
                            </div>    
                            </div>

                            <div  style={{cursor:"pointer",textAlign:"left"}} id="adv1">
                            <img className=" m-b-5" src={cog} alt="Extra" style={{width:"20px"}}/>
                            <span style={{fontSize:"18px",fontFamily:"Raleway-SemiBold"}} className=" m-t-15" id="adv"> Advanced </span>
                            </div>
                            <div className="flex-sa label-input100 cus" id="option">
                                <div className=" m-t-15">
                                <label style={{float:"left"}} className="m-r-10" htmlFor="myCheck" >ENCRYPTED</label>
                                <input style={{float:"left",width:"18px",height:"18px"}} className="m-t-5" type="checkbox" defaultChecked="checked" id="myCheck"
                                       onClick={() => this.setState({encrypt: !this.state.encrypt})}/>
                                </div>
                                <div className=" m-t-15">
                                    <label style={{float:"left"}} className="m-r-10 " htmlFor="myCheck1">HMAC</label>
                                    <input style={{float:"left",width:"18px",height:"18px"}} className="m-t-5" type="checkbox" id="myCheck1"
                                        onClick={() => this.setState({hmac: !this.state.hmac})}/>

                                </div>
                            
                            </div>
                            <label className=" label-input100 m-t-10 " htmlFor="message">MESSAGE</label>
                            <div className="wrap-input100 validate-input">
                                <textarea id="message" className="input100" name="message" placeholder="This is a confidential message."
                                  onChange={(e) => this.setState({emsg:e.target.value})} value={this.state.emsg}></textarea>
                                <span className="focus-input100"></span>
                            </div>

                            {this.retBtn()}
                            {/* {(this.state.progress)?this.retProg():this.retBtn()} */}
                            {(this.state.btn === "Clear")? this.retRes() : null}

                            <p className=" p-input100 text-center m-t-35">REVEAL </p>
                            <hr className="hr-input100 m-t-2"/>
                            <div className="label-input100 flex-sa"></div>
                            <label className="label-input100 m-l-2" htmlFor="pass">PASSWORD</label>

                            <div className="wrap-input100 ">
                                <input id="pass" className="input100" type="text" name="first-name" placeholder="Password" 
                                  onChange={(e) => this.setState({dpass:e.target.value})}/>
                                <span className="focus-input100"></span>
                            </div>
                            <label className=" label-input100 m-l-2" htmlFor="mess">Stegcloaked Message *</label>
                            <div className="wrap-input100 ">
                                <textarea id="mess" className="input100" name="mess" placeholder="Please enter your Encrypted Message"
                                  onChange={(e) => this.setState({dmsg:e.target.value})}></textarea>
                                <span className="focus-input100"></span>
                            </div>
                            <div className="container-contact100-form-btn">
                                <button className="contact100-form-btn" onClick={(e) => this.demsg(e)}>
                                    <span>
                                        Get Secret
                                        <i className="zmdi zmdi-arrow-right m-l-8"></i>
                                    </span>
                                </button>
                            </div>
                            <label className=" label-input100 m-l-2 m-t-10" >Your Secret</label>
                            <p className=" p-input100 text-center m-t-10"><i> {"/"+this.state.dsecret +"/"} </i></p>

                        </form>
                   </div>
                 </div>
        )
    }
}

export default App