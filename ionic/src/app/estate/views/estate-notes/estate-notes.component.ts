import { ServerTimestamp } from 'src/app/firebase';
import { IEstate } from './../../../core/models/estate.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotesService } from './../../../core/services/notes/notes.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { UsersStore } from './../../../core/stores/users/users.store';
import { EstateStore } from './../../../core/stores/estate/estate.store';
import { INote } from './../../../core/models/note.model';
import { ModalController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-notes',
  templateUrl: './estate-notes.component.html',
  styleUrls: ['./estate-notes.component.scss'],
})
export class EstateNotesComponent implements OnInit {

  public loading = true;
  public saveLoading = false;
  public form: FormGroup;
  public notes: INote[] = [];

  public get estate(): IEstate {
    return this.estateStore.estate
  }

  constructor(
    public modalCtrl: ModalController,
    private toastController: ToastController,
    private userService: UsersService,
    public usersStore: UsersStore,
    public estateStore: EstateStore,
    private notesService: NotesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      title: new FormControl(null, null),
      description: new FormControl(null, [Validators.required])
    });

    await this.load();
  }

  public async add(): Promise<void> {
    if (this.form.valid) {
      this.saveLoading = true;
      const payload: INote = {
        id: null,
        title: this.form.value.title || null,
        description: this.form.value.description,
        createAt: ServerTimestamp(),
        createBy: this.usersStore.userId,
        updateAt: null,
        updateBy: null,
      };

      await this.notesService.add(this.estate.id, payload);
      this.form.reset();
      this.saveLoading = false;
      this.loading = true;
      this.load();
    }
  }

  public async edit(fee: INote): Promise<void> { }

  public async remove(id: string): Promise<void> { }

  private async load() {
    this.notes = await this.notesService.getAll(this.estate.id);
    this.loading = false;
  }

}
