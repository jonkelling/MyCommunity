export default (store) => (next) => (action) => {
    try {
        console.log(JSON.stringify(action));
        // console.warn(`ACTION: ${JSON.stringify(action)}`);
    }
    catch (e) {
        console.log(e);
        // console.warn(`ACTION: ${action}`);
    }
    return next(action);
};
