import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Iter "mo:base/Iter";

actor {
  type Category = {
    id: Nat;
    name: Text;
  };

  type Note = {
    id: Nat;
    title: Text;
    content: ?Text;
    categoryId: ?Nat;
  };

  stable var categoryIdCounter : Nat = 0;
  stable var noteIdCounter : Nat = 0;

  let categories = HashMap.HashMap<Nat, Category>(10, Nat.equal, Nat.hash);
  let notes = HashMap.HashMap<Nat, Note>(50, Nat.equal, Nat.hash);

  // Category management
  public func addCategory(name : Text) : async Result.Result<Nat, Text> {
    let id = categoryIdCounter;
    categoryIdCounter += 1;
    let category : Category = { id = id; name = name };
    categories.put(id, category);
    #ok(id)
  };

  public func removeCategory(id : Nat) : async Result.Result<(), Text> {
    switch (categories.remove(id)) {
      case null { #err("Category not found") };
      case (?_) { #ok(()) };
    }
  };

  public query func getCategories() : async [Category] {
    Array.map<(Nat, Category), Category>(Iter.toArray(categories.entries()), func((_, category)) { category })
  };

  // Note management
  public func addNote(title : Text, content : ?Text, categoryId : ?Nat) : async Result.Result<Nat, Text> {
    let id = noteIdCounter;
    noteIdCounter += 1;
    let note : Note = { id = id; title = title; content = content; categoryId = categoryId };
    notes.put(id, note);
    #ok(id)
  };

  public query func getNotes() : async [Note] {
    Array.map<(Nat, Note), Note>(Iter.toArray(notes.entries()), func((_, note)) { note })
  };

  public shared func getNotesByCategory(categoryId : Nat) : async [Note] {
    Array.filter<Note>(Array.map<(Nat, Note), Note>(Iter.toArray(notes.entries()), func((_, note)) { note }), func(note) { note.categoryId == ?categoryId })
  };
}
