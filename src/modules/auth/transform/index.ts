import { isEmpty } from 'lodash';

export const transformAuth = (data: any) => {
  let response: any = {};

  if (!isEmpty(data)) {
    response = data.toJSON();
    response.id = data._id;

    delete response._id;
    delete response.password;

    return response;
  }

  return response;
};
