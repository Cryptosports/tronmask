// To do : need to update the nodes
export default {
    networks: [
        {
            id: 1,
            name: 'Mainnet',
            url: 'https://api.tronscan.org',
            fullNode: 'http://api.trondapps.org',
            solidityNode: 'http://api.trondapps.org',
            eventServer: 'http://api.trondapps.org',
            type: 'mainnet'
        },
        {
            id: 2,
            name: 'Testnet',
            url: 'https://testapi.tronscan.org',
            fullNode: 'https://api.shasta.trongrid.io',
            solidityNode: 'https://api.shasta.trongrid.io',
            eventServer: 'https://api.shasta.trongrid.io',
            type: 'testnet'
        }
    ]
}
