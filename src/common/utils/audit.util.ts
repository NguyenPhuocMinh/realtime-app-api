import { isEmpty } from 'lodash';
import { FilterQuery } from 'mongoose';
import { DEFAULT_SKIP, DEFAULT_LIMIT, DEFAULT_SORT } from '../../constants';

import { QueryDto, PaginationDto } from './dto';

export const filterPage = (queryDto: QueryDto, queryFields?: any) => {
  const { _search } = queryDto;

  const filter: FilterQuery<any> = {
    $and: [
      {
        deleted: false,
      },
    ],
  };

  if (!isEmpty(queryFields)) {
    filter['$and'].push(...queryFields);
  }

  return filter;
};

export const paginationPage = (paginationDto: PaginationDto) => {
  const { _start, _end, _sort, _order } = paginationDto;

  const skip = _start || DEFAULT_SKIP;
  const limit = _end || DEFAULT_LIMIT - skip;

  const sort = !isEmpty(_sort) ? _sort : DEFAULT_SORT;
  const order = !isEmpty(_order) && _order === 'ASC' ? -1 : 1;

  const sortOrder = {
    [sort]: order,
  };

  return {
    skip,
    limit,
    sortOrder,
  };
};
