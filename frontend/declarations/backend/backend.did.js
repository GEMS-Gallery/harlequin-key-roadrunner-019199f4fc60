export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Category = IDL.Record({ 'id' : IDL.Nat, 'name' : IDL.Text });
  const Note = IDL.Record({
    'id' : IDL.Nat,
    'categoryId' : IDL.Opt(IDL.Nat),
    'title' : IDL.Text,
    'content' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addCategory' : IDL.Func([IDL.Text], [Result_1], []),
    'addNote' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat)],
        [Result_1],
        [],
      ),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getNotes' : IDL.Func([], [IDL.Vec(Note)], ['query']),
    'getNotesByCategory' : IDL.Func([IDL.Nat], [IDL.Vec(Note)], []),
    'removeCategory' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
