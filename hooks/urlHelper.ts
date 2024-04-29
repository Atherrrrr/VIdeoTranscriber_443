export const COMMON_PATH: string = '/ams';
export const TABLES_PATH: string = `${COMMON_PATH}/db-config/db-table`;
export const COLUMN_TYPES_PATH: string = `${COMMON_PATH}/db-config/db-column-types`;
export const COLUMNS_PATH: (tableId: string) => string = (tableId) =>
  `${TABLES_PATH}/${tableId}/db-columns`;
export const TABLES_ATTRIBUTES_PATH: (tableId: string) => string = (tableId) => `${TABLES_PATH}/${tableId}`;
export const RELATIONS_PATH: (tableId: string) => string = (tableId) =>
  `${TABLES_PATH}/${tableId}/db-relations`;
export const OBJECT_STRUCTURES_PATH: string =
  `${COMMON_PATH}/db-config/db-object-structure`;
export const OBJECT_STRUCTURES_GENERIC_SEARCH: (parentTableName: string) => string = (parentTableName) =>
  `${COMMON_PATH}/generic/${parentTableName}/search`;
export const CREATE_OBJECT_STRUCTURE_DATA_PATH: (parentTableName: string) => string = (parentTableName) =>
  `${COMMON_PATH}/generic/${parentTableName}/save`;
export const UPDATE_OBJECT_STRUCTURE_DATA_PATH: (parentTableName: string, id: string) => string = (parentTableName, id) =>
  `${COMMON_PATH}/generic/${parentTableName}/${id}/save`;
export const SAVE_BULK_OBJECT_STRUCTURE_DATA_PATH: string = `${COMMON_PATH}/generic/bulk`;
export const ENUMSET_PATH: string = `${COMMON_PATH}/enumset`;
export const ENUMSET_BY_ID_PATH: (id: string) => string = (id) => `${ENUMSET_PATH}/${id}`;
