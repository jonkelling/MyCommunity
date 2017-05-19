export default (store) => (next) => (action) => {
    try {
        console.log(JSON.stringify(action));
    }
    catch (e) {
        console.log(action);
    }
    return next(action);
};
