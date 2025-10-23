import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'
import { encryptData, decryptData } from './../crypto.js'

const STORAGE_DATA_KEY = "user_data"

export const useUserData = defineStore('localUserData', () => {
    const _password = ref <null|string> (null)
    const _seed = ref <null|Uint8Array> (null)

    async function loadDataAsync(): Promise<void> {
        const encDataBase64 = localStorage.getItem(STORAGE_DATA_KEY)
        if (encDataBase64 === null) {
            throw new Error('No data in local storage')
        }
        const encDataBinary = atob(encDataBase64)
        // TODO: Do we need here some transformation before decryptData()?
        const encData = new Uint8Array(encDataBinary.length)
        for(let i = 0; i < encDataBinary.length; i++) {
            encData[i] = encDataBinary.charCodeAt(i)
        }
        if (_password.value === null) {
            throw new Error('Password is not set')
        }
        const dataJson = await decryptData(encData, _password.value)
        const data = JSON.parse(dataJson)
        const seedBinaryStr = atob(data['seed'])
        const seedArray = new Uint8Array(seedBinaryStr.length)
        for(let i = 0; i < seedBinaryStr.length; i++) {
            seedArray[i] = seedBinaryStr.charCodeAt(i);
        }
        _seed.value = seedArray
    }

    function isAuthenticated(): boolean {
        return _password.value !== null && _seed.value !== null;
    }
    
    async function saveDataAsync(): Promise<void> {
        if (_seed.value === null) {
            throw new Error("saveDataAsync expects seed be not null")
        }
        const data = {
            seed: btoa(String.fromCharCode(..._seed.value))
        }
        const dataJson = JSON.stringify(data)
        if (_password.value === null) {
            throw new Error('Password is not set')
        }
        const encData = await encryptData(dataJson, _password.value)
        const encDataBase64 = btoa(String.fromCharCode(...encData))
        localStorage.setItem(STORAGE_DATA_KEY, encDataBase64)
    }

    function hasStorageData(): boolean {
        return localStorage.getItem(STORAGE_DATA_KEY) !== null
    }

    function deleteStorageData(): void {
        localStorage.removeItem(STORAGE_DATA_KEY)
        _seed.value = null
        _password.value = null
    }

    const password = computed(() => {
        return _password.value
    })

    const seed = computed(() => {
        return _seed.value
    })

    function setPassword(pwd: null | string): void {
        _password.value = pwd;
    }

    async function setSeedAsync(seed: Uint8Array): Promise<void> {
        _seed.value = seed;
        await saveDataAsync()
    }

    return {
        password,
        seed,
        setPassword,
        setSeedAsync,
        saveDataAsync,
        loadDataAsync,
        deleteStorageData,
        isAuthenticated,
        hasStorageData,
    }
})

export const useAuthUserData = defineStore('localAuthUserData', () => {
    const _userData = useUserData()
    const seed = computed(() => {
        if (!_userData.seed) {
            throw new Error('User seed is not set')
        }
        return _userData.seed
    })
    return {
        seed
    }
})

// HRM
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserData, import.meta.hot))
    import.meta.hot.accept(acceptHMRUpdate(useAuthUserData, import.meta.hot))
}
