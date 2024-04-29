/**
 * AMS Backend Service
 */
import {
    deleteFetcher,
    getFetcher,
    postFetcher,
    putFetcher
  } from './apiHelper'
  import * as url from './urlHelper'
  
  // get tables
  export const fetchTables = async () => {
    return await getFetcher(url.TABLES_PATH)
  }
  
  // eslint-disable-next-line camelcase
  export const fetchTableColumns = async (table_id: string) => {
    return await getFetcher(url.TABLES_PATH + '/' + table_id + '/db-columns')
  }
  
  // add table
  export const addTable = async (table: any) => {
    return postFetcher(url.TABLES_PATH, table)
  }
  
  // update table
  export const updateTable = async (table: any) => {
    return await postFetcher(url.TABLES_PATH, table)
  }
  
  // add column to table
  export const addColumn = async (payload: any) => {
    return await postFetcher(url.COLUMNS_PATH(payload.tableId), [payload.column])
  }
  
  // get relations
  export const fetchRelations = async (tableId: string) => {
    return await getFetcher(url.RELATIONS_PATH(tableId))
  }
  
  // add relation to table
  export const addRelation = async (payload: any) => {
    return await postFetcher(url.RELATIONS_PATH(payload.tableId), [
      payload.relation
    ])
  }
  
  // update relation of table
  export const updateRelation = async (payload: any) => {
    return await postFetcher(url.RELATIONS_PATH(payload.tableId), [
      payload.relation
    ])
  }
  
  // get table records
  export const fetchTableRecords = async (tableName:any, rawData:any) => {
    return await postFetcher(
      url.OBJECT_STRUCTURES_GENERIC_SEARCH(tableName),
      rawData
    )
  }
  
  // add table record
  export const addTableRecord = async (tableName:any, rawData:any) => {
    return await postFetcher(
      url.CREATE_OBJECT_STRUCTURE_DATA_PATH(tableName),
      rawData
    )
  }
  
  // add geometry record
  export const addGeometryRecord = async (point:any) => {
    return await postFetcher(
      url.CREATE_OBJECT_STRUCTURE_DATA_PATH("test_geometry"),
      point
    )
  }
  
  // save bulk 
  export const saveBulk = async (rawData:any) => {
    return await postFetcher(url.SAVE_BULK_OBJECT_STRUCTURE_DATA_PATH, rawData)
  }
  
  // get all enumset list
  export const getTableList = async () => {
    return await getFetcher(url.TABLES_PATH)
  }
  
  // get all enumset list
  export const getEnumsetList = async () => {
    return await getFetcher(url.ENUMSET_PATH)
  }
  