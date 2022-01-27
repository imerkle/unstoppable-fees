
import './App.css';
import UAuth from '@uauth/js';
import React from 'react'
import { getTxs } from './fees';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      o: null,
    };
    this.uauth = new UAuth({
      clientID: 'f4TYKu6JhxiInJcoFRXeYjmxm1XwLn28QxCP0AtWbUs=',
      clientSecret: 'Mc91WArqMvBz641EuNPiB0nNDjh3qkspW9Z3SN+Z0Dc=',
      redirectUri: 'https://unstoppable-fees.vercel.app/callback',

      // Must include both the openid and wallet scopes.
      scope: 'openid wallet',
    })
    this.uauth.user().then(async (user) => {
      var o = await getTxs(user.wallet_address)
      this.setState({ user, o })
    })
  }




  handleLogin = () => {
    if (this.state.user) return;
    this.setState({ loading: true })
    this.uauth
      .loginWithPopup()
      .then(() => {
        this.uauth.user().then((user) => {
          this.setState({ user })
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }




  render() {
    //console.log(this.state.user) //​ {wallet_address sub}
    if (this.state.user) {
      var o = this.state.o;
      return (
        <div>
          < p > You've spent <span id="gasFeeTotal">{o.gasFeeTotalStr}</span> on gas. Right now, that's < span id="tokenusd" > {o.tokenusdStr}</span >.</p >
          <p>You used <span id="gasUsedTotal">{o.gasUsedTotalStr}</span> gas to send <span id="nOut">{o.nOut}</span> transactions, with an average price of <span id="gasPricePerTx">{o.gasPricePerTxStr}</span> gwei.</p>
          <p><span id="nOutFail">{o.nOutFail}</span> of them failed, costing you <span id="gasFeeTotalFail">{o.gasFeeTotalFailStr}</span>.</p>
        </div >
      );
    } else {
      return (
        <div>
          <button onClick={() => { this.handleLogin() }}> Login with Unstoppable</button>
        </div>
      );
    }
  }
}


export default App;
