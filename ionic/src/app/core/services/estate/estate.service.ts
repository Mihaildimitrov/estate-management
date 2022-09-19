import { IEstate } from './../../models/estate.model';
import { UsersService } from './../users/users.service';
import { EstateStore } from './../../stores/estate/estate.store';
import { Injectable } from '@angular/core';
import { Firestore, IFirestore } from 'src/app/firebase';

@Injectable({
  providedIn: 'root'
})
export class EstateService {
  private firestore: IFirestore;

  constructor(
    private estateStore: EstateStore,
    private usersService: UsersService
  ) {
    this.firestore = Firestore();
  }

  public async getAll(): Promise<IEstate[]> {
    return (await this.firestore.collection('estate').get()).docs.map(doc => doc.data() as IEstate);
  }

  public async getOne(id: string, forceUpdate: boolean = false, setInStore: boolean = true): Promise<IEstate> {

    if (!forceUpdate && this.estateStore.estate) { return this.estateStore.estate; }

    try {
      const estateQuery = await this.firestore.collection('estate').doc(id).get();
      if (estateQuery.exists) {
        if (setInStore) this.estateStore.setEstate(estateQuery.data() as IEstate);
        return estateQuery.data() as IEstate;
      } else { return null; }
    } catch (error) { throw error; }
  }

  public async create(estate: IEstate): Promise<IEstate> {
    try {
      const preEstateReqDoc = this.firestore.collection('estate').doc();
      estate.id = preEstateReqDoc.id;
      await preEstateReqDoc.set(estate);
      return estate;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, estatePayload: any): Promise<IEstate> {
    try {
      const estateDocument = this.firestore.collection('estate').doc(id);
      await estateDocument.update({ ...estatePayload });
      return estatePayload;
    } catch (error) { throw error; }
  }

  public async delete(eventDocId: string): Promise<boolean> {
    try {
      await this.firestore.collection('estate').doc(eventDocId).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

}
