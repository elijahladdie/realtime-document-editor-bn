export const onSuccess = (res, status_code = 200, status_msg, data, ) => {
   return res.status(200).json({
    status_code,
    status_msg,
    data,
  });
};

export const onError = (res, status_code, status_msg, data) => {
  return res.status(200).json({ 
    status_code,
    status_msg,
    data
  });
};

export const onServerError = (res) => {
  return res.status(500).json({
    status_code: 500,
    status_msg: res.__('Internal Server Error'),
  });
};