import { Component, OnInit } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { IList, ITask } from 'src/app/shared/interfaces/list.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { TaskManagerService } from 'src/app/shared/services/task-manager.service';
import { FadeInOut } from 'src/app/shared/animations/fadeInOut.animation';
import { UniqueIdService } from 'src/app/shared/services/unique-id.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [FadeInOut],
})
export class HomeComponent implements OnInit {
  lists: IList[] = [];
  tasks: ITask[] = [];
  listIsChosen = false;
  listModalVisible = false;
  modalInputList: IList = { id: '', name: '', listGroupId: '' };
  user!: IUser;
  theme = false;

  constructor(
    private tms: TaskManagerService,
    private guid: UniqueIdService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // get authorized user, then lists of the user
    this.authService.getAuthorizedUser().pipe(
      tap( user => this.user = user),
      switchMap(user => this.tms
        .getAllLists()
        .pipe(
          map((resp: IList[]) => {
            this.lists = resp.filter(
              (list) => list.listGroupId == user.listGroupId
            );
          })
        ))
    ).subscribe();
    // theme
    this.themeService.isThemeDark
      .pipe(tap((th) => (this.theme = th)))
      .subscribe();
  }

  openList(list: IList) {
    this.tasks = [];
    this.listIsChosen = true;
    this.lists.forEach((l) => {
      l.isOpen = l.id == list.id;
    });
    this.tms.openedList = list; // currently opened list
    // get all task in the list
    this.tms
      .getAllTasks()
      .pipe(
        map((tasks) => {
          this.tasks = tasks.filter((task) => task.listId == list.id);
        })
      )
      .subscribe();
  }

  // Modal appears when user clicks list settings
  openListModal(list: IList) {
    this.modalInputList = list;
    this.listModalVisible = true;
  }

  createList(value: any) {
    let list: IList = { id: '', name: '', listGroupId: '' };
    list.id = this.guid.generateId();
    list.name = value.name;
    list.listGroupId = this.user.listGroupId;
    this.tms.createList(list).subscribe();
    this.lists.push(list); // update view
  }

  updateList(e: any, list: IList) {
    let updatedListName = e.updatedListName;
    if (list && updatedListName) {
      this.listModalVisible = false;
      list.name = updatedListName;
      this.tms.updateList(list).subscribe();
    }
  }

  deleteList(list: IList) {
    if (list) {
      let id = list.id;
      let index = this.lists.findIndex((list) => id == list.id);
      this.lists.splice(index, 1);
      // this will also delete the tasks related to the deleted list with listId-s
      this.tms.deleteList(id).subscribe();
      this.listModalVisible = false;
      this.tasks = []; // remove deleted tasks from view;
    }
  }

  // ********* TASKS **********
  toggleTask(task: ITask) {
    task.isDone = !task.isDone;
    this.tms.updateTask(task).subscribe();
  }

  createTask(value: any) {
    let task = { id: '', name: '', listId: '', isDone: false };
    let id = this.guid.generateId();
    if (this.tms.openedList) {
      task.listId = this.tms.openedList.id;
      task.id = id;
      task.name = value.name;
      task.isDone = false;
    }
    this.tms.createTask(task).subscribe();
    this.tasks.push(task); // update view
  }

  deleteTask(task: ITask) {
    let index = this.tasks.findIndex((t) => t.id == task.id);
    this.tasks.splice(index, 1);
    this.tms.deleteTask(task.id).subscribe();
  }

  // will be optimized !!!
  filterTasks(by: any) {
    if (this.listIsChosen) {
      this.tasks = [];
      if (by.toLowerCase() == 'done') {
        this.tms
          .getAllTasks()
          .pipe(
            tap((resp: ITask[]) => {
              this.tasks = resp.filter(
                (task) =>
                  task.isDone == true && this.tms.openedList.id == task.listId
              );
            })
          )
          .subscribe();
      } else if (by.toLowerCase() == 'todo') {
        this.tms
          .getAllTasks()
          .pipe(
            tap((resp: ITask[]) => {
              this.tasks = resp.filter(
                (task) =>
                  task.isDone == false && this.tms.openedList.id == task.listId
              );
            })
          )
          .subscribe();
      } else {
        this.tms
          .getAllTasks()
          .pipe(
            map(
              (resp) =>
                (this.tasks = resp.filter(
                  (task) => this.tms.openedList.id == task.listId
                ))
            )
          )
          .subscribe();
      }
    }
  }

  // sign out when button is clicked on sidebar
  signOut() {
    this.authService.signOut();
  }

  // change theme via ThemeService when theme toggle is clicked on sidebar
  changeTheme(isThemeDark: boolean) {
    this.themeService.setDarkTheme(isThemeDark);
  }
}
