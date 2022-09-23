import { INote } from './../../models/note.model';
import { UsersStore } from './../../stores/users/users.store';
import { UsersService } from 'src/app/core/services/users/users.service';
import { EstateStore } from './../../stores/estate/estate.store';
import { Firestore, IFirestore } from 'src/app/firebase';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private firestore: IFirestore;

  constructor(
    private estateStore: EstateStore,
    private usersService: UsersService,
    private usersStore: UsersStore
  ) {
    this.firestore = Firestore();
  }

  public async getAll(estateId: string): Promise<INote[]> {
    return (await this.firestore.collection(`estate/${estateId}/notes`).orderBy('createAt', 'desc').get()).docs.map(doc => doc.data() as INote);
  }

  public async add(estateId: string, note: INote): Promise<INote> {
    try {
      const preEstateNoteReqDoc = this.firestore.collection(`estate/${estateId}/notes`).doc();
      note.id = preEstateNoteReqDoc.id;
      await preEstateNoteReqDoc.set(note);
      return note;
    } catch (error) {
      throw error;
    }
  }

  public async delete(estateId: string, noteId: string): Promise<boolean> {
    try {
      await this.firestore.collection(`estate/${estateId}/notes`).doc(noteId).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

}
