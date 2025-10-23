class BasisClient {
    baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async getKeyStatus(pubKey: Uint8Array): Promise<object> {
        const url = this.baseUrl + "/key-status/" + Buffer.from(pubKey).toString("hex")
        try {
            const res = await fetch(url)
            const data = await res.json()
            return data
        } catch(error: unknown) {
            console.log('BasisClient/getKeyStatus: network error=', error)
            throw error;
        }
    }

    async getReserves(pubKey: Uint8Array): Promise<object> {
        const url = this.baseUrl + "/reserves/issuer/" + Buffer.from(pubKey).toString("hex")
        try {
            const res = await fetch(url)
            const data = await res.json()
            return data
        } catch(error: unknown) {
            console.log('BasisClient/getReserves: network error=', error)
            throw error;
        }
    }

    async getRecentTrackerEvents(): Promise<object> {
        const url = this.baseUrl + "/events"
        try {
            const res = await fetch(url)
            const data = await res.json()
            return data
        } catch(error: unknown) {
            console.log('BasisClient/getRecentTrackerEvents: network error=', error)
            throw error;
        }
    }

    async getNotesByIssuer(pubKey: Uint8Array): Promise<object> {
        const url = this.baseUrl + "/notes/issuer/" + Buffer.from(pubKey).toString("hex")
        try {
            const res = await fetch(url)
            const data = await res.json()
            return data
        } catch(error: unknown) {
            console.log('BasisClient/getNotesByIssuer: network error=', error)
            throw error;
        }
    }

    async createNote(skBytes: Uint8Array, pkBytes: Uint8Array, targetAddress: string, amount: float): Promise<object> {
        console.log("basisClient/createNote: TO BE DONE")
        return {}
    }
}

export default function useBasisClient() {
    const BASIS_SERVER_BASE_URL = "http://213.239.193.208:3001"
    const bClient = new BasisClient(BASIS_SERVER_BASE_URL)
    return bClient
}
