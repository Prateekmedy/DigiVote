import ipfs from './ipfs'

// function for sending any file into IPFS and returns the hash.
export const ipfsSender = (file) => {

    return new Promise((resolve, reject) => {

      let buffer = Buffer.from(JSON.stringify(file))
      ipfs.add(buffer, (err, ipfsHash) => {
        if(ipfsHash){
          resolve(ipfsHash[0].hash)

          //this.setState({ ipfsHash:ipfsHash[0].hash })
        }else{
          reject("something is not good :(" + err);
        }   
      })

    })

  }

//function for fetching the data from the IPFS through the hash.
export const ipfsFetcher = (hash) => {
    
    return new Promise((resolve, reject) => {
      fetch(`https://ipfs.io/ipfs/${hash}`)
      .then(res => res.json())
      .then(
          (result) => {
            if(result){
              resolve(result)
              //this.setState({ipfsData:result})
            } 
          },
          (error) => {
            reject(error)
          }
      )
    })

  }