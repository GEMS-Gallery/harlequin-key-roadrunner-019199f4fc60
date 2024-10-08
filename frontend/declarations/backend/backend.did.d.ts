import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : bigint, 'name' : string }
export interface Note {
  'id' : bigint,
  'categoryId' : [] | [bigint],
  'title' : string,
  'content' : [] | [string],
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addCategory' : ActorMethod<[string], Result_1>,
  'addNote' : ActorMethod<[string, [] | [string], [] | [bigint]], Result_1>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getNotes' : ActorMethod<[], Array<Note>>,
  'getNotesByCategory' : ActorMethod<[bigint], Array<Note>>,
  'removeCategory' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
