import { UsersStore } from './../../stores/users/users.store';
import { Injectable } from '@angular/core';
import { Auth, Firestore, IAuth, IFirestore } from 'src/app/firebase';
import { IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private firestore: IFirestore;
  private firebaseAuth: IAuth;

  constructor(
    private usersStore: UsersStore
  ) {
    this.firestore = Firestore();
    this.firebaseAuth = Auth();
  }

  public async getOne(id: string): Promise<IUser> {
    try {
      let user = null;
      const userQuery = await this.firestore
        .collection('users')
        .where('id', '==', id)
        .get();

      if (userQuery.size > 0) { userQuery.forEach((doc) => user = doc.data()); }

      return user;
    } catch (error) { throw error; }
  }
}
