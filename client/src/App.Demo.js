//--------------------------------- Example Funcitons for testing the functionality------------------

  //function for calling the view function of the smart contract
  countOrganizer = async() => {

    const {contract, acc} = this.state;

    await contract.methods.getOrganizer(acc).call()
    .then(console.log)
    .catch(console.log);

    console.log("HEllo Updated");

  }

  //function for send the transaction or calling the non-view function of Smart Contract
  Organizer = async() => {

    const {contract } = this.state;

    await contract.methods.addOrganizer("Prateek","Indore",6987451235).send({from: '0xB18DFE177bd96c229D5e0E6D06446Ff0eF825B13',gas:6721975})
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((error) => {
      console.log(error);
    });

  }

  //onSubmit function for IPFS posting data from the frontend
  onSubmit = async(event) => {
    event.preventDefault();

    const file = {
      name:"prateek",
      age:21,
      address:"Samajwad nagar, Indore",
      city:"Indore",
      company:"Calsoft"
    };

    //for converting JSON object to string and then to buffer 
    const buffer = Buffer.from(JSON.stringify(file));
    console.log(buffer);

    //for converting buffer object to string and then convert back it to the JSON object
    const val = JSON.parse(buffer.toString());
    console.log(val);


    //save document to IPFS,return its hash#, and set hash# to state
    await ipfs.add(buffer, (err, ipfsHash) => {
      console.log(err,ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash
      this.setState({ ipfsHash:ipfsHash[0].hash });
    })
  };

  //Calling fucntion for fetching the data from the IPFS and convert back it to the JSON
  seek = async() => {
    const {ipfsHash} = this.state;

    console.log(ipfsHash);

    //GET call for ipfshash to data
    await fetch(`https://ipfs.io/ipfs/${ipfsHash}`)
    .then(res => res.json())
    .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      )
  }

  //Creation function for creating the new account then recharging it then send transaction.
  createAcc = async() => {
    
    const {contract, web3, accounts} = this.state;
    
    let acc;

    // create new ethereum account with password 
    await web3.eth.personal.newAccount("hellotest")
    .then( (res) => {acc = res});

    console.log(acc);

    //store the account address in the state
    this.setState({acc});

    // trasaction for recharging the new account
    await web3.eth.sendTransaction({
      from : accounts[0],
      to : acc,
      value: web3.utils.toWei("0.5", "ether")
    }).then(console.log);

    // console the current balance of new account
    web3.eth.getBalance(acc)
    .then((res)=> console.log(web3.utils.fromWei(res, 'ether')));

    // transaction for UNLOCK the account
    await web3.eth.personal.unlockAccount(acc,"hellotest",600)
    .then(console.log("Unlock"));

    // send the new transaction from the new account
    await contract.methods.addOrganizer("Madhur","Indore",6598451235).send({from: acc,gas:6721975})
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((error) => {
      console.log(error);
    });
    

  }

//----------------------------- Ending the Testing Functions-------------------------------------------
