
export const types = {
    SET_DATABASE: 'SET_DATABASE',
}

export const setDatabase = (newDatabase) => ({
    type: types.SET_DATABASE,
    payload: { newDatabase }
})
