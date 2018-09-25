import TronWeb from 'TronWeb'
import store from '../popup/store'

export default function tronWeb() {
    return new TronWeb(
        store.state.network.fullNode,
        store.state.network.solidityNode,
        store.state.network.eventServer
    )
}
