import TronWeb from 'tronweb'
import store from '../popup/store'

export default function tronWeb() {
    return new TronWeb(store.state.network.fullnode)
}
