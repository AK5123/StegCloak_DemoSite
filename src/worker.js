export default () => {
    self.importScripts(self.origin+'/bundle.js'); // eslint-disable-line no-restricted-globals
    
    self.addEventListener("message", e => {// eslint-disable-line no-restricted-globals
        let res = e.data;
    if(res.enc){
        let StegCloak = new self.StegCloak(res.encrypt,res.hmac); // eslint-disable-line no-restricted-globals
        let emsg = StegCloak.hide(res.data.message,res.data.key,res.data.cover)
        postMessage({enc:true,emsg})
    }else{
        let StegCloak = new self.StegCloak(); // eslint-disable-line no-restricted-globals
        let pass;
        try{
             pass = StegCloak.reveal(e.data.dmsg,e.data.pass)
        }catch(err){
             pass = err
        }
        console.log("reveal",pass)
        postMessage({enc:false,pass})
    }
     
    });
  };

