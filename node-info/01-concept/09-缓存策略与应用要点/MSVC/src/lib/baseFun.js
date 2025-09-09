

function setResInfo(ctx, ret, message, dataInfo, httpStatus = 200) {
  let retInfo = {};

  if(!ret) {
    retInfo = {
      'ret': -1,
      'message': message ? message : 'success',
      'data': dataInfo ? dataInfo : {}
    }
  } else {
    retInfo = {
      'ret': 0,
      'message': message ? message : 'success',
      'data': dataInfo ? dataInfo : {}
    }
  }

  ctx.response.type = 'text/plain';
  ctx.response.status = httpStatus;
  ctx.response.body = JSON.stringify(retInfo);
  return;
}

module.exports = {
  setResInfo
}