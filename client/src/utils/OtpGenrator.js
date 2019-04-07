const SendOtp = require('sendotp')
const sendOtp = new SendOtp('269401AbIEOvkX5c9a54d1')

// function for sending the otp to the given mobilr number
export const otpSender = (mobile, userId) => {

    return new Promise((resolve, reject) => {

        sendOtp.setOtpExpiry('3')
        sendOtp.send("91" + mobile, userId, (error, data) => {
        
            if(data.type === "success") resolve(data)
    
            if(error) reject(error)  
    
          });

    })

  }

//function for verifying the otp.
export const otpVerifier = (mobile, otp) => {
    
    return new Promise((resolve, reject) => {
      
        sendOtp.verify("91" + mobile, otp, function (error, data) {

            if(data.type === 'success') resolve(data)
            
            if(data.type === 'error') reject(error)
          })
    })

  }