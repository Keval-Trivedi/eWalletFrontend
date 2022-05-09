
import React from "react";
import axios from "axios";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      wallets:[],
      id:0,
      name:'',
      balance:''
    }
  }

  refreshList(){
    axios.get("http://localhost:8080/api/")
    .then((res)=>{
      const wallets = res.data.map((wallet)=>{
        let walletEntry = wallet;
        walletEntry.moneyToAdd = 0;
        walletEntry.moneyToWithdraw = 0;
        return walletEntry;
      })
      this.setState({
        wallets:wallets,
        id:0,
        name:'',
        balance:''
      })
    })
  }

  componentDidMount(){
    this.refreshList();
  }

  submit(event,id){
    event.preventDefault();
    if(id===0) {
      axios.post("http://localhost:8080/api/",{
        name:this.state.name,
        balance:this.state.balance
      })
      .then((res)=>{
        this.refreshList();
      })
    } else {
      axios.put("http://localhost:8080/api/",{
        id:this.state.id,
        name:this.state.name,
        balance:this.state.balance
      })
      .then((res)=>{
        this.refreshList();
      })
    }
  }

  delete(id){
    axios.delete(`http://localhost:8080/api/${id}`)
    .then(()=>{
      this.refreshList();
    })
  }

  edit(id){
    axios.get(`http://localhost:8080/api/${id}`)
    .then((res)=>{
      this.setState({
        id:res.data.id,
        name:res.data.name,
        balance:res.data.balance
      })
    })
  }

  addMoney(id){
    const wallet = this.state.wallets.find((wallet)=>{
      return wallet.id === id;
    })

    const money = wallet.moneyToAdd;

    axios.post(`http://localhost:8080/api/add/${id}/${money}`)
    .then(()=>{
      this.refreshList();
    })
  }

  withdrawMoney(id){
    const wallet = this.state.wallets.find((wallet)=>{
      return wallet.id === id;
    })

    const money = wallet.moneyToWithdraw;
    axios.post(`http://localhost:8080/api/withdraw/${id}/${money}`)
    .then((res)=>{
      if(res.data === 'Success'){
        this.refreshList();
      } else {
        alert(res.data);
      }
    })
  }

  changeMoneyToAdd(id, money) {
    const wallets = this.state.wallets.map((wallet)=>{
      if(id === wallet.id) {
        let walletEntry = wallet;
        walletEntry.moneyToAdd = money;
        walletEntry.moneyToWithdraw = 0;
        return walletEntry;
      } else {
        return wallet;
      }
    })
    this.setState({
      wallets:wallets,
      id:0,
      name:'',
      balance:''
    })
  }

  changeMoneyToWithdraw(id, money) {
    const wallets = this.state.wallets.map((wallet)=>{
      if(id === wallet.id) {
        let walletEntry = wallet;
        walletEntry.moneyToAdd = 0;
        walletEntry.moneyToWithdraw = money;
        return walletEntry;
      } else {
        return wallet;
      }
    })
    this.setState({
      wallets:wallets,
      id:0,
      name:'',
      balance:''
    })
  }

  render(){
    return (
      <div className="container">
        <div className="row">
          <div className="cols s6">
            <h5>List Of Existing E-Wallets</h5>
            <div className="input-field col s12">
              <table>
                <thead>
                  <tr>
                      <th>Wallet Id</th>
                      <th>Wallet Name</th>
                      <th>Wallet Balance</th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.wallets.map(wallet=>
                      <tr key={wallet.id}>
                          <td>{wallet.id}</td>
                          <td>{wallet.name}</td>
                          <td>{wallet.balance}</td>
                          <td>
                            <div className="col s18">
                              <input  onChange={(e)=>this.changeMoneyToAdd(wallet.id, e.target.value)} value={wallet.moneyToAdd} className="col s20" type="text" />
                              <button onClick={(e)=>this.addMoney(wallet.id)} className="btn waves-effect waves-light" >Add
                                <i className="material-icons right">add</i>
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className="col s18">
                              <input onChange={(e)=>this.changeMoneyToWithdraw(wallet.id, e.target.value)} value={wallet.moneyToWithdraw} type="text" className="autocomplete" />
                                <button onClick={(e)=>this.withdrawMoney(wallet.id)} className="btn waves-effect waves-light" >Withdraw
                                  <i className="material-icons right">remove</i>
                                </button>
                            </div>
                          </td>
                          <td>
                            <div className="col s18">
                                <button onClick={(e)=>this.delete(wallet.id)} className="btn waves-effect waves-light" >Delete
                                  <i className="material-icons right">delete</i>
                                </button>
                            </div>
                          </td>
                      </tr>
                      )
                  }
                </tbody>
              </table>
            </div>
          </div>
          <br></br>
          <h5>Create New E-Wallet</h5>
          <div className="col s6">
            <form onSubmit={(e)=>this.submit(e,this.state.id)}>
              <div className="input-field col s12">
                <i className="material-icons prefix">payment</i>
                <input onChange={(e)=>this.setState({name:e.target.value})} value={this.state.name} type="text" id="autocomlete-input" className="autocomplete"/>
                <label htmlFor="autocomlete-input">Wallet Name</label>
              </div>
              <div className="input-field col s12">
                <i className="material-icons prefix">account_balance</i>
                <input onChange={(e)=>this.setState({balance:e.target.value})} value={this.state.balance} type="text" id="autocomlete-input2" className="autocomplete"/>
                <label htmlFor="autocomlete-input2">Initial Balance</label>
              </div>
              <div className="input-field col s12">
                <button className="btn waves-effect waves-light" type="submit">Add
                  <i className="material-icons right">add</i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } 
}

export default App;
