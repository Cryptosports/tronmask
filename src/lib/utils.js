import { Transaction } from '@tronscan/client/src/protocol/core/Tron_pb'
import store from '../popup/store';

let contractTypes = {}

for (let key of Object.keys(Transaction.Contract.ContractType)) {
    contractTypes[Transaction.Contract.ContractType[key]] = key
}

export const CONTRACT_TYPES = contractTypes

export function getTokenAmount(rawAmount, precision = 6) {
    return rawAmount / Math.pow(10, precision)
}

export function getTokenRawAmount(amount, precision = 6) {
    return amount * Math.pow(10, precision)
}

export function getTronScanLink(path) {
    const domain = (store.state.network.type === 'mainnet') ? 'https://tronscan.org/#/' : 'https://shasta.tronscan.org/#/'

    return domain + path
}
