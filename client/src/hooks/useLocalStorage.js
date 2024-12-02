export const useLocalStorage = () => {
    const Get = (name) => {
        return localStorage.getItem(name)
    }
    const Set = (key, value) => {
        localStorage.setItem(key, value)
    }
    const Delete = (name) => {
        localStorage.removeItem(name)
    }
    const Clear = () => {
        localStorage.clear()
    }
    return { Get, Set, Delete, Clear }
}