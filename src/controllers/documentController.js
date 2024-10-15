import { onSuccess } from '../utils/index.js';

export const getDocument = (req, res) => {
    return onSuccess(res, 200, "realtime-doc server gate.");
};
