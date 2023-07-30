import React, {createContext} from 'react'

const Context = createContext({
    isAuthenticated: false,
    userId: null,
    updateAuth: () => {},
    updateUserId: () => {},
});

export default Context;
