import { isEmpty } from 'lodash';

export const transformMessage = (data: any) => {
  let response: any = {};

  if (!isEmpty(data)) {
    response = data.toJSON();
    response.id = data._id;

    delete response._id;

    return response;
  }

  return response;
};
