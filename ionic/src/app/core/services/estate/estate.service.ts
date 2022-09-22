import { UsersStore } from './../../stores/users/users.store';
import { IMaterial } from './../../models/material.models';
import { IService } from './../../models/service.model';
import { IFee } from './../../models/fee.model';
import { IUserEstate } from './../../models/userEstate.model';
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
    private usersService: UsersService,
    private usersStore: UsersStore
  ) {
    this.firestore = Firestore();
  }

  public async getAllBasedOnUser(userId: string): Promise<IEstate[]> {
    const userEstates = [];
    (await this.firestore.collection('userEstate').where('userId', '==', userId).get()).docs.map(doc => {
      userEstates.push(doc.data() as IUserEstate);
    });

    const promises = [];
    const estates: IEstate[] = [];
    const estateIds = userEstates.map(e => e.estateId);

    while (estateIds.length) {
      const chunk = estateIds.splice(0, 10);
      promises.push(this.firestore.collection('estate').where('id', 'in', chunk).get());
    }

    const queryAllEstates = await Promise.all(promises);
    queryAllEstates.map(queryEstateChunk => {
      queryEstateChunk.docs.map(async doc => {
        const estate = doc.data() as IEstate;
        estates.push(estate);
      });
    });

    return estates.sort((a, b) => b.createAt - a.createAt);
  }

  public async getAll(): Promise<IEstate[]> {
    return (await this.firestore.collection('estate').orderBy('createAt', 'desc').get()).docs.map(doc => doc.data() as IEstate);
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
      await this.usersService.removeUserFromEstate(this.usersStore.userId, eventDocId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // ===================================
  // FEES:
  // ===================================

  public async getAllEstateFees(estateId: string): Promise<IFee[]> {
    return (await this.firestore.collection(`estate/${estateId}/fees`).orderBy('createAt', 'desc').get()).docs.map(doc => doc.data() as IFee);
  }

  public async addFee(estateId: string, fee: IFee): Promise<IFee> {
    try {
      const preEstateFeeReqDoc = this.firestore.collection(`estate/${estateId}/fees`).doc();
      fee.id = preEstateFeeReqDoc.id;
      await preEstateFeeReqDoc.set(fee);
      return fee;
    } catch (error) {
      throw error;
    }
  }

  public async deleteFee(estateId: string, feeId: string): Promise<boolean> {
    try {
      await this.firestore.collection(`estate/${estateId}/fees`).doc(feeId).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }


  // ===================================
  // SERVICES:
  // ===================================

  public async getAllEstateServices(estateId: string): Promise<IService[]> {
    return (await this.firestore.collection(`estate/${estateId}/services`).orderBy('createAt', 'desc').get()).docs.map(doc => doc.data() as IService);
  }

  public async addService(estateId: string, service: IService): Promise<IService> {
    try {
      const preEstateFeeReqDoc = this.firestore.collection(`estate/${estateId}/services`).doc();
      service.id = preEstateFeeReqDoc.id;
      await preEstateFeeReqDoc.set(service);
      return service;
    } catch (error) {
      throw error;
    }
  }

  public async deleteService(estateId: string, serviceId: string): Promise<boolean> {
    try {
      await this.firestore.collection(`estate/${estateId}/fees`).doc(serviceId).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

  // ===================================
  // MATERIALS:
  // ===================================

  public async getAllEstateMaterials(estateId: string): Promise<IMaterial[]> {
    return (await this.firestore.collection(`estate/${estateId}/materials`).orderBy('createAt', 'desc').get()).docs.map(doc => doc.data() as IMaterial);
  }

  public async addMaterial(estateId: string, material: IMaterial): Promise<IService> {
    try {
      const preEstateFeeReqDoc = this.firestore.collection(`estate/${estateId}/materials`).doc();
      material.id = preEstateFeeReqDoc.id;
      await preEstateFeeReqDoc.set(material);
      return material;
    } catch (error) {
      throw error;
    }
  }

  public async deleteMateral(estateId: string, materialId: string): Promise<boolean> {
    try {
      await this.firestore.collection(`estate/${estateId}/fees`).doc(materialId).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

}
