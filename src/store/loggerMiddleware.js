const loggerMiddleware = (store) => (next) => (action) => {
    console.log('Dispatching action:', action);
    const result = next(action);
    console.log('State after action:', store.getState());
    return result;
  };
  
  export default loggerMiddleware;